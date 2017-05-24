

define(function(){
"use strict";

function Rect(x, y, w, h){
    this.type="rect";
    
    this.x = this.y = this.w = this.h = 0;
    switch (arguments.length){
        case 0:
            break;
        case 1:
            if (typeof x === "string"){
                var args = x.split(/[^\d\.-]+/); // split the string on sequences of nonnumeric characters
                // todo: support floats
                this.x = Number.parseInt(args[0]);
                this.y = Number.parseInt(args[1]);
                this.w = Number.parseInt(args[2]);
                this.h = Number.parseInt(args[3]);
            } else if (typeof x === "object"){
                this.x = x.x;
                this.y = x.y;
                this.w = x.w || x.width;
                this.h = x.h || x.height;
            }
            break;
        case 4:
            this.w = w;
            this.h = h;
        case 2:
            this.x = x;
            this.y = y;
            break;
        default:
            console.error("Wrong number of arguments to Rect");
            break;
    }
    
    Object.freeze && Object.freeze(this);
}
    
Rect.prototype.getX = function getX(){
    return this.x;
}
Rect.prototype.getY = function getY(){
    return this.y;
}
Rect.prototype.getWidth = function getWidth(){
    return this.w;
}
Rect.prototype.getHeight = function getHeight(){
    return this.h;
}
Rect.prototype.getMaxX = function getMaxX(){
    return this.x + this.w;
}
Rect.prototype.getMaxY = function getMaxY(){
    return this.y + this.h;
}
Rect.prototype.getCenterX = function getCenterX(){
    return this.x + this.w/2;
}
Rect.prototype.getCenterY = function getCenterY(){
    return this.y + this.h/2;
}
Rect.prototype.setPos = function setPos(x,y){
    this.x = x;
    this.y = y;
}
Rect.prototype.setSize = function setSize(w,h){
    this.w = w;
    this.h = h;
}

Rect.prototype.add = function add(x, y, w, h){
    x = x || 0;
    y = y || 0;
    w = w || 0;
    h = h || 0;
    if (typeof x === "object"){
        return new Rect(this.x + x.x, this.y + x.y, this.w + x.w, this.h + x.h);
    } else if (typeof x === "number"){
        return new Rect(this.x + x, this.y + y, this.w + w, this.h + h);
    }
}

Rect.prototype.multiply = function multiply(x,y,w,h){
    
    switch (arguments.length){
        case 1:
            y = x;
        case 2:
            w = x;
            h = y;
        case 4:
            return new Rect(x*this.x, y*this.y, w*this.w, h*this.h);
        default:
            console.error("wrong number of arguments to Rect.multiply");
            return null;
    }
}

Rect.prototype.divide = function divide(x,y,w,h){
    
    switch (arguments.length){
        case 1:
            y = x;
        case 2:
            w = x;
            h = y;
        case 4:
            return new Rect(this.x/x, this.y/y, this.w/w, this.h/h);
        default:
            console.error("wrong number of arguments to Rect.divide");
            return null;
    }
}

Rect.prototype.floor = function floor(){
    var x = this.x|0;
    var y = this.y|0;
    var w = this.x + this.w - x |0;
    var h = this.y + this.h - y |0;
    return new Rect(x, y, w, h);
}

Rect.prototype.expand = function expand(x,y){
    if (typeof y === "undefined"){
        y = x;
    }
    return this.add(-x,-y, 2*x, 2*y);
}

Rect.prototype.overlaptsWith = function overlapsWith(rect){
    return !(
        this.getX() > rect.getMaxX() ||
        rect.getX() > this.getMaxX() ||
        this.getY() > rect.getMaxY() ||
        rect.getY() > this.getMaxY()
    );
}

Rect.prototype.contains = function contains(rect){
    return (
        this.getX() <= rect.getX() &&
        this.getY() <= rect.getY() &&
        this.getMaxX() >= rect.getMaxX() &&
        this.getMaxY() >= rect.getMaxY());
}

Rect.prototype.distanceTo = function distanceTo(rect){
    var left = this.getX() < rect.getX() ? this : rect;
    var right = this.getX() < rect.getX() ? rect : this;
    var xDist = Math.max(right.getX()-left.getMaxX(), 0);
    
    var upper = this.getY() < rect.getY() ? this : rect;
    var lower = this.getY() < rect.getY() ? rect : this;
    var yDist = Math.max(lower.getY()-upper.getMaxY(), 0);
    
    return Math.hypot(xDist, yDist);
}

return Rect;

});
