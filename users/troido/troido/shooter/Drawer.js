"use strict";

/**
 * The Drawer class is the view component of the game.
 * When draw is called it will draw the sprites of all objects in the game, with the correct transformation
 */

var Drawer = Class.extend({
	
	game: null,
	
	screenWidth: 0,
	screenHeight: 0,
	canvas: null,
	ctx: null,
	scale: 1,
	sprites : null,
	
	init: function(game, canvas, width, height, scale){
		
		this.game = game;
		this.screenWidth = width;
		this.screenHeight = height;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.scale = scale;
		this.sprites = Sprite.loadSprites(JSON.parse(loadSync("sprites.json")));
	},
	
	draw: function(DRAWGRID){
		
		this.canvas.width = this.screenWidth;
		this.canvas.height = this.screenHeight;
		
		/* when DRAWGRID is true, all lines will be drawn for the collisionmanager's grid
		 */
		if (DRAWGRID){
			this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
			this.ctx.strokeStyle = "#000000";
			for (var i=0; i<=this.game.getWidth(); i++){
				this.ctx.moveTo(0, this.scale*i);
				this.ctx.lineTo(this.screenWidth, this.scale*i);
				this.ctx.moveTo(this.scale*i, 0);
				this.ctx.lineTo(this.scale*i, this.screenHeight);
			}
			this.ctx.stroke();
		}
		
		// It says players here, but I actually mean all Placables
		var players = this.game.getPlayers();
		players.forEach(function(value, key, collection){
			this.drawPlayer(value);
		},this);
	},
	
	drawSprite: function(spr,x,y){ // draws a sprite (as in a sprite of the Sprite class)
		this.ctx.drawImage(spr.img,spr.sx,spr.sy,spr.swidth,spr.sheight,x-spr.cx,y-spr.cy,spr.width,spr.height);
	},
	
	drawPlayer: function(player){
		/* draw a Placable, and then all it's gear, with the correct transformations
		 */
		var dir = player.getDirectionVector();
		
		this.ctx.setTransform(dir.x, dir.y, -dir.y, dir.x, player.x*this.scale, player.y*this.scale);
		
		this.drawSprite(this.sprites[player.spriteName],0,0);
		
		player.getGear().forEach(function(gear){
			this.ctx.setTransform(dir.x, dir.y, -dir.y, dir.x, player.x*this.scale, player.y*this.scale);
			this.drawGear(gear);
		},this);
		
	},
	
	drawGear: function(gear){
		/* draw the gear of an object
		 */
		var dir = gear.getDirectionVector();
		
		this.ctx.transform(dir.x, dir.y, -dir.y, dir.x, gear.x*this.scale, gear.y*this.scale);
		
		this.drawSprite(this.sprites[gear.spriteName],0,0);
		
	}
});