"use strict";


var DrawObjects = (function(){
	
	
	this.StoneOverlay = Class.extend({
		
		spriteNames:{left:"stoneLeft",right:"stoneRight",top:"stoneTop",bottom:"stoneBottom"},
		
		
		getImages: function(obj){
			var imgs = [];
			if (obj.neighbours == null){
				obj.findNeighbours(this.collisionField);
			}
			for (var spr in this.spriteNames){
				if (!(obj.neighbours[spr] && obj.neighbours[spr].filling)){
					imgs.push({
						x: obj.getX(),
						y: obj.getY(),
						spriteName: this.spriteNames[spr]
					});
				}
			}
			
			return imgs;
		}
	});
	
	this.GroundOverlay = this.StoneOverlay.extend({
		spriteNames: {left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom"}
	});
	
	this.GrassOverlay = Class.extend({
		
		getImages: function(obj){
			var imgs = [];
			if (obj.neighbours == null){
				obj.findNeighbours(this.collisionField);
			}
			var spr = "top";
			if (!(obj.neighbours[spr] && obj.neighbours[spr].filling)){
				imgs.push({
					x: obj.getX(),
					y: obj.getY(),
					spriteName: "grassTop"
				});
			}
			return imgs;
		}
	});
	
	this.GnomeDoorOverlay = Class.extend({
		
		getImages: function(obj){
			var imgs = [];
			if (obj.neighbours == null){
				obj.findNeighbours(this.collisionField);
			}
			if (!(obj.neighbours["left"] && obj.neighbours["left"].filling)){
				imgs.push({
					x: obj.getX(),
					y: obj.getY(),
					spriteName: "gnomeDoorLeft"
				});
			} else if (!(obj.neighbours["right"] && obj.neighbours["right"].filling)){
				imgs.push({
					x: obj.getX(),
					y: obj.getY(),
					spriteName: "gnomeDoorRight"
				});
			}
				
			return imgs;
		}
	});
		
		
	
	return this;
	
}).apply({});
