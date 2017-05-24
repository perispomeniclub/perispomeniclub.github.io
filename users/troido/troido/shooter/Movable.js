"use strict";



var Movable = Placable.extend({
	move: function(vx, vy, maxSpeed){//console.log(vx, vy);
		// make sure the player does not go faster than the maximal speed
		if (maxSpeed && (vx*vx + vy*vy > maxSpeed*maxSpeed)){
			var v = Math.hypot(vx, vy);//Math.sqrt(this.xto*this.xto + this.yto*this.yto);
			vx *= maxSpeed/v;
			vy *= maxSpeed/v;
		}
		
		// move the player
		var dir = this.getDirectionVector();
		var dx = (vx*dir.x - vy*dir.y);
		var dy = (vx*dir.y + vy*dir.x);
		if (dx != 0 || dy != 0){
			if (this.canStand(this.x + dx, this.y + dy)){
				this.place(this.x + dx,this.y + dy);
			} else {
				return false;
			}
		}
		return true;
	}
});