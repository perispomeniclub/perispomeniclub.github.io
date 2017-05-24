 

//var view = {x:0,t:0,z:0,Thx:0,Thy:0,Thz:0,x0:1,x1:0,x2:0,y0:0,y1:1,y2:0,z0:0,z1:0,z2:1};
var points, polygon;

function start(){

	x=100;
	y=100;
	z=0;
	pitch=0;
	yaw=0;
	roll=0;
	
	view=new ViewPoint();
	view.setPos(x,y,z);
	view.setDir(roll,pitch,yaw);
	
	mouselock=0;

	makeMap();


	drawn=new Array();
	visible=new Array();

	xview=new Array();
	yview=new Array();
	zview=new Array();

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

	update(0);
}


function makeMap(){



	point = new Array(
		[10,10,-10],[10,50,-10],[100,50,-10],[100,10,-10],[10,10,30],[10,50,30],[100,50,30],[100,10,30],
		[180,200,0],[220,200,0],[200,180,0],[200,220,0],[200,200,-20],[200,200,20],
		[100,150,0],[100,200,0],[100,300,0],
		[200,200,0],[250,250,0],[300,300,0],[350,350,0],[400,400,0],[450,450,0],[500,500,0],
		[500,0,0]
	);
	var floor = point.length

	lines=new Array([0,1,2,3,0,4,5,6,7,4],[1,5],[2,6],[3,7],
	[8,9],[10,11],[12,13],
	[14,15],["#0000FF",14,16],
	17,18,19,20,21,22);

	for (i=0;i<lines.length;i++){
		if (lines[i].length==undefined)
			lines[i]=[lines[i]];
		lines[i].outline=1;
		lines[i].fill=0;
	}

	triangle=new Array(["#FF0000",0,1,2],["#FF0000",0,2,3],["#0000FF",0,1,5,4],["#00FF00",0,3,7,4]);
	
	polygon=lines.concat(triangle)
	
	function addPoly(array,color,outline){
	
		var val = new Array(color);
		//val.color=color;
		//val.outline=outline;
		
		for (var i=0;i<array.length;i++){
			var a = point.push(array[i]);
			val.push(a)
		}
		polygon.push(val);
	//	alert(polygon);
	}
	function generateFloor(array2d,scl){
		function createNoise(array){
			for (var i=0;i<(array.length*array[0].length/50);i++){
				var a=Math.random()*12;
				var x=Math.random()*array.length;
				var y=Math.random()*array[0].length;
				var h=20*Math.random();
				for (var j=Math.max(0,Math.round(x-a));j<Math.min(array.length,x+a);j++){
					for (var k=Math.max(0,Math.round(y-a));k<Math.min(array[0].length,y+a);k++){
						if (get_radius(j-x,k-y)<a)
							array[j][k]+=h;
					}	
				}
			}
		}
		
		function drawFloor(array,scl,xmin,ymin){
			//var sta = point.length;
			var d=[];
			for (var i=0;i<array.length;i+=1){
				var c// = sta;
//				var b=polygon.push([])
				for (var j=0;j<array[0].length;j+=1){
					var a=point.push([i*scl+xmin,j*scl+ymin,array[i][j]])-1;
//					polygon[b-1][j]=a-1;
					if (j){
						var b=polygon.push([a,c]);
						polygon[b-1].outline=1;
					}
					if (i){
						var b=polygon.push([a,d[j]]);
						polygon[b-1].outline=1;
					}
					d[j]=a;
					c=a;
				}
//				polygon[b-1].outline=1;
			}
		}
		createNoise(array2d);
		drawFloor(array2d,scl,0,300)
	}
	
	var a=[];
	for (var i=0;i<30;i++){
		a[i]=[];
		for (var j=0;j<30;j++){
			a[i][j]=0;
		}
	}
	generateFloor(a,10);
	//document.getElementById("test").innerHTML=polygon;
	//alert(point.length);
	//addPoly([[0,0,0],[0,10,0],[10,0,0],[10,10,0]],"#FFFF00",0)
	
	for (var i=100;i<200;i+=20){
		for (var j=0;j<100;j+=20){
	//		addPoly([[i,j,-10]/*,[i+10,j,-10],[i+10,j+10,-10],[i,j+10,-10]*/],"#FFFF00",0);
		}
	}
	
	function makeValid(pol){
		for (var i=0;i<pol.length;i++){
			if (pol[i].outline==undefined)
				pol[i].outline=0;
			if (pol[i].fill==undefined)
				pol[i].fill=1;
			if (pol[i].color==undefined){
				if (pol[i][0].length!=undefined)
					pol[i].color=pol[i].shift();
				else
					pol[i].color="#000000";
			}
		}
		return pol;
	}
	polygon = makeValid(polygon);

}


