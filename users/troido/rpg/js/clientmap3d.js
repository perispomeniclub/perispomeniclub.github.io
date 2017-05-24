"use strict"

define(["sprite", "rect", "lib/three"], function(sprite, Rect, THREE){
    

class ClientMap3d {
    
    constructor(resources){
        this.updateNum = 0;
        this.sprites = resources.sprites;
        this.tiles = resources.tiles;
        this.reset();
        
    }
    
    reset(){
        this.drawings = new Map();
        this.cache = new Map();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x8899ff);
        this.scene.fog = new THREE.Fog(0x8899ff, 400, 480);
    }
        
    
    setData(changes){
        if (!changes.length){
            return;
        }
        this.updateNum ++;
        for (var i in changes){
            var change = changes[i];
            if (change.type == "add"){
                var model = this.getCache(change.data)
                this.drawings.set(change.data.id, model);
                this.scene.add(model);
            } else if (change.type == "rm"){
                var model = this.drawings.get(change.id);
                if (changes[i+1] && changes[i+1].type == "add" && changes[i+1].data.id == change.id){
                    // assume movement
                    change = change[i+1];
                    this.model.position.set(change.data.area.x, 0, change.data.area.y);
                    this.drawings.set(change.data.id, this.getCache(change.data));
                    ++i;
                } else {
                    this.scene.remove(model);
                    this.drawings.delete(change.id);
                }
            } else if (change.type == "sprite"){
                this.sprites.makeTiledSprite(change.data.name, change.data.data, this.tiles);
            } else {
                console.error("invalid change type");
            }
        }
    }
    
    getData(){
        return this.scene;
    }
    
        
    getCache(obj){
        
        var area = new Rect(obj.shape);
        var sprite = this.sprites.getSprite(obj.sprite.name || obj.sprite, obj.sprite.type)
        if (sprite.options && sprite.options.texture){
            sprite = this.sprites.getSprite(sprite.options.texture);
        }
        
        var texture = this.cache.get(sprite.img);
        if (!texture){
            texture = new THREE.CanvasTexture(sprite.img);
            texture.format = THREE.RGBAFormat;
            texture.minFilter = THREE.LinearFilter;
            this.cache.set(sprite.img, texture)
        }
        
        var model;
        var shape = sprite.options.shape || 'sprite';
        model = makeShape[shape](texture, area, sprite);
        model.position.add(new THREE.Vector3(area.getX(), sprite.options.z || 0, area.getY()));
        
        return model;
    }
    
    makeFloor(width, height){
        
        var geometry = new THREE.Geometry();
        
        geometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(width, 0, 0),
            new THREE.Vector3(0, 0, height),
            new THREE.Vector3(width, 0, height));

        geometry.faces.push(
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(1, 2, 3));
        
        geometry.faceVertexUvs = [[
            [
                new THREE.Vector2(0, 1),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 1)
            ],[
                new THREE.Vector2(1, 1),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 0)
            ]
        ]];
        
        return geometry;
    }
    
    
    
    close(){
        this.reset();
    }
}



var makeShape = {
    floor: function(texture, area){
        
        var width = area.getWidth();
        var height = area.getHeight();
        
//             texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//             texture.repeat.set(2, 2);
        var material = new THREE.MeshBasicMaterial({map: texture, /*side: THREE.DoubleSide,*/ transparent: true});
        
        var geometry = new THREE.Geometry();
        
        geometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(width, 0, 0),
            new THREE.Vector3(0, 0, height),
            new THREE.Vector3(width, 0, height));

        geometry.faces.push(
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(1, 2, 3));
        
        geometry.faceVertexUvs = [[
            [
                new THREE.Vector2(0, 1),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 1)
            ],[
                new THREE.Vector2(1, 1),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 0)
            ]
        ]];
        
        var model = new THREE.Mesh(geometry, material);
//         model.position.set(area.getX(), 0, area.getY());
        
        return model;
    },
    sprite: function(texture, area, sprite){
        var material = new THREE.SpriteMaterial({map: texture, fog: true});
        var model = new THREE.Sprite(material);
        model.scale.set(area.getWidth(),area.getHeight(),1);
        model.position.set(area.getWidth()*sprite.centerX, area.getHeight()/2, area.getHeight()*sprite.centerY);
        return model;
    },
    box: function(texture, area, sprite){
        
        var zHeight = sprite.options.zHeight || 32;
        var width = area.getWidth();
        var height = area.getHeight();
        var geometry = new THREE.Geometry();
        
        if (sprite.repeat){
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        
            var repeatX = width / sprite.sourceArea.getWidth();
            var repeatY = height / sprite.sourceArea.getWidth();
            var repeatZ = zHeight / sprite.sourceArea.getHeight();
        } else {
            var repeatX = 1;
            var repeatY = 1;
            var repeatZ = 1;
        }
        
        var material = new THREE.MeshBasicMaterial({map: texture, transparent: true/*, side: THREE.DoubleSide*/});
        
        // make a box. I want to control the Uv's myself
    
        geometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(width, 0, 0),
            new THREE.Vector3(0, 0, height),
            new THREE.Vector3(width, 0, height),
            new THREE.Vector3(0, zHeight, 0),
            new THREE.Vector3(width, zHeight, 0),
            new THREE.Vector3(0, zHeight, height),
            new THREE.Vector3(width, zHeight, height));

        geometry.faces.push(
            new THREE.Face3(0, 1, 2), // underside
            new THREE.Face3(2, 1, 3),
            new THREE.Face3(4, 6, 5), // upperside
            new THREE.Face3(5, 6, 7),
            new THREE.Face3(6, 2, 7), // south
            new THREE.Face3(7, 2, 3),
            new THREE.Face3(4, 5, 0), // north
            new THREE.Face3(0, 5, 1),
            new THREE.Face3(4, 0, 6), // west
            new THREE.Face3(6, 0, 2),
            new THREE.Face3(5, 7, 1), // east
            new THREE.Face3(1, 7, 3));
        
        geometry.faceVertexUvs = [[
            [
                new THREE.Vector2(0, repeatY), // under
                new THREE.Vector2(repeatX, repeatY),
                new THREE.Vector2(0, 0),
            ],[
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatX, repeatY),
                new THREE.Vector2(repeatX, 0),
            ],[
                new THREE.Vector2(0, repeatY), // upper
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatX, repeatY),
            ],[
                new THREE.Vector2(repeatX, repeatY),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatX, 0),
            ],[
                new THREE.Vector2(0, repeatZ), // south
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatX, repeatZ),
            ],[
                new THREE.Vector2(repeatX, repeatZ),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatX, 0),
            ],[
                new THREE.Vector2(0, repeatZ), // north
                new THREE.Vector2(repeatX, repeatZ),
                new THREE.Vector2(0, 0),
            ],[
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatX, repeatZ),
                new THREE.Vector2(repeatX, 0),
            ],[
                new THREE.Vector2(0, repeatZ), // west
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatY, repeatZ),
            ],[
                new THREE.Vector2(repeatY, repeatZ),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatY, 0),
            ],[
                new THREE.Vector2(0, repeatZ), // east
                new THREE.Vector2(repeatY, repeatZ),
                new THREE.Vector2(0, 0),
            ],[
                new THREE.Vector2(0, 0),
                new THREE.Vector2(repeatY, repeatZ),
                new THREE.Vector2(repeatY, 0),
            ]
        ]];
        
        var model = new THREE.Mesh(geometry, material);
//         model.position.set(area.getX(), 0, area.getY());
        return model;
    }
        
}

return ClientMap3d;

});
