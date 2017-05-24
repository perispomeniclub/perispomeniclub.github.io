function	Grid(props){
	this.value=[];
	this.fill=function(val){
		for	(var	i=0;i<this.size;i++)
			this.value[i]=val;
	};

	this.fillO=function(con){
		for	(var	i=0;i<this.size;i++)
			this.value[i]=new	con(i%this.width,Math.floor(i/this.width),this.value[i]);
	};

	this.fillFn=function(fn){
		for	(var	i=0;i<this.size;i++)
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
		for		(x	in	this)
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
	for	(i	in	props)
		this[i]=props[i];
	!this.size&&(this.size=this.width*this.height);
	this.init&&this.init();
}
//alert("grid	is	syntax	error	free");
