"use strict";

define(["sprite", "rect", "lib/three"], function(sprite, Rect, THREE){


class Render3d {
    
    constructor(map, canvas){
        this.lastUpdate = 0;
        this.map = map;
        this.data = [];
        this.canvas = canvas;
        
        
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.camera = new THREE.PerspectiveCamera(75, 1, 10, 1000);
        
    }
    
    
    draw(viewport){ 
        this.camera.position.set(viewport.origin.x, 26, viewport.origin.y);
        this.camera.rotation.y = -viewport.origin.rot || 0;
        
        var scene = this.map.getData();
        this.renderer.render(scene, this.camera);
        
    }
    
    darken(){
        void(0);
    }
}

return Render3d;

});
