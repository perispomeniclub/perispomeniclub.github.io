
"use strict";

var Sprite = Class.extend({
	img: null,
	sx: 0,
	sy: 0,
	swidth: 0,
	sheight:0,
	cx: 0,
	cy: 0,
	width: 0,
	height: 0,
	init: function(img,sx,sy,swidth,sheight,cx,cy,width,height){
		this.img=img;
		this.sx=sx||0;
		this.sy=sy||0;
		this.swidth=swidth||img.width-this.sx;
		this.sheight=sheight||img.height-this.sy;
		this.cx=cx||0;
		this.cy=cy||0;
		this.width=width||this.swidth;
		this.height=height||this.sheight;
	}
});

// static Sprite[]
Sprite.loadSprites = function(spriteData){
	var images = {};
	var sprites = {};
	for (var name in spriteData){
		var data = spriteData[name], img;
		if (!images[data.image]){
			img = new Image();
			img.src = data.image;
			images[data.image] = img;
		}else
			img = images[data.image];
		var spr = new Sprite(img, data.sx, data.sy, data.swidth, data.sheight, data.cx, data.cy, data.width, data.height);
		spr.name = name;
		sprites[name]=spr;
	}
	return sprites;
};
