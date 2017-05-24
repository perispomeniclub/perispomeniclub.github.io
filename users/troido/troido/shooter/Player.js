"use strict";




var Player = Mobile.extend({
	
	spriteName: "player",
	shape: "circle",
	radius: 1,
	solid: true,
	maxSpeed: 10,
	weapon: null,
	
	health: 100,
	
	init: function(){
		this._super.apply(this,arguments);
		this.weapon = new Weapons.Gun(this,1.5,0,0)
		this.addGear(this.weapon);
	},
	
	control: function(controls){ 
		this.setMovement(0,0);
		this.addMovement(controls.up - controls.down, controls.right - controls.left );
		this.turn(controls.turn);
		this.willShoot = controls.shoot;
	},
	update: function(time){
		this._super.apply(this,arguments);
		//console.log(this.getDirectionVector());
		
		this.willShoot && this.weapon.shoot();
		
	},
	damage:function(amount){
		this.health -= amount;
	}
});