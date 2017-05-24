var MapLoader = Class.extend({
    
    width: 0,
    height: 0,
    data: null,
    
    load: function(filename, callback){
        var self = this;
        LoadFile.loadImage(filename, function(img){
            var canvas = document.createElement("canvas");
            self.width = canvas.width = img.width;
            self.height = canvas.height = img.height
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img,0,0);
            self.data = [];
            var idata=ctx.getImageData(0,0,canvas.width,canvas.height).data;
            for(var i=0; i*4<idata.length; i++){
                self.data[i] = idata[i*4]<<16 | idata[i*4+1]<<8 | idata[i*4+2];
            }
            
            callback && callback(self);
        });
    },
    
    // a bit like the forEach function, but both the x and y coordinates are given as arguments to the callback
    // the callback will be executed like callback(value, x, y, mapLoader)
    for2d: function(callback){
        
        for (var i=0, l=this.data.length; i<l; i++){
            callback(this.data[i], i%this.width, (i/this.width)|0, this);
        }
    },
    get: function(x, y){
        return this.data[x+y*this.width];
    },
    getWidth: function(){
        return this.width;
    },
    getHeight: function(){
        return this.height;
    }
});