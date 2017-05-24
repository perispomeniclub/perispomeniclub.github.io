"use strict";


var Mobile = Movable.extend({
	vx: 0,
	vy: 0,
	maxSpeed:0,
	
	collisionManager: null, // : CollisionManager
	
	
	turn: function(direction){
		if (direction){
			this.setDirection(this.getDirection() + direction);
		}
	},
	setMovement: function(vx, vy){ // vx and vy form the vector for the movement relative to the current orientation
		this.vx = vx;
		this.vy = vy;
	},
	addMovement: function(vx, vy){ // vx and vy form the vector for the movement relative to the current orientation
		this.vx += vx;
		this.vy += vy;
	},
	update: function(timeSinceLastUpdate){ // time in seconds
		this._super.apply(this,arguments);
		this.move(this.vx, this.vy,this.maxSpeed * timeSinceLastUpdate);
	}
});