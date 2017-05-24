
function imag_multiply(a,b,c,d){
	// with: (a+bi)*(c+di)
	r_r=a*c-b*d;
	r_i=a*d+b*c;
	return r_r;
}

function imag_divide(a,b,c,d){
	// with: (a+bi)/(c+di) = (a+bi)(c-di)/(c^2+d^2) = (ac+bd)/(c^2+d^2)+(-ad+bc)/(c^2+d^2)i
	var e=c*c+d*d;
	r_r=(a*c+b*d)/e;
	r_i=(-a*d+b*c)/e;
	return r_r;
}

function imag_set_radius(a,b,rad){
	var c=rad/Math.sqrt(a*a+b*b);
	r_r=a*c;
	r_i=b*c;
	return r_r;
}

function get_radius(a,b){
	return Math.sqrt(a*a+b*b);
}

function get_radius_3d(a,b,c){
	return Math.sqrt(a*a+b*b+c*c);
}

function get_radius_4d(a,b,c,d){
	return Math.sqrt(a*a+b*b+c*c+d*d);
}

function imag_from_polar(rad,phi){
	r_r=rad*Math.cos(phi);
	r_i=rad*Math.sin(phi);
	return r_r;
}

function imag_expo(a,b,n){
	// with: (a+bi)^n
	var c=Math.pow(a*a+b*b,n/2);
	var d=n*Math.atan2(b,a);
	r_r=c*Math.cos(d);
	r_i=c*Math.sin(d);
}

function quat_multiply(a,b,c,d,e,f,g,h){
	//with: (a+bi+cj+dk)*(e+fi+gj+hk)
	r_r=a*e-b*f-c*g-d*h;
	r_i=a*f+b*e+c*h-d*g;
	r_j=a*g-b*h+c*e+d*f;
	r_k=a*h+b*g-c*f+d*e;
	return r_r;
}

function quat_divide(a,b,c,d,e,f,g,h){
	quat_multiply(a,b,c,d,e,-f,-g,-h);
	var a=e*e+f*f+g*g+h*h;
	r_r/=a;
	r_i/=a;
	r_j/=a;
	r_k/=a;
	return r_r;
}

function quat_set_radius(a,b,c,d,rad){
	var e=rad/Math.sqrt(a*a+b*b+c*c+d*d);
	r_r=a*e;
	r_i=b*e;
	r_j=c*e;
	r_k=d*e;
	return r_r;
}

Array.prototype.sortIndex = function(){
	// should sort the array on the height of the values, then return an array with the sorted indices
	var array=[this[0]];
	var indices = [0];
	for (var a=1; a<this.length; a++)
	{
		var b = 0;
		while (this[a]<array[b])
			b++;
		array.splice(b,0,this[a]);
		indices.splice(b,0,a);
	}
	return indices;
}

Array.prototype.sortIndex2D = function(c)
{
	// should sort the array on the height of the values, then return an array with the sorted indices
	var array=[];
	var indices = [0];
	for (var a=0; a<this.length; a++)
		array[a] = this[a][c];

	for (var a=1; a<this.length; a++)
	{
		var b = 0;
		while (this[a][c]<array[b])
			b++;
		array.splice(b,0,this[a][c]);
		indices.splice(b,0,a);
	}
	return indices;
}


Array.prototype.sortIndexObj = function()
{
	var array=[];
	var indices = [0];
	for (var a=0; a<this.length; a++)
		array[a] = this[a].d;

	for (var a=1; a<this.length; a++)
	{
		var b = 0;
		while (this[a].d<array[b])
			b++;
		array.splice(b,0,this[a].d);
		indices.splice(b,0,a);
	}
	return indices;
}


Array.prototype.switchN = function(a,b)
{
	var c = this[a];
	this[a]=this[b];
	this[b]=c;

}


function point_distance_3d(x,y,z,a,b,c){
	return Math.sqrt((x-a)*(x-a)+(y-b)*(y-b)+(z-c)*(z-c))
}


function mean(array){
	var b = 0;
	for (var a=0; a<array.length; a++)
		{
		b+=array[a];
		}
	b/=array.length;
	return b;
}