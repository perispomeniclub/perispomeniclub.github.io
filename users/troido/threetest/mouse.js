"use strict";

var MouseDragManager = Class.extend({
	
	element: null,
	mouseStartX: 0,
	mouseStartY: 0,
	mouseEndX: 0,
	mouseEndY: 0,
	dragFun: null,
	
	init: function(element){
		
		this.element = element || window;
		
		var self = this;
		this.element.addEventListener("mousedown",function(e){self._mouseDown(e);},false);
		this.element.addEventListener("mouseup",function(e){self._clearMouse();});
		this.element.addEventListener("blur",function(e){self._clearMouse();});
		this.element.addEventListener("mouseleave",function(e){self._clearMouse();});
		
		this.dragFun = function(e){self._mouseDrag(e);};
	},
	
	
	getDragX: function(){
// 		console.log(this.mouseStartX, this.mouseEndX, this.mouseEndX - this.mouseStartX);
		return this.mouseEndX - this.mouseStartX;
	},
	
	getDragY: function(){
// 		console.log(this.mouseStartY, this.mouseEndY, this.mouseEndY - this.mouseStartY);
		return this.mouseEndY - this.mouseStartY;
	},
	
	flush: function(){
		this.mouseStartX = this.mouseEndX;
		this.mouseStartY = this.mouseEndY;
	},
	
	
	_mouseDown: function(mouseEvent){
		var self = this;
		this.element.setCapture && this.element.setCapture();
		this.element.addEventListener("mousemove",this.dragFun);
		
		this.mouseStartX = mouseEvent.screenX;
		this.mouseStartY = mouseEvent.screenY;
		this.mouseEndX = mouseEvent.screenX;
		this.mouseEndY = mouseEvent.screenY;
	},
	
	_mouseDrag: function(mouseEvent){
		this.mouseEndX = mouseEvent.screenX;
		this.mouseEndY = mouseEvent.screenY;
		mouseEvent.preventDefault();
	},
	
	_mouseUp: function(){
		this._clearMouse();
	},
	
	_clearMouse: function(){
		
		this.element.removeEventListener("mousemove",this.dragFun);
	}
	
});