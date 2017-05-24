"use strict";

var Weapon = Wieldable.extend({
	cooldown: 0,
	update: function(time){
		this.cooldown -= time;
	}
});

var Weapons = { // enum
	Laser: Wieldable.extend({
		
// 		cooldown: 1.0,
// 		
// 		shoot: function(x, y, direction){
// 			
// 		}
		
	}),
	Gun: Weapon.extend({
		spriteName: "gun",
		
		shoot: function(){
			if (this.cooldown <= 0){
				(new Bullet(this.getAbsoluteX(),this.getAbsoluteY(),this.getAbsoluteDirection(),30)).putInMap(this.parent.map);
				this.cooldown = 0.3;
			}
		}
	})
};