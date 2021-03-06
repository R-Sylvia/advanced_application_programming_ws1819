/**
 * Client side script for the game.
 * @date 16.12.2018
 * @author Nicola Giaconi
 * @author Sylvia Reißmann
 * @author Anna Lukjanenko
 */



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
    posAvatar[i] = new Array(2); //2 dimensions x and z
    for (let j=0;j<2;++j){
        posAvatar[i][j] = 0; // initialise to middle of field
    }
    avatars[i].position.set(posAvatar[i][0], myAvatar.height/2, posAvatar[i][1]);
}

let server = {  array0 : new Array(100),
                array1 : new Array(100),
                array2 : new Array(100),
                array3 : new Array(100),
                array4 : new Array(100) }

console.log('avatar positions initialised');
const scores = new Array(numPlayers);   // array of scores received from server
const itemsToGrab = new Array(100);
const joints = new Array(numPlayers);
let lastMoved = -1;
let lastUpdated = -1;
const myWorld = {
    edge1 : 		1000,
    edge2 : 		1000
};
camera.position.z = 150*scaleFactor;
camera.position.y = 100*scaleFactor;
camera.position.z = 300*scaleFactor;

/**
 * Socket connected event.
 * Starts the game itself.
 * @author Sylvia
 */
socket.on('connect', () => {
    console.log('socketid: ' + socket.id)
    startGame()
});

/**
 * Ajax call to get username of the current player.
 * @author Sylvia
 * @returns the ajax call.
 */
function usernameajax() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://192.168.178.20:8080/username",    // Home
        //"url": "http://192.168.20.13:8080/username",   // Home2
        //"url": "http://149.222.154.38:8080/username", // FH
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false
    }
    return $.get(settings)
}

/**
 * Starts the game (if possible).
 * @author Sylvia
 */
