"use strict";


var Inventory=Class.extend({
	put:function(item){
		for (var i=0;i<this.size;i++){
			if (!this.slots[i]){
				this.slots[i]=item;
				return true;
			}
		}
		return false;
	},
	remove:function(slot){
		if (this.slots[slot]){
			var a=this.slots[slot];
			this.slots[slot]=undefined;
			return a;
		}
		return false;
	},
	get:function(slot){
		return this.slots[slot];
	},
	init:function(size){
		this.size=size;
		this.slots=[];
	}
});