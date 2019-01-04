/*
Author: Nicola Giaconi
Date: 17 November 2018
Description: Game development for Advanced Software Programming
Additional notes:

*/
//http://149.222.154.38:8080/
// 192.168.100.207:8080
////////////////////////////////////////////////////
//////////////  Setup environment  /////////////////
////////////////////////////////////////////////////
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("black");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight,
                                          0.1, 1000);
const controls = new THREE.TrackballControls(camera, canvas);
controls.rotateSpeed = 2;
const clock = new THREE.Clock();
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);


////////////////////////////////////////////////////
////////  Global customizable parameters  //////////
////////////////////////////////////////////////////
const scaleFactor = 1/5;                //change size of all objects but keep proportions
const myAvatar = {
	height	   : 70*scaleFactor,
    headRadius : 10*scaleFactor,
    bodyWidth  : 15*scaleFactor
};
const numPlayers = 1;
const avatars = new Array(numPlayers);
const scores = new Array(numPlayers);
for (let i=0;i<numPlayers;++i){
	scores[i] = 0;
}
const avatar = new THREE.Object3D();
avatars[0] = avatar;
const itemsToGrab = new Array(100);
let gameOver = false;
const joints = new Array(numPlayers);//TODO: # of players...
let lastMoved = -1;
const myWorld = {
    edge1 : 		1000,
    edge2 : 		1000
};
camera.position.z = 150*scaleFactor;
camera.position.y = 100*scaleFactor;
camera.position.z = 300*scaleFactor;

////////////////////////////////////////////////////
/////////  Create Avatar and 3D Space   //////////
////////////////////////////////////////////////////
createPlayingField();
createFence();
createAvatar();
createItems();


////////////////////////////////////////////////////
///////////////  Support functions  ////////////////
////////////////////////////////////////////////////
function createPlayingField(){
    /*
    Description: 
        This function creates the playing field
    @return: 
        void
    */
    "use strict";
    const geo = new THREE.PlaneGeometry(myWorld.edge1, myWorld.edge2);
    geo.computeVertexNormals();
    const mat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, shininess: 20});
    const txtLoader = new THREE.TextureLoader();
    txtLoader.load("textures/woodenFloor.png",  function(txtMap) {
        txtMap.wrapS = THREE.RepeatWrapping;
        txtMap.wrapT = THREE.RepeatWrapping;
        txtMap.minFilter = THREE.NearestMipMapLinearFilter;
        txtMap.repeat.set(myWorld.edge1/100,myWorld.edge2/100);
        mat.map = txtMap;
        mat.needsUpdate = true;
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI/2;
    plane.receiveShadow = true;
    scene.add(plane);
}

function createFence(){
    /*
    Description: 
        This function creates the fence delimiting the field
    @return: 
        void
    */
	const geo = new THREE.BoxGeometry(myWorld.edge1, myAvatar.height, myAvatar.height/10);
    geo.computeVertexNormals();
    const mat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, shininess: 20, color:'red'});
    const fence1 = new THREE.Mesh(geo, mat);
    fence1.position.y = myAvatar.height/2;
    const fence2 = fence1.clone();
    const fence3 = fence1.clone();
    const fence4 = fence1.clone();
    fence1.position.z = myWorld.edge1/2;
    fence2.position.z = -myWorld.edge1/2;
    fence3.position.x = -myWorld.edge1/2;
    fence3.rotation.y = -Math.PI/2;
    fence4.position.x = myWorld.edge1/2;
    fence4.rotation.y = -Math.PI/2;
    scene.add(fence1);
    scene.add(fence2);
    scene.add(fence3);
    scene.add(fence4);
}


function createAvatar(){
    /*
    Description: 
        This function creates the Avatar
    @return: 
        void
    */
    "use strict";
    createHead();
    createBody();
	createLegs();
	createArms();
	avatar.add(camera);
    scene.add(avatar);
	avatar.position.y = myAvatar.height/2;
}


function createItems(){
 	/*
    Description: 
        This function creates the items that populate the field
    @return: 
        void
    */
    for (let i=0;i<itemsToGrab.length;++i){
    	let radius = myAvatar.headRadius*(1+2*Math.random()-0.5)+myAvatar.bodyWidth*3/2;
    	let geometry = randomGeometry();
    	let material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, 
												shininess: 50, 
    											color:randomColor()});
		itemsToGrab[i] = new THREE.Mesh(geometry, material);
		if(geometry.type === "SphereGeometry"){
			offset = geometry.parameters.radius;
		}
		if(geometry.type === "BoxGeometry"){
			offset = geometry.parameters.height/2;
		}
		if(geometry.type === "CylinderGeometry"){
			offset = geometry.parameters.height/2;
		}
		itemsToGrab[i].position.y = offset+0.01;
		itemsToGrab[i].position.x = myWorld.edge1  * 9/10 * (Math.random()-0.5);
		itemsToGrab[i].position.z = myWorld.edge2  * 9/10 * (Math.random()-0.5);
		scene.add(itemsToGrab[i]);
	}
}


