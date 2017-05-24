
define(["client", "lib/domReady!","utils"], function(Client, domReady, utils){
"use strict";

function main(){
    
    
    var dom = {};
    var ids = {
        connectInput: "connectform",
        connectButton: "connectbutton",
        addressField: "serveraddress",
        nameField: "name",
        canvas: "canvas",
        disconnectButton: "disconnectbutton",
        outputConsole: "chatconsole",
        chatInput: "chatsendinput",
        chatForm: "chatsendform",
        sendbutton: "sendbutton",
        chatArea: "chat",
        touchforward: "buttonup",
        touchattack: "buttonup",
        touchturnleft: "buttonleft",
        touchback: "buttondown",
        touchturnright: "buttonright",
        touchinteract: "buttoninteract",
        toggleTouch: "toggletouch",
        touchControls: "touchcontrols",
        randomName: "randomnamebutton",
        interact: "interactbuttons",
        dialogArea: "dialogarea",
        dialogSpeaker: "dialogspeaker",
        dialogText: "dialogtext",
        dialogButtons: "dialogbuttons",
        inventory: "inventory",
        healthValue: "healthvalue"
    };
    for (var elem in ids){
        dom[elem] = document.getElementById(ids[elem]);
    }
    var client = new Client(dom);
    
   
    window.client = client; // debugging
    var gameElementsDom = document.getElementsByClassName("gameelement");
    // In chrome a DOMCollection is not iterable, so this should make it an iterable array
    var gameElements = [];
    for (var i=0; i<gameElementsDom.length; i++){
        gameElements[i] = gameElementsDom[i];
    }

    dom.connectInput.addEventListener("submit", function(){
        var address = dom.addressField.value;
        var name = dom.nameField.value;
        client.connect(address, name, function(){
            console.log("connected to "+address+" as "+name);
            dom.connectButton.hidden = true;
            dom.disconnectButton.hidden = false;
            for (var e of gameElements){
                e.hidden = false;
            }
            dom.outputConsole.value = "connected to "+address+" as "+name;
            dom.chatInput.value = "";
            dom.addressField.disabled = true;
            dom.nameField.disabled = true;
            dom.randomName.disabled = true;
        }, function(){
            dom.connectButton.hidden = false;
            dom.disconnectButton.hidden = true;
            for (var e of gameElements){
                e.hidden = true;
            }
            dom.addressField.disabled = false;
            dom.nameField.disabled = false;
            dom.randomName.disabled = false;
        });
    });

    dom.disconnectButton.addEventListener("click", function(){
        client.disconnect();
    });

    dom.connectButton.disabled = false;
    dom.nameField.disabled = false;
    dom.addressField.disabled = false;

    
    ["forward", "back", "turnleft", "turnright"].forEach(function(name){
        var touchbutton = dom["touch"+name];
        touchbutton.addEventListener("touchstart", function(e){
            e.preventDefault();
            client.input.triggerStart(name);
        });
        touchbutton.addEventListener("touchend", function(e){
            e.preventDefault();
            client.input.triggerEnd(name);
        });
    });
    
    dom.toggleTouch.addEventListener("click",function(e){
        dom.touchControls.hidden = !dom.touchControls.hidden;
    });
    
    dom.randomName.addEventListener("click",function(e){
        dom.nameField.value = utils.generateName();
    });
    
}

return main;

});