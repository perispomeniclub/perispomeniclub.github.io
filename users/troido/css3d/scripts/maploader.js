"use strict";

var MapLoader = Class.extend({
	
	width: 0,
	height: 0,
	data: null,
	
	load: function(filename, callback){
		var self = this;
		LoadFile.loadImage(filename, function(img){
			
			self.fromImg(img);
			
			callback && callback(self);
		});
	},
	
	fromImg: function(img){
		
		var canvas = document.createElement("canvas");
		this.width = canvas.width = img.width;
		this.height = canvas.height = img.height
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img,0,0);
		this.data = [];
		var idata=ctx.getImageData(0,0,canvas.width,canvas.height).data;
		for(var i=0; i*4<idata.length; i++){
			this.data[i] = idata[i*4]<<16 | idata[i*4+1]<<8 | idata[i*4+2];
		}
	},
	
	for2d: function(callback){
		
		for (var i=0, l=this.data.length; i<l; i++){
			callback(this.data[i], i%this.width, (i/this.width)|0, this);
		}
	},
	get: function(x, y){
		if(x<0 || y<0 || x>=this.width || y>=this.height){
			return null;
		}
		return this.data[x+y*this.width];
	},
	getWidth: function(){
		return this.width;
	},
	getHeight: function(){
		return this.height;
	}
});