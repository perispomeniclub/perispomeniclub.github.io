"use strict";



/** TO DO:
 * 
 * - put all depths in different (sub)layers
 * - load new parts of the map when player gets to edge normal map
 * - let step get as argument the time passed, and base movement on this
 * - require that the images are loaded before SpriteList executes a callback
 * 
 * 
 * Done:
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
	_loadCallbacks: null,
	_loaded: false,
	
	init: function(){
		this._loadCallbacks = [];
	},
	
	loadSprites: function(filename){
		LoadFile.loadText(filename, (function(str){
			this.setSprites(JSON.parse(str));
			this._loadCallbacks.forEach(function(cb){
				cb(this);
			}, this);
			this._loaded = true;
		}).bind(this));
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
	},
	
	addLoadCallback: function(callback){
		if (this._loaded){
			callback(this);
		} else {
			this._loadCallbacks.push(callback);
		}
	}
});


var Background=Class.extend({
	width: 0,
	height: 0,
	spriteNames: null,
	map: null,
	
	
	init:function(fileName, sprites, callback){
		this.map=new MapLoader();
		this.spriteNames = [];
		for (var x in sprites){
			this.spriteNames[Number(x)]=sprites[x];
		}
		
		this.map.load(fileName,function(map){
			this.width = map.getWidth();
			this.height = map.getHeight();
			callback && callback(this);
		}.bind(this));
		
	},
	getVal: function(x,y){
		return this.map.get(x,y);
	},
	getSpriteName: function(x,y){
		return this.spriteNames[this.getVal(x,y)]
	},
	getSprites: function(x1, y1, x2, y2){
		x1 = Math.max(Math.min(x1, this.width),0);
		y1 = Math.max(Math.min(y1, this.height),0);
		x2 = Math.max(Math.min(x2, this.width),0);
		y2 = Math.max(Math.min(y2, this.height),0);
		
		var sprites = [];
		
		for (var x=x1; x<x2; x++){
			for (var y = y1; y<y2; y++){
				if (this.getSpriteName(x,y)){
					sprites.push({
						x: x,
						y: y,
						spriteName: this.getSpriteName(x,y)
					});
				}
			}
		}
		return sprites;
	},
	getWidth: function(){
		return this.width;
	},
	getHeight: function(){
		return this.height;
	}
});


var SubLayerish = Class.extend({
	
	
	spriteNames: null,
	map: null,
	
	
	init:function(game, sprites){
		this.map = game;
		this.spriteNames = sprites;
		
		
	},
	getSprites: function(x1, y1, x2, y2){
// 		x1 = Math.max(Math.min(x1, this.width),0);
// 		y1 = Math.max(Math.min(y1, this.height),0);
// 		x2 = Math.max(Math.min(x2, this.width),0);
// 		y2 = Math.max(Math.min(y2, this.height),0);
// 		
// 		var sprites = [];
// 		
// 		for (var x=x1; x<x2; x++){
// 			for (var y = y1; y<y2; y++){
// 				if (this.getSpriteName(x,y)){
// 					sprites.push({
// 						x: x,
// 				  y: y,
// 				  spriteName: this.getSpriteName(x,y)
// 					});
// 				}
// 			}
// 		}
		
		var objs = this.map.getObjects(x1, y1, x2, y2);
		
		var sprites = []
		
		objs.forEach(function(obj){
			if (this.spriteNames[o.name]){
				sprites.push({
					x: o.getX(),
					y: o.getY(),
					spriteName: this.spriteNames[o.name]
				});
			}
		});
		return sprites;
	},
	getWidth: function(){
		return this.map.getWidth();
	},
	getHeight: function(){
		return this.map.getHeight();
	}
});

var MapLoader = Class.extend({
	
	width: 0,
	height: 0,
	data: null,
	
	load: function(filename, callback){
		LoadFile.loadImage(filename, (function(img){
			var canvas = document.createElement("canvas");
			this.width = canvas.width = img.width;
			this.height = canvas.height = img.height
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			this.data = [];
			var idata=ctx.getImageData(0,0,canvas.width,canvas.height).data;
			for(var i=0;i*4<idata.length;i++){
				this.data[i] = idata[i*4]<<16 | idata[i*4+1]<<8 | idata[i*4+2];
			}
			
			callback && callback(this);
		}).bind(this));
	},
	
	for2d: function(callback){
		this.data.forEach(function(value, id){
			callback(value, id%this.width, (id/this.width)|0, this);
		}, this);
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
 * wooho, it did
 */
