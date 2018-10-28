

function createWebSocket() {
    var WebSocket = require('websocket').client
    const ws = new WebSocket('wss://127.0.0.1:8080');
    return ws;
}