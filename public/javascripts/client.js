


// from example: https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
//window.WebSocket = window.WebSocket || window.MozWebSocket;

let socket = io();

console.log('i am a client');

//let ws = new WebSocket('ws://149.222.154.38:8080');
//let ws = new WebSocket('ws://192.168.178.20:8080');
//let ws = io();

/*
ws.onopen = function () {
    // connection is opened and ready to use
    console.log('opened connection');
    ws.send('hello server');
};*/

$(function () {
    //var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
});




// socket.io
// do not use var