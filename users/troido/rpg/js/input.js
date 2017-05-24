"use strict";

define(function () {

class InputManager {
    
    constructor(){
        this.inputs = {};
    }
    
    createInput(name){
        var input = new InputListener(name);
        this.inputs[name] = input;
        return input;
    }
    
    
    getState(name){
        return this.inputs[name].state;
    }
    
    addStartListener(name, func){
        this.inputs[name].startListeners.add(func);
    }
    addEndListener(name, func){
        this.inputs[name].endListeners.add(func);
    }
    addListener(name, func){
        this.inputs[name].startListeners.add(func);
        this.inputs[name].endListeners.add(func);
    }
    addUpdateListener(name, func){
        this.inputs[name].updateListeners.add(func);
    }
    
    deleteStartListener(name, func){
        this.inputs[name].startListeners.delete(func);
    }
    deleteEndListener(name, func){
        this.inputs[name].endListeners.delete(func);
    }
    deleteListener(name, func){
        this.inputs[name].startListeners.delete(func);
        this.inputs[name].endListeners.delete(func);
    }
    deleteUpdateListener(name, func){
        this.inputs[name].updateListeners.delete(func);
    }
    
    triggerStart(name){
        this.inputs[name].start();
    }
    triggerEnd(name){
        this.inputs[name].end();
    }
    triggerUpdate(name, value){
        this.inputs[name].update(value);
    }
    trigger(name, type, value){
        if (this.inputs[name]){
            if (type === "start"){
                this.inputs[name].start();
            } else if (type === "end"){
                this.inputs[name].end();
            } else if (type === "update"){
                this.inputs[name].update(value);
            }
        }
    }
    clear(){
        for (var input in this.inputs){
            this.inputs[input].end();
        }
    }
    
}

class InputListener{
    
    constructor(name){
        this.name = name;
        this.startListeners = new Set();
        this.endListeners = new Set();
        this.updateListeners = new Set();
        this.state = false;
        
    }
    
    start(){
        if (this.state){
            return;
        }
        this.state = true;
        for (var listener of this.startListeners){
            listener(this.name, "start");
        }
    }
    
    end(){
        if (!this.state){
            return;
        }
        this.state = false;
        for (var listener of this.endListeners){
            listener(this.name, "end");
        }
    }
    
    update(value){
        this.state = value;
        for (var listener of this.updateListeners){
            listener(this.name, value);
        }
    }
}

return InputManager;

});