function update(e){
	move(e);

	redraw();
}

{ // mouselook
$(document).ready(function(){
	$(document).mousemove(function(e){
		if (mouselock){
//			alert("hi");
			pitch=P0+(e.pageY-My)/40;
			yaw=Y0+(e.pageX-Mx)/40;
			redraw();
		}
	});

	$(document).mousedown(function(e){
		mouselock=1;
		Mx=e.pageX;
		My=e.pageY;
		P0=pitch;
		Y0=yaw;
//		alert(""+Mx+"     "+My);
	});

	$(document).mouseup(function(){
		mouselock=0;
	});
	$(document).mouseleave(function(){
		$(document).mouseup();
	});
//	$('#perspective').css({'-webkit-perspective':'150'});
//	$('#item').css('-webkit-transform', 'rotateX(45deg)');	
});
}

function redraw(){
	view.setPos(x,y,z);
	view.setDir(roll,pitch,yaw);
	newPoint=calc3d(view,point,1);

	draw2d();
	draw3d(newPoint,polygon);
	if (DOMenabled){
		drawDom(newPoint,polygon);
	}
//	drawCSS3();
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
	if (keynum==32){z+=5;e.preventDefault()}
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
		y=prompt('y position',y);
		z=prompt('z position',z);
	}

	if (keychar=="a"){yaw-=Math.PI/16;}
	if (keychar=="d"){yaw+=Math.PI/16;}
	if (keychar=="r"){pitch+=Math.PI/16;}
	if (keychar=="f"){pitch-=Math.PI/16;}
	if (keychar=="c"){roll+=Math.PI/16;}
	if (keychar=="v"){roll-=Math.PI/16;}

	if (keychar=='t'){
		alert('x: '+x+'\ny: '+y+'\nz: '+z+'\ndirection: '+yaw+'\npitch: '+pitch)
	}

}


/*function setViewDirXYZ(xto,yto,zto,xup,yup,zup){
	xto = Math.cos(Thz)*Math.cos(Thy);
	yto = Math.sin(Thz)*Math.cos(Thy);
	zto = Math.sin(Thy);
	
	xup = Math.cos(Thy)*Math.cos(Thx)
	yup = -Math.cos(Thx)*Math.sin(Thy)*Math.cos(Thz)+Math.sin(Thx)*Math.sin(Thz)
	zup = -Math.cos(Thx)*Math.sin(Thy)*Math.sin(Thz)+Math.sin(Thx)*Math.cos(Thz)
	xup = cos(y)*cos(x)
	yup = -cos(x)*sin(y)*cos(z)+sin(x)*sin(z)
	zup = -cos(x)*sin(y)*sin(z)+sin(x)*cos(z)
	
//	xup*yup= Math.cos(Thy)*Math.cos(Thx)*Math.sin(Thx)*Math.sin(Thz) - Math.cos(Thy)*Math.cos(Thx)*Math.cos(Thx)*Math.sin(Thy)*Math.cos(Thz)
	yup*zup = sin(z)*cos(z)*(cos(x)*cos(x)*sin(y)*sin(y) + sin(x)*sin(x)) - cos(x)*sin(x)*sin(y)
	yup^2= cos2(x)*sin2(y)*cos2(z) -2*(sin(x)*cos(x)*sin(y)*sin(z)*cos(z))+ sin2(x)*sin2(z)
	
	this.x0 = xto;
	this.x1 = yto;
	this.x2 = - zto;

	this.y0 = Math.sin(Thx)* Math.sin(Thy)* Math.cos(Thz)- Math.cos(Thx)* Math.sin(Thz);
	this.y1 = Math.sin(Thx)* Math.sin(Thy)* Math.sin(Thz)+ Math.cos(Thx)* Math.cos(Thz);
	this.y2 = Math.sin(Thx)* Math.cos(Thy);
	y0 = sin(x)* sin(y)* cos(z)- cos(x)* sin(z);
	y1 = sin(x)* sin(y)* sin(z)+ cos(x)* cos(z);
	y2 = sin(x)* cos(y);

	this.z0 = -yup
	this.z1 = -zup
	this.z2 = xup
	
}*/


