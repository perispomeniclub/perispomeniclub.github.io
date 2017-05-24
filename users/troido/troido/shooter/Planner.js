"use strict";

var Planner = Movable.extend({
	
	xto: 0,
	yto: 0,
	moving: false,
	maxSpeed: 0,
	
	goalX: 0,
	goalY: 0,
	
	path: null,
	
	goTo: function(xto, yto){
		this.moving = true;
		this.xto = xto;
		this.yto = yto;
	},
	
	moveToGoal: function(maxSpeed){
		if (this.moving){
			if (this.x == this.xto && this.y == this.yto){
				this.moving = false;
			} else {
				var canmove = this.move(this.xto - this.x, this.yto - this.y,maxSpeed);
				this.moving = canmove
				return canmove;
			}
		}
		return true;
	},
	
	moveTo: function(x, y){
		this.goalX = x;
		this.goalY = y;
		
		this.path = Pathfinding.findPathAstar2d(this.map.getSolidField([this]),this.getPosition(),{x:x,y:y},this.getSize());
		//console.log(this.path);
	},
	
	follow: function(obj){
		if (((this.x == this.goalX && this.y == this.goalY) || Math.hypot(this.goalX - obj.x, this.goalY - obj.y) > 3 ) && !this.moving){
			//console.log(this)
			this.path = Pathfinding.findPathAstar2d(this.map.getSolidField([this, obj]),this.getPosition(),obj.getPosition(),this.getSize());
			//console.log(this.path);
			this.goalX = obj.x;
			this.goalY = obj.y;
		}
	},
	
	update: function(time){
		this._super.apply(this,arguments);
		if (!this.moving && this.path && this.path.length){
			var goal = this.path.shift();
			this.goTo(goal.x, goal.y);
		}
		if (!this.moveToGoal(time * this.maxSpeed)){
			this.moveTo(this.goalX, this.goalY);
		}
	}
});