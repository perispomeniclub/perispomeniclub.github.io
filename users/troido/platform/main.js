"use strict";





function main(){
	
	new Platform("blocks.json", document.getElementById("canvas"));
	
}


// preload some files into cache so they are loaded instantly later
LoadFile.loadText("textures2.json");
LoadFile.loadImage("images.png");
LoadFile.loadImage("images2.png");
// If they aren't loaded yet when I have to really use them, there's going to be a problem
// FIXED THE ABOVE (I hope)


window.addEventListener("load",main);