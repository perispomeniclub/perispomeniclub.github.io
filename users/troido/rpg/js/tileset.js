
define(["sprite","rect"], function (sprite, Rect) {
var Sprite = sprite.Sprite;
"use strict";

class TileSet {
    
    constructor(data, images){
        
        this.image = images[data.name];
        
        this.data = data;
        
    }
    
    drawTile(tileId, shape, ctx){
        // todo: spacing and margin
        
        var d = tileId;
        var sx = (tileId%this.data.columns)*this.data.tilewidth;
        var sy = (tileId/this.data.columns|0)*this.data.tileheight;
        ctx.drawImage(
            this.image, sx, sy, this.data.tilewidth, this.data.tileheight,
            shape.getX(),shape.getY(),shape.getWidth(),shape.getHeight()
        );
    }
    
    makeSprite(tileId){
        var sx = (tileId%this.data.columns)*this.data.tilewidth;
        var sy = (tileId/this.data.columns|0)*this.data.tileheight;
        return new spr.Sprite(this.image, new rect.Rect(sx, sy, this.data.tilewidth, this.data.tileheight));
    }
}

return TileSet;
});
