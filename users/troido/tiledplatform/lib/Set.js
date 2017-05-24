"use strict";


/**
 * The Set class is only available in newer browsers.
 * This is some kind of backup for if it is not available
 * only the add, has, delete and forEach methods are supported
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 * 
 * This set is made for objects. Do not use for numbers.
 * 
 * Also, IE and Safari don't support the constructor with an Iterable argument
 */

(function(){
	//console.log(window.Set);
	if (!window.Set){
		console.log("Using own class for Set");
		(function() {
			/* Unique ID code by Aleksandar Totic on http://stackoverflow.com/questions/1997661/unique-object-identifier-in-javascript
			 */
			var id_counter = 1;
			Object.defineProperty(Object.prototype, "__uniqueId", {
				writable: true
			});
			Object.defineProperty(Object.prototype, "uniqueId", {
				get: function() {
					if (this.__uniqueId == undefined)
						this.__uniqueId = id_counter++;
					return this.__uniqueId;
				}
			});
		}());
		
		window.Set = function(iterable){
			
			if (iterable){
				if (iterable instanceof window.Set){
					this.values = iterable.values.concat(); // concat to make a copy of the array
				} else {
					this.values = [];
					iterable.forEach(function(obj){
						this.add(obj);
					},this);
				}
			} else {
				this.values = [];
			}
			
		};
		
// 		var id_counter = 1;
		
		var getUniqueId = function(object){
// 			if (!object.uniqueId){
// 				object.uniqueId = id_counter;
// 				id_counter++;
// 			}
			return object.uniqueId;
		};
		
		Set.prototype.add = function(o){
			this.values[getUniqueId(o)] = o;
		};
		Set.prototype.has = function(o){
			return this.values[getUniqueId(o)] ? true : false;
		};
		Set.prototype.delete = function(o){
			delete this.values[getUniqueId(o)];
		};
		Set.prototype.forEach = function(callBack, thisObject){
// 			this.values.forEach(callBack,thisObject);
			for (var i in this.values){//=0, l=this.values.length; i<l; i++){
				callBack.call(thisObject, this.values[i], this.values[i], this);
			}
		};
		
		
		//USING_OWN_SET = true;
	}
	
	
	// Test if an array can be made with an array as argument for the constructor
	// if not, make this
	
	var a = []
	var s = new Set([a]);
	if (!s.has(a)){
		console.log("Using new constructor for Set");
		// the constructor does not accept arguments
		var S = window.Set;
		
		// I couldn't find out how to change the constructor for the Set class, so I make a new wrapper
		window.Set = function(collection){
			var set = new S();
			if (collection){
				collection.forEach(function(value){
					this.add(value);
				},set);
			}
			return set;
		};
	}
})();
