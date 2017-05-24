"use strict";
/**
 * A projectile to be fired by a gun.
 * When this projectile collides with a solid object, it will create an explosion and destroy itself
 */

var Bullet = Placable.extend({
	
	speed: 0,
	spriteName: "bullet",
	shape: "circle",
	radius: 0.5,
	
	init: function(x, y, direction, speed){
		// start with a forwards motion
		this._super(x, y, direction);
		this.speed = speed;
	},
	update: function(time){
		this._super(time);
		
		var dir = this.getDirectionVector()
		this.place(this.x + this.speed*time*dir.x, this.y + this.speed*time*dir.y);
		if (!this.canStand(this.x, this.y)){ //!this.move(0,this.speed*time)){
			// create an explosion
			(new Explosion(this.x, this.y, this.direction)).putInMap(this.map);
			this.delete()
		}
	}
});