

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
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("black");
const scene = new THREE.Scene();

///////Camera
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

let username = null
let playerid = null

////////////////////////////////////////////////////
////////  Global customizable parameters  //////////
////////////////////////////////////////////////////
const scaleFactor = 1/5;               //change size of all objects but keep proportions
const myAvatar = {
    height	   : 70*scaleFactor,
    headRadius : 10*scaleFactor,
    bodyWidth  : 15*scaleFactor
};
const avatars = new Array(5);
let scores;   // array of scores received from server
let itemsToGrab; // arrayof items received from server

socket.on('connect', () => {
    console.log(socket.id)
    startGame()
});


function usernameajax() {
        var settings = {
            "async": false,
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

        return $.ajax(settings)

}

function getUserName() {

    console.log('function get username called')
    let res = false;

    $.when(usernameajax()).then(function (response) {
        if (response.status == 200) {
            console.log("getting unsername was successfull")
            username = response.data
            res = true
        } else {
            console.log('getting username was not successfull');
            alert("you are not logged in")
        }
    })

    return res
}

////////////////////////////////////////////////////
////////////////  Render function  /////////////////
////////////////////////////////////////////////////
function render() {
    //called every 30or 60ms
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
    // send position update
}

// supportfunctions:

// createPlayingField

// createFence

// createAvatars

// randomColor

// createHead

// createBody

// createLegs

// createArms

// moveJoints

// getPlayerIndex -> playerid

// mycb

//update function to update avatar array from server array with positions

function startGame() {
    ans = getUserName()

    if (ans) {
        console.log(username)
        socket.emit('start play', {user: username}, function(responsedata) {
            console.log("got socket message here")
            if (responsedata.answer === false) {
                console.log("you can not enter the game")
                window.location.href = "menu.html"
            } else {
                playerid = responsedata.id
                console.log("entered game " + playerid)
                // initialise avatar arrays and so on
                for (let i=0;i<5;++i){
                    avatars[i] = new THREE.Object3D();
                }

            }
        } );
    } else {
        console.log('no username')
        window.location.href = "menu.html"
    }

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
        });

        // react on userinput

    // rendering function call here
    render();
}


/**
 * Renders the game using the variables above
 */
// function displayGame()...

$("#btn_exit").click(function() {
    console.log("clicked exit")
    socket.emit('player quits', {id: playerid, user: username})
});