
define(["lib/inheritance", "sprite", "loadfile"], function(Class, Sprite, loadFile){
	var Drawer = Class.extend({
		chargrid: null,
		game: null,
		sprites: null,
		width: 0,
		height: 0,
		canvas: null,
		ctx: null,
		textOutput: null,
		scale: 1,
		
		init: function(game, spritefile, canvas, textOutput, descriptionElement){
			this.game = game;
			this.setSprites(spritefile);
			this.canvas = canvas;
			this.ctx = canvas && canvas.getContext("2d");
			this.textOutput = textOutput;
			this.descriptionOutput = descriptionElement;
		},
		
		setSprites: function(file){
			loadFile(file,(function(spriteText){
				var obj = JSON.parse(spriteText);
				this.sprites = Sprite.loadSprites(obj.sprites);
				this.scale = obj.scale
			}).bind(this));
		},
		
		resetScreen: function(width, height){
			this.width = width;
			this.height = height;
			this.chargrid = [];
			for (var i=0; i<width; i++){
				this.chargrid[i] = [];
			}
			this.canvas.width = this.width * this.scale;
			this.canvas.height = this.height * this.scale;
			this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		},
		
		getDrawString: function(terminator, filler, corner){
			terminator = terminator || "\n";
			filler = filler || " "
			corner = corner || "+";
			var s = corner;
			for (var i=0; i<this.width; i++){
				s += "-";
			}
			s += corner + terminator;
			for (var y=0; y<this.height; y++){
				s += "|"
				for (var x=0; x<this.width; x++){
					s += this.chargrid[x][y] || filler;
				}
				s += "|" + terminator;
			}
			s += corner;
			for (var i=0; i<this.width; i++){
				s += "-";
			}
			s += corner;
			return s;
		},
		
		drawSprite: function(spr,x,y){
			// draws a sprite (as in a sprite of the Sprite class)
			this.ctx.drawImage(spr.img, spr.sx, spr.sy, spr.swidth, spr.sheight, x*this.scale-spr.cx, y*this.scale-spr.cy, spr.width, spr.height);
			this.chargrid[x][y] = spr.char;
		},
		
		draw: function(){
			this.resetScreen(this.game.getWidth(), this.game.getHeight());
			if (!this.sprites){
				return;
			}
			var field = this.game.getField();
			for (var x=0; x<this.width; x++){
				for (var y=0; y<this.height; y++){
					if (field.isVisited(x, y)){
						if (field.isVisited(x, y)>1){
							this.drawSprite(this.sprites.visited2,x,y);
						} else {
							this.drawSprite(this.sprites.visited1,x,y);
						}
					}
				}
			}
			// these two loops could be merged, but firefox would display an ugly blinking effect where two sprites overlap
			// this may still be a danger
			for (var x=0; x<this.width; x++){
				for (var y=0; y<this.height; y++){
					var obj = field.get(x, y);
					if (obj && obj.spritename && this.sprites[obj.spritename]){
						this.drawSprite(this.sprites[obj.spritename],x,y);
					}
				}
			}
			var player = this.game.getPlayer();
			this.drawSprite(this.sprites[player.spritename],player.x,player.y);
			if (this.textOutput){
				this.textOutput.innerHTML = this.getDrawString("<br />", "&nbsp");
			}
			//console.log(this.descriptionOutput);
			if (this.descriptionOutput){
				this.descriptionOutput.innerHTML = this.game.getCurrentLevelDescription();
			}
		}
	});
	return Drawer;
});