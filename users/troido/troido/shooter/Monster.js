"use strict";

var Monster = Planner.extend({
	
	spriteName: "monster",
	shape: "rectangle",
	width: 3,
	height: 3,
	solid: true,
	health: 25,
	damagePerSecond: 15,
	maxSpeed: 11,
	seeingRange: 15,
	target: null,
	
	damage: function(d){
		this.health -= d;
	},
	
	update: function(time){
		if (!this.target){//console.log(this.target)
			var nearObjects = this.map.get(this.getXmin()-this.seeingRange, this.getYmin()-this.seeingRange, this.getXmax()+this.seeingRange, this.getYmax()+this.seeingRange);
			nearObjects.forEach(function(obj){
				if (obj instanceof Player){
					this.target = obj;
					//console.log(this.target)
				}
			},this);
		}
		
		if (this.target){
			this.follow(this.target)
			//this.goTo(this.target.x, this.target.y);
		}
		this._super(time);
		
		if (this.health <= 0){
			this.delete();
			return
		}
// 		console.log(this.health);
		this.getCollisions().forEach(function(obj){
			obj.damage && obj.damage(this.damagePerSecond*time);
		});
	}
});