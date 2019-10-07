/*
Code Boilerplate taken from https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
*/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'knob-client';

const pid = 1;

const WebSocketServer = require('./ws.js');
const Log = require('./logger.js');
const SystemEventListener = require('./system-event.listener.js');
const SerialEventListener = require('./serial.listener.js');
const IfttClient = require('./ifttt.client.js');

var state = false;
var blockingLevel = 0;

init();

function init() {
    initWebsockets();
    initSystemListeners();
}

function initWebsockets() {
    WebSocketServer.init();
    WebSocketServer.addOnMessageListener(
        function (m) {
            if (m['type'] === 'log') {
                Log.log(m.log_type, m.data, m.time);
            } else if (m['type'] === 'poll_status') {
                WebSocketServer.sendMessage('set_status', blockingLevel);
            }
        });
    WebSocketServer.addOnConnectListener(function() {
        Log.log('chrome_extension_connected', 'NA', new Date());
    });
    WebSocketServer.addOnDisconnectListener(function() {
        Log.log('chrome_extension_disconnected', 'NA', new Date());
    })
}

function initSystemListeners() {
    SystemEventListener.addKeyStrokeListener(function (event) {
        Log.log('key_down', 'NA', new Date());
    });

    SystemEventListener.addMouseClickListener(function (event) {
        Log.log('mouse_down', 'NA', new Date());
    });

    SerialEventListener.addSerialListener(function (msg) {
        if (msg.type === 'log') {
            Log.log(msg.log_type, msg.data, msg.time);
            if (msg.log_type === 'set_status') {
                blockingLevel = msg.data;
                WebSocketServer.sendMessage(msg.log_type, msg.data);
                IfttClient.setMuteLevel(pid, 3 - parseInt(msg.data));
            }
        }
    });

    SerialEventListener.addConnectListener(function() {
        blockingLevel = 0;
        WebSocketServer.sendMessage('set_status', blockingLevel);
        Log.log('device_connected', 'NA', new Date());
    });

    SerialEventListener.addDisconnectListener(function() {
        Log.log('device_disconnected', 'NA', new Date());
    })

}

function timeout() {
    // console.log("BING");
    // console.log(state);
    setTimeout(function () {
            state = !state;
            if (state) {
                WebSocketServer.sendMessage('set_status', 1);
            } else {
                WebSocketServer.sendMessage('set_status', 0);
            }
            timeout();
        },
        1000
    )
}
