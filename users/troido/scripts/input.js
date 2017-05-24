
var InputManager = Class.extend({
	
	keys: null,
	inputs: null,
	mouse: null,
	
	init: function(){
		this.keys = new Keys();
		this.mouse = new MouseDragManager(document.getElementById("outerframe"));
		
	},
	
	get: function(inputName){
		var result = 0;
		switch (inputName){
			case "right":
				result =  ((this.keys.get(68)||this.keys.get(39)) - (this.keys.get(65)||this.keys.get(37)));
				break;
			case "forward":
				result = (this.keys.get(87)||this.keys.get(38)) - (this.keys.get(83) || this.keys.get(40));
				break;
			case "yaw":
				result = this.mouse.getDragX()/15 - (this.keys.get(69) - this.keys.get(81));
				break;
			case "pitch":
				result = -this.mouse.getDragY()/15 - (this.keys.get(82) - this.keys.get(70));
// 				console.log(result);
				break;
			case "roll":
				result = -(this.keys.get(84) - this.keys.get(71));
				break;
		}
		
		return result;
	},
	
	flush: function(){
		this.mouse.flush();
	}
	
});