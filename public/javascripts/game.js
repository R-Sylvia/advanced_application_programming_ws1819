

//import { getUserName } from 'client_import_functions'


// game logic and so on (maybe split in more files) for client side

/**
 * variables for informatione needed for the game
 * get updatet via websocket
 * send current position via websocket
 */
// object list
// current position
// ...

let socket = io();

////////////////////////////////////////////////////
//////////////  Setup environment  /////////////////
////////////////////////////////////////////////////
const thiscanvas = document.getElementById("canvas");
//console.log(thiscanvas)
const renderer = new THREE.WebGLRenderer({canvas:thiscanvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("black");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight,
    0.1, 1000);
const controls = new THREE.TrackballControls(camera, thiscanvas);
controls.rotateSpeed = 2;
const clock = new THREE.Clock();
const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);

let username = null
let playerID = null
let gameRunning = false

////////////////////////////////////////////////////
////////  Global customizable parameters  //////////
////////////////////////////////////////////////////
const scaleFactor = 1/5;   //change size of all objects but keep proportions
const myAvatar = {
    height	   : 70*scaleFactor,
    headRadius : 10*scaleFactor,
    bodyWidth  : 15*scaleFactor
};
const numPlayers = 5;
const avatars = new Array(numPlayers);
const posAvatar = new Array(numPlayers);
for (let i=0;i<numPlayers;++i){
    avatars[i] = new THREE.Object3D();
    posAvatar[i] = new Array(3); //3 dimensions x, y, z
}
const scores = new Array(numPlayers);   // array of scores received from server
const itemsToGrab = new Array(100);
const joints = new Array(numPlayers);
let lastMoved = -1;
const myWorld = {
    edge1 : 		1000,
    edge2 : 		1000
};
camera.position.z = 150*scaleFactor;
camera.position.y = 100*scaleFactor;
camera.position.z = 300*scaleFactor;

socket.on('connect', () => {
    console.log('socketid: ' + socket.id)
    startGame()
});

function usernameajax() {
    var settings = {
        "async": true,
        "crossDomain": true,
        //"url": "http://192.168.178.20:8080/username",    // Home
        "url": "http://192.168.20.13:8080/username",   // Home2
        //"url": "http://149.222.154.38:8080/username", // FH
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false
    }

    return $.get(settings)

}

function getUserName() {

    console.log('function get username called')

    $.when(usernameajax()).then(function (response) {
        if (response.status == 200) {
            console.log("getting unsername was successfull")
            username = response.data
            socket.emit('start play', {user: username}, function(responsedata) {
                console.log("got socket message here")
                if (responsedata.answer === false) {
                    console.log("you can not enter the game")
                    window.location.href = "menu.html"
                } else {
                    playerID = responsedata.id
                    console.log("entered game " + playerID)
                    gameRunning = true
                    // initialise avatar arrays and so on
                    createPlayingField();
                    createFence();
                    createAvatars();

                }
            } );
        } else {
            console.log('getting username was not successfull');
            alert("you are not logged in")
            window.location.href = "menu.html"
        }
    })

}

////////////////////////////////////////////////////
////////////////  Initialisation  //////////////////
////////////////////////////////////////////////////
/*playerIndex = getPlayerIndex();
createPlayingField();
createFence();
createAvatars();
*/
////////////////////////////////////////////////////
/////////////  Create Playing field  ///////////////
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
    txtLoader.load('../images/woodenFloor.png',  function(txtMap) {
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
    "use strict";
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

////////////////////////////////////////////////////
////////////////  Create Avatars    ////////////////
////////////////////////////////////////////////////

function createAvatars(){
    /*
    Description:
        This function creates all the avatars
    @return:
        void
    */
    "use strict";
    for (let i=0;i<numPlayers;++i){
        let playerColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        createHead(i, playerColor);
        createBody(i, playerColor);
        createLegs(i);
        createArms(i);
        scene.add(avatars[i]);
        avatars[i].position.y = myAvatar.height/2;
    }
    avatars[playerID].add(camera);
}

function createHead(i, colore){
    /*
    Description:
        This function creates the head of the avatars
    Parameters:
    @input i: number
        player number
    @input colore: THREE.color
    	player color
    @return:
        void
    */
    "use strict";
    const geometry = new THREE.SphereGeometry(myAvatar.headRadius, 50, 50);
    const material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,
        shininess: 200,
        color:colore});
    const head = new THREE.Mesh(geometry, material);
    head.position.y = myAvatar.height-myAvatar.headRadius;
    avatars[i].add(head);
}

