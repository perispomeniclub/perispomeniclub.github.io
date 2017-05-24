"use strict";

define(["sprite", "rect"], function(sprite, Rect){
    

class Render {
    
    constructor(map, canvas){
        this.lastUpdate = 0;
        this.map = map;
        this.data = [];
        this.ctx = canvas.getContext('2d');
        
    }
    
    updateData(){
        if (this.map.updateNum == this.lastUpdate){
            return;
        }
        this.data = [...this.map.getData().values()]
        this.data.sort(function(o1, o2){
            if (o1.depth != o2.depth){
                return o1.depth > o2.depth ? -1 : 1;
            } else {
                return o1.id > o2.id ? -1 : 1;
            }
        });
    }
    
    draw(viewport){
        this.updateData();
        viewport.applyTranslation(this.ctx);
        
        for (var obj of this.data){
            obj.image.draw(this.ctx);
        }
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    darken(){
        this.ctx.fillStyle = "rgba(127,127,127,0.5)";
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    }
}

return Render;

});
