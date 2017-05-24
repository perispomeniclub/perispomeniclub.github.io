
define(["sprite", "rect", "utils"], function (sprite, Rect, u) {
var Sprite = sprite.Sprite;
"use strict";

class SpriteSet {
    
    constructor(data, images){
        
        this.images = images;
        
        this.data = data;
        
        this.tiledSprites = new Map();
        
        this.sprites = new Map();
        for (var spriteName in data.sprites){
            var spriteData = data.sprites[spriteName];
            if (spriteData.area){
                var spriteArea = new Rect(spriteData.area);
            } else {
                var x = u.def(spriteData.x, spriteData.cellX*data.cellWidth);
                var y = u.def(spriteData.y, spriteData.cellY*data.cellHeight);
                var w = u.def(spriteData.width, spriteData.w, data.cellWidth);
                var h = u.def(spriteData.height, spriteData.h, data.cellHeight);
                var spriteArea = new Rect(x,y,w,h);
            }
            var imgName = u.def(spriteData.source, data.defaultSource);
            var sprite = new Sprite(images[imgName], spriteData.options || {}, spriteArea, spriteData.repeat, spriteData.centerX, spriteData.centerY);
            this.sprites.set(spriteName, sprite);
        }
        
    }
    
    makeTiledSprite(name, data, tileset){
        var tileWidth = data.tileWidth||1;
        var tileHeight = data.tileHeight||1;
        var gridWidth = data.gridWidth;
        var gridHeight = data.gridHeight;
        var spriteWidth = tileWidth*gridWidth;
        var spriteHeight = tileHeight*gridHeight;
//         var centerX = data.centerX || 0;
//         var centerY = data.centerY || 0;
        var values = data.tiles;
        
        var canvas = document.createElement("canvas");
        canvas.width = spriteWidth;
        canvas.height = spriteHeight;
        var ctx = canvas.getContext("2d");
        for (var x=0; x<gridWidth; x++){
            for (var y=0; y<gridHeight; y++){
                var value = values[x + y*gridWidth];
                if (value){
                    var area = new Rect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
                    tileset.drawTile(value - 1, area, ctx);
                }
            }
        }
        
        var sprite = new Sprite(canvas, {shape: 'floor'})
        this.tiledSprites.set(name, sprite);
        
//         console.log("made tiled sprite: "+name)
    }
    
    getSprite(name, type){
        if (type == "tiled"){
            return this.tiledSprites.get(name);
        }
        return this.sprites.get(name);
    }
}

return SpriteSet;
});
