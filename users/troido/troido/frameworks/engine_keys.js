var keys = {
	down:new Array(),
	keypress:function(e) {if (!keys.down[e]) engine.triggerEvent("keypress_"+e); keys.down[e] = 1; engine.triggerEvent("keydown_"+e);},
	keyunpress:function(e) { keys.down[e] = 0; engine.triggerEvent("keyrelease_"+e);},
}
//engine.ext.step.push(function()

document.onkeydown=function(event){keys.keypress(event.which)};
document.onkeyup=function(event){keys.keyunpress(event.which)};

for (var a=0;a<256;a++){
	keys.down[a] = 0;
	eval("engine.events.keypress_"+a+"=[]")
	eval("engine.events.keyrelease_"+a+"=[]")
	eval("engine.events.keydown_"+a+"=[]")
	}

//engine.games[0].content.resources.objects[0].events.step