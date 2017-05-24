"use strict";


var AbstractDrawLayer = Class.extend({
	
	depth: 0,
	scl: 1,
	output: null,
	sprites: null,
	dynamic: false,
	field: null,
	
	
	init: function(depth, scale){
		this.depth = depth;
		this.scl = scale;
		this.output = new CanvasWrapper();
	},
	
	
	start: function(){
		this.output.setSize(this.field.getWidth() * this.scl, this.field.getHeight() *this.scl);
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


var DynamicDrawLayer = AbstractDrawLayer.extend({
	
	
	dynamic: true,
	
	start: function(){
		
		this._super();
// 		console.log(this.field.field.getAll());
	},
	
	
	updateDrawing: function(view){
		
		var objs=this.field.getObjects(
			view.getXmin(this.depth, this.scl),
			view.getYmin(this.depth, this.scl),
			view.getXmax(this.depth, this.scl)+1,
			view.getYmax(this.depth, this.scl)+1
		);
// 		console.log(view);
		var depths = [];
		
		objs.forEach(function(obj){
			// this is not a good naming choice
			var imgs = obj.getImages();
			imgs && imgs.forEach(function(img){
				if (!depths[img.order]){
					depths[img.order] = [];
				}
				depths[img.order].push(img);
			});
		});
		
		this.output.clear();
		
		depths.forEach(function(imgs){
			//imgs.forEach(function(img){
			/* for some unknown reason, going from bottom right to top left solves the
			 * flickering problem that firefox otherwise has.
			 * tested in: http://jsfiddle.net/922frgmd/4/
			 */
			for (var i=imgs.length-1; i>=0; i--){
				this.output.drawSprite(this.sprites.getSprite(imgs[i].spriteName),imgs[i].x*this.scl,imgs[i].y*this.scl);
			}//, this);
		}, this);
	}
});


var StaticDrawLayer = AbstractDrawLayer.extend({
	
	dynamic: false,
	
	
	start: function(){
		this._super()
		this.updateDrawing();
		
	},
	
	updateDrawing: function(){
		
		for (var y=0; y<this.field.height; y++){
			for (var x=0; x<this.field.width; x++){
				var spritename = this.field.getSpriteName(x,y)
				if (spritename){
// 					console.log(spritename);
					var spr = this.sprites.getSprite(spritename);
					this.output.drawSprite(spr,x*this.scl,y*this.scl);
				}
			}
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

