"use strict"

define(["sprite", "rect"], function(sprite, Rect){
    

class ClientMap {
    
    constructor(resources){
        this.updateNum = 0;
        this.sprites = resources.sprites;
        this.tiles = resources.tiles;
        this.drawings = new Map();
        
    }
    
    setData(changes){
        if (!changes.length){
            return;
        }
        this.updateNum ++;
        for (var change of changes){
            if (change.type == "add"){
                this.drawings.set(change.data.id, this.getCache(change.data));
            } else if (change.type == "rm"){
                this.drawings.delete(change.id);
            } else if (change.type == "sprite"){
                this.sprites.makeTiledSprite(change.data.name, change.data.data, this.tiles);
            } else {
                console.error("invalid change type");
            }
        }
    }
    
    getData(){
        return this.drawings;
    }
    
        
    getCache(obj){
    
        var area = new Rect(obj.shape).floor();
        var sprite = this.sprites.getSprite(obj.sprite.name || obj.sprite, obj.sprite.type)
        var image = sprite.place(area, obj.rotation);
        
        var cacheData = {
            id: obj.id,
            name: obj.name,
            type: obj.type,
            depth: obj.depth,
            image: image
        };
        return cacheData;
    }
    
    
    
    close(){
        this.drawings = new Map();
    }
}

return ClientMap;

});
