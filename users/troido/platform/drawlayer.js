"use strict";


var AbstractDrawLayer = Class.extend({
	
	depth: 0,
	scl: 1,
	output: null,
	sprites: null,
	dynamic: false,
	field: null,
	loaded: false,
	
	
	init: function(depth, scale, dynamic){
		this.depth = depth;
		this.scl = scale;
		this.output = new CanvasWrapper();
		this.dynamic = dynamic;
	},
	
	
	start: function(){
		this.output.setSize(this.field.getWidth() * this.scl, this.field.getHeight() *this.scl);
// 		console.log(this.field, this.scl, this.field.getWidth() * this.scl, this.field.getHeight() *this.scl);
		if (!this.dynamic){
			this.updateDrawing && this.updateDrawing();
		}
		this.loaded = true;
	},
	
	
	draw: function(view){
		
		if (this.dynamic){
			this.updateDrawing(view)
		}
		
		return this.output.getCanvas();
	},
	
	setSprites: function(sprites){
		this.sprites = sprites;
	},
	
	setField: function(collisionManager){
		this.field = collisionManager;
	}
});


var DrawLayer = AbstractDrawLayer.extend({
	
// 	dynamic: false,
	
	drawObject: function(obj){
		var imgs = this.field.getObjSprites(obj);
		for (var i=0, l=imgs.length; i<l; i++){
			this.output.drawSprite(this.sprites.getSprite(imgs[i].spriteName),imgs[i].x*this.scl,imgs[i].y*this.scl);
		}
	},
	
	updateDrawing: function(view){
		
		var imgs 
		if (this.dynamic){
			imgs = this.field.getSprites(
				view.getXmin(this.depth, this.scl),
				view.getYmin(this.depth, this.scl),
				view.getXmax(this.depth, this.scl)+1,
				view.getYmax(this.depth, this.scl)+1
			);
			this.output.clear();
		} else {
			imgs = this.field.getSprites(0, 0, this.field.getWidth(), this.field.getHeight());
		}
		for (var i=imgs.length-1; i>=0; i--){
			this.output.drawSprite(this.sprites.getSprite(imgs[i].spriteName),imgs[i].x*this.scl,imgs[i].y*this.scl);
		}
	}
});





// This is my own wrapper for the canvas class
// I have no idea how to name this
// this is not for the final canvas, only the hidden ones
var CanvasWrapper = Class.extend({
	
	
	canvas: null,
	ctx: null,
	width: 0,
	height: 0,
	
	init: function(){
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		
	},
	
	drawSprite: function(spr,x,y){
		if (spr){
			if(spr.img){
				this.ctx.drawImage(spr.img,spr.sx,spr.sy,spr.swidth,spr.sheight,x-spr.cx,y-spr.cy,spr.width,spr.height);
			} else {
				console.error("image for sprite "+spr.name+" not available");
			}
		} else {
			console.error("sprite not available");
		}
	},
	
	setSize: function(width, height){
		this.canvas.width = this.width = width;
		this.canvas.height = this.height = height;
	},
	
	getCanvas: function(){
		return this.canvas;
	},
	
	clear: function(){
		this.ctx.clearRect(0,0,this.width,this.height);
	}
	
});

