

define(["rect"], function (Rect){
"use strict";

var inventorySize = 16;
var inventoryWidth = 4;
var inventoryHeight = 4;
var tileWidth = 32;
var tileHeight = 32;
var tileSpacing = 2;

class Inventory {
    
    constructor(canvas, spriteset, client){
        this.data = [];
        for (var i=0; i<inventorySize; i++){
            this.data[i] = null;
        }
        this.dataString = JSON.stringify(this.data);
        this.selector = 0;
        this.client = client;
        var input = client.input;
        var self = this;
//         input.addStartListener("previousslot",function(){
//             self.moveSelector(-1);
//         });
//         input.addStartListener("nextslot",function(){
//             self.moveSelector(1);
//         });
//         input.addStartListener("selectslot", function(){
//             self.select();
//         });
        
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.spriteset = spriteset;
        this.draw();
    }
    
    update(data){
        if (JSON.stringify(data) === this.dataString){
            return;
        }
        
        this.data = data;
        this.dataString = JSON.stringify(data);
        
        this.draw();
    }
    
    draw(){
        
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        for (var i=0; i<this.data.length; i++){
            if (this.data[i] === null){
                continue;
            }
            var x = i % inventoryWidth;
            var y = i / inventoryWidth |0;
            var shape = new Rect(
                (tileSpacing+tileWidth)*x+tileSpacing,
                (tileSpacing+tileHeight)*y+tileSpacing,
                tileWidth,
                tileHeight);
            this.spriteset.getSprite(this.data[i].sprite).draw(this.ctx, shape);
            if (this.data[i].stackable){
                this.ctx.fillText(this.data[i].amount, shape.getX(), shape.getMaxY());
            }
        }
    }
    
//     select(i){
//         if (arguments.length === 0){
//             i = this.selector;
//         }
//         if (i >= 0 && i < this.data.choices.length){
//             var data = JSON.stringify({
//                 type: "input",
//                 input: "dialogchoice",
//                 inputType: "update",
//                 value: i
//             });
//             this.client.safeSend(data);
//         }
//     }
    
    moveSelector(d){
        
        this.selector += d;
        this.selector %= this.data.length;
        if (this.selector < 0){
            this.selector += this.data.length;
        }
        this.draw();
    }
}

return Inventory;

});