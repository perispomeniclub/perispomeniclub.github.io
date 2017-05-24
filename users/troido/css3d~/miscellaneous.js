"use strict";


(function(){
	
	var bg = document.getElementById("clock-bg"),
		seconds = document.getElementById("clock-secondenwijzer"),
		minutes = document.getElementById("clock-minutenwijzer"),
		hours = document.getElementById("clock-wijzer");

	
	var updateClock = function(){
		
	}
	
	
})();


var loadOrbox = function(){
	
	document.getElementById("orboxgame").style.visibility = "visible";
	
	
	
	
	requirejs(["main"],function(OrboxGame){
		
		new OrboxGame(
			"orboxsprites.json", 
			{
				canvasOutputId: "orbox-gamecanvas", 
				textOutputId: "orbox-textoutput", 
				descriptionId: "orbox-description", 
				ownLevelListId: "orbox-ownmaplist", 
				otherLevelListId: "orbox-othermaplist"
			}, 
			{
				firstLevel: "orbox/levels/SPack.json", 
				ownLevels: "orbox/levels/", 
				otherLevels: "orbox/levels/public/"
			}
		);
	});
}