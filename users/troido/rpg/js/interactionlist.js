

define([], function (){
"use strict";


class InteractionList{
    
    constructor(outputElement, client){
        this.data = [];
        this.dataString = JSON.stringify(this.data);
        this.selector = 0;
        this.output = outputElement;
        this.client = client;
        var input = client.input;
        var self = this;
        input.addStartListener("previousinteraction",function(){
            self.moveSelector(-1);
        });
        input.addStartListener("nextinteraction",function(){
            self.moveSelector(1);
        });
        input.addStartListener("selectinteraction", function(){
            self.select();
        });
    }
    
    update(data){
        if (JSON.stringify(data) === this.dataString){
            return;
        }
        this.clearInteractionButtons();
        
        this.data = data;
        this.dataString = JSON.stringify(data);
        
        if (data.length){
            this.selector = Math.min(this.selector, data.length-1);
            for (var i in data){
                this.makeInteractionButton(i);
            }
        }
    }
    
    clearInteractionButtons(){
        var element = this.output;
        while (element.firstChild){
            element.removeChild(element.firstChild);
        }
    }
    
    makeInteractionButton(i){
        var interaction = this.data[i]
        var text = document.createTextNode(((i == this.selector)?"* ":"") + interaction.action + " " + interaction.name + ((i == this.selector)?" *":""));
        var node = document.createElement("button");
        node.classList.add("interaction");
        node.addEventListener("click", function(e){
            this.select(i);
        }.bind(this));
        node.appendChild(text);
        this.output.appendChild(node);
    }
    
    select(i){
        if (arguments.length === 0){
            i = this.selector;
        }
        if (i >= 0 && i < this.data.length){
            var data = JSON.stringify({
                type: "input",
                input: "interact",
                inputType: "update",
                value: this.data[i]
            });
            this.client.safeSend(data);
        }
    }
    
    moveSelector(d){
        if (!this.data.length){
            return;
        }
        this.selector = Math.min(this.selector, this.data.length-1);
        this.selector += d;
        this.selector %= this.data.length;
        if (this.selector < 0){
            this.selector += this.data.length;
        }
        this.clearInteractionButtons();
        for (var i in this.data){
            this.makeInteractionButton(i);
        }
    }
}

return InteractionList;

});
