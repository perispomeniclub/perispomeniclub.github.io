"use strict";
/* some code I copied from the platformer game
 * each Controller has a Mobile
 * note: this is a controller for player controlled objects not for monsters
 */

var Controller=Class.extend({
	obj: null,
	setObject:function(obj){
		this.obj = obj;
	},
	init:function(obj){
		this.obj = obj;
	}
});


/*
 * whenever control is called, it will update the information that object has about controls
 */

var ControllerKeys=Controller.extend({
	/*
	 * This is not the best style code in the game, once I have time for it, this mechanism should chance
	 */
	keys: null,
	init: function(obj){
		this._super(obj);
		this.keys = new Keys();
	},
		
	control:function(time){
		var keys = this.keys;
		var controls = {
			// 999 represents here a number that is definitly larger than the maxspeed
			left: keys.get(81)*999,
			right: keys.get(69)*999,
			up: (keys.get(87)||keys.get(38))*999,
			down: (keys.get(83) || keys.get(40))*999,
			turn: -((keys.get(68)||keys.get(39)) - (keys.get(65)||keys.get(37)))*time*4,
			shoot: keys.get(32)
		};
		
		this.obj.control(controls);
	},
});














/*/ ugly, when the rest works, I should completely rewrite this
var Controller = Class.extend({
	
	player: null,
	controls: null,
	
	init: function(player){
		this.player = player
		this.controls = {
			left: 0,
			right: 0,
			up: 0,
			down: 0,
			turn: 0.0,
		}
		
		document.addEventListener("keydown",function(e){Keys.press(e.which);});
		document.addEventListener("keyup",function(e){Keys.release(e.which);});
		window.addEventListener("blur",function(e){Keys.clearAll()});
	},
	setControl: function(keyCode){
		switch(keyCode){
			case 65
	
});*/