function ViewPoint(){
	this.x=0;
	this.t=0;
	this.z=0;
	this.Thx=0;
	this.Thy=0;
	this.Thz=0;
	this.x0=1;
	this.x1=0;
	this.x2=0;
	this.y0=0;
	this.y1=1;
	this.y2=0;
	this.z0=0;
	this.z1=0;
	this.z2=1;
	function setViewPos(x,y,z){
		this.x=x;
		this.y=y;
		this.z=z;
	}
	function setViewDir(Thx,Thy,Thz){
		this.Thx=Thx;
		this.Thy=Thy;
		this.Thz=Thz;
		this.x0 = Math.cos(Thy)*Math.cos(Thz);
		this.x1 = Math.cos(Thy)*Math.sin(Thz);
		this.x2 = - Math.sin(Thy);

		this.y0 = Math.sin(Thx)* Math.sin(Thy)* Math.cos(Thz)- Math.cos(Thx)* Math.sin(Thz);
		this.y1 = Math.sin(Thx)* Math.sin(Thy)* Math.sin(Thz)+ Math.cos(Thx)* Math.cos(Thz);
		this.y2 = Math.sin(Thx)*Math.cos(Thy);

		this.z0 = Math.cos(Thx)*	Math.sin(Thy)*	Math.cos(Thz)- Math.sin(Thx)* Math.sin(Thz);
		this.z1 = Math.cos(Thx)* Math.sin(Thy)* Math.sin(Thz)- Math.sin(Thx)* Math.cos(Thz);
		this.z2 = Math.cos(Thx)* Math.cos(Thy);
	}

	this.setPos=setViewPos;
	this.setDir=setViewDir;
}


function calc3d(vp,points,size){
/*
x+=32*round(lengthdir_x(1,point_direction(x,y,player.x,player.y)));
y+=32*round(lengthdir_y(1,point_direction(x,y,player.x,player.y)));
*/
	var view=new Array();
	for (var a=0;a<point.length;a++){
		
		dx = vp.x0* (point[a][0]-vp.x) + vp.x1* (point[a][1]-vp.y) + vp.x2*( point[a][2]-vp.z);
		dy = vp.y0* (point[a][0]-vp.x) + vp.y1* (point[a][1]-vp.y) + vp.y2* (point[a][2]-vp.z);
		dz = vp.z0* (point[a][0]-vp.x) + vp.z1* (point[a][1]-vp.y) + vp.z2* (point[a][2]-vp.z);
		
		view[a]={x:(-dy*size/Math.abs(dx)),y:(-dz*size/Math.abs(dx)),visible:(dx>0)}


	}
	triangleDist();
	return view;
}


