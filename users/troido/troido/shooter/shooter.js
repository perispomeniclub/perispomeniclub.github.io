

// Inspired by python, I will start non-public variables with an underscore.
// I'm not sure now if I should make all variables private.
// A private variable with a getter and a setter is not really private.

// ok, maybe I won't do this

// getters seem useless, but setters are pretty usefull

// wow, javascript becomes much better: for (.. of ..) loop, list comprehensions, pity it is not supported in many browsers yet

var Game = Class.extend({
	field: null,// : CollisionManager
// 	objects: [], // don't fill this array, replace it
	
	
	
	init:function(width,height){
		this.field = new CollisionManager(width,height);
		//var p = new Player(10,10,0);
		//p.putInMap(this.field);
// 		this.addPlacable(p);
	},
	
	getWidth: function(){
		return this.field.width;
	},
	
	getHeight: function(){
		return this.field.height;
	},
	
	addPlacable: function(object){
// 		this.objects.push(object); // [facepalm] why couldn't I even listen to myself? (line 15)
// 		object.setGame(this);
		object.putInMap(this.field);
	},
	
	getPlayers: function(){ //console.log(this.field.getAll());
		return this.field.getAll();
	},
	
	update: function(timeSinceLastUpdate){ // time in seconds
		//console.log(this.getPlayers());
		this.getPlayers().forEach(function(obj){
			//console.log(key,value);
			obj.update && obj.update(timeSinceLastUpdate);
		});
	}
	
});

/*
 * TODO:
 * - Fix inconsistencies over 0 direction
 * - Decide whether to use coordinates as seperate variables, or only in location/size objects
 * - Decide whether placables should know CollisionManager or Game object
 */



function main(){
	// console.log("This games uses newer javasript technologies and might therefore not work in all browsers");
	// console.log("The code is tested to work in Firefox 31, Google-Chrome 36 and Chromium 34, running on Ubuntu Linux");
	// console.log("On windows, it works in Firefox 30 and IE 11");
	var game = new Game(50,50);
	
	var p1 = new Player(10,10,Math.PI);
		p2 = new Player(20,20,0);
	game.addPlacable(p1);
	game.addPlacable(p2);
	for (var i=0; i<50; i++){
		game.addPlacable(new Block(0,i));
		game.addPlacable(new Block(49,i));
	}
	for (var i=1; i<49; i++){
		game.addPlacable(new Block(i,0));
		game.addPlacable(new Block(i,49));
	}
	for (var i=10; i<30; i++){
		game.addPlacable(new Block(i,35));
	}
	
	
	game.addPlacable(new Monster(10,40));
	var controller = new ControllerKeys(p2);
	var drawer = new Drawer(game, document.getElementById('canvas'), 400, 400, 8);
	var fps = 60;
	window.setInterval(update, 1000/fps, fps, game, drawer, controller);
}


function update(fps, game, drawer,controller){
	
	
	controller.control(1/fps);
	game.update(1/fps);
	drawer.draw();
	
}



window.addEventListener("load",main);

// load a file, return the contents
function loadSync(url){
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	return xmlhttp.responseText;
}
