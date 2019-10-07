/*
Code Boilerplate taken from https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
*/
"use strict";
// TODO: replace
// Port where we'll run the websocket server
var webSocketsServerPort = 42429;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = [];
var onMessageListeners = [];
var disconnectListeners = [];
var connectListeners = [];
var server = undefined,
    wsServer = undefined;

module.exports = {
    init: function (port) {
        initServer();
        initWsServer();
    },
    sendMessage: function (type, data) {
        const msg = {
            type: type,
            value: data
        };
        clients.forEach(function (client) {
            client.sendUTF(JSON.stringify(msg))
        })
    },
    addOnMessageListener: function (listener) {
        onMessageListeners.push(listener);
    },
    addOnConnectListener: function (l) {
        connectListeners.push(l);
    },
    addOnDisconnectListener: function (l) {
        disconnectListeners.push(l);
    }
}

function initServer() {
    server = http.createServer(function (request, response) {
    });
    server.listen(webSocketsServerPort, function () {
        console.log((new Date()) + " Server is listening on port " +
            webSocketsServerPort);
    });
}

function initWsServer() {
    /**
     * WebSocket server
     */
    wsServer = new webSocketServer({
        // WebSocket server is tied to a HTTP server. WebSocket
        // request is just an enhanced HTTP request. For more info
        // http://tools.ietf.org/html/rfc6455#page-6
        httpServer: server
    });

    // This callback function is called every time someone
    // tries to connect to the WebSocket server
    wsServer.on('request', function (request) {
        console.log((new Date()) + ' Connection from origin ' +
            request.origin + '.');

        // accept connection - you should check 'request.origin' to
        // make sure that client is connecting from your website
        // (http://en.wikipedia.org/wiki/Same_origin_policy)
        var connection = request.accept(null, request.origin);
        connectListeners.forEach(function (l) {
            l()
        });
        clients.push(connection);
        // we need to know client index to remove them on 'close' event

        console.log((new Date()) + ' Connection accepted.');


        // user sent some message
        connection.on('message', function (message) {
            if (message.type === 'utf8') { // accept only text
                onMessageListeners.forEach(function (listener) {
                    try {
                        listener(JSON.parse(message.utf8Data));
                    } catch (e) {
                        // console.log(e);
                        console.log("Parsing error", message.utf8Data);
                    }
                });
                return;
            }
        });

        // user disconnected
        connection.on('close', function (connection) {
            disconnectListeners.forEach(function (l) {
                l()
            });
            return;
        });
    });
}
