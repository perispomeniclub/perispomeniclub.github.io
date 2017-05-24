/*var keys = new Array();
for (var a=0;a<127;a++)
  keys[a] = 0;
var col=new Object();

function keypress(e) {
  keys[e.which] = 1;
  document.getElementById("text").innerHTML=e.which;
}

function keyunpress(e) {
  keys[e.which] = 0;
}

function initCollision(canvas,draw1,draw2){
  col.canvas=document.getElementById(canvas);
  col.ctx=col.canvas.getContext("2d");
}*/

var Keys={
	keys:[],
	pressed:[],
	released:[],
	get:function(x){
		return this.keys[x]||0;
	},
	getPress:function(x){
		return this.pressed[x]||0;
	},
	getRelease:function(x){
		return this.released[x]||0;
	},
	press:function(x){
		this.pressed[x]=!this.keys[x];
		this.keys[x]=1;
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
}
document.addEventListener("keydown",function(e){Keys.press(e.which);});
document.addEventListener("keyup",function(e){Keys.release(e.which);});
window.addEventListener("blur",function(e){Keys.clearAll()});
// window.addEvenListener("",function(e){Keys.clearAll()
