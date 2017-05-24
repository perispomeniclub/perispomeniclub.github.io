"use strict";
/**
 * This is te base class for all the objects in the game that can be drawn.
 * It has two derived classes, Placable and Wieldable
 * All GameObjects have a position and a direction, though the direction is practically only used for circular objects and like.
 */


var GameObject = Class.extend({
	
	x: 0,
	y: 0,
	_direction: 0, // 0 means to the right, increase in direction means turning counter-clockwise
	// glad to have that settled
	// I should change this to an imaginary number, I think imaginary multiplication will make things faster
	
	game: null,
	
	
	createObject: function(type, x,y,direction){
		var o = game.createObject(type, x,y,direction)
		o.parent = this
	},
	
	init: function(x, y, direction){
		this.x = x || 0;
		this.y = y || 0;
		this._direction = direction || 0;
		//this._id = Placable.id++;
	},
	
	getDirection: function(){
		/* this function should be avoided */
		return this._direction;
	},
	
	getDirectionVector: function(){
		return {x: Math.cos(this._direction), y: -Math.sin(this._direction)};
	},
	
	setDirection: function(dir){
		this._direction = dir;
	},
	
	addDirection: function(dir){ // if I switch to coordinates and imaginary multiplication, this all will be usefull
		this._direction += dir;
	},
	
	setDirectionVector: function(vector){
		this._direction = Math.atan2(vector.x, vector.y);
	},
	
	getX: function(){
		return this.x;
	},
	
	getY: function(){
		return this.y;
	},
	
	getPosition: function(){
		return {x: this.x, y: this.y}; //new Position(this.x, this.y);
	}
	
});
