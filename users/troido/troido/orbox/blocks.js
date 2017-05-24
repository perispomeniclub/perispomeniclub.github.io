var blocks={
	block:{
		solid:true,
		tx:3,
	},
	end:{
		touch:function(){end();return 1},
		tx:1,
	},
	cornerTL:{
		touch:function(x,y,vx,vy){if (vy>0||vx>0){player.vy=-vx;player.vx=-vy;}else return 1;},
		tx:6,
	},
	cornerTR:{
		touch:function(x,y,vx,vy){if (vy>0||vx<0){player.vy=vx;player.vx=vy;}else return 1;},
		tx:7,
	},
	cornerBR:{
		touch:function(x,y,vx,vy){if (vy<0||vx<0){player.vy=-vx;player.vx=-vy;}else return 1;},
		tx:4,
	},
	cornerBL:{
		touch:function(x,y,vx,vy){if (vy<0||vx>0){player.vy=vx;player.vx=vy;}else return 1;},
		tx:5,
	},
	stop:{
		touch:function(){return 2},
		tx:2,
		ty:1,
	},
	clickerH:{tx:3,ty:1,
		touch:function(x,y){
			setNum(x+1,y,0);
			setNum(x-1,y,0);
			setNum(x,y,1);
		}
	},
	clickerV:{tx:4,ty:1,
		touch:function(x,y){
			setNum(x,y+1,0);
			setNum(x,y-1,0);
			setNum(x,y,1);
		}
	},
	teleC:{
		touch:function(x,y,vx,vy,arg){
			player.x=Number(arg[0])||0;
			player.y=Number(arg[1])||0;
			return 3;
		},
		tx:1,
		ty:1
	},
	teleM:{
		touch:function(x,y,vx,vy,arg){
			player.x=Number(arg[0])||0;
			player.y=Number(arg[1])||0;
			return 3;
		},
		ty:1
	},
	teleB:{
		touch:function(x,y,vx,vy,arg){
			player.x=Number(arg[0])||0;
			player.y=Number(arg[1])||0;
			return 3;
		},
		tx:7,
		ty:1
	},
	
}
