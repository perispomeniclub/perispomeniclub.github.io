"use strict";

/**
 * an explosion is created for example by a bullet, and damages all objects it collides with
 * (assuming these objects can be damaged)
 * After a certain time, the explosion will remove itself
 */

var Explosion = Placable.extend({
	
	spriteName: "explosion",
	shape: "circle",
	radius: 1.75,
	solid: false,
	timeToLive: 0.5,
	damagePerSecond: 40,
	
	update: function(time){
		this.getCollisions().forEach(function(obj){
			obj.damage && obj.damage(this.damagePerSecond*Math.min(time, this.timeToLive));
		},this);
		this.timeToLive -= time;
		if (this.timeToLive <= 0){
			this.delete()
		}
	}
});