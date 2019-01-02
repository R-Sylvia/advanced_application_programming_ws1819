

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

let username = null
let playerid = null

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
            console.log("received avatar message")
        });

        socket.on('item positions', function (msg) {
            // render new gamefield
            console.log("received item message")
        });

        socket.on('current scores', function (msg) {
            // render new gamefield
            console.log("received scores message")
        });

        socket.on('game ends', function (msg) {
            // show scores
            console.log("received game end message")
        });

        // react on userinput

}


/**
 * Renders the game using the variables above
 */
// function displayGame()...

$("#btn_exit").click(function() {
    console.log("clicked exit")
    socket.emit('player quits', {id: playerid, user: username})
});