/*const url = 'wss://test-ws-client.try'
const connection = new WebSocket(url)



connection.onopen = () => {
  connection.send('hey');
  console.log('on open event');
}

connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
    //console.log(e.data)
}*/


"use strict";
import { createWebSocket } from "./client_import_functions"

console.log('message');

var ws = createWebSocket();

ws.onopen = function() {
    console.log('open')
}

ws.onmessage = function(ev) {
    let _data = JSON.parse(ev.data);

    console.log(_data);
}