/*
Author: Nicola Giaconi
Date: 19 Oct 2018
Description: Base for WebPage for ASP Project
*/

////////////////////////////////////////////////////
//////////////  Setup environment  /////////////////
////////////////////////////////////////////////////
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("white");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,
                                           0.1, 1000);
// create scene and camera
camera.position.z = 10;
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set( 1.5,1,1 );
scene.add(light);
const clock = new THREE.Clock();

////////////////////////////////////////////////////
////////  Global customizable parameters  //////////
////////////////////////////////////////////////////
const numObj = 100;

////////////////////////////////////////////////////
/////////////  Create #n small objects  ////////////
////////////////////////////////////////////////////
const objArray = new Array(numObj+1);
const objDirection = new Array(numObj+1);
const objSpeed = new Array(numObj+1);
createObj();


////////////////////////////////////////////////////
///////////////  Support functions  ////////////////
////////////////////////////////////////////////////

function createObj(){
    /*
    Description: 
        This function creates the objects, put them at a random position 
        and associates each a random speed vector, rotation, and speed value
    @return: void
    */
    "use strict";
    for (let i=0;i<numObj;++i){
        createNewObj(i);
    }
    createMeteor();
}

function createNewObj(i){
    "use strict";
    const geometry = randomGeometry();
    const material = new THREE.MeshBasicMaterial({color:randomColor(), wireframe:true});
    const object = new THREE.Mesh(geometry, material);
    const initialDir = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);
    generateRandomPosition(object);
    object.rotation.x = Math.random()*Math.PI;
    object.rotation.y = Math.random()*Math.PI;
    objSpeed[i] = randomSpeed();
    objDirection[i] = initialDir;
    objArray[i] = object;
    scene.add(object);
}


function createMeteor(){
    /*
    Description: 
        This function creates the meteor object, and defines associated properties
    @return: void
    */
    const geometry = new THREE.SphereGeometry(randomSize(), 30, 30);
    const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, shininess: 200, 
    											color:"gold"});
    const object = new THREE.Mesh(geometry, material);
    const initialDir = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);
    generateRandomPosition(object);
    object.rotation.x = Math.random()*Math.PI;
    object.rotation.y = Math.random()*Math.PI;
    objSpeed[numObj] = randomSpeed()+30;
    objDirection[numObj] = initialDir;
    objArray[numObj] = object;
    scene.add(object);
}

function randomGeometry(){
    /*
    This function selects a random geometrical object among a few predefined options
    @return: Three.Geometry
        Geometry of the random object
    */
    "use strict";
    const selectGeo = Math.random();
    if(selectGeo < 1/7){
    	return new THREE.SphereGeometry(randomSize(), 15, 15);
    }
    else if(selectGeo < 2/5){
    	return new THREE.CylinderGeometry(randomSize(), randomSize(), 2, 16);
    }
    else if(selectGeo < 1/2){
    	return new THREE.TorusKnotGeometry(3*randomSize(), randomSize(), 100, 16);
    }
    else if(selectGeo < 4/5){
    	return new THREE.DodecahedronBufferGeometry(randomSize()*2);
    }
    else{
    	return new THREE.TorusGeometry(randomSize()*2, randomSize(), 8, 50);
    }
}


function randomSpeed(){
    /*
    This function selects a random speed within a range
    @return: Number
        Number denoting random speed
    */
    "use strict";
    const minObjSpeed = 0.1;
    return minObjSpeed + Math.random()/2;
}


function randomSize(){
    /*
    This function selects a random size within a range
    @return: Number
        Number denoting random size
    */
    "use strict";
    const objMinRadius = 0.2;
    return objMinRadius + Math.random();
}

function randomColor(){
    /*
    This function selects a random color
    @return: THREE.Color
        Random color
    */
    "use strict";
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    return color;
}

function generateRandomPosition(obj){
    /*
    Description: 
        This function defines the initial position of the object
    Parameters:
    @input THREE.Object
        Object to position
    @return: 
        void
    */
    "use strict";
    const pos = new THREE.Vector3(camera.getFilmHeight()*
    							  (window.innerWidth/window.innerHeight)*
    							  (2*Math.random()-1)/2, 
    							  camera.getFilmHeight()/2*(2*Math.random()-1), 
    							  0);
    obj.position.copy(pos);
}

////////////////////////////////////////////////////
////////////////  Render function  /////////////////
////////////////////////////////////////////////////

function render() {
    requestAnimationFrame(render);
    const h = clock.getDelta();
    for (let i=0;i<numObj+1;++i){
        //update position accordingly
        objArray[i].position.x += objDirection[i].x*objSpeed[i]*h;
        objArray[i].position.y += objDirection[i].y*objSpeed[i]*h;
        objArray[i].position.z += objDirection[i].z*objSpeed[i]*h;
        //if object too far away, remove it and replace it
        if(objArray[i].position.distanceTo(objDirection[i]) > camera.getFilmWidth()){
        	scene.remove(objArray[i]);
        	if(i != numObj){
        		createNewObj(i);
        	}
        	else{
        		createMeteor();
        	}
        }
    }
    renderer.render(scene, camera);
}

render();