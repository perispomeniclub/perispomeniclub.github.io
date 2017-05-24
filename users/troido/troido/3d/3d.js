function start(){

x=100;
y=100;
z=0;
pitch=0;
yaw=0;
roll=0;


xpoint=new Array(10,10,100,100,10,10,100,100,
180,220,200,200,200,200,
100,100,100,
200,250,300,350,400,450,500,550,600,650);
ypoint=new Array(10,50,50,10,10,50,50,10,
200,200,180,220,200,200,
150,200,300,
200,250,300,350,400,450,500,550,600,650);
zpoint=new Array(-10,-10,-10,-10,30,30,30,30,
0,0,0,0,-20,20
,0,0,0,
0,0,0,0,0,0,0,0,0,0);
line1=new Array(0,1,2,3,4,5,6,7,0,1,2,3,
8,10,12,
14,14,
17,18,19,20,21,22,23,24,25);
line2=new Array(1,2,3,0,5,6,7,4,4,5,6,7,
9,11,13,
15,16,
18,19,20,21,22,23,24,25,26);
square=new Array();
square[1]=new Array(0,0,0);//4,0,2,0,1);
square[2]=new Array(1,1,3);//5,1,3,3,2);
square[3]=new Array(2,5,7);//6,5,6,6,6);
square[4]=new Array(3,4,4);//7,4,7,7,5);
square[0]=new Array("#FF0000","#0000FF","#00FF00","#00FF00","#0000FF","#0000FF");

triangle=new Array(["#FF0000",0,1,2],["#FF0000",0,2,3],["#0000FF",0,1,5],["#0000FF",0,5,4],["#00FF00",0,3,7],["#00FF00",0,7,4]);

drawn=new Array();
visible=new Array();

xview=new Array();
yview=new Array();

linedir=[" ","\\","|","/","-"," ","-","/","|","\\"];

var c=document.getElementById("canvas");
width=c.width;
height=c.height;

DOMenabled=0;

dwidth=width/8;
dheight=height/8;
field= new Array(dwidth);
for (var a=0; a<dwidth; a++){
field[a]=new Array(dheight);
for (var b=0; b<dheight; b++){
field[a][b]=0;
}
}

update(0)
}

function update(e){
move(e);

calc3d(x,y,z,roll,pitch,yaw,1);

draw();
draw3d();
if (DOMenabled){
drawDom();}
}


function move(e){
var keynum;
var keychar;
var numcheck;

keynum = e.which;
keychar = String.fromCharCode(keynum);
//alert(keynum+"\n"+keychar);
if (keychar=="i"){y-=10;}
if (keychar=="k"){y+=10;}
if (keychar=="j"){x-=10;}
if (keychar=="l"){x+=10;}
if (keynum==32){z+=5;}
if (keychar=='z'){z-=5;}

if (keychar=="w"){
x+=5*Math.cos(yaw);
y+=5*Math.sin(yaw);}
if (keychar=="s"){
x-=5*Math.cos(yaw);
y-=5*Math.sin(yaw);}
if (keychar=="q"){
x+=5*Math.sin(yaw);
y-=5*Math.cos(yaw);}
if (keychar=="e"){
x-=5*Math.sin(yaw);
y+=5*Math.cos(yaw);}
if (keychar=="g"){
x=prompt('x position',x);
y=prompt('y position',y);}

if (keychar=="a"){yaw-=Math.PI/16;}
if (keychar=="d"){yaw+=Math.PI/16;}
if (keychar=="r"){pitch+=Math.PI/16;}
if (keychar=="f"){pitch-=Math.PI/16;}
if (keychar=="c"){roll+=Math.PI/16;}
if (keychar=="v"){roll-=Math.PI/16;}


/*if (yaw>Math.PI){
yaw-=2*Math.PI;
}
if (yaw<=-Math.PI){
yaw+=2*Math.PI;
}*/
if (keychar=='t'){
alert('x: '+x+'\ny: '+y+'\nz: '+z+'\ndirection: '+yaw+'\npitch: '+pitch)
}



}


