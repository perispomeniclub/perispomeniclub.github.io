"use strict";




var Placable = GameObject.extend({
	
	shape: "", // "circle" or "rectangle"
	
	map: null,
	solid: false,
	
	gear: null,
	
	init: function(){
		this._super.apply(this,arguments);
		this.gear = [];  // maybe better to make this a set
	},
	
	update: function(time){
		this.gear.forEach(function(obj){
			obj.update(time);
		});
	},
	
	putInMap: function(collisionManager){
		if (this.map){
			this.map.remove(this);
		}
		this.map = collisionManager;
		this.map.set(this);
		return this;
	},
	
	place: function(x, y){
		if (this.map){
			this.map.remove(this);
		}
		this.x = x;
		this.y = y;
		if (this.map){
			this.map.set(this);
		}
	},
	
	place_vec: function(vector){
		this.place(vector.x,vector.y);
	},
	
	setSize: function(w, h){
		if (this.map){
			this.map.remove(this);
		}
		this.width = w;
		this.height = h;
		if (this.map){
			this.map.set(this);
		}
	},
	
	setSize_vec: function(vector){
		this.setSize(vector.x,vector.y);
	},
	
	delete: function(){
		if (this.map){
			this.map.remove(this);
		}
		delete this;
	},
	
	getGear: function(){
		return this.gear;
	},
	
	addGear: function(wieldable){
		this.gear.push(wieldable);
	},
	
	removeGear: function(wieldable){
		this.gear.splice(this.gear.indexOf(wieldable),1);
	},
	
	collidesWith: function(other){
		if (this.shape == "circle" ){
			if (other.shape == "circle"){
				return this._circleCircleCollision(this, other);
			} else {
				return this._circleRectangleCollision(this,other);
			}
		} else {
			if (other.shape == "circle"){
				return this._circleRectangleCollision(other,this);
			} else {
				return this._rectangleRectangleCollision(this,other);
			}
		}
	},
	
	
	getCollisions: function(){
		var possibleCollisions = this._getpossibleCollisions();
		var collisions = [];
		possibleCollisions.forEach(function(object, key, collection){
			if (object != this && this.collidesWith(object)){
				collisions.push(object);
			}
		},this);
		return collisions;
	},
	
	getSolidCollisions: function(){
		var possibleCollisions = this._getpossibleCollisions();
		var collisions = [];
		possibleCollisions.forEach(function(object, key, collection){
			if (object != this && this.collidesWith(object) && object.solid){
				collisions.push(object);
			}
		},this);
		return collisions;
	},
	
	_getpossibleCollisions: function(){
		return this.map.get(this.getXmin(), this.getYmin(), this.getXmax(), this.getYmax());
	},
	
	isInMap: function(x,y){
		return !(this.getXmin()<0 || this.getYmin()<0 || this.getXmax()>=this.map.width || this.getYmax()>=this.map.height)
	},
	
	inInMap_vec: function(vector){
		this.isInMap(vector.x,vector.y);
	},
	
	canStand: function(x,y){
		
		var tempx = this.x, tempy = this.y;
		this.place(x, y);
		if (!this.isInMap(x,y)){
			this.place(tempx, tempy);
			return false;
		}
// 		if (!this.solid){
// 			return true;
// 		}
		//var blocked = false;
		var collisions = this.getSolidCollisions();//getCollisions();
// 		collisions.forEach(function(object, key, collection){
// 			blocked = object.solid || blocked;
// 		});
		
		this.place(tempx, tempy);
		return (!collisions.length);
	},
	
	canStand_vec: function(vector){
		this.canStand(vector.x,vector.y);
	},
	
	
	getXmin: function(){
		return  this.x - ((this.shape == "circle") && this.radius);
	},
	
	getYmin: function(){
		return  this.y - ((this.shape == "circle") && this.radius);
	},
	
	getMinPos: function(){
		return {x: this.getXmin(), y: this.getYmin()};
	},
	
	getXmax: function(){
		return  this.x + ((this.shape == "circle") ? this.radius : this.width);
	},
	
	getYmax: function(){
		return  this.y + ((this.shape == "circle") ? this.radius : this.height);
	},
	
	getMaxPos: function(){
		return {x: this.getXmax(), y: this.getYmax()};
	},
	
	getWidth: function(){
		return (this.shape == "circle") ? 2*this.radius : this.width;
	},
	
	getHeight: function(){
		return (this.shape == "circle") ? 2*this.radius : this.height;
	},
	
	getSize: function(){
		return {w: this.width, h:this.height};
	},
	
	_circleCircleCollision: function(c1,c2){
		return (Math.hypot(c1.x-c2.x, c1.y-c2.y) < (c1.radius + c2.radius));
	},
	
	_rectangleRectangleCollision: function(rect1, rect2){
		var l1 = rect1.getXmin(), r1 = rect1.getXmax(), t1 = rect1.getYmin(), b1 = rect1.getYmax();
		var l2 = rect2.getXmin(), r2 = rect2.getXmax(), t2 = rect2.getYmin(), b2 = rect2.getYmax();
		//console.log( l1>=r2, l2>=r1, t1>=b2, t2>=b1 )
		return !( l1>=r2 || l2>=r1 || t1>=b2 || t2>=b1 );
	},
	
	_circleRectangleCollision: function(circle, rectangle){
		// based on Cygon's code on: http://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
		
		// Find the closest point to the circle within the rectangle
		var closestX = Math.min(Math.max(circle.x, rectangle.getXmin()), rectangle.getXmax());
		var closestY = Math.min(Math.max(circle.y, rectangle.getYmin()), rectangle.getYmax());
		
		// Calculate the distance between the circle's center and this closest point
		var distanceX = circle.x - closestX;
		var distanceY = circle.y - closestY;
		
		// If the distance is less than the circle's radius, an intersection occurs
		var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
		return distanceSquared < (circle.radius * circle.radius);
	}
	
});
