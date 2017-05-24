"use strict";


var Blocks = (function(){
	this.Placable = Class.extend({
		x:0,
		y:0,
		box: {l: 0,t: 0,r: 1,b: 1},
		collisionField: null,
		drawOrder: 0,
		
		imgs: null,
		
		place:function(x,y){
			this.collisionField && this.collisionField.remove(this);
			this.x=x;
			this.y=y;
			this.collisionField && this.collisionField.set(this);
		},
		setEvents:function(events){
			this.eventRoom=events;
			events.addObj(this);
		},
		removeEvents:function(){
			this.eventRoom.removeObj(this);
			this.eventRoom=undefined;
		},
		init:function(x,y,game){
			this.collisionField = game.field;
			if (this.collisionField==undefined) console.log(this);
			this.place(x,y);
		},
		
		start: function(){
			this._updateImages();
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
			return this.box.r;
		},
		getHeight: function(){
			return this.box.b;
		},
		
		_updateImages: function(){
			if (this.spriteName){
				this.imgs = [{order: this.drawOrder, x: this.x, y: this.y, spriteName: this.spriteName}];
			}
		},
		
		getImages: function(){
			
			return this.imgs
		}
	});

	this.Movable = this.Placable.extend({
		xto:0,
		yto:0,
		xprevious:0,
		yprevious:0,
		collision:"rectangle",
		collisions:[],
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
		
		collidesWith:function(obj){
			switch (obj.collision){
				case "rectangle":
					var l1=this.x+this.box.l, r1=this.x+this.box.r, t1=this.y+this.box.t, b1=this.y+this.box.b;
					var l2= obj.x+ obj.box.l, r2= obj.x+ obj.box.r, t2= obj.y+ obj.box.t, b2= obj.y+ obj.box.b;
					return !(l1>r2||l2>r1||t1>=b2||t2>=b1);
				case "complex":
					return obj.collidesWith(this);
			}
		},
		step:function(timePassed){
			
			timePassed = Math.min(timePassed, 0.067);
			
			this.getCollisions();
			this.onground = false;
			this.yto += this.gravity;
			this.yto *= this.airFrictionY;
			this.xprevious = this.x;
			this.yprevious = this.y;
			this.place(this.x, this.y + this.yto);
			var c=this.solidCollision();
			if (c==2){
				if (this.yto>0){
					var newPlace = Math.floor(this.y+this.box.b)-this.box.b;
					if (this.y-this.yto<=newPlace){
						this.place(this.x,newPlace);
						this.onground = true;
						this.yto = 0;
					}
				}
			} else if (c){
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
			c=this.solidCollision();
			if (c&&c!=2){
				this.place(this.x-this.xto,this.y);
				this.xto=0;
			}
			
			this._updateImages();
		},
		solidCollision:function(){
			for (var i=0;i<this.collisions.length;i++){
				if (this.collidesWith(this.collisions[i])){
					switch (this.collisions[i].solid){
						case 0:
							break;
						case 1:
							return 1;
						case 2:
							var other=this.collisions[i];
							if (this.yto>0&&this.y+this.box.b<=other.y+other.box.b)
								return 2;
							break;
					}
				}
			}
			return 0;
		},
		getCollisions:function(){
			var objs=this.collisionField.get(this.x+this.box.l-2,this.y+this.box.t-2,this.x+this.box.r+2,this.y+this.box.b+2);
			var collisions=[];
			objs.forEach(function(obj){
				if (obj!==this)
					collisions.push(obj);
			});
			this.collisions=collisions;
		}
	});

	this.Creature = this.Movable.extend({
		speed:{walk:1/16, float:0.025, jump:3/8, fly:1/144},
		controller: null,
		
		step:function(world){
			this._super(world);
			this.controller && this.controller.plan();
			if (!this.controller){
				return;	// don't execute it until the controller is implemented
			}
			var dir=(this.controller.right-this.controller.left);
			dir=(!dir)?0:(dir>0?1:-1);
			this.xto+=(this.onground?this.speed.walk:this.speed.float)*dir;
			
			if ((this.controller.jump&&this.onground)||this.controller.fly)
				this.yto=-this.speed.jump;
			if (this.controller.up&&this.yto<0)
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
		spriteName:"player",
		drawOrder: 10,
		controllerName: "ControllerKeys",
		box:{l:0.125,t:0.125,r:0.875,b:2},
		speed:{walk:1/16, float:0.025, jump:3/8, fly:1/144}
	});

	this.Gnome = this.Creature.extend({
		spriteName:"gnomeLeft",
		drawOrder: 10,
		box:{l:2/32,t:4/32,r:6/32,b:24/32}
		
	});

	this.Goblin = this.Creature.extend({
		spriteName:"goblinRight",
		drawOrder: 10,
		box:{l:8/32,t:5/32,r:24/32,b:1.5}
		
	});

	this.Block = this.Placable.extend({
		collision:"rectangle",
		box:{l:0,t:0,r:1,b:1},
		solid:1,
		static:true
	});


	this.Stone = this.Block.extend({
		spriteName:"black",
		drawOrder: 13,
		spriteNames:{left:"stoneLeft",right:"stoneRight",top:"stoneTop",bottom:"stoneBottom"},
		overlayOrder: 14,
		filling:true,
		neighbours:{},
		around:{"left":[-1,0],"bottom":[0,1],"right":[1,0],"top":[0,-1]},
		_findNeighbours:function(field){
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
		},
		
		_updateImages: function(){
			this._findNeighbours(this.collisionField);
			this._super();
			for (var spr in this.around){
				if (!(this.neighbours[spr] && this.neighbours[spr].filling)){
					this.imgs.push({
						order: this.overlayOrder,
						x: this.x,
						y: this.y,
						spriteName: this.spriteNames[spr]
					});
				}
			}
		}
		
	});

	this.Ground = this.Stone.extend({
		spriteNames:{left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom"}
	});

	this.Grass = this.Stone.extend({
		spriteNames:{left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom",grass:"grassTop"},
		
		_updateImages: function(){
			this._super();
			if (!(this.neighbours.top && this.neighbours.top.filling)){
				this.imgs.push({order: 16, x: this.x, y: this.y, spriteName: this.spriteNames.grass});
			}
		}
		
	});

	this.GnomeDoor = this.Grass.extend({
		spriteNames:{left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom",grass:"grassTop",door:"gnomeDoorLeft",doorRight:"gnomeDoorRight"},

		_updateImages: function(){
			this._super();
			if (!(this.neighbours.left&&this.neighbours.left.filling)){
				this.imgs.push({order: 15, x: this.x, y: this.y, spriteName: this.spriteNames.door});
			} else if (!(this.neighbours.right&&this.neighbours.right.filling)){
				this.imgs.push({order: 15, x: this.x, y: this.y, spriteName: this.spriteNames.doorRight});
			}
		}
	});

	this.Decor = this.Block.extend({
		solid:0,
		filling:false
	});

	this.TreeStem = this.Decor.extend({spriteName:"treeStem",drawOrder:8});

	this.Leaves = this.Decor.extend({spriteName:"leaves",drawOrder:9});

	this.TreeBranch = this.Block.extend({
		spriteName:"treeBranch",
		solid:2,
		box:{l:0,t:0,r:1,b:0.5}
	});

	this.Fire = this.Decor.extend({spriteName:"fire",drawOrder:17});

	this.Bush = this.Decor.extend({spriteName:"bush",drawOrder:17});


	this.Item = this.Placable.extend({
		collision:"rectangle",
		box:{l:0,t:0,r:1,b:1},
		remove:function(collisionEvent){
			collisionEvent.removeObj(this);
			return this;
		}
	});

	this.Coin = this.Item.extend({
		spiteName:"coin"
	})
	
	return this;
	
}).apply({});