function calc3d(xcam,ycam,zcam,Thx,Thy,Thz,size){

for (var a=0;a<xpoint.length;a++){

/**/

dx= Math.cos(Thy)*(Math.sin(Thz)*(ypoint[a]-ycam) +Math.cos(Thz)*(xpoint[a]-xcam))- 
Math.sin(Thy)*(zpoint[a]-zcam);
 
dy= Math.sin(Thx)*(Math.cos(Thy)*(zpoint[a]-zcam)+ Math.sin(Thy)*(Math.sin(Thz)*(ypoint[a]-ycam)+Math.cos(Thz)*(xpoint[a]-xcam)))+
Math.cos(Thx)*(Math.cos(Thz)*(ypoint[a]-ycam)-Math.sin(Thz)*(xpoint[a]-xcam));
 
dz= Math.cos(Thx)*(Math.cos(Thy)*(zpoint[a]-zcam)+ Math.sin(Thy)*(Math.sin(Thz)*(ypoint[a]-ycam)+Math.cos(Thz)*(xpoint[a]-xcam)))- 
Math.sin(Thx)*(Math.cos(Thz)*(ypoint[a]-ycam)-Math.sin(Thz)*(xpoint[a]-xcam));
/*/
dx = xpoint[a]-xcam;
dy = ypoint[a]-ycam;
dz = zpoint[a]-zcam;

/**/
xview[a]=-dy*size/dx;
yview[a]=-dz*size/dx;
visible[a]=(dx>0);
drawn[a]=0;
/*/

var hdir=Math.atan(Math.tan((Math.abs(Math.atan2(ypoint[a]-ycam,xpoint[a]-xcam))*2*((ycam>=ypoint[a])-0.5)+yaw)/2)*2);
var vdir=-(Math.atan2(zpoint[a]-zcam,Math.sqrt(Math.pow(xpoint[a]-xcam,2)+Math.pow(ypoint[a]-ycam,2)))-pitch);
var dist=get_radius_3d(xpoint[a]-xcam,ypoint[a]-ycam,zpoint[a]-zcam);
xview[a]=hdir/dist*100;
yview[a]=vdir/dist*100;
/**/
}
}


function draw(){
var ctx=document.getElementById("canvas").getContext("2d");
ctx.clearRect(0,0,width,height);
ctx.strokeRect(0,0,width,height);

ctx.beginPath();
for (var a=0;a<line1.length;a++){
ctx.moveTo(xpoint[line1[a]],ypoint[line1[a]]);
ctx.lineTo(xpoint[line2[a]],ypoint[line2[a]]);
}
ctx.stroke();/**/

ctx.beginPath();
ctx.fillStyle="blue";
ctx.arc(x,y,5,0,2*Math.PI);
ctx.fill();
ctx.moveTo(x,y);
ctx.lineTo(x+20*Math.cos(yaw),y+20*Math.sin(yaw))
ctx.stroke();

}