function triangleDist(){
//var c=0;
	for (var a=0; a<polygon.length; a++){
		polygon[a].d=0;
		
		for (var b=0; b<polygon[a].length; b++){
			//if (c>4940)
			//alert(c+":     "+point[polygon[a][b]]+"            "+polygon[a][b]+"            "+a+", "+b);
			//c++;
			polygon[a].d+=point_distance_3d(x,y,z,point[polygon[a][b]][0],point[polygon[a][b]][1],point[polygon[a][b]][2]);}
		polygon[a].d /= polygon[a].length;
		/*triangle[a][4]= mean([	point_distance_3d(x,y,z,point[triangle[a][1]][0],point[triangle[a][1]][1],point[triangle[a][1]][2]),
								point_distance_3d(x,y,z,point[triangle[a][2]][0],point[triangle[a][2]][1],point[triangle[a][2]][2]),
								point_distance_3d(x,y,z,point[triangle[a][3]][0],point[triangle[a][3]][1],point[triangle[a][3]][2])]);*/
	}
}

{ // CSS3

function drawCSS3(){
	var fr=document.getElementById("perspective")
	var oo=document.getElementById("item")
	
//	ss$('#perspective').css({'-webkit-perspective':''+zc});
//	$('#perspective').css({'-webkit-transform-style':'flat'});
//	$('#perspective').css({'-webkit-perspective':''+zc});
//	$('#perspective').css({'-webkit-perspective-origin':''+(-xc)+' '+(yc)});
//	$('#item').css({'-webkit-transform':'translate3d('+(xc)+'px,'+(-yc)+'px,'+(-zc)+'px)'+'rotateX(45deg)'+'rotateZ('+(-yaw)+')'}); //'scale3d('+100/(500-x)+','+100/(500-x)+','+10/(5000-x)+')'});
//	$('#perspective').css({'-webkit-transform':'translateZ('+(-x)+'px)'});
	
//	$('#item').css({'-webkit-transform': 'rotateX(45deg)translate(500px,-300px)'});	


}

}


 // Canvas
function draw2d(){
	var ctx=document.getElementById("canvas").getContext("2d");
	ctx.clearRect(0,0,width,height);
	ctx.strokeRect(0,0,width,height);


	for (var a=0;a<polygon.length;a++){

		if (polygon[a].outline)
			ctx.strokeStyle=polygon[a].color;
		else
			ctx.fillStyle=polygon[a].color;
		ctx.beginPath();
		ctx.moveTo(point[polygon[a][0]][0],point[polygon[a][0]][1]);
		for (var i=1; i<polygon[a].length; i++)
			ctx.lineTo(point[polygon[a][i]][0],point[polygon[a][i]][1]);
		//ctx.lineTo(b*xview[polygon[a][3]]+d,c*yview[polygon[a][3]]+e);
		//ctx.closePath();
		if (polygon[a].outline)
			ctx.stroke();
		else
			ctx.fill();
	}

	ctx.beginPath();
	ctx.fillStyle="blue";
	ctx.arc(x,y,5,0,2*Math.PI);
	ctx.fill();
	ctx.moveTo(x,y);
	ctx.lineTo(x+20*Math.cos(yaw),y+20*Math.sin(yaw))
	ctx.stroke();

}


