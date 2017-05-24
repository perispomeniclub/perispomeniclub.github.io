function Timer(id,stepsize,count){
 this.start=function(){
  this.first=(new Date()).getTime();
  this.on=1;
  this.update=setInterval( function(timer){timer.step()},this.count,this);
 };
 this.size=stepsize||1000;
 this.count=count||1000;
 this.stop=function(){
  this.running=0;
  clearInterval(this.update);
  return (m=this.get());
 };
 this.output=document.getElementById(id);
 this.draw=function(str){
  this.output.innerHTML=str;
 };
 this.m=this.on=0;
 this.get=function(){
  return (this.on&&((new Date()).getTime()-this.first))+this.m;
 };
 this.step=function(){
  this.draw(Math.round(this.get()/this.size));
 };
 this.reset=function(){
  this.m=0;
  this.first=(new Date()).getTime();
 };
 
}
