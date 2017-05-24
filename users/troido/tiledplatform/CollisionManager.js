"use strict";

/**
 * A CollisionManager object keeps track of which objects are at a location.
 * 
 * The set method stores the object in a set on every square that the object (partially) covers.
 * The remove method removes the object from that area. It is important that the location and size of
 * the object don't change between setting this object on the field and removing it.
 * 
 * The get method returns a set of object that could in the specified area.
 * This set may contain objects that are not exactly in the area, but if an object is in the area, it will be in the set
 * This way, for exact collision checking not all the objects in the map have to be checked, but only the objects that are near
 * 
 * I just found out about the term 'spatial partitioning', which is probably the best name for this
 * 
 *
 * This class uses the Set class, which is not supported in all browsers.
 * If Set is not supported, my custom implementation of set is required.
 * The constructor 'new Set(Iterable)' is also required.
 * 
 */

var CollisionManager = Class.extend({
	
	width: 0,
	heigth: 0,
	field: null, // Set[][] field
	allObjects: null,
	
	init: function(width,height){
		if (!Set){
			console.error("The Set object, which is required for the CollisionManager class, is not supported in your browser");
		}
		this.field=[];
		for (var x=0;x<width;x++){
			this.field[x]=[];
			for (var y=0;y<height;y++){
				this.field[x][y]=new Set();
			}
		}
		
		this.allObjects = new Set();
		
		this.width=width;
		this.height=height;
	},
	resizeWidth: function(width){
		if (width>this.width){
			for (var x=this.width;x<width;x++){
				this.field[x]=[];
				for (var y=0; y<this.height; y++){
					this.field[x][y] = new Set();
				}
			}
		}
		this.width = width;
	},
	resizeHeight: function(height){
		if (height>this.height){
			for (var y=this.height; y<height; y++){
				for (var x=0; x<this.width; x++){
					this.field[x][y] = new Set();
				}
			}
		}
		this.height = height;
	},
	resize: function(width,height){
		this.resizeWidth(width);
		this.resizeHeight(height);
	},
	set: function(obj){
		/* add an object to the CollisionManager */
		this.allObjects.add(obj);
		
		var x1 = obj.getXmin(), y1 = obj.getYmin(), x2 = obj.getXmax(), y2 = obj.getYmax();
		for(var x=Math.max(0,Math.floor(x1));x<Math.min(this.width,Math.ceil(x2));x++){
			for(var y=Math.max(0,Math.floor(y1));y<Math.min(this.height,Math.ceil(y2));y++){
				this.field[x][y].add(obj);
			}
		}
	},
	remove: function(obj){
		/* remove an object from the collisionManager */
		this.allObjects.delete(obj)
		var x1 = obj.getXmin(), y1 = obj.getYmin(), x2 = obj.getXmax(), y2 = obj.getYmax();
		for(var x=Math.max(0,Math.floor(x1));x<Math.min(this.width,Math.ceil(x2));x++){
			for(var y=Math.max(0,Math.floor(y1));y<Math.min(this.height,Math.ceil(y2));y++){
				this.field[x][y].delete(obj);
			}
		}
	},
	get: function(x1,y1,x2,y2){ // I think I should change the arguments to x, y, width, height, just to be consequent
		/* return a set of all objects that might be within the specified area */
		var objects = new Set();
		for(var x = Math.max(0,Math.floor(x1));x<Math.min(this.width,Math.ceil(x2));x++){
			for(var y = Math.max(0,Math.floor(y1));y<Math.min(this.height,Math.ceil(y2));y++){
				//objects=objects.concat(this.field[x][y]);
				this.field[x][y].forEach(function(value, key, set){
					objects.add(value);
				});
			}
		}
		return objects;
	},
	getAll: function(){
		/* get all the objects on the map */
		return new Set(this.allObjects);/*/this.get(0, 0, this.width, this.height);/**/
	},
	getSolidField: function(exceptions, x, y, width, height){
		/* get a 2 dimensional array of booleans that tells whether there is a solid object in that square .
		 * objects that are in the list exceptions are not taken into account.
		 * all arguments are optional.
		 */
		x = Math.max(Math.floor(x),0) || 0;
		y = Math.max(Math.floor(y),0) || 0;
		width = Math.min(Math.floor(width),this.width-x) || this.width - x;
		height = Math.min(Math.floor(height),this.height-y) || this.height - y;
		
		var solidField = new Array(width);
		for (var i=0; i<width; i++){
			solidField[i] = new Array(height);
			for (var j=0; j<height; j++){
				solidField[i][j] = false;
				this.field[i+x][j+y].forEach(function(obj){
					if (obj.solid && exceptions && !exceptions.contains(obj)){
						solidField[i][j] = true;
					}
				});
			}
		}
		return solidField;
	},
	
	getWidth: function(){
		return this.width;
	},
	getHeight: function(){
		return this.height;
	}
});