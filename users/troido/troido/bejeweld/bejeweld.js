function startAll(gamemode){


document.getElementById("prestart").style.display="none";

width=10;
height=10;
mode=gamemode;
scale=20;
selectedx=0;
selectedy=0;
ctx=document.getElementById("canvas").getContext("2d");
delay=0;

fieldColors=new Array();
fieldColors[0]="white";
fieldColors[1]="red";
fieldColors[2]="blue";
fieldColors[3]="yellow";
fieldColors[4]="orange";
fieldColors[5]="purple";
fieldColors[6]="aqua";
fieldColors[7]="lime";
fieldColors[8]="red";

fieldSigns=[" ","+","*","-","@","?","/","%","#"];

map=new Array();
for (var a=0;a<(width+2);a++){
map[a]=new Array();
for (var b=0;b<(height+2);b++){
map[a][b]=0;
}}
start();
}


function start(){

amount=7;
selecting=0;
points=0;
combo=0;
up=0;
extra=0;
scoring=0;

for (var a=1;a<=width;a++){
for (var b=1;b<=height;b++){
map[a][b]=Math.floor(Math.random()*amount+1);
}}

if (mode=="moves"){
turns=0;
maxturns=21;
update();
delay=500;
document.getElementById("game").style.display="inline";
alert("You have "+maxturns+" moves.\nMake them count!");
} else if (mode=="time"){
time=0;
maxtime=60;
update();
alert("You have "+maxtime+" seconds.\nUse it well!\n\nYour time begins when you press the ok button.");
document.getElementById("game").style.display="inline";
timing();
}
}


function update(){
points+=Math.max(extra-6+up*(extra>0),0)*scoring;
up++;
extra=0;
change=checkPairs();
drawBoard();
if (change){
setTimeout("gravity()",delay);
return 1;
} else {
scoring=0;
if (testend()){
alert("Your score is "+points+"\nPress ok to restart.");
document.getElementById("prestart").style.display="inline";
document.getElementById("game").style.display="none";
}
return 0;
}

}


function select(event){

var x=Math.floor((event.clientX-100)/(scale));
var y=Math.floor((event.clientY-100)/(scale));
if (x==selectedx&&y==selectedy){
selecting=0;
} else if (selecting&&((x==selectedx&&(y==selectedy+1||y==selectedy-1))||(y==selectedy&&(x==selectedx+1||x==selectedx-1)))){
var num=map[x+1][y+1];
map[x+1][y+1]=map[selectedx+1][selectedy+1];
map[selectedx+1][selectedy+1]=num;
selecting=0;
combo=1;
scoring=1;
up=0;
var valid=update();
if (valid){
turns++;
} else {
var num=map[x+1][y+1];
map[x+1][y+1]=map[selectedx+1][selectedy+1];
map[selectedx+1][selectedy+1]=num;
if (mode!="time"){
alert("invalid move");}
}
} else {
selectedx=x;
selectedy=y;
selecting=1;
}
drawBoard();
drawSelect();
}


function checkPairs(){

var xpair= new Array();
var ypair= new Array();
var npair= new Array();
for (var a=1;a<=width;a++){
for (var b=1;b<=height;b++){
var c=map[a][b]
if (map[a+1][b]==c&&map[a-1][b]==c){
xpair.push(a);
ypair.push(b);
npair.push(0);
}
if (map[a][b+1]==c&&map[a][b-1]==c){
xpair.push(a);
ypair.push(b);
npair.push(1);
}
}}
for (var a=0;a<npair.length;a++){
//points+=combo*scoring;
combo++;
//extra=-5;
map[xpair[a]][ypair[a]]=0;
map[xpair[a]+1*!npair[a]][ypair[a]+1*npair[a]]=0;
map[xpair[a]-1*!npair[a]][ypair[a]-1*npair[a]]=0;
}
return npair.length
//up++;
}


function gravity(){
for (var x=1;x<=width;x++){
for (var y=1;y<=height;y++){
if (!map[x][y]){
extra+=2;

map[x].splice(y,1)
map[x][0]=Math.floor(Math.random()*amount+1);
map[x].unshift(0);
} }}
//points+=(Math.max(1,extra)+up)*scoring;
drawBoard();
setTimeout("update()",delay);
}


function timing(){
time++;
drawScore();
if (testend()){
alert("Your score is "+points+".\nPress ok to restart.");
document.getElementById("prestart").style.display="inline";
document.getElementById("game").style.display="none";
}else{
setTimeout("timing()",1000);
}
}


function drawBoard(){
ctx=document.getElementById("canvas").getContext("2d");
for (var a=0;a<height;a++){
for (var b=0;b<width;b++){
ctx.fillStyle=fieldColors[(map[b+1][a+1])];
ctx.fillRect((scale*b),(scale*a),scale,scale);
ctx.font=(scale/1.5)+"px Verdana";
ctx.fillStyle="#000000";
ctx.fillText(fieldSigns[(map[b+1][a+1])],scale*b,scale*(a+0.5))
//console.log(fieldSigns[(map[b+1][a+1])])
}}
drawScore();
}


function drawScore(){
var left;
if (mode=="moves"){
left="Moves left: "+(maxturns-turns);
} else if (mode=="time"){
left="Time left: "+(maxtime-time);}
document.getElementById("score").innerHTML="Points: "+Math.floor(points)+"<br />"+left;
}


function drawSelect(){
if (selecting){
ctx.strokeStyle="#000000";
ctx.strokeRect((scale*selectedx),(scale*selectedy),scale,scale);
}
}


function testend(){
if (mode=="moves"){
return (turns >=maxturns);
} else if (mode=="time"){
return (time>=maxtime);
}
}


function showHelp(){
var text=loadText("bejeweld_help.htm");
document.getElementById("help").getElementsByTagName("p")[0].innerHTML=text;
}


function loadText(file){
var xmlhttp;
xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET",file,false);
xmlhttp.send();
var info;
info=xmlhttp.responseText;
return info
}

/**/