function draw3d(points,polygon){

	var b=-width/(Math.PI);
	var c=height/(Math.PI);
	var d=width/2;
	var e=height/2;

	var ctx2=document.getElementById("canvas2").getContext("2d");
	ctx2.clearRect(0,0,width,height);


	var arr=polygon.sortIndexObj();

	for (var a=0;a<polygon.length;a++){
		var g=0;
		for (var i=1;i<polygon[arr[a]].length;i++)
			g+=!points[polygon[arr[a]][i]].visible;
		if (g)
			continue;
		//if (visible[polygon[arr[a]][1]]&&visible[polygon[arr[a]][2]]&&visible[polygon[arr[a]][3]]){
		if (polygon[arr[a]].outline)
			ctx2.strokeStyle=polygon[arr[a]].color;
		else
			ctx2.fillStyle=polygon[arr[a]].color;
		ctx2.beginPath();
		ctx2.moveTo(b*points[polygon[arr[a]][0]].x+d,c*points[polygon[arr[a]][0]].y+e);
		for (var f=1; f<polygon[arr[a]].length; f++)
			ctx2.lineTo(b*points[polygon[arr[a]][f]].x+d,c*points[polygon[arr[a]][f]].y+e);
		if (polygon[arr[a]].outline)
			ctx2.stroke();
		else
			ctx2.fill();
	}

	 // draw background and crosshairs(?)
	ctx2.strokestyle="#000000";
	ctx2.strokeRect(0,0,width,height);
	ctx2.beginPath();
	ctx2.moveTo(d,e+5);
	ctx2.lineTo(d,e-5);
	ctx2.moveTo(d+5,e);
	ctx2.lineTo(d-5,e);
	ctx2.stroke();
	
	
	/*ctx2.beginPath();
	for (var i=0;i<lines.length;i++){
		var g=0;
		for (var j=1;j<lines[i].length;j++)
			g+=!(visible[lines[i][j]]);
		if (g)
			continue;
		ctx2.moveTo(b*xview[lines[i][0]]+d,c*yview[lines[i][0]]+e);
		for (var j=1;j<lines[i].length;j++)
			ctx2.lineTo(b*xview[lines[i][j]]+d,c*yview[lines[i][j]]+e);
	}
	ctx2.stroke();/**/

}




 // DOM playfield
function drawDom(points, polygon){
	for (var a=0; a<dwidth; a++){
		for (var b=0; b<dheight; b++){
			field[a][b]=0;
		}
	}


	var b=-dwidth/(Math.PI);
	var c=dheight/(Math.PI);
	var d=dwidth/2;
	var e=dheight/2;
	
	var arr=polygon.sortIndexObj();
	
	for (var a=0;a<polygon.length;a++){
		var g=0;
		for (var i=1;i<polygon[arr[a]].length;i++)
			g+=!points[polygon[arr[a]][i]].visible;
		if (g)
			continue;
		//if (visible[polygon[arr[a]][1]]&&visible[polygon[arr[a]][2]]&&visible[polygon[arr[a]][3]]){
		
		var xprevious = b*points[polygon[arr[a]][0]].x+d,
			yprevious = c*points[polygon[arr[a]][0]].y+e;
		for (var f=1; f<polygon[arr[a]].length; f++){
			var x = b*points[polygon[arr[a]][f]].x+d,
				y = c*points[polygon[arr[a]][f]].y+e;
			fieldArrayLine(xprevious, yprevious, x, y);
			xprevious = x;
			yprevious = y;
		}
	}
	
// 	for (var a=0;a<line1.length;a++){
// 		if (visible[line1[a]]&&visible[line2[a]]){
// 			fieldArrayLine(b*xview[line1[a]]+d,c*yview[line1[a]]+e,b*xview[line2[a]]+d,c*yview[line2[a]]+e,1);
// 		}
// 	}

	//alert("succes");
	drawPlayfieldDOM();
}


function fieldArrayLine(x1,y1,x2,y2,val){

	var xx=x1;
	var yy=y1;

	imag_set_radius(x2-x1,y2-y1,1);

	for (var a=0; a<=get_radius(x2-x1,y2-y1); a++){

		if (xx>=0 && yy>=0 && xx<dwidth && yy<dheight)
			field[Math.floor(xx)][Math.floor(yy)]=Math.round(r_r*1.4+1)+3*Math.round(r_i*1.4+1)+1;
		xx+=r_r;
		yy+=r_i;
	}
}


function drawPlayfieldDOM(){

	var p=document.getElementById("playfield")

	var pl="|";

	for (var a=0;a<dheight;a++){
		for (var b=0;b<dwidth;b++){
			if (field[b][a]){
				pl+=linedir[field[b][a]]+" ";
			} else {
				pl+="  ";
			}
		}
	pl+="|<br />|";
	p.innerHTML=pl;
	}
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
			}
		}
	}else {
		DOMenabled=0;
		document.getElementById("playfield").innerHTML="";
		field=0;
	}
}


/**/

