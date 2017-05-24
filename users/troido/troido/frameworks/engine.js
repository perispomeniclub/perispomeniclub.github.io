engine={
	games:[],
	ext:{extensions:[],
		load:[],
		step:[],
	},
	events:{
		create:[],
		step:[],
	},
	load:function(){
		//for (var i=0,l=engine.extensions.length;i<l;i++){
			//engine.extensions[i].load();
		//}
		for (var i=0,l=engine.games.length;i<l;i++){
			engine.games[i].load()
		}
	},
	triggerEvent:function(event){
		for (var i=0;i<engine.games.length;i++){
			engine.games[i].room.trigger(event);
		}
	},
	
};

function Game(content){
	this.id=engine.games.push(this)-1;
	this.content=content;
	this.global={};
	global=this.global;
	
	this.room={
		trigger:function(string){eval("for (var i=0,a=this.events."+string+",l=a.length;i<l;i++) a[i].execute(a[i].ent.events."+string+");")},
		instances:[],
		events:engine.events,
		instanceCreate:function(ent,x,y){
			var inst={ent:ent,x:x,y:y}
			inst.id= this.instances.push(inst)-1;
			//inst.events={}
			for (x in ent.events){
				//inst.events[x]=ent.events[x];
				if (this.events[x]){
					//alert(x+":")
					//alert(this.events[x])
					this.events[x].push(inst);
				}
			}
			inst.drawSelf=function(ctx){
				//alert(this.ent.sprite)
				ctx.drawImage(/*document.getElementsByTagName("img")[0],0,0)/*/this.ent.sprite.image,this.x,this.y);
			}
			inst.execute=function(event){this.event=event; this.event()}
			//inst.events=ent.events;
			inst.execute(inst.ent.events.create);
		}
	};
	this.makeNames=function(){
		var b=this.content.resources
		for (x in b){
			for (var i=0, a=b[x], l=a.length; i<l; i++)
				setName(a[i],a[i].name);
		}
		for (var i=0;i<b.objects.length;i++){
			var c=b.objects[i];
			eval("c.sprite="+c.spriteName);
		}
	}
	this.load=function(){
		this.canvas=document.getElementById(this.content.canvasId);
		this.ctx=canvas.getContext("2d");
		this.playground=document.getElementById(this.content.playDiv);
		//alert(this.content.playDiv);
		var imgs=document.createElement("div");
		this.playground.appendChild(imgs);
		for (var i=0,a=this.content.resources.sprites,l=a.length;i<l;i++){
			var img=new Image;
			//alert(a[i].src)
			img.src=a[i].src;
			a[i].image=img;
			imgs.appendChild(img)
		}
		this.currentRoom=this.content.resources.rooms[0];
		this.roomstart(this.currentRoom);
		// start
	}
	this.step=function(){
		//for (
		this.ctx.fillStyle=this.room.bgColor
		this.ctx.fillRect(0,0,this.room.width,this.room.height);
		this.ctx.fillStyle="#FFFFFF";
		engine.ctx=this.ctx
		this.room.trigger("step");
		this.ctx.fillStyle="#FFFFFF";
		for (var i=0,a=this.room.instances,l=a.length;i<l;i++)
			a[i].drawSelf(this.ctx);
		
	}
	this.roomstart=function(room){
		//this.events={};
		//this.events.create=[];
		this.room.width=room.settings.width;
		this.room.height=room.settings.height;
		this.canvas.width=room.settings.width;
		this.canvas.height=room.settings.height;
		this.room.bgColor=room.backgrounds.backgroundColor;
		this.room.creation=room.creationCode;
		this.room.creation();
		this.update=setInterval("engine.games["+this.id+"].step()",1000/room.speed);
		//for (var i=0,l=room.instances.length;i<l;i++){
		//	if room.instances[i]
		//for (var i=0,l=room.instances.length;i<l;i++)
		//	room.instances[i].create()
		//room starting
	}
	this.makeNames();
}
/*
function instanceCreate(ent,x,y){
	inst={ent:ent,x:x,y:y}
	inst.id= this.instances.push(inst)-1;
	for (x in ent)
		inst[x]=ent[x];
	inst.events.create();
}*/



window.onload=function(){engine.load()};

{
	function objlength(obj){
		var a=0;
		for (var x in content) a++;
		return a;
	}
	function setName(obj,name){ eval(name+"=obj;") }
}