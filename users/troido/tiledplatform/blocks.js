"use strict";

/**
 * These are all the Entities that can be placed on the screen
 * also some abstract classes
 * Maybe I should replace this with the Entity Component System thingy
 * 
 */
var Blocks = {};
(function(){
	
	// The super class for all game entities
	// it has a name, a location and a shape
	this.GameObject = Class.extend({
		
		
		// name should be the name of the class
		// it should replace spriteName
		// the code at the bottom of the page sets the name
		name: "",
		x:0,
		y:0,
		// The box is somewhat like the metrics of the object.
		// if l and t are not zero, the left upper corner is not placed exactly at the 
		// x and y coordinates.
		// the difference between l and r, and between t and b, are the width and height of the entity respectively
		box: {l: 0,t: 0,r: 1,b: 1},
		
		
		init: function(){
			
			// should make the name a property of the object itself
			// this makes it easier to recognize the object when it is logged
			// apart from debugging convenience this does not do anything
			this.name = this.name;
		},
		
		getX: function(){
			return this.x;
		},
		getY: function(){
			return this.y;
		},
		getXmin: function(){
			return this.x + this.box.l;
		},
		getXmax: function(){
			return this.x + this.box.r;
		},
		getYmin: function(){
			return this.y + this.box.t;
		},
		getYmax: function(){
			return this.y + this.box.b;
		},
		getWidth: function(){
			return this.box.r - this.box.l;
		},
		getHeight: function(){
			return this.box.b - this.box.t;
		}
	});
	
	
	// the type of entity that should communicate with a CollisionManager (which all entities should)
	// children of this class should not modify x and y, but call the function place instead
	this.Placable = this.GameObject.extend({
		
		
		collisionField: null,
		collision: "rectangle",
		
		
		init: function(x,y,game){
			this._super();
			this.collisionField = game.room;
			if (!this.collisionField){
				console.log(this);
				console.error("no CollisionField found");
			}
			this.place(x,y);
		},
		// change x and y coordinates and update the information in the CollisionManager (if there is any)
		place: function(x,y){
			this.collisionField && this.collisionField.remove(this);
			this.x = x;
			this.y = y;
			this.collisionField && this.collisionField.set(this);
		},
		// returns whether an object collides with this object
		collidesWith: function(obj){
			switch (obj.collision){
				case "rectangle":
					var l1 = this.getXmin(), r1 = this.getXmax(), t1 = this.getYmin(), b1 =this.getYmax();
					var l2 = obj.getXmin(), r2 = obj.getXmax(), t2 = obj.getYmin(), b2 = obj.getYmax();
					return !(l1>r2 || l2>r1 || t1>=b2 || t2>=b1);
				case "complex":
					return obj.collidesWith(this);
			}
		},
		/*
		updateCollisions: function(){
			var objs = this.collisionField.get(this.x+this.box.l-2,this.y+this.box.t-2,this.x+this.box.r+2,this.y+this.box.b+2);
			var collisions = [];
			objs.forEach(function(obj){
				if (obj !== this){
					collisions.push(obj);
				}
			},this);
			this.collisions = collisions;
		},*/
		
		// returns all the Placable entities that collide with this object
		getCollisions: function(){
			var objs = this.collisionField.get(this.x+this.box.l-2,this.y+this.box.t-2,this.x+this.box.r+2,this.y+this.box.b+2);
			var collisions = [];
			objs.forEach(function(obj){
				if (obj !== this && this.collidesWith(obj)){
					collisions.push(obj);
				}
			},this);
			return collisions;
		},
		solidCollision: function(){
			var collisions = this.getCollisions();
			var s = 0;
			for (var i=0;i<collisions.length;i++){
// 				if (this.collidesWith(collisions[i])){
				switch (collisions[i].solid){
					case 0:
						break;
					case 1:
						return 1;
					case 2:
						var other = collisions[i];
						if (this.yto>0 && this.y+this.box.b<=other.y+other.box.b)
							s = 2;
						break;
				}
// 				}
			}
			return s;
		}
		
	});
	
	// This class represents all objects that are influenced by physics
	// These objects should therefore be updated every step
	this.Movable = this.Placable.extend({
		xto:0,
		yto:0,
		box:{
			l:0,t:0,r:1,b:1
		},
		airFrictionY:0.985,
		airFrictionX:0.90,
		groundFrictionX:0.75,
		gravity:0.0165,
		onground:false,
		
		
		init: function(x, y, game){
			this._super(x, y, game);
			game.addStepObserver(this);
		},
		step:function(timePassed){
			
			timePassed = Math.min(timePassed, 0.067);
			
			this.onground = false;
			this.yto += this.gravity;
			this.yto *= this.airFrictionY;
// 			var xprevious = this.x;
// 			var yprevious = this.y;
			this.place(this.x, this.y + this.yto);
			var c = this.solidCollision();
			if (c==2){
				// the object collides with something it can stand on, but also can jump through
				if (this.yto>0){
					var newPlace = Math.floor(this.y+this.box.b)-this.box.b;
					if (this.y-this.yto<=newPlace){
						this.place(this.x,newPlace);
						this.onground = true;
						this.yto = 0;
					}
				}
			} else if (c){
				// a normal collision
				if (this.yto>0){
					this.place(this.x, Math.floor(this.y+this.box.b)-this.box.b);
					this.onground=true;
				} else {
					this.place(this.x, Math.ceil(this.y+this.box.t)-this.box.t - this.yto);
				}
				this.yto=0;
			}
			this.xto *= this.onground ? this.groundFrictionX:this.airFrictionX;
			this.place(this.x+this.xto, this.y);
			c = this.solidCollision();
			if (c&&c!=2){
				this.place(this.x-this.xto,this.y);
				this.xto=0;
			}
			
		}
	});
	
	
	/* I don't really remember the exact distinction between Movable and Creature,
	 * but a Creature can be controlled by some controller
	 */
	this.Creature = this.Movable.extend({
		speed:{walk:1/16, float:0.025, jump:3/8, fly:1/144},
		controller: null,
		
		step:function(world){
			this._super(world);
			if (!this.controller){
				return;
			}
			var plans = this.controller.plan();
			if (!plans){
				return;
			}
			var dir=(plans.right-plans.left);
			dir=(!dir)?0:(dir>0?1:-1);
			this.xto+=(this.onground?this.speed.walk:this.speed.float)*dir;
			
			if ((plans.jump&&this.onground)||plans.fly)
				this.yto=-this.speed.jump;
			if (plans.up&&this.yto<0)
				this.yto-=this.speed.fly;
		},
		invSize:0,
		init:function(x,y,g){
			this._super(x,y,g);
			this.inventory=new Inventory(this.invSize);
			if (this.controllerName){
				this.controller = new Controllers[this.controllerName](this, g);
			}
		}
	})

	this.Player = this.Creature.extend({
		controllerName: "ControllerKeys",
		box:{l:0.125,t:0.125,r:0.875,b:2},
		speed:{walk:1/16, float:0.025, jump:3/8, fly:1/144},
		init: function(x,y,g){
			this._super(x,y,g);
			// debug acces to the player
			// remove this later
			window.player = this;
		}
	});

	this.Gnome = this.Creature.extend({
		box:{l:2/32,t:4/32,r:6/32,b:24/32}
		
	});

	this.Goblin = this.Creature.extend({
		box:{l:8/32,t:5/32,r:24/32,b:1.5}
		
	});

	this.Block = this.Placable.extend({
		collision:"rectangle",
		box:{l:0,t:0,r:1,b:1},
		solid:1,
		static:true
	});


	this.Stone = this.Block.extend({
		filling: true,
		neighbours: null,
		around:{"left":[-1,0],"bottom":[0,1],"right":[1,0],"top":[0,-1]},
		findNeighbours:function(){
			var field = this.collisionField;
			var neighbours={};
			for (var n in this.around){
				var objs=field.get(this.x+this.around[n][0],this.y+this.around[n][1],this.x+this.around[n][0]+1,this.y+this.around[n][1]+1);
				objs.forEach(function(obj){
					if (obj.static){
						neighbours[n]=obj;
	// 					break;
					}
				});
				this.neighbours=neighbours;
			}
		}
		
	});

	this.Ground = this.Stone.extend({});

	this.Grass = this.Stone.extend({});

	this.GnomeDoor = this.Grass.extend({});

	this.Decor = this.Block.extend({
		solid:0,
		filling:false
	});

	this.TreeStem = this.Decor.extend({});

	this.Leaves = this.Decor.extend({});

	this.TreeBranch = this.Block.extend({
		solid:2,
		box:{l:0,t:0,r:1,b:0.5}
	});

	this.Fire = this.Decor.extend({});

	this.Bush = this.Decor.extend({});


	this.Item = this.Placable.extend({
		collision:"rectangle",
		box:{l:0,t:0,r:1,b:1},
		remove:function(collisionEvent){
			collisionEvent.removeObj(this);
			return this;
		}
	});

	this.Coin = this.Item.extend({});
	
	
	// make sure each class has a name
	for (var name in this){
		this[name].prototype.name = name;
	}
	
	return this;
	
}).apply(Blocks);
