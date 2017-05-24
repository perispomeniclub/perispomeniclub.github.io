"use strict";


var Wieldable = GameObject.extend({
	
	parent: null,
	
	init: function(parent,x,y,direction){
		this._super(x,y,direction);
		this.parent = parent;
	},
	
	getAbsoluteX: function(){
		var dirvec = this.parent.getDirectionVector();
		return this.parent.getX() + this.getX()*dirvec.x + this.getY()*dirvec.y;
	},
	
	getAbsoluteY: function(){
		var dirvec = this.parent.getDirectionVector();
		return this.parent.getY() + this.getX()*dirvec.y + this.getY()*dirvec.x;
	},
	
	getAbsoluteDirection: function(){
		return this.getDirection() + this.parent.getDirection();
	},
	
	getAbsoluteDirectionVector: function(){
		return {x: Math.cos(this.getAbsoluteDirection()), y: -Math.sin(this.getAbsoluteDirection())};
	}
});