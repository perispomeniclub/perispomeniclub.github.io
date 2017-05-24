"use strict";



/** TO DO:
 * 
 * - load new parts of the map when player gets to edge normal map
 * - let step get as argument the time passed, and base movement on this
 * - require that the images are loaded before SpriteList executes a callback
 * 
 * 
 * Done:
 * - put all depths in different (sub)layers
 * - make sure DrawLayer.start() only gets called on a DrawLayer when the sprites are loaded
 * - improve loadfile so it works when getting a request while loading
 * - remove all uses of class Grid from class Background
 * - let controller be made by a player, so player can be a pixel in the world too
 * - fix game.step so it doesn't loop over 16626 objects
 * 
 * 
 */



var SpriteList = Class.extend({
	
	sprites: null,
	
	
	loadSprites: function(filename, callback){
		var self = this
		LoadFile.loadText(filename, function(str){
			self.setSprites(JSON.parse(str));
			callback(self);
		});
	},
	
	setSprites: function(spriteData){
		
		this.sprites = {};
		for (var i in spriteData){
			var a=spriteData[i];
			var spr=new Sprite(LoadFile.loadImage(a.image),a.sx,a.sy,a.swidth,a.sheight,a.cx,a.cy,a.width,a.height);
			spr.name=i;
			this.sprites[i]=spr;
		}
	},
	getSprites: function(){
		return this.sprites;
	},
	getSprite: function(name){
		return this.sprites[name];
	}
});



var MapLoader = Class.extend({
	
	width: 0,
	height: 0,
	data: null,
	
	load: function(filename, callback){
		var self = this;
		LoadFile.loadImage(filename, function(img){
			var canvas = document.createElement("canvas");
			self.width = canvas.width = img.width;
			self.height = canvas.height = img.height
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			self.data = [];
			var idata=ctx.getImageData(0,0,canvas.width,canvas.height).data;
			for(var i=0; i*4<idata.length; i++){
				self.data[i] = idata[i*4]<<16 | idata[i*4+1]<<8 | idata[i*4+2];
			}
			
			callback && callback(self);
		});
	},
	
	for2d: function(callback){
		
		for (var i=0, l=this.data.length; i<l; i++){
			callback(this.data[i], i%this.width, (i/this.width)|0, this);
		}
	},
	get: function(x, y){
		return this.data[x+y*this.width];
	},
	getWidth: function(){
		return this.width;
	},
	getHeight: function(){
		return this.height;
	}
});




/* A class to hopefully replace the Loader
 * woohoo, it did
 */
