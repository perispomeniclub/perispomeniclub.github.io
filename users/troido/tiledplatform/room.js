"use strict";

/**
 * This class now uses the collisionmanager, but might eventually replace it.
 * The room keeps track of what objects are where, and will increase the size of the collisionmanager if it is nog large enough
 * The reason for making this class was to do collisions and loading in one
 * It can load a tile if it isn't loaded yet
 */

var Room = Class.extend({
	
	field: null,
	objects: null,
	loaded: null,
	
	init: function(name, tileWidth, tileHeight, legenda, game){
		this.field = new CollisionManager(1, 1);
		this.name = name
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
// 		this.legenda = legenda;
		this.blocks = legenda;
// 		for (var x in legenda.blocks)
// 			this.blocks[Number(x)] = legenda[x]
		this.loaded = [];
		this.game = game;
// 		this.objects = Set();
	},
	
	// test if the size of the CollisionManager should be increased, and do so if needed
	// Will only increase in positive direction, will not go below 0
	_updateSize: function(xmax, ymax){
		if (xmax > this.field.getWidth()){
			this.field.resize(this.field.getWidth()*2, this.field.getHeight());
		}
		if (ymax > this.field.getHeight()){
			this.field.resize(this.field.getWidth(), this.field.getHeight()*2);
		}
	},
	
	// load a tile and add the objects to the collisionManager
	_loadTile: function(tileX, tileY, callback){
		if (!this.loaded[tileX]){
			this.loaded[tileX] = [];
		}
		this.loaded[tileX][tileY] = true;
		
		var self = this;
		var map = ""+this.name.prefix + tileX + this.name.infix + tileY + this.name.suffix;
		(new MapLoader()).load(map, function(mapLoader){
			mapLoader.for2d(function(value, localX, localY){
				var type = self.blocks[value];
				if (type){
					for (var i=0;i<type.length;i++){
						var obj=new Blocks[type[i]](tileX*self.tileWidth+localX,tileY*self.tileHeight+localY,self.game);
					}
				}
			});
			
			callback && callback(self);
		});
	},
	
	// return whether a tile is loaded (or loading) already
	_isLoaded: function(x, y){
		return  this.loaded[x] && this.loaded[x][y];
	},
	
	// load all tiles in an area that are not loaded yet
	load: function(x1, y1, x2, y2, callback){
		var toLoad = 1;
		
		var self = this;
		// function to test if all tiles are loaded. Used as a callback when a tile is loaded.
		function loadedTile(){
			toLoad--;
			if (!toLoad){
				callback && callback(self);
			}
		}
		for (var x=x1/this.tileWidth|0; x<=x2/this.tileWidth|0; x++){
			for (var y=y1/this.tileHeight|0; y<=y2/this.tileHeight|0; y++){
				if (!this._isLoaded(x, y)){
					toLoad++
					this._loadTile(x, y, loadedTile);
				}
			}
		}
		loadedTile();
		
	},
	
	// a wrapper to the set function of the collisionmanager
	add: function(obj){
// 		this.objects.add(obj)
		var xmin = obj.getXmin(), ymin = obj.getYmin(), xmax = obj.getXmax(), ymax = obj.getYmax();
		
		this._updateSize(obj.getXmax(), obj.getYmax());
		
		this.field.set(obj);
	},
	
	// a wrapper to the remove function of the collisionmanager
	remove: function(obj){
		this.field.remove(obj);
	},
	
	// a wrapper to the get function of the collisionmanager.
	// it will try to load, but that definitely won't be in time for this call
	get: function(x1, y1, x2, y2){
		
		this.load(x1-8, y1-8, x2+8, y2+8);
		return this.field.get(x1, y1, x2, y2);
		
	},
	
	// I want to get rid of these functions, but I need them for compatibility
	getWidth: function(){
		return 192;//this.field.getWidth();
	},
	getHeight: function(){
		return 160;//this.field.getHeight();
	},
	getAll: function(){
		return this.field.getAll();
	}
	
});

Room.prototype.set = Room.prototype.add;