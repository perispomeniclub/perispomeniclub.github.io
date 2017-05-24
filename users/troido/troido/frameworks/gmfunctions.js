

//function functions() {



//EVENTS
function troido_event_gamestart(){event0; setInterval('troido_event_step()',1000/room_speed); ctx = document.getElementById("canvas").getContext("2d");}
function troido_event_step(){event1; }//troido_event_draw()}
function troido_event_draw(){var ctx = document.getElementById("canvas").getContext("2d"); event2;}


//FUNCTIONS
// math
function random(x){return Math.random()*x}
function sqr(x){return x*x}
function point_distance(x1,y1,x2,y2){return Math.sqrt(sqr(x2-x1)+sqr(y2-y1))}
function sin(x) {return Math.sin(x)}
function cos(x) {return Math.cos(x)}
function tan(x) {return Math.tan(x)}
function round(x) {return Math.round(x)}
function floor(x) {return Math.floor(x)}
function ceil(x) {return Math.ceil(x)}
function sqrt(x) {return Math.sqrt(x)}
function abs(x) {return Math.abs(x)}
function power(x,n) {return Math.pow(x,n)}
function exp(x) {return Math.exp(x)}
function min(x,y) {return Math.min(x,y)}
function max(x,y) {return Math.max(x,y)}
/*function (x) {return Math.(x)}
function (x) {return Math.(x)}
function (x) {return Math.(x)}
function (x) {return Math.(x)}
function (x) {return Math.(x)}*/

// strings
function string_length(x){return x.length}

// popup
function show_message(text) {alert(text)}
function get_string(text,defaultvalue) {return prompt(text,defaultvalue)}
function get_integer(x,defaultvalue) {return prompt(x,defaultvalue)}

// draw
function draw_set_color(col) {ctx.fillStyle=col;ctx.strokeStyle=col;}
function draw_rectangle(x1,y1,x2,y2,outline) { if (outline) ctx.strokeRect(x1,y1,x2-x1,y2-y1); else ctx.fillRect(x1,y1,x2-x1,y2-y1);}
function draw_line(x1,y1,x2,y2) {ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();}
function draw_circle(x,y,r,outline) {ctx.beginPath(); ctx.arc(x,y,r,0,2*Math.PI); if (outline) ctx.stroke(); else ctx.fill();}
function draw_triangle(x1,y1,x2,y2,x3,y3,outline) {ctx.beginPath; ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.closePath(); if (outline) ctx.stroke(); else ctx.fill();}
function draw_text(x,y,string) {ctx.fillText(string,x,y)}

function make_color_rgb(red,green,blue){return "rgb("+red+","+green+","+blue+")"}

// data
function ds_grid_create(w,h) {var a = []; a.width=w; a.height=h; for (var b=0;b<w;b++){ a[b]=[]; for (var c=0;c<h;c++) a[b][c]=0} return a}
function ds_grid_destroy(id) {};
function ds_grid_set(id,x,y,val) {id[x][y]=val;}
function ds_grid_add(id,x,y,val) {id[x][y]+=val;}
function ds_grid_multiply(id,x,y,val) {id[x][y]*=val;}
function ds_grid_get(id,x,y) {return id[x][y];}
function ds_grid_width(id) {return id.width}
function ds_grid_height(id) {return id.height}


// keypress
troido_keys = new Array();
for (var a=0;a<127;a++){troido_keys[a] = 0;}
function troido_keypress(e){troido_keys[e.which] = 1; keyboard_lastkey = e.which; keyboard_key = e.which;}
function troido_unkeypress(e){troido_keys[e.which] = 0; if (keyboard_key==e.which) keyboard_key = 0;}

function keyboard_check(key) {return troido_keys[key];}


//VARIABLES
var pi = Math.PI;
var c_blue = "blue";
var c_red = "red";
var c_green = "green";
var c_lime = "lime";
var c_white = "white";
var c_black = "black";



//}