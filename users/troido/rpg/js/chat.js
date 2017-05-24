

define([], function (){
"use strict";


class Chat {
    
    constructor(outputElement, form, inputElement, client){
        this.outputConsole = outputElement;
        this.form = form;
        this.input = inputElement
        this.client = client;
        this.form.addEventListener("submit", this.sendChat.bind(this));
    }
    
    sendChat(e){
        e.preventDefault();
        var chatMessage = this.input.value;
        this.input.value = "";
        if (!chatMessage){
            return;
        }
        var data = JSON.stringify({
            type: "input",
            input: "chat",
            inputType: "update",
            value: chatMessage
        });
        this.client.safeSend(data);
    }
    
    print(text){
        var c = this.outputConsole;
        var isDown = c.scrollTop + c.clientHeight === c.scrollHeight;
        c.value += "\n"+text;
        console.log("chat: "+text);
        if (isDown){
            c.scrollTop = c.scrollHeight - c.clientHeight;
        }
    }
}

return Chat;

});