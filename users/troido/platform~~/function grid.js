
function Grid(props){
	this.value=[];
	this.fill=function(val){
		for	(var i=0;i<this.size;i++)
			this.value[i]=val;
	};

	this.fillO=function(con){
		for (var i=0;i<this.size;i++)
			this.value[i]=new con(i%this.width,Math.floor(i/this.width),this.value[i]);
	};

	this.fillFn=function(fn){
		for	(var i=0;i<this.size;i++)
			this.value[i]=fn(i%this.width,Math.floor(i/this.width),this.value[i]);
	};
	this.from2D=function(array2D){
		this.width=array2D.length;
		this.height=array2D[0].length;
		this.size=this.width*this.height;
		for	(var	i=0;i<this.size;i++){
			this.value[i]=array2D[i%this.width][Math.floor(i/this.width)]||0;
		};
	}
	this.to2D=function(){
		var arr=[];
		for (var i=0;i<this.width;i++){
			arr[i]=this.getCol(i);
		}
		return arr;
	};
	this.resize=function(width,height){
		var arr=this.to2D();
		this.width=width;
		this.height=height;
		this.size=width*height;
		for	(var	i=0;i<this.size;i++){
			if (i%this.width>=arr.length){
				this.value[i]=0;
				continue;
			}
			this.value[i]=arr[i%this.width][Math.floor(i/this.width)]||0;
		};
	}
	this.getLine=function(y){
		return	this.value.slice(y*this.width,(y+1)*this.width);
	};
	this.getCol=function(x){
		var	a=[];
		for	(var	i=0;i<this.height;i++)
			a.push(this.get(x,i));
		return	a;
	},

	this.for=function(fn){
		for	(var	i=0;i<this.size;i++)
			fn(i%this.width,Math.floor(i/this.width),this.value[i]);
	};

	this.legit=function(x,y){
		return	(x>=0&&y>=0&&x<this.width&&y<this.height);
	};

	this.get=function(x,y){
		return	(this.legit(x,y)&&this.value[Math.floor(x)+Math.floor(y)*this.width]);
	};

	this.copy=function(){
		var	a=new	Grid();
		for	(x in this)
			a[x]=this[x];
		a.value=this.value.concat();
		return a;
	}

	this.set=function(x,y,val){
		return	(this.legit(x,y)&&(this.value[Math.floor(x)+Math.floor(y)*this.width]=val));
	};
	this.add=function(x,y,val){
		return	(this.legit(x,y)&&(this.value[Math.floor(x)+Math.floor(y)*this.width]+=val));
	};
	this.clear=function(){
		this.value=[];
		this.width=0;
		this.height=0;
	}
	this.fromImageFile=function(filename,callback){
		var img=new Image();
		var grid=this;
		this.clear();
		img.onload=function(){
			var canvas=document.createElement("canvas");
			canvas.width=img.width;
			canvas.height=img.height
			var ctx=canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			var idata=ctx.getImageData(0,0,canvas.width,canvas.height).data;
			//console.log(idata[0],idata[1],idata[2],idata[3],idata[0]<<16|idata[1]<<8|idata[2]);
			for(var i=0;i*4<idata.length;i++)
				grid.value[i]=idata[i*4]<<16|idata[i*4+1]<<8|idata[i*4+2];
			grid.width=canvas.width;
			grid.height=canvas.height;
			grid.size=grid.value.length;
// 			console.log(filename);
// 			var p = 0;
// 			console.log(grid.value[p]);
// 			console.log(idata[p*4],idata[p*4+1],idata[p*4+2],idata[p*4+3]);
// 			console.log(idata[p*4]<<16|idata[p*4+1]<<8|idata[p*4+2]);
			callback&&callback(grid);
		}
		img.src=filename;
	}
	
	for	(i	in	props)
		this[i]=props[i];
	!(this.width&&this.height)&&this.clear();
	!this.size&&(this.size=this.width*this.height);
	this.init&&this.init();
}

