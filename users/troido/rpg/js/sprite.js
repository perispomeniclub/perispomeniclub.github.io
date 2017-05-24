"use strict";

define(["rect", "utils"],function (Rect, u) {

class Sprite {
    
    constructor(image, options, sourceArea, repeat, centerX, centerY){
        this.image = image;
        this.options = options;
        this.sourceArea = sourceArea || new Rect(0,0,image.width,image.height);
        this.img = document.createElement('canvas');
        this.img.width = this.sourceArea.getWidth();
        this.img.height = this.sourceArea.getHeight();
        var ctx = this.img.getContext('2d');
        ctx.drawImage(image,
            this.sourceArea.getX(),
            this.sourceArea.getY(),
            this.sourceArea.getWidth(),
            this.sourceArea.getHeight(),
            0, 0, this.img.width, this.img.height);
        this.centerX = u.def(centerX, .5);
        this.centerY = u.def(centerY, .5);
        this.repeat = repeat;
    }
    
    draw(ctx, area, rotation){
        var rr = rotation;
        if (rotation){
            var centerX = this.centerX * area.getWidth();//u.def(this.centerX, area.getWidth()/2);
            var centerY = this.centerY * area.getHeight();//u.def(this.centerY, area.getHeight()/2);
            
            ctx.translate(area.getX()+centerX, area.getY()+centerY);
            ctx.rotate(rr);
            ctx.drawImage(this.img, -centerX, -centerY, area.getWidth(), area.getHeight());
            ctx.rotate(-rr);
            ctx.translate(-area.getX()-centerX, -area.getY()-centerY);
        } else {
            if (this.repeat){
                ctx.fillStyle = ctx.createPattern(this.img, 'repeat');
                ctx.fillRect(area.getX(), area.getY(), area.getWidth(), area.getHeight());
            } else {
                ctx.drawImage(this.img, area.getX(), area.getY(), area.getWidth(), area.getHeight());
            }
        }
    }
    
    place(area, rotation){
        return new PlacedSprite(this, area, rotation);
    }
}


class PlacedSprite{
    
    constructor(sprite, area, rotation){
        this.sprite = sprite;
        this.area = area;
        this.rotation = rotation || 0;
    }
    
    draw(ctx){
        this.sprite.draw(ctx, this.area, this.rotation);
    }
}

return {Sprite: Sprite, PlacedSprite: PlacedSprite};

});