function randomColor(){
    /*
    Description:
    	This function selects a random color
    @return: THREE.Color
        Random color
    */
    "use strict";
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    return color;
}


function randomGeometry(){
    /*
    This function selects a random geometrical object among a few predefined options
    @return: Three.Geometry
        Geometry of the random object
    */
    "use strict";
    const selectGeo = Math.random();
    if(selectGeo < 1/3){
    	return new THREE.SphereGeometry(randomSize(), 10, 10);
    }
    else if(selectGeo < 2/3){
    	let size = randomSize();
    	return new THREE.CylinderGeometry(size, size, size, 16);
    }
    else{
    	let size = randomSize();
    	return new THREE.BoxGeometry(size, size, size);
    }
}

function randomSize(){
    /*
    This function selects a random size within a range
    @return: Number
        Number denoting random size
    */
    "use strict";
    return myAvatar.headRadius*(1+2*Math.random()-0.5)+myAvatar.bodyWidth*3/2;
}


function createHead(){
    /*
    Description: 
        This function creates the head of the Avatar
    @return: 
        void
    */
    "use strict";
    const geometry = new THREE.SphereGeometry(myAvatar.headRadius, 50, 50);
    const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, 
												shininess: 200, 
    											color:"gold"});
    const head = new THREE.Mesh(geometry, material);
	head.position.y = myAvatar.height-myAvatar.headRadius;
	avatar.add(head);
}

function createBody(){
    /*
    Description: 
        This function creates the body of the Avatar
    @return: 
        void
    */
    "use strict";
	const bodyX = myAvatar.bodyWidth*3/2;
	const bodyY = myAvatar.bodyWidth*2.5;
	const bodyZ = myAvatar.bodyWidth;
	const geometry = new THREE.BoxGeometry(bodyX, bodyY, bodyZ);
    const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, 
												shininess: 200, 
    											color:"brown"});
    const body = new THREE.Mesh(geometry, material);
	body.position.y = myAvatar.height-2*myAvatar.headRadius-bodyY/2;
	avatar.add(body);
}

function createLegs(){
    /*
    Description: 
        This function creates the legs of the Avatar
    @return: 
        void
    */
    "use strict";	
	const radiusLegs = myAvatar.bodyWidth/3;
	const lengthLegs = myAvatar.height-myAvatar.headRadius/2-myAvatar.bodyWidth*2.5/2;
	const geometry = new THREE.CylinderGeometry(radiusLegs, radiusLegs, lengthLegs, 32 );
    const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, 
												shininess: 200, 
    											color:"blue"});
    const leg1 = new THREE.Mesh(geometry, material);
	leg1.position.y = myAvatar.height
						-2*myAvatar.headRadius
						-myAvatar.bodyWidth*2.5
						-lengthLegs/2-0.01;
	const leg2 = leg1.clone();
	leg1.position.x -= myAvatar.bodyWidth*3/8;
	leg2.position.x += myAvatar.bodyWidth*3/8;
	leg1.position.z += myAvatar.bodyWidth/5;
	leg2.position.z -= myAvatar.bodyWidth/5;
	leg1.rotation.x = -Math.PI/15;
	leg2.rotation.x = +Math.PI/15;
	joints[0] = -1;
	avatar.add(leg1);
	avatar.add(leg2);
}

function detectCollision(){
	/*
    Description: 
        This function detects the contact between the avatar and the items
    @return: 
        void
    */
    for (let i=0;i<itemsToGrab.length;++i){
    	let dist;
    	let distance2D = Math.sqrt(Math.pow(avatar.position.x-itemsToGrab[i].position.x,2)+
			Math.pow(avatar.position.z-itemsToGrab[i].position.z,2));
    	if(itemsToGrab[i].geometry.type === "SphereGeometry"){
			dist = itemsToGrab[i].geometry.parameters.radius;
		}
		else if(itemsToGrab[i].geometry.type === "BoxGeometry"){
			dist = itemsToGrab[i].geometry.parameters.width*1.2;
		}
		else if(itemsToGrab[i].geometry.type === "CylinderGeometry"){
			dist = itemsToGrab[i].geometry.parameters.radiusTop;
		}
		else{
			dist = 0;
		}
		if(	distance2D <= dist){
			scene.remove(itemsToGrab[i]);
			itemsToGrab.splice(i,1);
			++scores[0];
		}
	}
}


