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
	},
// });
// 
// 
// var DrawLayer = AbstractDrawLayer.extend({
	
// 	dynamic: false,
	
	drawObject: function(obj){
		var imgs = this.field.getObjSprites(obj);
		for (var i=0, l=imgs.length; i<l; i++){
			this.output.drawSprite(this.sprites.getSprite(imgs[i].spriteName),imgs[i].x*this.scl,imgs[i].y*this.scl);
		}
	},
	
	updateDrawing: function(view){
		
		var imgs;
		if (this.dynamic){
			imgs = this.field.getSprites(
				view.getXmin(this.depth, this.scl),
				view.getYmin(this.depth, this.scl),
				view.getXmax(this.depth, this.scl),
				view.getYmax(this.depth, this.scl)
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


var DrawLayer = AbstractDrawLayer.extend({
	
	offset: 8,
	drawn: {xmin: 0, ymin: 0, xmax: 0, ymax: 0},
	
	updateDrawing: function(view){
		
		var imgs;
		var xmin, ymin, xmax, ymax;
		if (this.dynamic){
// 			imgs = this.field.getSprites(
			xmin = view.getXmin(this.depth, this.scl),
			ymin = view.getYmin(this.depth, this.scl),
			xmax = view.getXmax(this.depth, this.scl),
			ymax = view.getYmax(this.depth, this.scl)
// 			);
		} else {
// 			console.log("I am drawing while i'm not dynamic");
			xmin = view.getXmin(this.depth, this.scl) - this.offset,
			ymin = view.getYmin(this.depth, this.scl) - this.offset,
			xmax = view.getXmax(this.depth, this.scl) + this.offset,
			ymax = view.getYmax(this.depth, this.scl) + this.offset;
// 			imgs = this.field.getSprites(xmin, ymin, xmax, ymax);
		}
		imgs = this.field.getSprites(xmin, ymin, xmax, ymax);
		this.drawn = {xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax};
		
		if (this.output.width < (xmax-xmin)*this.scl){
			this.output.resize((xmax-xmin)*this.scl, this.output.height);
		}
		if (this.output.height < (ymax-ymin)*this.scl){
			this.output.resize(this.output.width, (ymax-ymin)*this.scl);
		}
		this.output.clear();
		
		
		for (var i=imgs.length-1; i>=0; i--){
			this.output.drawSprite(this.sprites.getSprite(imgs[i].spriteName), (imgs[i].x)*this.scl, (imgs[i].y)*this.scl);
		}
	},
	
	start: function(){
		this.output.setSize(this.field.getWidth() * this.scl, this.field.getHeight() *this.scl);
// 		if (!this.dynamic){
// 			this.updateDrawing && this.updateDrawing();
// 		}
		this.loaded = true;
	},
	
	draw: function(view){
		
		if (this.dynamic || !this.drawn ||
			view.getXmin(this.depth, this.scl) <= this.drawn.xmin||
			view.getYmin(this.depth, this.scl) <= this.drawn.ymin||
			view.getXmax(this.depth, this.scl) >= this.drawn.xmax||
			view.getYmax(this.depth, this.scl) >= this.drawn.ymax){
			this.updateDrawing(view)
		}
		
		return this.output.getCanvas();
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

