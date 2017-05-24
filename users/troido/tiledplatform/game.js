

/**
 * This class represents a game layer.
 * Unlike the BackgoundLayers, activity happens in this layer.
 * It has a CollisionManager, which is used to get information about all placable entities
 * 
 * It represents the model part of the MVC pattern, and should be the main way of the view to
 * communicate with the model.
 * 
 * It is also the observable for the step 'event'
 */

var Game = Class.extend({
	
	field: null,
	_cameraObj: null,
	_stepObservers: null,
	room: null,
	
	
	init: function(maps, blockObjs,beginX, beginY, callback){
// 		this.field = new CollisionManager(0,0);
		this._stepObservers = new Set();
		
		var blocks = []
		for (var x in blockObjs){
			blocks[Number(x)] = blockObjs[x];
		}
		this.room = new Room(maps, maps.tilewidth, maps.tileheight, blocks, this);
		
		
		var self = this;
		this.room.load(/*1,1,191,159,/*/beginX-16, beginY-16, beginX+16, beginY+16, function(){self.start();callback&&callback(self);});
		
		
// 		this.loadMap(map, blocks, callback);
	},
	
	
	/*
	 * load the game from an image.
	 * Map is the name of an image file, and blocks is like a dictionary where the values of the
	 * pixels are mapped to the names of the corresponding objects.
	 */
	loadMap: function(map, blocks, callback){
		var self = this;
		(new MapLoader()).load(map, function(mapLoader){
			self.field.resize(mapLoader.getWidth(), mapLoader.getHeight());
			mapLoader.for2d(function(value, x, y){
				var type=blocks[value];
				if (type){
					for (var i=0;i<type.length;i++){
						var obj=new Blocks[type[i]](x,y,self);
					}
				}
			});
			
			self.start();
			callback && callback(self);
		});
		
		
	},
	
	// get the object that should be the view center
	// this function should be called by the view part
	getCameraObj: function(){
		return this._cameraObj;
	},
	
	// guess what this function does
	// It is best that this function is called by the camera entity itself
	setCameraObj: function(obj){
		this._cameraObj = obj;
	},
	
	// called by Platform.step, this function calls the step functions of all observers.
	step: function(timePassed){
		this._stepObservers.forEach(function(obj){
			obj.step && obj.step(timePassed);
		});
		
	},
	
	start: function(){
		this.room.getAll().forEach(function(obj){
			obj.start && obj.start();
		});
	},
	
	// get all placable entities within the area.
	// The returned Set may contain more objects than it should, but never less
	getObjects: function(x1, y1, x2, y2){
		if (x1<=0 && y1<=0 && x2>=this.room.getWidth() && y2>= this.room.getHeight()){
			return this.room.getAll();
		} else {
			return this.room.get(x1, y1, x2, y2);  
		}
	},
	
	getWidth: function(){
		return this.room.getWidth();
	},
	getHeight: function(){
		return this.room.getHeight();
	},
	
	// this is like addObserver in java, but the called function is step.
	addStepObserver: function(obj){
		this._stepObservers.add(obj);
	},
	
	removeStepObserver: function(obj){
		this._stepObservers.delete(obj);
	}
});




