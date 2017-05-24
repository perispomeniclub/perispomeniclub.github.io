"use strict";
/*
 * TODO:
 * - Decide whether to use coordinates as seperate variables, or only in location/size objects
 * - Decide whether placables should know CollisionManager or Game object
 */



function main(){
	/* The main code to be executed when the page is loaded
	 * 
	 */
	
	// console.log("This games uses newer javasript technologies and might therefore not work in all browsers");
	// console.log("The code is tested to work in Firefox 31, Google-Chrome 36 and Chromium 34, running on Ubuntu Linux");
	// console.log("On windows, it works in Firefox 30 and IE 11");
	
	// make the game
	var game = new Game(50,50);
	
	
	// fill the map
	var p1 = new Player(10,10,Math.PI),
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
	
	// add a controller to player 2
	var controller = new ControllerKeys(p2);
	
	var drawer = new Drawer(game, document.getElementById('canvas'), 400, 400, 8);
	var fps = 60;
	window.setInterval(update, 1000/fps, fps, game, drawer, controller);
}


function update(fps, game, drawer,controller){
	
	/* call the update functions of the controller and the game, with as argument the time in seconds since the last call */
	
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
