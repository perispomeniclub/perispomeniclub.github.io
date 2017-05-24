"use strict";


// This should be where all drawings come together
var Drawer = Class.extend({
	
	canvas: null,
	ctx: null,
	view: null,
	
	init: function(canvas, width, height){
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		//this.ctx.translate(Math.floor(this.canvas.width/2), Math.floor(this.canvas.height/2));
		this.view = new View(width || canvas.width, height || canvas.height);
	},
	
	
	getView: function(){
		return this.view;
	},
	
	drawCanvas: function(image, depth){
		this.ctx.drawImage(
			image,
			-Math.floor(this.view.getXmin(depth,1)),
			-Math.floor(this.view.getYmin(depth,1))
		);
	},
	
	clear: function(){
		this.ctx.fillStyle="rgba(0,0,0,0)";
		this.ctx.globalCompositeOperation="copy";
		this.ctx.fillRect(0,0,1,1);
		this.ctx.globalCompositeOperation="source-over";
	}
	
});


var View = Class.extend({
	centerX: 0,
	centerY: 0,
	width: 0,
	height: 0,
	
	init: function(width, height){
		this.setSize(width || this.width, height || this.height);
	},
	
	setSize: function(width, height){
		this.width = width;
		this.height = height;
	},
	
	setViewCenter: function(cx, cy){
		this.centerX = cx;
		this.centerY = cy;
	},
	
	getCenterX: function(depth, scl){
		return this.centerX/(depth*scl);
	},
	getCenterY: function(depth, scl){
		return this.centerY/(depth*scl);
	},
	getXmin: function(depth, scl){
		return (this.centerX/depth - this.width/2) /scl;
	},
	getYmin: function(depth, scl){
		return (this.centerY/depth - this.height/2) /scl;
	},
	getXmax: function(depth, scl){
		return (this.centerX/depth + this.width/2) /scl;
	},
	getYmax: function(depth, scl){
		return (this.centerY/depth + this.height/2) /scl;
	},
	getWidth: function(scl){
		return this.width/scl;
	},
	getHeight: function(scl){
		return this.height/scl
	}
});

