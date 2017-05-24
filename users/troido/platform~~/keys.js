"use strict";

/**
 * A class to keep track of which keys are currently pressed
 */

var Keys = Class.extend({
	keys: null,
	pressed: null,
	released: null,
	
	init:function(){
		
		this.keys = [];
		this.pressed = [];
		this.released = [];
		
		document.addEventListener("keydown",function(e){this.press(e.which);}.bind(this));
		document.addEventListener("keyup",function(e){this.release(e.which);}.bind(this));
		window.addEventListener("blur",function(e){this.clearAll()}.bind(this));
	},
	
	get:function(x){
		// returns whether this key is currently down
		return this.keys[x]||0;
	},
	getPress:function(x){
		return this.pressed[x]||0;
	},
	getRelease:function(x){
		return this.released[x]||0;
	},
	press:function(x){
		if(!this.keys[x]){
			this.pressed[x]=1//!this.keys[x];
			this.keys[x]=1;
		}
	},
	release:function(x){
		this.keys[x]=0;
		this.released[x]=1;
	},
	clear:function(n){
		if (n===undefined)
			n=128;
		for (var i=0;i<n;i++){
			this.pressed[i]=0;
			this.released[i]=0;
		}
	},
	clearKeys:function(n){
		if (!n)
			n=128;
		for (var i=0;i<n;i++){
			this.keys[i]=0;
		}
	},
	clearPressed:function(n){
		if (n===undefined)
			n=128;
		for (var i=0;i<n;i++){
			this.pressed[i]=0;
		}
	},
	clearReleased:function(n){
		if (n===undefined)
			n=128;
		for (var i=0;i<n;i++){
			this.released[i]=0;
		}
	},
	clearAll:function(n){
		if (n===undefined)
			n=128;
		for (var i=0;i<n;i++){
			this.keys[i]=0;
			this.pressed[i]=0;
			this.released[i]=0;
		}
	}
});

