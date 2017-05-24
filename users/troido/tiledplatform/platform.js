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


/**
 * In this file are all the classes that I couldn't find another file for
 * 
 */



/**
 * The SpriteList class (or sprite loader) is responsible for keeping track of all existing sprites
 * Once a spritename is known and the spriteList is loaded, the spriteList can be used to get the corresponding sprite.
 * Note that this is about the Sprite class as defined in sprite.js
 */

var SpriteList = Class.extend({
	
	sprites: null,
	
	
	loadSprites: function(filename, callback){
		var self = this
		LoadFile.loadText(filename, function(str){
			self.setSprites(JSON.parse(str), callback);
			callback(self);
		});
	},
	
	setSprites: function(spriteData, callback){
		
		this.sprites = {};
		for (var i in spriteData){
			var a=spriteData[i];
			var img = LoadFile.loadImage(a.image);
			var spr=new Sprite(img, a.sx,a.sy,a.swidth,a.sheight,a.cx,a.cy,a.width,a.height);
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


/**
 * This class loads an image into an array.
 * Every value of the array is composed of the color values of the pixel: red*256^2 + green*256 + blue
 * This class is used by the BackgroundLayer and the Game class
 */

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
	
	// a bit like the forEach function, but both the x and y coordinates are given as arguments to the callback
	// the callback will be executed like callback(value, x, y, mapLoader)
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
 * but it's becoming a similar mess :(
 */


/**
 * This class is kind of the main class.
 * The main jobs of this class are to load all the gamefiles in,
 * initialize the layers and do the main game loop
 * This class is above the MVC pattern. It is supposed to be the outermost class in the decorator pattern.
 * I think this is one of the ugliest classes in the game, but it's much cleaner than the Loader object it replaced
 * 
 * Maybe I should delegate more of the loading and initialization to other classes like Game and BackgroundLayer
 * 
 * 
 * It loads its information from a JSON file. The name of this file is given as first argument to the constructor.
 * This JSON file, which is currently blocks.json, has two main attributes: textures and layers
 * 
 * 'textures' has a name of a file with sprites to be loaded and a list of filenames of images to be loaded.
 * The list of images is not always necessary, however, when it is not included,
 * the startDraw function may be called start before the images are loaded.
 * On a non-dynamic drawLayer this may cause problems.
 * 
 * 'layers' is a list of layers. I will call the layers that are in this list the main layers
 * There are two types of main layers: a BackgroundLayer and a Game layer.
 * The Game layers also have a list of sublayers.
 * Every main layer has a depth, which determines with which speed it will follow the camera,
 * and a scale, which is the distance between the origins of two blocks that have distance 1
 * in the game.
 * All main layers are quite independant, except for rendering
 * 
 * The draw function is called in the step function.
 * I tried asychronous drawing earlier, but it looks very ugly.
 * Maybe the draw function does not belong it this class, but in the Drawer class
 * 
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
	
	// a too long and evil function
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
				this.toLoad++;
				var game = new Game(layer.maps, layer.blocks, map.begin.x, map.begin.y, function(){
					self.toLoad--;
					self.isReady();
				});
				this._games.push(game);
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
		
		// debug hack to stop the main interval when delete is pressed
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

