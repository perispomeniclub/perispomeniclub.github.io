"use strict";
/** The Game class should represent the model.
 * all commumication between the model and the view should go through this class
 */

var Game = Class.extend({
	field: null,// : CollisionManager
// 	objects: [], // don't fill this array, replace it
	
	
	init: function(width,height){
		this.field = new CollisionManager(width,height);
	},
	
	getWidth: function(){
		return this.field.width;
	},
	
	getHeight: function(){
		return this.field.height;
	},
	
	addPlacable: function(object){
// 		this.objects.push(object); // [facepalm] why couldn't I even listen to myself? (line 8)
// 		object.setGame(this);
		object.putInMap(this.field);
	},
	
	createObject: function(ObjectClass,x,y,direction){
		var o = new ObjectClass();
		o.x = x;
		o.y = y;
		o.setDirection(direction);
		if (o instanceof Placable){
			o.putInMap(this.field);
		}
	},
	
	getPlayers: function(){
		return this.field.getAll();
	},
	
	update: function(timeSinceLastUpdate){
		
		this.getPlayers().forEach(function(obj){
			
			obj.update && obj.update(timeSinceLastUpdate);
		});
	}
	
});