/**
 * In this file a class for web socket communication helper functions is defined.
 *
 * @date 01.11.2018
 * @author Sylvia Reißmann
 */


module.exports = class Chat {

    constructor(wsServer) {
        this.webSocketServer = wsServer;
        this.room = 'game room'
    }

    broadcastMessage(type, msg) {
        this.webSocketServer.emit(type, msg);
    }

    sendPrivate(type, msg, socketid) {
        this.webSocketServer.to(socketid).emit(type, msg);
    }

    getRoomName() {
        return this.room
    }

    broadcastToRoom(type, msg) {
        this.webSocketServer.to(this.room).emit(type, msg)
    }

}