function draw3d(){

var b=-width/(Math.PI);
var c=height/(Math.PI);
var d=width/2;
var e=height/2;

var ctx2=document.getElementById("canvas2").getContext("2d");
ctx2.clearRect(0,0,width,height);
ctx2.strokeRect(0,0,width,height);
ctx2.beginPath();
ctx2.moveTo(d,e+5);
ctx2.lineTo(d,e-5);
ctx2.moveTo(d+5,e);
ctx2.lineTo(d-5,e);
ctx2.stroke();

for (var a=0;a<triangle.length;a++){
if (visible[triangle[a][1]]&&visible[triangle[a][2]]&&visible[triangle[a][3]]){
ctx2.fillStyle=triangle[a][0];
ctx2.beginPath();
ctx2.moveTo(b*xview[triangle[a][1]]+d,c*yview[triangle[a][1]]+e);
ctx2.lineTo(b*xview[triangle[a][2]]+d,c*yview[triangle[a][2]]+e);
ctx2.lineTo(b*xview[triangle[a][3]]+d,c*yview[triangle[a][3]]+e);
ctx2.closePath();
ctx2.fill();
for (var g=0;g<a;g++){
//for (var f=1;f<=4;h++)
//if yview[triangle[h][g]]>(yview[triangle[a][
}
}
}

/*for (var a=0;a<square[1].length;a++){
if (visible[square[1][a]]&&visible[square[2][a]]&&visible[square[3][a]]&&visible[square[4][a]]){
ctx2.fillStyle=square[0][a];
ctx2.beginPath();
ctx2.moveTo(b*xview[square[1][a]]+d,c*yview[square[1][a]]+e);
ctx2.lineTo(b*xview[square[2][a]]+d,c*yview[square[2][a]]+e);
ctx2.lineTo(b*xview[square[3][a]]+d,c*yview[square[3][a]]+e);
ctx2.lineTo(b*xview[square[4][a]]+d,c*yview[square[4][a]]+e);
ctx2.closePath();
ctx2.fill();
for (var f=1;f<=4;f++){
drawn[square[f]]=1;}
for (var g=0;g<a;g++){
//for (var f=1;f<=4;h++)
//if yview[square[h][g]]>(yview[square[a][
}
}
}*/


ctx2.beginPath();
for (var a=0;a<line1.length;a++){
if (visible[line1[a]]&&visible[line2[a]]){
ctx2.moveTo(b*xview[line1[a]]+d,c*yview[line1[a]]+e);
ctx2.lineTo(b*xview[line2[a]]+d,c*yview[line2[a]]+e);}
}
ctx2.stroke();

}


function drawDom(){
for (var a=0; a<dwidth; a++){
for (var b=0; b<dheight; b++){
field[a][b]=0;
}}


var b=-dwidth/(Math.PI);
var c=dheight/(Math.PI);
var d=dwidth/2;
var e=dheight/2;

for (var a=0;a<line1.length;a++){
if (visible[line1[a]]&&visible[line2[a]]){
fieldArrayLine(b*xview[line1[a]]+d,c*yview[line1[a]]+e,b*xview[line2[a]]+d,c*yview[line2[a]]+e,1);

}


}

//alert("succes");
drawPlayfieldDOM();
}


function fieldArrayLine(x1,y1,x2,y2,val){

var xx=x1;
var yy=y1;

imag_set_radius(x2-x1,y2-y1,1);

for (var a=0; a<=get_radius(x2-x1,y2-y1); a++){

if (xx>=0 && yy>=0 && xx<dwidth && yy<dheight){

field[Math.round(xx)][Math.round(yy)]=Math.round(r_r*1.4+1)+3*Math.round(r_i*1.4+1)+1;
}

xx+=r_r;
yy+=r_i;
}
}


function drawPlayfieldDOM(){

var p=document.getElementById("playfield")
var text = "|"
//p.innerHTML="|";

for (var a=0;a<dheight;a++){
for (var b=0;b<dwidth;b++){
if (field[b][a]){
text+=linedir[field[b][a]]+" ";
} else {
text+="  "}
}
text+="|<br />|";
}
p.innerHTML=text;
}

function enableDOM(enable){
if (enable){
DOMenabled=1;

dwidth=width/8;
dheight=height/8;
field= new Array(dwidth);
for (var a=0; a<dwidth; a++){
field[a]=new Array(dheight);
for (var b=0; b<dheight; b++){
field[a][b]=0;
}}
}else {
DOMenabled=0;
document.getElementById("playfield").innerHTML="";
field=0;
}
}

/*function draw_rectangle(a){

ctx2.fillStyle=c_square[a];
ctx2.beginPath();
ctx2.moveTo(b*xview[square[1][a]]+d,c*yview[square[1][a]]+e);
ctx2.lineTo(b*xview[square[2][a]]+d,c*yview[square[2][a]]+e);
ctx2.lineTo(b*xview[square[3][a]]+d,c*yview[square[3][a]]+e);
ctx2.lineTo(b*xview[square[4][a]]+d,c*yview[square[4][a]]+e);
ctx2.closePath();
ctx2.fill();
for (var b=1;b<=4,b++){
drawn[square[b]]=1;}

}

function isInFront(p){
var range=Math.PI/4;
return ((xview[p]<=range) && (xview[p]>-range));
}
*/