


// from example: https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
window.WebSocket = window.WebSocket || window.MozWebSocket;

console.log('i am a client');

var ws = new WebSocket('ws://192.168.178.20:8080');

ws.onopen = function () {
    // connection is opened and ready to use
    console.log('opened connection');
    ws.send('hello server');
};