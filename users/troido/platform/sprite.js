"use strict";



function Sprite(img,sx,sy,swidth,sheight,cx,cy,width,height){
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


Sprite.prototype.getImage = function(){
	return this.img;
}