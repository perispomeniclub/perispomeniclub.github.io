"using strict";

define(["lib/inheritance"], function(Class){
	var Blocks = {};
	(function(){
		var B = this;
		
		// superclass for all solid blocks
		this.solid = Class.extend({
			// the touch method is fired when the player enters this square
			// if this returns true, the player will undo the step of entering
			touch: function(player){
				player.stop();
				return true;
			}
		});
		
		// the common block
		this.block = this.solid.extend({
			spritename: "block"
		});
		
		// the goal block, once this is reached, the player finished the level
		this.end = Class.extend({
			spritename: "end",
			touch: function(player){
				player.finish();
				return false;
			}
		});
		
		// superclass for the four blocks that can make the player change direction
		this.corner = Class.extend({
			dx: 0,
			dy: 0,
			_d: 1,
			init: function(dxy){
				this.dx = parseInt(dxy[0]);
				this.dy = parseInt(dxy[1]);
				this._d = -this.dx * this.dy
			},
			touch: function(player){
				
				if (player.dx == this.dx || player.dy == this.dy){
					// if the player enters on the diagonal side, make him change direction
					player.setDirection(this._d*player.dy, this._d*player.dx);
					return false;
				} else {
					// else, stop him
					player.stop();
					return true;
				}
				
			}
		});
		
		// corner where the top and left sides make the player change direction
		this.cornerTL = this.corner.extend({
			spritename: "cornerTL",
			init: function(){
				this._super([1,1]);
			}
		});
		
		// corner where the top and right sides make the player change direction
		this.cornerTR = this.corner.extend({
			spritename: "cornerTR",
			init: function(){
				this._super([-1,1]);
			}
		});
		
		// corner where the bottom and right sides make the player change direction
		this.cornerBR = this.corner.extend({
			spritename: "cornerBR",
			init: function(){
				this._super([-1,-1]);
			}
		});
		
		// corner where the bottom and left sides make the player change direction
		this.cornerBL = this.corner.extend({
			spritename: "cornerBL",
			init: function(){
				this._super([1,-1]);
			}
		});
		
		// a stopper block where the player can choose direction again
		this.stop = Class.extend({
			spritename: "stopper",
			touch: function(player){
				player.stop();
				return false;
			}
		});
		
		// a teleport to teleport the player to a certain location
		this.teleport = Class.extend({
			targetX: 0,
			targetY: 0,
			init: function(targetXY){
				this.targetX = parseInt(targetXY[0]);
				this.targetY = parseInt(targetXY[1]);
			},
			touch:function(player){
				player.place(this.targetX, this.targetY);
				return false;
			}
		});
		
		this.teleC = this.teleport.extend({
			spritename: "teleC"
		});
		
		this.teleM = this.teleport.extend({
			
			spritename: "teleM"
		});
		this.teleB = this.teleport.extend({
			
			spritename: "teleB"
		});
		
		// this block will, once entered, remove the two blocks on its left and right, and become solid itself.
		this.clickerH = Class.extend({
			spritename: "clickerH",
			field: null,
			x: 0,
			y: 0,
			
			init: function(a, field, x, y){
				this.field = field;
				this.x = x;
				this.y = y;
			},
			touch: function(player){
				this.field.set(this.x-1, this.y, null);
				this.field.set(this.x+1, this.y, null);
				this.field.set(this.x, this.y, new B.block());
			}
		});
		
		// same as clickerH, but vertical
		this.clickerV = Class.extend({
			spritename: "clickerV",
			field: null,
			x: 0,
			y: 0,
			
			init: function(a, field, x, y){
				this.field = field;
				this.x = x;
				this.y = y;
			},
			touch: function(player){
				this.field.set(this.x, this.y-1, null);
				this.field.set(this.x, this.y+1, null);
				this.field.set(this.x, this.y, new B.block());
			}
		});
		
		
	}).apply(Blocks);
	return Blocks;
});
	