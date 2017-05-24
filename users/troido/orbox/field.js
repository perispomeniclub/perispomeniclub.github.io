"using strict";

define(["lib/inheritance"], function(Class){
	var Field = Class.extend({
		
		_field: null,
		_visitField: null,
		width: 0,
		height: 0,
		
		
		/* this class has 2 possible constructors.
		* One way is to make an empty field (all cells are null) and make the arguments with and height.
		* 
		* Another is to load a level, and pass the level object as first argument
		* The second element should be a dictionary (object in this case) of classes that can be used as blocks.
		* The level object should have a field property, which should be a 2d array representing the playfield.
		* The values in the playfield should be numbers.
		*/
		init: function(protoObjOrWidth, heightOrBlocks){
			this._field = [];
			if (protoObjOrWidth instanceof Object){
				// constructor from level object
				var protoObj = protoObjOrWidth,
					width = protoObj.width || protoObj.field.length,
					height = protoObj.height || protoObj.field[0].length,
					blocks = heightOrBlocks;
				
				// iterate over all cells
				for (var i=0; i<width; i++){
					this._field[i] = [];
					for (var j=0; j<height; j++){
						
						// get the value from the protype field
						var id = protoObj.field[i][j] || 0,
							block = protoObj.indices[id].split(":"),
							name = block[0];
						block.shift();
						
						// put an object in the right cell if possible or otherwise null
						if (blocks[name]){
							this._field[i][j] = new blocks[name](block, this, i, j);
						} else {
							this._field[i][j] = null;
						}
						
					}
				}
			} else {
				// construct an empty field
				var width = protoObjOrWidth,
					height = heightOrBlocks;
				for (var i=0; i<width; i++){
					this._field[i] = [];
					for (var i=0; i<height; j++){
						this._field[i][j] = null;
					}
				}
			}
			
			// make another field that keeps track how many times a cel has been visited
			// can be useful for displaying a trail, and for calculating the score
			this._visitField = [];
			for (var i=0; i<width; i++){
				this._visitField[i] = [];
				for (var j=0; j<height; j++){
					this._visitField[i][j] = 0;
				}
			}
			
			this.width = width;
			this.height = height;
		},
		
		set: function(x,y,val){
			if (x<0 || y<0 || x>=this.width || y>=this.height){
				return;
			}
			this._field[x][y] = val;
		},
		
		get: function(x,y){
			if (x<0 || y<0 || x>=this.width || y>=this.height){
				return null;
			}
			return this._field[x][y];
		},
		
		visit: function(x,y){
			if (x<0 || y<0 || x>=this.width || y>=this.height){
				return;
			}
			this._visitField[x][y]++;
		},
		
		isVisited: function(x,y){
			if (x<0 || y<0 || x>=this.width || y>=this.height){
				return 0;
			}
			return this._visitField[x][y];
		}
	});
	return Field;
});