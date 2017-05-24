"use strict";
/**
 * Some functions are supported in newer browsers, but not in all browsers.
 * This file contains functions that do support them
 * The Set class has its own file however
 */

if (!Math.hypot){
	/* Math.hypot should return the square root of ( the sum of all (arguments squared ) )
	 * If the arguments represent a vector, Math.hypot returns the length of that vector
	 */
	Math.hypot = function(){
		var total = 0;
		for (var i = 0; i<arguments.length; i++){
			total += arguments[i] * arguments[i];
		}
		return Math.sqrt(total);
	}
}

if (![].contains){
	Array.prototype.contains = function(x){
		return this.indexOf(x)>=0;
	}
}