var Platform = Class.extend({
	
	_drawLayers: null,
	_games: null,
	_drawer: null,
	_mainGame: null,
	_mainLayer: null,
	_lastStepTime: null,
	
	init: function(fileName,canvas){
		this._drawer = new Drawer(canvas, 960, 640);
		this.loadMapFile(fileName);
	},
	
	loadMapFile: function(fileName){
		LoadFile.loadText(fileName,(function(string){
			this.loadMap(JSON.parse(string));
		}).bind(this));
	},
	
	
	loadMap: function(map){
		
		var sprites = new SpriteList();
		sprites.loadSprites(map.textures.sprites);
		map.textures.images.forEach(function(imgname){
			LoadFile.loadImage(imgname);
		});
		
		this._drawLayers = [];
		this._games = [];
		
		map.layers.forEach(function(layer){
			
			var drawLayer;
			if (layer.type == "background"){
				drawLayer = new StaticDrawLayer(layer.depth,layer.scale, false);
				
				// This callback function looks complicated but that is because drawLayer.start 
				// should be executed when both the layer and the sprites are loaded
				var bgObj = new Background(layer.map, layer.sprites, function(){sprites.addLoadCallback(drawLayer.start.bind(drawLayer))});
				drawLayer.setField(bgObj);
			} else if (layer.type == "game"){
				drawLayer = new DynamicDrawLayer(layer.depth, layer.scale, true);
				var game = new Game(layer.map, layer.blocks, function(){
					sprites.addLoadCallback(drawLayer.start.bind(drawLayer))
				});
				this._games.push(game);
				drawLayer.setField(game);
				if (layer.main){
					this._mainGame = game;
					this._mainLayer = drawLayer;
				}
				
				
				if (layer.sublayers){
					var subLayers = [];
					layer.sublayers.forEach(function(subdata){
						var subDrawLayer = new StaticDrawLayer(layer.depth, layer.scale, false);
						var subLayer = new SubLayerish(game, sprites);
						subDrawLayer.setField(subLayer);
						sprites.addLoadCallback(subDrawLayer.start.bind(subDrawLayer))
// 						console.log(subdata);
						subDrawLayer.setSprites(sprites);
						this._drawLayers.push(subDrawLayer);
					}, this);
				}
			}
			drawLayer.setSprites(sprites);
			this._drawLayers.push(drawLayer);
		}, this);
		
		
		
		this.lastStepTime = Date.now();
		var stepInterval = setInterval(this.step.bind(this),25);
		
		requestAnimationFrame(this.draw.bind(this));
		// debug hack to stop the game
		document.addEventListener("keydown",function(e){
			if (e.which == 46){
				alert("step interval stopped");
				clearInterval(stepInterval);
			}
		});
	},
	
	step: function(){
		var timePassed = (this._lastStepTime - Date.now())/1000;
		this._lastStepTime = Date.now();
		this._games.forEach(function(game){
			game.step && game.step(timePassed);
		});
	},
	
	draw: function(time){
		
		var camera = this._mainGame.getCameraObj(),
			cameraScl = this._mainLayer.scl;
		if (camera){
			// I think I should also do something with depth, but I'm not sure what
			this._drawer.getView().setViewCenter(camera.getX()*cameraScl, camera.getY()*cameraScl);
			this._drawer.clear();
			
			this._drawLayers.forEach(function(layer){
// 				console.log(layer);
				layer.loaded && this._drawer.drawCanvas(layer.draw(this._drawer.getView()), layer.depth);
			}, this);
		}
		requestAnimationFrame(this.draw.bind(this));
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
		
		(new MapLoader()).load(map, (function(mapLoader){
			this.field.resize(mapLoader.getWidth(), mapLoader.getHeight());
			mapLoader.for2d((function(value, x, y){
				var type=blocks[value];
				if (type){
					for (var i=0;i<type.length;i++){
						var obj=new Blocks[type[i]](x,y,this);
// 						if (obj.camera){ // ugly code
// 							this.setCameraObj(obj.camera);
// 						}
					}
				}
			}).bind(this));
			
			this.start();
			callback && callback(this);
		}).bind(this));
		
		
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
		return this.field.get(x1, y1, x2, y2);  
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




function main(){
	
	new Platform("blocks.json", document.getElementById("canvas2"));
	
}


// preload some files into cache so they are loaded instantly later
LoadFile.loadText("textures2.json");
LoadFile.loadImage("images.png");
LoadFile.loadImage("images2.png");
// If they aren't loaded yet when I have to really use them, there's going to be a problem
// FIXED THE ABOVE (I hope)


window.addEventListener("load",main);

