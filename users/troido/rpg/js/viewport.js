"use strict";

define(["rect", "utils"],function (Rect, utils) {
        
class ViewPort {
    
    constructor(area, drawArea, scale){
        
        this.area = area;
        
        this.drawArea = drawArea;
        this.setScale(scale || 0);
        
        this.zoomStep = 0.1;
        this.origin = {x: 0, y: 0, rot: 0};
    }
    
    setViewArea(data){
        this.area = new Rect(data.area);
        this.viewCenterX = data.center.x;
        this.viewCenterY = data.center.y;
        this.origin = data.origin;
        
    }
    
    setScale(scale){
        var maxscale = 1;
        var minscale = Math.min(
            this.drawArea.getWidth()/this.area.getWidth(),
            this.drawArea.getHeight()/this.area.getHeight()
        );
        this.scale = utils.clamp(scale, minscale, maxscale);
    }
    
    zoomIn(){
        this.setScale(this.scale+this.zoomStep);
    }
    
    zoomOut(){
        this.setScale(this.scale-this.zoomStep);
    }
    
    applyTranslation(context){
        
        context.scale(this.scale, this.scale);
        context.translate(
            -utils.clamp(
                this.viewCenterX - this.drawArea.getWidth()/2/this.scale,
                this.area.getX(),
                this.area.getMaxX()-this.drawArea.getWidth()/this.scale
            )|0,
            -utils.clamp(
                this.viewCenterY - this.drawArea.getHeight()/2/this.scale,
                this.area.getY(),
                this.area.getMaxY()-this.drawArea.getWidth()/this.scale)
            |0
        );
    }
}
    
return ViewPort;
});
