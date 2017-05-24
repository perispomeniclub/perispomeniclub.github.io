
"use strict";

define(
    [GRAPHICS_3D ? 'clientmap3d' : 'clientmap','tileset','viewport','initializeinput','input','rect','img/tiles.js', 'interactionlist', 'conversation', 'chat', 'inventory', 'lib/text!../img/objectsprites.json', 'spriteset', GRAPHICS_3D ? 'render3d' : 'render'],
    function(ClientMap, TileSet, ViewPort, initializeInput, InputManager, Rect, tl, InteractionList, Conversation, Chat, Inventory, sprites, SpriteSet, Render){


class Client {
    
    constructor(outputElements, errorHandler){
        this.canvas = outputElements.canvas;
        
        this.err = errorHandler || function(mess){alert(mess)};
        
        var images = {};
        images["standart_tiles"] = document.getElementById("tiles");
        images["objectsprites"] = document.getElementById("objectsprites");
        
        
        this.tiles = new TileSet(TileSets["standart_tiles"], images);
        this.sprites = new SpriteSet(JSON.parse(sprites), images);
        
        this.map = new ClientMap({tiles: this.tiles, sprites: this.sprites});
        
        this.renderer = new Render(this.map, this.canvas);
        
        this.viewport = new ViewPort(
            new Rect(0,0,this.canvas.width, this.canvas.height),
            new Rect(0, 0, this.canvas.width, this.canvas.height)
        );
        
        this.input = new InputManager();
        initializeInput(this.input,{
            keys: {
                65: "turnleft",
                87: "forward",
                68: "turnright",
                83: "back",
                69: "straferight",
                81: "strafeleft",
                37: "west",
                38: "north",
                39: "east",
                40: "south",
                188: "previousinteraction",
                190: "nextinteraction",
                191: "selectinteraction",
                219: "previouschoice",
                221: "nextchoice",
                220: "selectchoice",
                32: "attack",
                107: "zoomin",
                109: "zoomout"
            }
        });
        
        window.addEventListener("blur", this.input.clear.bind(this.input));
        
        for (var name of ["north", "south", "west", "east", "forward", "back", "turnleft", "turnright", "strafeleft", "straferight", "attack"]){
            this.input.addListener(name, function(n, type){
                var data = JSON.stringify({
                    type: "input",
                    input: n,
                    inputType: type
                });
                this.safeSend(data);
            }.bind(this));
        }
        
        this.ws = null;
        this.closeCallback = null;
        
        
        this.inventory = new Inventory(outputElements.inventory, this.sprites, this);
        this.chat = new Chat(outputElements.outputConsole, outputElements.chatForm, outputElements.chatInput, this);
        this.interactionList = new InteractionList(outputElements.interact, this);
        this.conversation = new Conversation(outputElements.dialogSpeaker, outputElements.dialogText, outputElements.dialogButtons, this);
        this.healthOutput = outputElements.healthValue;
        
        var self = this;
        this.input.addStartListener("zoomin",function(){self.viewport.zoomIn(); self.redraw();});
        this.input.addStartListener("zoomout",function(){self.viewport.zoomOut(); self.redraw();});
    }
    
    connect(address, name, succesCallback, closeCallback){
        
        address = address || "ws://localhost:9318";
        name = name || "Player";
        
        this.closeCallback = closeCallback;
        
        if (this.ws){
            this.ws.close();
        }
        
        try {
            this.ws = new WebSocket(address);
        } catch (e){
            console.error(e.message);
            this.err("invalid address");
            return;
        }
        this.ws.addEventListener("message", this.onMessage.bind(this));
        
        this.name = name;
        
        var introduction = JSON.stringify({
            type: "introduction",
            name: name
        });
        this.ws.addEventListener("open",function(){
            this.ws.send(introduction);
            succesCallback && succesCallback();
        }.bind(this));
        
        this.ws.addEventListener("error", function(e){
            this.err("failed to connect to "+address);
        }.bind(this));
        
        this.ws.addEventListener("close", this.disconnect.bind(this));
        
    }
    
    disconnect(){
        this.ws.close();
        this.map.close();
        this.closeCallback && this.closeCallback();
        this.renderer.darken();
    }
    
    // only send a message if the websocket is open, otherwise ignore it
    safeSend(message){
        if (this.ws && this.ws.readyState === WebSocket.OPEN){
            this.ws.send(message);
        }
    }
    
    sendChat(chatMessage){
        if (!chatMessage){
            return;
        }
        var data = JSON.stringify({
            type: "input",
            input: "chat",
            inputType: "update",
            value: chatMessage
        });
        this.safeSend(data);
    }
    
    onMessage(message){
//         console.log(message.data);
        var data = JSON.parse(message.data);
        if (data.type === "update"){
            this.update(data);
        } else if (data.type === "error"){
            this.err(data.message);
            this.disconnect();
        }
    }
    
    update(data){
        
//         var updateStart = Date.now();
        
        var redraw = false;
        if (data.map){
            this.map.setData(data.map);
            redraw = true;
        }
        
        if (data.viewport){
            this.viewport.setViewArea(data.viewport);
            redraw = true;
        }
        
        if (redraw){
            this.redraw()
        }
        
        if (data.inventory){
            this.inventory.update(data.inventory);
        }
        if (data.messages){
            for (var m of data.messages){
                if (m.sender){
                    this.chat.print(m.sender+": "+m.message);
                } else {
                    this.chat.print(m.message);
                }
            }
        }
        if (data.interactions){
            this.interactionList.update(data.interactions);
        }
        if (data.conversation){
            this.conversation.update(data.conversation);
        }
        if (data.health){
            this.setText(this.healthOutput, data.health)
            
        }
        
//         var passedTime = Date.now-updateStart;
//         if (passedTime > 4){
//             console.log(passedTime);
//         }
    }
    
    redraw(){
        this.renderer.draw(this.viewport);
    }
    
    setText(element, text){
        this.clearElement(element);
        var textNode = document.createTextNode(text);
        element.appendChild(textNode);
    }
    
    clearElement(element){
        while (element.firstChild){
            element.removeChild(element.firstChild);
        }
    }
}


return Client;

});
