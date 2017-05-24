"using strict";

define(["lib/inheritance"], function(Class){
	var Player = Class.extend({
		
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		isMoving: false,
		movement: 0,
		field: null,
		alive: true,
		finished: false,
		spritename: "player",
		
		init: function(field, x, y){
			this.x = x;
			this.y = y;
			this.field = field;
		},
		move: function(dx, dy){
			if ((dx==0&&dy==0)||this.isMoving) return;
			this.dx = dx;
			this.dy = dy;
			this.isMoving = true;
		},
		isAlive: function(){
			return this.alive;
		},
		isFinished: function(){
			return this.finished;
		},
		update: function(){
			if (!this.isMoving){
				return;
			}
			
			var xprevious = this.x,
				yprevious = this.y;
			this.step();
			if (this.x<0 || this.y<0 || this.x>=this.field.width || this.y>=this.field.height){
				this.die();
				return;
			}
			var obj = this.field.get(this.x, this.y);
			if ((obj && obj.touch && obj.touch(this))){
				this.place(xprevious, yprevious);
			} else {
				this.field.visit(xprevious,yprevious);
			}
		},
		stop: function(){
			this.isMoving=false;
		},
		step: function(){
			this.place(this.x + this.dx, this.y + this.dy);
		},
		place: function(x, y){
			this.x = x;
			this.y = y;
		},
		setDirection: function(dx, dy){
			this.dx = dx;
			this.dy = dy;
		},
		die: function(){
			this.stop();
			this.alive = false;
			console.log("dead");
		},
		finish: function(){
			this.stop();
			this.finished = true;
			console.log("win");
		}
	});
	return Player;
});
