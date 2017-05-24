// global variables: width, height, map[width][height], filled[width+2][height+2], color, amount, filling, turns, fieldColors, drawnums


function startAll(){


width=14;
height=14;
amount=6;
filling=1;
turns=0;
drawnums=0;



fieldColors=new Array();
fieldColors[0]="red";
fieldColors[1]="green";
fieldColors[2]="blue";
fieldColors[3]="yellow";
fieldColors[4]="orange";
fieldColors[5]="purple";

map=new Array();
for (a=0;a<width;a++){
map[a]=new Array();
for (b=0;b<height;b++){
map[a][b]=Math.floor(Math.random()*amount);
}
}

filled=new Array();
for (a=0;a<width+2;a++){
filled[a]=new Array();
for (b=0;b<height+2;b++){
filled[a][b]=0;
}
}

filled[1][1]=1;
//map[0][0]=-1;

color=map[0][0];

checkmap();

drawPlayfieldCanvas();
if (drawnums){
drawPlayfieldDOM();}

drawButtons();
}



function change(newColor){

color=newColor;

checkmap();

drawPlayfieldCanvas();
if (drawnums){
drawPlayfieldDOM();}

turns++;

if (filling>=(width*height)){
alert("Congratulations, you made it in "+turns+" turns!"+"\n"+"Press F5 to restart.");}

}



function checkmap(){
for (var a=0;a<width;a++){
for (var b=0;b<height;b++){

if (filled[a+1][b+1])
{
map[a][b]=color;
}
else if (map[a][b]==color)
{
if (filled[a][b+1]||filled[a+2][b+1]||filled[a+1][b]||filled[a+1][b+2])
{
filled[a+1][b+1]=1;
filling++;
}
}

}}
}


function changeCell(x,y){

}


function drawPlayfieldDOM(){

document.getElementById("playfield").innerHTML="<p>";

for (var a=0;a<height;a++){
for (var b=0;b<width;b++){
document.getElementById("playfield").innerHTML+=map[b][a]+" ";
}
document.getElementById("playfield").innerHTML+="<br />";
}
document.getElementById("playfield").innerHTML+="</p>";
}


function drawPlayfieldCanvas(){
var ctx=document.getElementById("canvas").getContext("2d");
for (var a=0;a<height;a++){
for (var b=0;b<width;b++){
ctx.fillStyle=fieldColors[(map[b][a])];
ctx.fillRect((20*b),(20*a),20,20);
}}
}


function drawButtons(){
document.getElementById("buttons").innerHTML="<p>";
for (var a=0;a<amount;a++){
document.getElementById("buttons").innerHTML+="<button type=\"button\" onclick=\"change("+a+")\">color "+a+" ("+fieldColors[a]+")</button><br />";
}
document.getElementById("buttons").innerHTML+="</p>";
}

function setDrawnums(){
drawnums=!drawnums;
if (drawnums){
drawPlayfieldDOM();
} else {
document.getElementById("playfield").innerHTML="";
}
}