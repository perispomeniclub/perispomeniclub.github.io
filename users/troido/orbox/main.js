


define(["loadfile", "game", "drawer", "lib/inheritance", "lib/domReady!"], function(loadFile, Game, Drawer, Class){
	
	
	var OrboxGame = Class.extend({
		game: null,
		drawer: null,
		maps: null,
		
		html: null,
		
		init: function(sprites, htmlIds, levelFiles){// canvasOutputId, textOutputId, descriptionId, ownLevelListId, otherLevelListId){
			
			this.html = {
				outputCanvas: document.getElementById(htmlIds.canvasOutputId),
				textOutput: document.getElementById(htmlIds.textOutputId),
				description: document.getElementById(htmlIds.descriptionId),
				ownLevelList: document.getElementById(htmlIds.ownLevelListId),
				otherLevelList: document.getElementById(htmlIds.otherLevelListId)
			}
			
			this.game = new Game();
			this.drawer = new Drawer(this.game, sprites, this.html.outputCanvas, this.html.textOutput, this.html.description);
			loadFile(levelFiles.ownLevels + "list.txt",this.onLevelsLoad.bind(this, levelFiles.ownLevels, this.html.ownLevelList));
			loadFile(levelFiles.otherLevels + "list.txt",this.onLevelsLoad.bind(this, levelFiles.otherLevels, this.html.otherLevelList));
			
			this.game.startGame(levelFiles.firstLevel);
			
			window.setInterval(this.update.bind(this), 150, this.game, this.drawer, this.maps);
			
			
			// temporary input hack
			// ok, by now I should find a better way to do this
			document.addEventListener("keydown",function(e){
				switch (e.which){
					case 65:
					case 37:
						this.game.getPlayer().move(-1,0);
						break;
					case 87:
					case 38:
						this.game.getPlayer().move(0,-1);
						break;
					case 68:
					case 39:
						this.game.getPlayer().move(1,0);
						break;
					case 83:
					case 40:
						this.game.getPlayer().move(0,1);
						break;
				}
				
			}.bind(this));
		},
		
		onLevelsLoad: function(prefix, element, str){
			
// 			console.log(prefix, str);
// 			var items = str.split(";");
// 			this.maps = {own: items[1].split("\n"), other: items[2].split("\n")};
			if (!element){
				return;
			}
			
			var arr = str.split("\n");
			var game = this.game;
			var ul = document.createElement("ul");
			for (var i=0; i<arr.length; i++){
				if (arr[i].length){
					var li = document.createElement("li");
					var button = document.createElement("button");
					button.value = prefix + arr[i];
					button.addEventListener("click",function(event){
						game.startGame(this.value);
					});
					var txt = document.createTextNode(arr[i].replace(/\.json/ig, ""));
					button.appendChild(txt);
					li.appendChild(button);
					ul.appendChild(li);
				}
			}
			
			
			// clear the parent node
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
			element.appendChild(ul);
// 			this.outputLevelList(str.split("\n"), this.html.ownLevelList, prefix);
// 			this.outputLevelList(this.maps.other, this.html.otherLevelList, "levels/public/");
			
			
		},
		
// 		outputLevelList: function(arr, element, prefix){
// 			var game = this.game;
// 			var ul = document.createElement("ul");
// 			for (var i=0; i<arr.length; i++){
// 				if (arr[i].length){
// 					var li = document.createElement("li");
// 					var button = document.createElement("button");
// 					button.value = prefix + arr[i];
// 					button.addEventListener("click",function(event){
// 						game.startGame(this.value);
// 					});
// 					var txt = document.createTextNode(arr[i].replace(/\.json/ig, ""));
// 					button.appendChild(txt);
// 					li.appendChild(button);
// 					ul.appendChild(li);
// 				}
// 			}
// 			
// 			
// 			// clear the parent node
// 			while (element.firstChild) {
// 				element.removeChild(element.firstChild);
// 			}
// 			element.appendChild(ul);
// 		},
		
		update: function(){
			this.game.update();
			this.drawer.draw();
			if (this.game.getPlayer().isFinished()){
				this.game.startNextLevel();
			}
		}
		
	});
	
	return OrboxGame;
	
});
