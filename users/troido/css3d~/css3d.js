
var Player = Class.extend({
	
	location: null,
	orientation: null,
	input: null,
	map: null,
	
	init: function(map, location, orientation){
		this.location = location || {x: 0, y: 0, z:0};
		this.orientation = orientation || {x: 0, y: 0, z: 0};
		this.input = new InputManager();
		this.map = map;
	},
	
	getLocation: function(axis){
		if (axis){
			return this.location[axis];
		} else {
			return this.location;
		}
	},
	getOrientation: function(axis){
		if (axis){
			return this.orientation[axis];
		} else {
			return this.orientation;
		}
	},
	step: function(){
		this.orientation.y += this.input.get("yaw")/20;
		this.orientation.x += this.input.get("pitch")/20;
		this.orientation.z += this.input.get("roll")/20;
		var xp = this.location.x, yp = this.location.y, zp = this.location.z;
		this.location.z += -10*(this.input.get("forward") * Math.cos(this.orientation.y) + this.input.get("right") * Math.sin(this.orientation.y));
// 		console.log(this.map.get(this.location.x|0, this.location.z|0));
		if (!this.map.get(this.location.x|0, this.location.z|0)){
			this.location.z = zp;
		}
		this.location.x += 10*(this.input.get("right") * Math.cos(this.orientation.y) - this.input.get("forward") * Math.sin(this.orientation.y));
		if (!this.map.get(this.location.x|0, this.location.z|0)){
			this.location.x = xp;
		}
		this.input.flush();
	}
});



function step(player){
	player.step();
	
	draw(player)
}

function draw(camera){
	var l = camera.getLocation(),
		o = camera.getOrientation();
// 	console.log(o);
	var cam = document.getElementById("camera");
	cam.style.transform = "translate3d("+l.x.toFixed(10)+"px,"+(l.y-170).toFixed(10)+"px,"+l.z.toFixed(10)+"px) rotateY("+(o.y).toFixed(10)+"rad) rotateX("+o.x.toFixed(10)+"rad) rotateZ("+o.z.toFixed(10)+"rad)";
// 	console.log(cam.style.transform);
	transformRoot(cam, document.getElementById("root"));
}


function main(){
	var map = new MapLoader()
	map.fromImg(document.getElementById("heightmap"));
	var player = new Player(map, {x: 500, y: 0, z:1400}, {x: 0, y: 3.1416, z: 0});
	
	var stepInterval = window.setInterval(step,50, player);
	
	// debug hack to stop the game
	document.addEventListener("keydown",function(e){
		if (e.which == 46){
			alert("step interval stopped");
			clearInterval(stepInterval);
		}
	});
}

window.addEventListener("load",main);

