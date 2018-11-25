


module.exports = class Chat {

    constructor(wsServer) {
        this.webSocketServer = wsServer;
    }

    broadcastMessage(msg) {
        this.webSocketServer.emit('chat message', msg);
    }
}