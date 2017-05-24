var Placable=Class.extend({
	x:0,
	y:0,
	sprite:{},
	place:function(x,y){
		this.x=x;
		this.y=y;
	},
	setSprite:function(array){
		this.sprite=array[this.spriteName];
	},
	draw:function(data){
		data.drawing.drawSprite(this.sprite,this.x*data.scl,this.y*data.scl);
	},
	setEvents:function(events){
		this.eventRoom=events;
		events.addObj(this);
	},
	removeEvents:function(){
		this.eventRoom.removeObj(this);
		this.eventRoom=undefined;
	},
	init:function(x,y,collisionField){
		this.collisionField=collisionField;
		if (collisionField==undefined) console.log(this);
		this.x=x;
		this.y=y;
	}
});

var Movable=Placable.extend({
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
	gravity:1/64,
	onground:false,
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
	ev_step:function(){
		this.onground=false;
		this.yto+=this.gravity;
		this.yto*=this.airFrictionY;
		this.xprevious=this.x;
		this.yprevious=this.y;
		this.y+=this.yto;
		var c=this.solidCollision();
		if (c==2){
			if (this.yto>0){
				var newPlace=Math.floor(this.y+this.box.b)-this.box.b;
				if (this.y-this.yto<=newPlace){
					this.y=newPlace;
					this.onground=true;
					this.yto=0;
				}
			}
		}else if (c){
			if (this.yto>0){
				this.y=Math.floor(this.y+this.box.b)-this.box.b;
				this.onground=true;
			}else{
				this.y=Math.ceil(this.y+this.box.t)-this.box.t;
				this.y-=this.yto;
			}
			this.yto=0;
		}
		this.xto*=this.onground?this.groundFrictionX:this.airFrictionX;
		this.x+=this.xto;
		c=this.solidCollision();
		if (c&&c!=2){
			this.x-=this.xto;
			this.xto=0;
		}
	},
	solidCollision:function(){
		//if (this.collidesWith(world))
			//return 1;
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
	ev_setCollisions:function(){
		this.collisionField.remove(this,this.xprevious+this.box.l,this.yprevious+this.box.t,this.xprevious+this.box.r,this.yprevious+this.box.b);
		this.collisionField.set(this,this.x+this.box.l,this.y+this.box.t,this.x+this.box.r,this.y+this.box.b);
	},
	ev_getCollisions:function(){
		var objs=this.collisionField.get(this.x+this.box.l-2,this.y+this.box.t-2,this.x+this.box.r+2,this.y+this.box.b+2);
		var collisions=[];
		for (var i=0;i<objs.length;i++){
			if (objs[i]!==this)
				collisions.push(objs[i]);
		}
		this.collisions=collisions;
	}
});

var Creature=Movable.extend({
	speed:{walk:1/16, float:0.025, jump:3/8, fly:1/144},
	ev_step:function(world){
		this._super(world);
		if (!this.controller)
			return;	// don't execute it until the controller is implemented
		var dir=(this.controller.right-this.controller.left);
		dir=(!dir)?0:(dir>0?1:-1);
		this.xto+=(this.onground?this.speed.walk:this.speed.float)*dir;
		
		if ((this.controller.jump&&this.onground)||this.controller.fly)
			this.yto=-this.speed.jump;
		if (this.controller.up&&this.yto<0)
			this.yto-=this.speed.fly;
	},
	invSize:0,
	init:function(x,y,c){
		this._super(x,y,c);
		this.inventory=new Inventory(this.invSize);
	}
})

var Player=Creature.extend({
	spriteName:"player",
	box:{l:0.125,t:0.125,r:0.875,b:2},
	speed:{walk:1/16, float:0.025, jump:3/8, fly:1/144},
	ev_draw10:function(data){
		this.draw(data);
	},
});

var Gnome=Creature.extend({
	spriteName:"gnomeLeft",
	box:{l:2/32,t:4/32,r:6/32,b:24/32},
	ev_draw10:function(data){
		data.drawing.drawSprite(this.sprite,this.x*data.scl,this.y*data.scl);
	}
	
});

var Goblin=Creature.extend({
	spriteName:"goblinRight",
	box:{l:8/32,t:5/32,r:24/32,b:1.5},
	ev_draw10:function(data){
		data.drawing.drawSprite(this.sprite,this.x*data.scl,this.y*data.scl);
	}
	
});

var Block=Placable.extend({
	collision:"rectangle",
	box:{l:0,t:0,r:1,b:1},
	solid:1,
	static:true,
	ev_startCollisions:function(){
		this.collisionField.set(this,this.x+this.box.l,this.y+this.box.t,this.x+this.box.r,this.y+this.box.b);
	}
});


var Stone=Block.extend({
	spriteName:"black",
	spriteNames:{left:"stoneLeft",right:"stoneRight",top:"stoneTop",bottom:"stoneBottom"},
	sprites:{},
	filling:true,
	neighbours:{},
	around:{"left":[-1,0],"bottom":[0,1],"right":[1,0],"top":[0,-1]},
	findNeighbours:function(field){
		neighbours={};
		for (var n in this.around){
			var objs=field.get(this.x+this.around[n][0],this.y+this.around[n][1],this.x+this.around[n][0]+1,this.y+this.around[n][1]+1);
			for (var i=0;i<objs.length;i++){
				if (objs[i].static){
					neighbours[n]=objs[i];
					break;
				}
			}
			this.neighbours=neighbours;
		}
	},
	setSprite:function(sprites){
		this._super(sprites);
		this.sprites={};
		for (var x in this.spriteNames){
			this.sprites[x]=sprites[this.spriteNames[x]];
		}
	},
	ev_getStartCollisions:function(){
		this.findNeighbours(this.collisionField);
	},
	ev_draw13:function(data){
		this.draw(data);
	},
	ev_draw14:function(data){
		for (var x in this.around){
			if (this.neighbours[x]&&this.neighbours[x].filling){
				continue;
			}
			data.drawing.drawSprite(this.sprites[x],this.x*data.scl,this.y*data.scl);
		}
	
	}
});

var Ground=Stone.extend({
	spriteNames:{left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom"}
});

var Grass=Stone.extend({
	spriteNames:{left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom",grass:"grassTop"},
	ev_draw16:function(data){
		if ((this.neighbours.top&&this.neighbours.top.filling))
			return;
		data.drawing.drawSprite(this.sprites.grass,this.x*data.scl,this.y*data.scl);
	}
});

var GnomeDoor=Grass.extend({
	spriteNames:{left:"groundLeft",right:"groundRight",top:"groundTop",bottom:"groundBottom",grass:"grassTop",door:"gnomeDoor"},
	ev_draw15:function(data){
		if (!(this.neighbours.left&&this.neighbours.left.filling)){
			data.drawing.drawSprite(this.sprites.door,this.x*data.scl,this.y*data.scl);
		} else if (!(this.neighbours.right&&this.neighbours.right.filling)){
			data.drawing.drawSprite(this.sprites.door,(this.x+1)*data.scl,this.y*data.scl);
		}
	}
});

var Decor=Block.extend({
	solid:0,
	filling:false,
	init:function(x,y,c){
		this._super(x,y,c);
		if (this.level){
			this["ev_draw"+this.level]=function(data){
				this.draw(data);
			};
		}
	}
});

var TreeStem=Decor.extend({spriteName:"treeStem",level:8});

var Leaves=Decor.extend({spriteName:"leaves",level:9});

var TreeBranch=Block.extend({
	spriteName:"treeBranch",
	solid:2,
	box:{l:0,t:0,r:1,b:0.5},
	ev_draw8:function(data){
		this.draw(data);
	}
});

var Fire=Decor.extend({spriteName:"fire",level:17});

var Bush=Decor.extend({spriteName:"bush",level:17});


var Item=Placable.extend({
	collision:"rectangle",
	box:{l:0,t:0,r:1,b:1},
	remove:function(collisionEvent){
		collisionEvent.removeObj(this);
		return this;
	}
});

var Coin=Item.extend({
	spiteName:"coin"
})