function getUserName() {

    $.when(usernameajax()).then(function (response) {
        if (response.status == 200) {
            console.log("getting unsername was successfull")
            username = response.data
            socket.emit('start play', {user: username}, function(responsedata) {
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

                    // create items
                    server.array0 = JSON.parse(responsedata.array0)
                    server.array1 = JSON.parse(responsedata.array1)
                    server.array2 = JSON.parse(responsedata.array2)
                    server.array3 = JSON.parse(responsedata.array3)
                    server.array4 = JSON.parse(responsedata.array4)

                    let players = JSON.parse(responsedata.players)
                    console.log(players)
                    for (let i = 0; i < players.length; i++){
                        if (players[i]){
                            scene.add(avatars[i])
                        }
                    }
                    createClientItems()
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
/////////////  Create Playing field  ///////////////
////////////////////////////////////////////////////
function createPlayingField(){
    /*
    Author: Nicola Giaconi
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
    Author: Nicola Giaconi
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
    Author: Nicola Giaconi
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
        avatars[i].position.y = myAvatar.height/2;
    }
    scene.add(avatars[playerID])
    avatars[playerID].add(camera);
}

function createHead(i, colore){
    /*
    Author: Nicola Giaconi
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
    Author: Nicola Giaconi
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
    Author: Nicola Giaconi
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
    Author: Nicola Giaconi
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
    Author: Nicola Giaconi
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
function mycb(event){
    /*
    Author: Nicola Giaconi
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
            sendPos();
            moveJoints();
        }
        else{
            return;
        }
    }
    if(event.keyCode == 65){ //a  (left)
        if(avatars[playerID].position.x - stepDistance > -495/1000*myWorld.edge2){
            avatars[playerID].position.x -= stepDistance;
            sendPos();
            moveJoints();
        }
        else{
            return;
        }
    }
    if(event.keyCode == 87){ //w  (forward)
        if(avatars[playerID].position.z - stepDistance > -495/1000*myWorld.edge1){
            avatars[playerID].position.z -= stepDistance;
            sendPos();
            moveJoints();
        }
        else{
            return;
        }
    }
    if(event.keyCode == 83){ //s  (backward)
        if(avatars[playerID].position.z + stepDistance < 495/1000*myWorld.edge2){
            avatars[playerID].position.z += stepDistance;
            sendPos();
            moveJoints();
        }
        else{
            return;
        }
    }
}

document.addEventListener("keydown",mycb);

/**
 * Updates the avatars position from global variable.
 * @author Nicola
 * @author Sylvia
 */
function updateAvatarPos(){
    /*
    Author: Sylvia Reißmann, Nicola Giaconi
    Description:
        This function updates the avatars positions for the renderer
    @return:
        void
    */
    "use strict";
    for (let i=0;i<numPlayers;++i){
        if (gameRunning) {
            if ((posAvatar[i][0] !== null) && (posAvatar[i][1] !== null)) {
                avatars[i].position.set(posAvatar[i][0], myAvatar.height / 2, posAvatar[i][1]);
            }
        }
    }
}

/**
 * Sends the current position of the players avatar to the server.
 * @author Sylvia
 */
function sendPos(){
    /*
    Author: Sylvia Reißmann, Nicola Giaconi
    Description:
        This function informs the server of the avatar (playerID) new position
    @return:
        void
    */
    if (gameRunning) {
        posi = new Array(2)
        posi[0] = avatars[playerID].position.x;
        posi[1] = avatars[playerID].position.z;
        socket.emit('position update', {id: playerID, position: JSON.stringify(posi)});
    }
}

function createClientItems(){
    /*
    Author: Nicola Giaconi
    Description:
        This function creates the items based on server answer
    @return:
        void
    */
    "use strict";
    //server.array0[i] stores geometry type
    //server.array1[i] stores radius of item
    //server.array2[i] stores x-coordinate
    //server.array3[i] stores y-coordinate
    //server.array4[i] stores z-coordinate
    for (let i=0;i<itemsToGrab.length;++i){
        let geometry;
        if (server.array0[i] === 0){
            geometry = new THREE.SphereGeometry(server.array1[i], 10, 10);
        }
        else if(server.array0[i] === 1){
            geometry = new THREE.CylinderGeometry(server.array1[i], server.array1[i], server.array1[i], 16);
        }
        else{
            geometry = new THREE.BoxGeometry(server.array1[i], server.array1[i], server.array1[i]);
        }
        let randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        let radius = myAvatar.headRadius*(1+2*Math.random()-0.5)+myAvatar.bodyWidth*3/2;
        let material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,
            shininess: 50,
            color:randomColor});
        itemsToGrab[i] = new THREE.Mesh(geometry, material);
        itemsToGrab[i].position.x = server.array2[i];
        itemsToGrab[i].position.y = server.array3[i];
        itemsToGrab[i].position.z = server.array4[i];
        scene.add(itemsToGrab[i]);
    }
}

function deleteItems(items){
    /*
    Author: Nicola Giaconi
    Description:
        This function deletes the items based on server answer (avatar contact)
    @return:
        void
    */
    "use strict";
    for (let i = 0; i < items.length; i++) {
        const indexItemToRemove = items[i]
        scene.remove(itemsToGrab[indexItemToRemove]);
        itemsToGrab.splice(indexItemToRemove,1);
    }
}

////////////////////////////////////////////////////
////////////////  Render function  /////////////////
////////////////////////////////////////////////////
function render() {
    //Author: Nicola Giaconi
    //called every 30or 60ms
    const time = clock.getElapsedTime();
    if(Math.abs(time - lastUpdated) < 0.25){//eyes sampling
        ;//do nothing
    }
    else{
        lastUpdated= time;
        updateAvatarPos();
    }
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

render();

/**
 * Triggers the game start and initialisation (getUserName) and handles websocket events.
 * @author Sylvia
 */
function startGame() {
    getUserName()

    // message for the group chat received
    // @author Anna Lukjanenko
    socket.on('chat message', function (msg) {
        // add message to chat
        console.log("received chat message")
        //$("chatentry").append('<p class="username"><strong>' + data.user + '</strong>:</p>');
        $("#chatentry").append('<p class="usermessage">' + msg + '</p>');
    });

    // new avatar positions received
    socket.on('avatar positions', function (msg) {
        // render new gamefield
        // update avatar array with avatar position array of server
        console.log("received avatar message")
		if (gameRunning) {
			posis = JSON.parse(msg.first)
			posAvatar[0] = posis
            posis = JSON.parse(msg.second)
            posAvatar[1] = posis
            posis = JSON.parse(msg.third)
            posAvatar[2] = posis
            posis = JSON.parse(msg.fourth)
            posAvatar[3] = posis
            posis = JSON.parse(msg.fifth)
            posAvatar[4] = posis
            //updateAvatarPos()
        }
    });

    // new current player scores received
    // @author Anna Lukjanenko
    socket.on('current scores', function (msg) {
        // render new gamefield
        // reset score array
        console.log("received scores message")
        names = JSON.parse(msg.names)
        newscores = JSON.parse(msg.scores)
        var html = '';
        for (i = 0; i < names.length; i++) {
	    html += '<p class="score">' + (i + 1) + '.  ' + names[i] + '  ' + newscores[i] + '</p>';
        }
        $("#scoreentry").html(html);
    });

    // game ends message received
    socket.on('game ends', function (msg) {
        // show scores
        console.log("received game end message")
        gameRunning = false
		alert('Game is over!')
        window.location.href='menu.html'
    });

    // received array of items to be removed
    socket.on('delete items', function(msg){
        console.log("received delete items message")
        items = JSON.parse(msg.items)
        deleteItems(items)
    });

    // received message a player left the game
    socket.on('player left', function(msg){
        console.log("received player left message")
        scene.remove(avatars[msg.id])
    });

    // received message a new player joins the game
    socket.on('new player', function(msg){
        console.log("received new player message")
        scene.add(avatars[msg.id])
    });
}

/**
 * Eventhandler for click on button "exit".
 * @author Sylvia
 */
$("#btn_exit").click(function() {
    socket.emit('player quits', {id: playerID, user: username})
    window.location.href='menu.html'
});

/**
 * Eventhandler for click on button "send" to send a message to the group chat.
 * @author Sylvia
 * @author Anna
 */
$(function () {
    $('form').submit(function (e) {
        e.preventDefault();
        socket.emit('send message', username + ': ' + $("#message").val());
        $("#message").val('')
    });
});
