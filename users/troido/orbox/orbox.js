"using strict";

// Function.prototype.construct = function(aArgs) {
//     // code from developer.mozilla.org
//     var fConstructor = this, fNewConstr = function() { fConstructor.apply(this, aArgs); };
//     fNewConstr.prototype = fConstructor.prototype;
//     return new fNewConstr();
// };

define(["inheritance", "field", "loadfile", "blocks", "player"], function(Class, Field, loadFile, Blocks, Player){
	console.log(Class);
	var Orbox = Class.extend({
		
		shouldStart: false,
		levelCache: null,
		levels: null,
		field: null,
		player: null,
		currentLevel: 0,
		maxLevel: 0,
		canScroll: false,
		
		init: function(){
			this.levelCache = {};
		},
		
		startGame: function(levelfile){
			loadFile(levelfile,this._start.bind(this));
		},
		
		_start: function(levelStr){
			var levelObj = JSON.parse(levelStr);
			this.levels = levelObj.levels;
			this.canScroll = levelObj.canScroll;
			this.currentLevel = 0;
			this.startLevel();
		},
		startLevel: function(){
			var level = this.levels[this.currentLevel];
			this.field = new Field(level, Blocks); // I really should get rid of this global variable. Maybe requireJS would help.
			this.player = new Player(this.field, level.x0, level.y0);
		},
		startNextLevel: function(){
			if (this.player.isFinished() || this.canScroll || this.currentLevel < this.maxLevel){
				this.currentLevel = (this.currentLevel+1)%this.levels.length;
				console.log(this.currentLevel);
				this.startLevel();
			}
		},
		getField: function(){
			return this.field;
		},
		getPlayer: function(){
			return this.player;
		},
		getWidth: function(){
			if (this.field){
				return this.field.width;
			} else {
				return 0;
			}
		},
		getHeight: function(){
			if (this.field){
				return this.field.height;
			} else {
				return 0;
			}
		},
		update: function(){
			this.player.update();
			if (!this.player.isAlive() && !this.player.isFinished()){
				this.startLevel();
			}
		}
	});
	return Orbox;
});
