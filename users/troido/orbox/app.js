"use strict"

requirejs.config({
	baserURL: "."
});

requirejs(["main"],function(OrboxGame){
	
	new OrboxGame(
		"sprites.json", 
		{
			canvasOutputId: "gamecanvas", 
			textOutputId: "textoutput", 
			descriptionId: "description", 
			ownLevelListId: "ownmaplist", 
			otherLevelListId: "othermaplist"
		}, 
		{
			firstLevel: "levels/SPack.json", 
			ownLevels: "levels/", 
			otherLevels: "levels/public/"
		}
	);
});