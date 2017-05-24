function move(dir){

xprevious=x;
yprevious=y;
map[x][y]=2;

if (dir==0) {x++;}
if (dir==1) {y--;}
if (dir==2) {x--;}
if (dir==3) {y++;}

checkplace();

drawscreen();
document.getElementById("place").innerHTML=x+","+y;//+"    "+key;
}




function start(mode){

end=0;
x=0;
y=0;
map=new Array();

if mode==0{
width=4;
height=4;}


var a;
var b;
for (a=0;a<width;a++){
map[a]=new Array();
for (b=0;b<height;b++){
map [a][b]=0;
}
}
if mode==0{
map[3][3]=1;
map[3][2]=1;
map[0][1]=1;
map[1][1]=3;}

lol=loadmap();

document.getElementById("place").innerHTML=x+","+y+"<br />"+lol;
drawscreen();
}




function drawscreen(){
var a;
var b;
var c;
document.getElementById("drawing").innerHTML="";
for (a=0;a<height;a++){
for (b=0;b<width;b++){
if (a==y && b==x){
document.getElementById("drawing").innerHTML+="+ ";
}else{
c=map[b][a];
if (c==1){
document.getElementById("drawing").innerHTML+="O";}
else if (c==2){
document.getElementById("drawing").innerHTML+="* ";}
else if (c==3){
document.getElementById("drawing").innerHTML+="X ";}
else {
document.getElementById("drawing").innerHTML+="_ ";}

}
}
document.getElementById("drawing").innerHTML+="<br />";
}

}




function checkplace(){

if (x<0||x>=width||y<0||y>=height){
x=xprevious;
y=yprevious;
}else{ 
var a=map[x][y];
if (a==3){
endgame();
} 
if (a&&!end){
x=xprevious;
y=yprevious;
}
}
}




function endgame(){
var c=0;
for (var a=0;a<width;a++){
for (var b=0;b<height;b++){
c+=(map[a][b]==0);
}}
if (c==0){
alert ("you won");
end=1;
}else{
alert("you're not done yet")}
}



function newmap(){

}



function loadmap(){
var xmlhttp;
xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","oasemaps.php",false);
xmlhttp.send();
var info;
info=xmlhttp.responseText;
return info
}













/*

var key=checkkey();

if (key=="W"){y--};
if (key=="S"){y++};
if (key=="A"){x--};
if (key=="D"){x++};


function checkkey(){
var keynum;
var keychar;
var numcheck;

if(window.event) // IE
	{
	keynum = e.keyCode;
	}
else if(e.which) // Netscape/Firefox/Opera
	{
	keynum = e.which;
	}
keychar = String.fromCharCode(keynum);
numcheck = /\d/;
document.getElementById("lol").innerHTML=keynum;

return keynum;
}



function draw(){
//alert ("start drawing");
document.write("\
<button type=\"button\" onclick=\"move(1)\">up</button>\
<br />\
<button type=\"button\" onclick=\"move(2)\">left</button>\
<button type=\"button\" onclick=\"move(0)\">right</button>\
<br />\
<button type=\"button\" onclick=\"move(3)\">down</button>\
<br />\
")

//alert("i'm drawing");
}

/*





function field(){
document.write(map[1]);
}
*/