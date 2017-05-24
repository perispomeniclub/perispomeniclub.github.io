

define([], function (){
"use strict";


class Conversation{
    
    constructor(speakerElement, textElement, choiceElement, client){
        this.data = {speaker: "", text: "", choice: []};
        this.dataString = JSON.stringify(this.data);
        this.selector = 0;
        this.speakerElement = speakerElement;
        this.textElement = textElement;
        this.choiceElement = choiceElement;
        this.client = client;
        var input = client.input;
        var self = this;
        input.addStartListener("previouschoice",function(){
            self.moveSelector(-1);
        });
        input.addStartListener("nextchoice",function(){
            self.moveSelector(1);
        });
        input.addStartListener("selectchoice", function(){
            self.select();
        });
    }
    
    update(data){
        if (JSON.stringify(data) === this.dataString){
            return;
        }
        
        this.data = data;
        this.dataString = JSON.stringify(data);
        
        this.setText(this.speakerElement, data.speaker ? data.speaker+":" : "");
        this.setText(this.textElement, data.text);
        this.clearElement(this.choiceElement);
        
        if (data.text && !data.choices.length){
            data.choices.push("Continue");
        }
        this.selector = 0;
        for (var i in data.choices){
            this.makeChoiceButton(i);
        }
    }
    
    clearElement(element){
        while (element.firstChild){
            element.removeChild(element.firstChild);
        }
    }
    
    setText(element, text){
        this.clearElement(element);
        var textNode = document.createTextNode(text);
        element.appendChild(textNode);
    }
    
    makeChoiceButton(i){
        var choice = this.data.choices[i];
        var text = document.createTextNode(((i == this.selector)?"* ":"") + choice + ((i == this.selector)?" *":""));
        var node = document.createElement("button");
        node.classList.add("dialogchoice");
        node.addEventListener("click", function(e){
            this.select(i);
        }.bind(this));
        node.appendChild(text);
        this.choiceElement.appendChild(node);
    }
    
    select(i){
        if (arguments.length === 0){
            i = this.selector;
        }
        if (i >= 0 && i < this.data.choices.length){
            var data = JSON.stringify({
                type: "input",
                input: "dialogchoice",
                inputType: "update",
                value: i
            });
            this.client.safeSend(data);
        }
    }
    
    moveSelector(d){
        if (!this.data.choices.length){
            return;
        }
        
        this.selector = Math.min(this.selector, this.data.choices.length-1);
        this.selector += d;
        this.selector %= this.data.choices.length;
        if (this.selector < 0){
            this.selector += this.data.choices.length;
        }
        this.clearElement(this.choiceElement);
        for (var i in this.data.choices){
            this.makeChoiceButton(i);
        }
    }
}

return Conversation;

});