function createBody(i, colore){
    /*
    Description:
        This function creates the body of the avatars
         Parameters:
    @input i: number
        player number
    @input colore: THREE.color
    	player color
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
        color:colore});
    const body = new THREE.Mesh(geometry, material);
    body.position.y = myAvatar.height-2*myAvatar.headRadius-bodyY/2;
    avatars[i].add(body);
}

function createLegs(i){
    /*
    Description:
        This function creates the legs of the avatars
    @input i: number
        player number
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
    joints[i] = -1;
    avatars[i].add(leg1);
    avatars[i].add(leg2);
}

function createArms(i){
    /*
    Description:
        This function creates the arms of the avatars
    @input i: number
        player number
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
    avatars[i].add(arm1);
    avatars[i].add(arm2);
}

function moveJoints(){
    /*
    Description:
        This function moves the client's avatar joints
    @return:
        void
    */
    "use strict";
    if(joints[playerID] < 0){
        avatars[playerID].children[2].rotation.x += 2*Math.PI/15;
        avatars[playerID].children[3].rotation.x -= 2*Math.PI/15;
        avatars[playerID].children[4].rotation.x -= 2*Math.PI/12;
        avatars[playerID].children[5].rotation.x += 2*Math.PI/12;
        avatars[playerID].children[2].position.z -= 2*myAvatar.bodyWidth/5;
        avatars[playerID].children[3].position.z += 2*myAvatar.bodyWidth/5;
        avatars[playerID].children[4].position.z += 2*myAvatar.bodyWidth/5;
        avatars[playerID].children[5].position.z -= 2*myAvatar.bodyWidth/5;
        joints[playerID] = 1;
    }
    else{
        avatars[playerID].children[2].rotation.x -= 2*Math.PI/15;
        avatars[playerID].children[3].rotation.x += 2*Math.PI/15;
        avatars[playerID].children[4].rotation.x += 2*Math.PI/12;
        avatars[playerID].children[5].rotation.x -= 2*Math.PI/12;
        avatars[playerID].children[2].position.z += 2*myAvatar.bodyWidth/5;
        avatars[playerID].children[3].position.z -= 2*myAvatar.bodyWidth/5;
        avatars[playerID].children[4].position.z -= 2*myAvatar.bodyWidth/5;
        avatars[playerID].children[5].position.z += 2*myAvatar.bodyWidth/5;
        joints[playerID] = -1;
    }
}

////////////////////////////////////////////////////
///////////////  CLIENT GAME LOGIC    //////////////
////////////////////////////////////////////////////

/*
function getPlayerID(){
    /*
    Description:
        This function returns the player ID
    @return: number
        player ID
    * /
    "use strict";
    return 0;//TODO, REPLACE WITH PLAYER ID ASSIGNED BY SERVER
}
*/

function mycb(event){
    /*
    Description:
        This function moves the avatars
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
    if(!gameRunning){
        //alert("GAME OVER!!!");
        return;
    }
    if(Math.abs(time - lastMoved) < 0.15){//For the human eyes sampling
        return;
    }
    else{
        lastMoved = time;
    }
    if(event.keyCode == 68){ //d  (right)
        if(avatars[playerID].position.x + stepDistance < 495/1000*myWorld.edge2){
            avatars[playerID].position.x += stepDistance;
            moveJoints();
        }
        else{
            return;
        }
    }
    if(event.keyCode == 65){ //a  (left)
        if(avatars[playerID].position.x - stepDistance > -495/1000*myWorld.edge2){
            avatars[playerID].position.x -= stepDistance;
            moveJoints();
        }
        else{
            return;
        }
    }
    if(event.keyCode == 87){ //w  (forward)
        if(avatars[playerID].position.z - stepDistance > -495/1000*myWorld.edge1){
            avatars[playerID].position.z -= stepDistance;
            moveJoints();
        }
        else{
            return;
        }
    }
    if(event.keyCode == 83){ //s  (backward)
        if(avatars[playerID].position.z + stepDistance < 495/1000*myWorld.edge2){
            avatars[playerID].position.z += stepDistance;
            moveJoints();
        }
        else{
            return;
        }
    }
    detectCollision(i);
}
document.addEventListener("keydown",mycb);

function updateAvatarPos(){
    /*
    Description:
        This function updates the avatars positions for the renderer
    @return:
        void
    */
    "use strict";
    for (let i=0;i<numPlayers;++i){		// TODO only for those avatars who exist
        for (let j=0;i<3;++j){
            posAvatar[i][j] = 0;//instead of 0, SERVER ANSWER
        }
        avatars[i].position.set(posAvatar[i][0], posAvatar[i][1], posAvatar[i][2]);
    }
}

////////////////////////////////////////////////////
////////////////  Render function  /////////////////
////////////////////////////////////////////////////
function render() {
    //called every 30or 60ms
    //updateAvatarPos();
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
    // send position update, i.e. send avatar[playerID].position - how to?
}

render();

//TODO
//function creating items in the field based on server-side creation
//function updating items in the field based on server-side detect collision results
//function getting player score from server
//communication server-client

function startGame() {
    getUserName()
    /*ans = getUserName()
	console.log('anser received: ' + ans)
    if (ans) {
        console.log(username)
        socket.emit('start play', {user: username}, function(responsedata) {
            console.log("got socket message here")
            if (responsedata.answer === false) {
                console.log("you can not enter the game")
                window.location.href = "menu.html"
            } else {
                playerIndex = responsedata.id
                console.log("entered game " + playerid)
                // initialise avatar arrays and so on
                createPlayingField();
                createFence();
                createAvatars();

            }
        } );
    } else {
        console.log('no username')
        window.location.href = "menu.html"
    }
	*/
    socket.on('chat message', function (msg) {
        // add message to chat
        console.log("received chat message")
    });

    socket.on('avatar positions', function (msg) {
        // render new gamefield
        // update avatar array with avatar position array of server
        console.log("received avatar message")
    });

    socket.on('item positions', function (msg) {
        // render new gamefield
        // reset item array
        // itemsToGrab = msg.items;
        console.log("received item message")
    });

    socket.on('current scores', function (msg) {
        // render new gamefield
        // reset score array
        console.log("received scores message")
    });

    socket.on('game ends', function (msg) {
        // show scores
        console.log("received game end message")
        gameRunning = false
		alert('Game is over!')
    });

    // react on userinput

    // rendering function call here
}


/**
 * Renders the game using the variables above
 */
// function displayGame()...

$("#btn_exit").click(function() {
    console.log("clicked exit")
    socket.emit('player quits', {id: playerID, user: username})
});