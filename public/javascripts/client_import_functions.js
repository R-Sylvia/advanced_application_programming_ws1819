

function createWebSocket() {
    let WebSocket = require('websocket').client
    const ws = new WebSocket('wss://127.0.0.1:8080');
    return ws;
}

function getUserName() {

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

    $.ajax(settings).done(function (response) {
        if (response.status == 200) {
            console.log("getting unsername was successfull")
            console.log(response.data)
        } else {
            console.log('getting username was not successfull');
            alert("khabaret")
        }
    })

}

module.exports = {
    getUserName: getUserName,
};