var Platform = Class.extend({
	
	_drawLayers: null,
	_games: null,
	_drawer: null,
	_mainGame: null,
	_mainLayer: null,
	_lastStepTime: null,
	toLoad: 0,
	
	init: function(fileName,canvas){
		this._drawer = new Drawer(canvas, 960, 640);
		this.loadMapFile(fileName);
		
	},
	
	loadMapFile: function(fileName){
		var self = this;
		LoadFile.loadText(fileName,function(string){
			self.loadMap(JSON.parse(string));
		});
	},
	
	
	loadMap: function(map){
		// increase to make sure all calls are initialized first
		this.toLoad++;
		
		var sprites = new SpriteList();
		this.toLoad++;
		var self = this;
		sprites.loadSprites(map.textures.sprites, function(){
			self.toLoad--;
			self.isReady();
		});
		
// 		map.textures.images.forEach(function(imgname){
		for (var i=0, l=map.textures.images.length; i<l; i++){
			this.toLoad++;
			LoadFile.loadImage(map.textures.images[i], function(){
				self.toLoad--;
				self.isReady();
			});
		}
		
		this._drawLayers = [];
		this._games = [];
		
		var layer;
// 		map.layers.forEach(function(layer){
		for (var i=0, l=map.layers.length; i<l; i++){
			layer = map.layers[i];
			
			var drawLayer;
			if (layer.type == "background"){
				drawLayer = new DrawLayer(layer.depth,layer.scale, false);
				
				this.toLoad++;
				var bgObj = new BackgroundLayer(layer.map, layer.sprites, function(){
					self.toLoad--;
					self.isReady();
				});
				drawLayer.setField(bgObj);
				drawLayer.setSprites(sprites);
				this._drawLayers.push(drawLayer);
			} else if (layer.type == "game"){
// 				drawLayer = new DynamicDrawLayer(layer.depth, layer.scale, true);
				this.toLoad++;
				var game = new Game(layer.map, layer.blocks, function(){
					self.toLoad--;
					self.isReady();
				});
				this._games.push(game);
// 				drawLayer.setField(game);
				if (layer.main){
					this._mainGame = game;
					this._mainLayer = {scl: layer.scale, depth: layer.depth};
				}
				
				
				if (layer.sublayers){
					var subLayers = [];
					var subdata;
					for (var j=0, m=layer.sublayers.length; j<m; j++){
						subdata = layer.sublayers[j];
						var subDrawLayer = new DrawLayer(layer.depth, layer.scale, subdata.dynamic);
						if (subdata.type == "spritemap"){
							var subLayer = new SubLayerish(game, subdata.sprites);
						} else if (subdata.type == "objmap"){
							var subLayer = new SubLayerishObjectMap(game, subdata.objects);
						} else {
							console.error("Unknown sublayer type");
						}
						subDrawLayer.setField(subLayer);
						subDrawLayer.setSprites(sprites);
						this._drawLayers.push(subDrawLayer);
					}
				}
			} else {
				console.error("Unknown layer type");
			}
		}
		
		
		// done initializing calls
		this.toLoad--;
		this.isReady();
		
		
		this.lastStepTime = Date.now();
		var stepInterval = setInterval(function(){self.step()},30);
		
		// debug hack to stop the game
		document.addEventListener("keydown",function(e){
			if (e.which == 46){
				alert("step interval stopped");
				clearInterval(stepInterval);
			}
		});
	},
	startDraw: function(){
		
		for (var i=0, l=this._drawLayers.length; i<l; i++){
			this._drawLayers[i].start(this._drawer.getView());
		}
		
// 		var self = this
		// the idea of asynchronous drawing was so nice, but it looked very ugly
		//requestAnimationFrame(function(){self.draw();});
	},
	
	step: function(){
		var timePassed = (this._lastStepTime - Date.now())/1000;
		this._lastStepTime = Date.now();
		for (var i=0, l=this._games.length; i<l; i++){
			this._games[i].step && this._games[i].step(timePassed);
		}
		this.draw();
	},
	
	draw: function(time){
		
		var camera = this._mainGame.getCameraObj(),
			cameraScl = this._mainLayer.scl;
		if (camera){
			// I think I should also do something with depth, but I'm not sure what
			this._drawer.getView().setViewCenter(camera.getX()*cameraScl, camera.getY()*cameraScl);
			this._drawer.clear();
			
			for (var i=0, l=this._drawLayers.length; i<l; i++){
				this._drawer.drawCanvas(this._drawLayers[i].draw(this._drawer.getView()), this._drawLayers[i].depth);
			}
		}
// 		var self = this;
// 		requestAnimationFrame(function(){self.draw();});
	},
	
	isReady: function(){
		if (this.toLoad == 0){
			this.startDraw();
		}
	}
	
});

var Game = Class.extend({
	
	field: null,
	_cameraObj: null,
	_stepObservers: null,
	
	init: function(map, blockObjs, callback){
		this.field = new CollisionManager(0,0);
		this._stepObservers = new Set();
		
		var blocks = []
		for (var x in blockObjs){
			blocks[Number(x)] = blockObjs[x];
		}
		this.loadMap(map, blocks, callback);
	},
	
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
	
	getCameraObj: function(){
		return this._cameraObj;
	},
	
	setCameraObj: function(obj){
		this._cameraObj = obj;
	},
	
	step: function(timePassed){
		this._stepObservers.forEach(function(obj){
			obj.step && obj.step(timePassed);
		});
		
	},
	
	start: function(){
		this.field.getAll().forEach(function(obj){
			obj.start && obj.start();
		});
	},
	
	getObjects: function(x1, y1, x2, y2){
		if (x1<=0 && y1<=0 && x2>=this.field.getWidth() && y2>= this.field.getHeight()){
			return this.field.getAll();
		} else {
			return this.field.get(x1, y1, x2, y2);  
		}
	},
	
	getWidth: function(){
		return this.field.getWidth();
	},
	getHeight: function(){
		return this.field.getHeight();
	},
	
	addStepObserver: function(obj){
		this._stepObservers.add(obj);
	},
	
	removeStepObserver: function(obj){
		this._stepObservers.delete(obj);
	}
});




