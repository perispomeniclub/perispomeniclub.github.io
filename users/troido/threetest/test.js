"use strict";


function onDomLoad(){
    
    
    
    
    var map = document.createElement("canvas");
    map.width = 200;
    map.height = 200;
    var mapctx = map.getContext("2d");
    mapctx.drawImage(document.getElementById("map"), 0, 0);
    
    document.getElementById("sideinfo").appendChild(map);
    
    var data = [];
    var idata = mapctx.getImageData(0,0,map.width,map.height).data;
    for(var i=0; i*4<idata.length; i++){
        data[i] = idata[i*4]<<16 | idata[i*4+1]<<8 | idata[i*4+2];
    }
    
    
    
    var renderCanvas = document.getElementById("threecanvas")
    var renderer = new THREE.WebGLRenderer({canvas: renderCanvas});
    renderer.setSize(window.innerWidth*0.8, window.innerHeight);
    
    renderer.shadowMapEnabled = true;
    
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.8 / window.innerHeight, 0.1, 1000);
    
    camera.position.set(10, 40, 65);
    
    
    var yaw=0, pitch=0, roll=0;
    
    
    
    var scene = new THREE.Scene();
    var faceMaterial = new THREE.MeshLambertMaterial({color: 0x44FF22, wireframe: false, shading: THREE.SmoothShading});
    
    var faceGeometry = new THREE.Geometry();
    
    var w = map.width;
    
    for (var j=0; j<map.height; j+=1){
        for (var i=0; i<map.width;i+=1){
            var l = faceGeometry.vertices.length;
            faceGeometry.vertices.push(new THREE.Vector3(i, (data[i + j*map.width]>>16)/4, j));
            if (i && j){
                faceGeometry.faces.push(new THREE.Face3(l-1-w, l-1, l-w),
                                        new THREE.Face3(l-w, l-1, l));
            }
        }
    }
    
    faceGeometry.computeFaceNormals();
    faceGeometry.computeVertexNormals();
    
    var mesh = new THREE.Mesh(faceGeometry, faceMaterial);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    
    var cone = new THREE.CylinderGeometry(0, 4, 8, 24);
    var material = new THREE.MeshLambertMaterial( { color: 0x008800 } );
    var needles = new THREE.Mesh( cone, material );
    needles.position.y = 7;
    var cyl = new THREE.CylinderGeometry(1,1,5,12);
    var bark = new THREE.MeshLambertMaterial({color: 0x993300});
    var stem = new THREE.Mesh(cyl, bark);
    stem.position.y = 2.5;
    
    var fir = new THREE.Object3D();
    fir.add(stem);
    fir.add(needles);
    fir.scale.set(.5, .5, .5);
    
    for (var i=0; i<50; i++){
        var spar = fir.clone();
        spar.position.x = Math.random()*map.width|0;
        spar.position.z = Math.random()*map.height|0;
        spar.position.y = (data[spar.position.x + spar.position.z*map.width]>>16)/4;
        spar.traverse(function(obj){
            obj.castShadow = true;
        });
        scene.add(spar);
    }
    
//     scene.add(fir);
    
    /* */
    var light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(200, 500, -100);
    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowCameraLeft = -300;
    light.shadowCameraRight = 0;
    light.shadowCameraTop = 100;
    light.shadowCameraBottom = -200;
    light.shadowCameraVisible = true;
    scene.add(light);
    /*/
    var ball = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 32), new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
    ball.position.set(50, 50, 50);
    scene.add(ball);
    
    var pointLight = new THREE.PointLight( 0xffffff);
    pointLight.position.set( 50, 50, 50 );
    scene.add(pointLight );
    /* */
    
    scene.add(new THREE.AmbientLight(0x222222));
    
    
    
    var input = new InputManager();
    
    var render = function(time){
        
        yaw -= input.get("yaw")/30;
        pitch -= input.get("pitch")/30;
        roll += input.get("roll")/20
        
        camera.lookAt((new THREE.Vector3(Math.cos(yaw)*Math.cos(pitch), Math.sin(pitch), Math.sin(yaw)*Math.cos(pitch))).add(camera.position));
        camera.up.y = Math.cos(pitch);
        
        
        camera.position.x += 1*(input.get("forward") * Math.cos(yaw) - input.get("right") * Math.sin(yaw));
        camera.position.y += 1*input.get("up"); 
        camera.position.z += 1*(input.get("right") * Math.cos(yaw) + input.get("forward") * Math.sin(yaw));
        
        input.flush();
        
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();

}


addEventListener("load", onDomLoad);