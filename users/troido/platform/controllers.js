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
// 			console.log(this.keys);
			var keys = this.keys
			this.left=keys.get(65)||keys.get(37);
			this.right=keys.get(68)||keys.get(39);
			this.jump=keys.getPress(87)||keys.getPress(38);
			this.up=keys.get(87)||keys.get(38);
			this.fly=keys.getPress(32);
			this.shift=keys.getPress(90);
			if (this.shift&&this.obj.collisions.length){
// 				this.obj.collisions.some(function(obj){
				var obj;
				for (var i=0;i<this.obj.collisions.length;i++){
					obj = this.obj.collisions[i]
					if (obj instanceof Blocks.Creature && obj !== this.obj){
						this.setObject(obj);
						break;
					}
				}
			}
			keys.clear();
		}
	});
	
	return this;
}).apply({});