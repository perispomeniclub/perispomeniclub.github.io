"use strict";

var Controllers = (function(){
	this.Controller = Class.extend({
		
		obj: null,
		setObject:function(obj){
			if (this.obj){
				this.obj.controller=undefined;
			}
			this.obj=obj;
			obj.controller=this;
		},
		init:function(obj){
			if (obj){
				this.obj=obj;
			}
		}
	});

	this.ControllerKeys = this.Controller.extend({
		
		keys: null,
		
		init: function(obj, game){
			this.keys = new Keys();
			this._super(obj);
// 			var camera = new Camera(this);
// 			obj.camera = camera; // ugly
			game.setCameraObj(this);
		},
		
		
		getX: function(){
			return this.obj.x+0.5;
		},
		
		getY: function(){
			return this.obj.y+0.5;
		},
		
		plan:function(){
			var keys = this.keys
			var movements = {};
			movements.left = keys.get(65)||keys.get(37);
			movements.right=keys.get(68)||keys.get(39);
			movements.jump=keys.getPress(87)||keys.getPress(38);
			movements.up=keys.get(87)||keys.get(38);
			movements.fly=keys.getPress(32);
			movements.shift=keys.getPress(90);
			var collisions = this.obj.getCollisions();
			if (movements.shift && collisions.length){
// 				this.obj.collisions.some(function(obj){
				var obj;
				for (var i=0;i<collisions.length;i++){
					obj = collisions[i]
					if (obj instanceof Blocks.Creature && obj !== this.obj){
						this.setObject(obj);
						break;
					}
				}
			}
			keys.clear();
			return movements;
		}
		
	});
	
	return this;
}).apply({});