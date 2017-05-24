"use strict";


var BackgroundLayer=Class.extend({
// 	width: 0,
// 	height: 0,
	spriteNames: null,
	map: null,
	
	
	init:function(fileName, sprites, callback){
		this.map=new MapLoader();
		this.spriteNames = [];
		for (var x in sprites){
			this.spriteNames[Number(x)]=sprites[x];
		}
		var self = this;
		this.map.load(fileName,function(map){
// 			self.width = map.getWidth();
// 			self.height = map.getHeight();
			callback && callback(self);
		});
		
	},/*
	getVal: function(x,y){
		return this.map.get(x,y);
	},*/
	getSpriteName: function(x,y){
		return this.spriteNames[this.map.get(x,y)]
	},
	getSprites: function(x1, y1, x2, y2){
		x1 = Math.max(Math.min(x1, this.getWidth()),0);
		y1 = Math.max(Math.min(y1, this.getHeight()),0);
		x2 = Math.max(Math.min(x2, this.getWidth()),0);
		y2 = Math.max(Math.min(y2, this.getHeight()),0);
		
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
		return this.map.getWidth();
	},
	getHeight: function(){
		return this.map.getHeight();
	}
});


var SubLayerish = BackgroundLayer.extend({
	
	
// 	spriteNames: null,
// 	map: null,
	sprites: null,
	
	
	init:function(game, sprites){
		this.map = game;
		this.spriteNames = sprites;
	},
	
	getObjSprites: function(obj){
		if (this.spriteNames[obj.name]){
			return [{
				x: obj.getX(),
				y: obj.getY(),
				spriteName: this.spriteNames[obj.name]
			}];
		} else {
			return [];
		}
	},
	
	getSprites: function(x1, y1, x2, y2){
		
		var objs = this.map.getObjects(x1, y1, x2, y2);
		
		this.sprites = [];
		
		objs.forEach(function(obj){
// 			if (this.spriteNames[obj.name]){
			// this function could be in a for loop
			// that would make it much faster in firefox, but slightly slower in chrome
			this.sprites.push.apply(this.sprites, this.getObjSprites(obj));
// 			}
		}, this);
		
		return this.sprites;
	}/*,
	getWidth: function(){
		return this.map.getWidth();
	},
	getHeight: function(){
		return this.map.getHeight();
	}*/
});

var SubLayerishObjectMap = SubLayerish.extend({
	
// 	spriteNames: null,
// 	map: null,
// 	sprites: null,
	
	init:function(game, objectNames){
		this.map = game;
		// TO DO: better naming
		this.spriteNames = {};
		for (var name in objectNames){
			this.spriteNames[name] = new DrawObjects[objectNames[name]]();
		}
		
	},
	
	getObjSprites: function(obj){
		if (this.spriteNames[obj.name]){
			return this.spriteNames[obj.name].getImages(obj);
		} else {
			return [];
		}
	}/*,
	getSprites: function(x1, y1, x2, y2){
		
		var objs = this.map.getObjects(x1, y1, x2, y2);
		
		this.sprites = [];
		
		objs.forEach(function(obj){
			if (this.spriteNames[obj.name]){
				// this function could be faster in firefox with a for loop
				this.sprites.push.apply(this.sprites, this.getObjSprites(obj));
			}
		}, this);
		
		return this.sprites;
	},
	getWidth: function(){
		return this.map.getWidth();
	},
	getHeight: function(){
		return this.map.getHeight();
	}*/
});

