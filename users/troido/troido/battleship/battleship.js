

function start(){



setVars();
makeField(0);
//alert("hi")
drawPlayField(play);



}


/*function update(S){
if (S) {
getCoordinates();
shoot(x,y);
}



}*/

function update(x,y){
shoot(x,y);
drawPlayField(play);
}


function shoot(x,y){
if (field[0][x][y]==2||field[0][x][y]==3) {
say("you already shot here");
} else if (field[0][x][y]==1){
say("BOOM!");
field[0][x][y]=3;
hit(fleet[0][x][y]);
} else {
say("splash");
field[0][x][y]=2;
}
}


function drawPlayField(p) {
var line="<div style='text-decoration:underline;'>  |"
for (var a=1; a<=width; a++){
line += a + " ";
}
line += "</div>"
p.innerHTML=line;
//p.innerHTML="<div style='text-decoration:underline;'>  |1 2 3 4 5 6 7 8 9 10</div>";
for (var y=0;y<height;y++){
p.innerHTML+=y+" |";
for (var x=0;x<width;x++){
p.innerHTML+="<span onclick='update("+x+","+y+")'>"+chars[field[0][x][y]]+" </span>";
}
p.innerHTML+="<br />";
}
}


function setVars() {
field = new Array();
fleet = new Array();

width = 10;
height = 10;

play=document.getElementById("playfield");
chars = ["~","~",".","x"];
max=25;
ships = [5,4,3,3,3,2,2,2];
boats = ships;
//alert(boats[2]);
}


function makeField(N) {

fleet[N] = new Array();
field[N] = new Array();
for (var x=0;x<10;x++){
field[N][x] = new Array();
fleet[N][x] = new Array();
for (var y=0;y<10;y++){
field[N][x][y] = 0;
fleet[N][x][y] = 0;
}}

for (var a=0;a<ships.length;a++){
var c;
do{
var x = Math.floor(Math.random()*10);
var y = Math.floor(Math.random()*10);
var ori = Math.floor(Math.random()*4);
c=place_ship(N,x,y,ori,ships[a],a)
} while (c)
//field[N][x][y]=1;

}

}


function place_ship(N,x,y,dir,length,ship){
var n=0;
var xx = x;
var yy = y;
//alert("test");

for (var a=0; a<length; a++){
//alert("testing "+a+"\n"+length+"\n"+dir+"\n"+x+"\n"+y+"\n"+xx+"\n"+yy);
if ((xx>=10)||(yy>=10)||(xx<0)||(yy<0)){
n=1;
break;
} else {
n += field[N][xx][yy]
 + field[N][Math.max(xx-1,0)][yy] + field[N][Math.min(xx+1,9)][yy] + field[N][xx][Math.max(yy-1,0)] + field[N][xx][Math.min(yy+1,9)]
 + field[N][Math.max(xx-1,0)][Math.max(yy-1,0)] + field[N][Math.min(xx+1,9)][Math.min(xx+1,9)]
 + field[N][Math.min(xx+1,9)][Math.max(yy-1,0)] + field[N][Math.max(xx-1,0)][Math.min(yy+1,9)];

xx += (dir == 0)-(dir == 2);
yy += (dir == 1)-(dir == 3);
}
//alert("succes"+a)
}

//alert("test2");
if (n==0){
xx=x;
yy=y;
for (a=0; a<length; a++){
//alert(length+"\n"+dir+"\n"+x+"\n"+y+"\n");
fleet[N][xx][yy] = ship;
field[N][xx][yy] = 1;
xx += (dir == 0)-(dir == 2);
yy += (dir == 1)-(dir == 3);
}
} else {
return 1;}


}


function hit(ship) {

boats[ship]-=1;
if (boats[ship]<=0){
say("BOOM!<br />You sunk a ship");}
if (getArraySum(boats) == 0){
drawPlayField(play);
alert("You won the game =D\nPress F5 to restart");
}
}


function getArraySum(array){
  var sum = 0;
  for (var a=0; a<array.length; a++)
    {
    sum += array[a];
    } 
return sum;
}


function say(text){
document.getElementById("output").innerHTML=text;
}


function getCoordinates() {
x=prompt("enter the target's x position",1)-1;
y=prompt("enter the target's y position",1)-1;
}

/**/
