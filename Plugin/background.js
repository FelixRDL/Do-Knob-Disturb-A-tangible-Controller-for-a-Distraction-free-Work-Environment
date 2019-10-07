'use strict';

const WS_HOST = "localhost:42429"
var websocket = undefined;

var currFocusLevel = 0;

onInit();


chrome.runtime.onStartup.addListener(function () {
    onInit();
});

chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {
    logToSocket('tab_switch', tabId);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    logToSocket('tab_close', tabId);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const msg = message;
    if (msg.type === "PAGE_OPENED") {
        logToSocket('page_opened', msg.value);
        setTimeout(function () {
            broadcastToExtension('set_blocking_level', currFocusLevel);
        }, 1)
    } else if (msg.type === "ON_PAGE_BLOCKED") {
        logToSocket('page_blocked', msg.value);
    } else if (msg.type === "ON_PAGE_UNBLOCKED") {
        logToSocket('page_unblocked', msg.value);
    }
});

//
//
//

function onInit() {
    initializeWebsocket();
    broadcastToExtension('set_blocking_level', currFocusLevel);
}

//
//
//

function broadcastToExtension(type, data) {
    const msg = {type: type, value: data};
    // Found at https://stackoverflow.com/questions/16046585/chrome-extension-send-message-from-background-script-to-all-tabs
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, msg);
        });
    });
}

function initializeWebsocket() {
    if ('WebSocket' in window) {
        websocket = new WebSocket('ws://' + WS_HOST);
        console.log("======== websocket ===========", websocket);

        websocket.onopen = function () {
            websocket.send(JSON.stringify({
                type: 'poll_status',
                value: undefined
            }));
        };

        websocket.onmessage = function (event) {
            var received_msg = JSON.parse(event.data);
            currFocusLevel = received_msg.value;
            if (received_msg.type === 'set_status') {
                broadcastToExtension('set_blocking_level', currFocusLevel);
            }
        };

        websocket.onclose = function () {
            console.log("==== web socket closed ====== ");
            websocket = undefined;
            retryWebsocketConnect(500);
        }
    }
}

function retryWebsocketConnect(interval) {
    console.log("Retry Websocket Connect");
    setTimeout(function () {
            if (websocket == undefined
            ) {
                initializeWebsocket();
                retryWebsocketConnect();
            }
            else {
                return;
            }
        },
        interval
    )
}

/**
 Allowed types:
 TabSwitch
 Page Requested
 Code Taken from https://www.html5rocks.com/de/tutorials/file/filesystem/
 */
function logToSocket(type, data) {
    data = {
        type: 'log',
        log_type: type,
        data: data,
        time: new Date()
    }
    if (websocket) {
        websocket.send(JSON.stringify(data))
    }
}
