"use strict";

define(function () {

function initializeInput(input, inputData){
    
    
    
    var inputs = {};
    
    var keys = {};
    for (var key in inputData.keys){
        var name = inputData.keys[key];
        if (!inputs[name]){
            inputs[name] = input.createInput(name);
        }
        keys[key] = inputs[inputData.keys[key]];
    }
        
    window.addEventListener("keydown", function(e){
        if (e.target.classList.contains("editabletext")){ //e.target.nodeName === "INPUT" && e.target.type === "text"){
            return;
        }
        if (keys[e.which]){
            e.preventDefault();
            keys[e.which].start();
        }
    });
    
    window.addEventListener("keyup", function(e){
        keys[e.which] && keys[e.which].end();
    });
    
}

return initializeInput;
});