function createArms(){
	/*
    Description: 
        This function creates the arms of the Avatar
    @return: 
        void
    */
    "use strict";
	const radiusArms = myAvatar.bodyWidth/5;
	const lengthArms = myAvatar.bodyWidth*3.5/2;
	const geometry = new THREE.CylinderGeometry(radiusArms, radiusArms, lengthArms, 32 );
    const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, 
												shininess: 200, 
    											color:"blue"});
    const arm1 = new THREE.Mesh(geometry, material);
	arm1.position.y = myAvatar.height-3.5*myAvatar.headRadius;
	const arm2 = arm1.clone();
	arm1.position.x -= myAvatar.bodyWidth;
	arm2.position.x += myAvatar.bodyWidth;
	arm1.position.z -= myAvatar.bodyWidth/5;
	arm2.position.z += myAvatar.bodyWidth/5;
	arm1.rotation.x = +Math.PI/12;
	arm2.rotation.x = -Math.PI/12;
	avatar.add(arm1);
	avatar.add(arm2);
}

function moveJoints(){
	if(joints[0] <0){
		avatar.children[2].rotation.x += 2*Math.PI/15;
		avatar.children[3].rotation.x -= 2*Math.PI/15;
		avatar.children[4].rotation.x -= 2*Math.PI/12;
		avatar.children[5].rotation.x += 2*Math.PI/12;
		avatar.children[2].position.z -= 2*myAvatar.bodyWidth/5;
		avatar.children[3].position.z += 2*myAvatar.bodyWidth/5;
		avatar.children[4].position.z += 2*myAvatar.bodyWidth/5;
		avatar.children[5].position.z -= 2*myAvatar.bodyWidth/5;
		joints[0] = 1;
	}
	else{
		avatar.children[2].rotation.x -= 2*Math.PI/15;
		avatar.children[3].rotation.x += 2*Math.PI/15;
		avatar.children[4].rotation.x += 2*Math.PI/12;
		avatar.children[5].rotation.x -= 2*Math.PI/12;
		avatar.children[2].position.z += 2*myAvatar.bodyWidth/5;
		avatar.children[3].position.z -= 2*myAvatar.bodyWidth/5;
		avatar.children[4].position.z -= 2*myAvatar.bodyWidth/5;
		avatar.children[5].position.z += 2*myAvatar.bodyWidth/5;
		joints[0] = -1;
	}
}

function mycb(event){
    /*
    Description: 
        This function moves the avatar
        according to the user´s input (d/a/e/q/w/s)
    Parameters:
    @input event: Keyboard-event
        Key pressed
    @return: 
        void
    */
    "use strict";
	const time = clock.getElapsedTime();
	const stepDistance = myAvatar.bodyWidth*1.8;
	if(gameOver){
		alert("GAME OVER!!!");
		return;
	}
	if(Math.abs(time - lastMoved) < 0.15){//For the human eyes sampling
		return;
	}
	else{
		lastMoved = time;
	}
	if(event.keyCode == 68){ //d  (right)
		if(avatar.position.x + stepDistance < 495/1000*myWorld.edge2){
			avatar.position.x += stepDistance;
			moveJoints();
		}
		else{
			return;
		}
	}
	if(event.keyCode == 65){ //a  (left)
		if(avatar.position.x - stepDistance > -495/1000*myWorld.edge2){
			avatar.position.x -= stepDistance;
			moveJoints();
		}
		else{
			return;
		}
	}
	if(event.keyCode == 87){ //w  (forward)
		if(avatar.position.z - stepDistance > -495/1000*myWorld.edge1){
			avatar.position.z -= stepDistance;
			moveJoints();
		}
		else{
			return;
		}
	}
	if(event.keyCode == 83){ //s  (backward)
		if(avatar.position.z + stepDistance < 495/1000*myWorld.edge2){
			avatar.position.z += stepDistance;
			moveJoints();
		}
		else{
			return;
		}
	}
	detectCollision();
}
document.addEventListener("keydown",mycb);

////////////////////////////////////////////////////
////////////////  Render function  /////////////////
////////////////////////////////////////////////////
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

render();