var keys = new Array();
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
}