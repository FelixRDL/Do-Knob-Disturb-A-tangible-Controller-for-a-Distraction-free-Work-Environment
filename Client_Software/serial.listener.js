var serialListeners = [];
var connectListeners = [];
var disconnectListeners = [];

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
// TODO: if you are using a genuine Arduino, replace this accordingly
var deviceName = "wchusbserial";
var manufacturerName = "wch.cn";
const baudRate = 9600;
var port = undefined;
const RETRY_INTERVAL = 5000;
const SERIAL_HANDSHAKE_TIMEOUT = 500;

var isConnected = false;

var buffer = '';

connectToHardware();

function handleSerialData(data) {
    console.log(data.toString());
    const msg = parseMsg(data.toString());
    serialListeners.forEach(function (l) {
        l(msg);
    });
}

function parseMsg(msg) {
    const result = {};
    var data = msg.replace('\n', '');
    data = data.split(";");
    result['type'] = 'log';
    result['log_type'] = data[0];
    result['time'] = new Date();
    if (data.length > 1) {
        result['data'] = data[1];
    }
    return result;
}

function connectToHardware() {
    console.log("Connect");
    getDevicePort(
        function (device) {
            console.log(device);
            console.log("Connection Attempt!");
            port = new SerialPort(device.comName, {autoOpen: false, baudRate: baudRate});
            port.open(function (err) {
                    if (err) {
                        setTimeout(connectToHardware, RETRY_INTERVAL);
                        console.error(err);
                    }
                    else {
                        port.on('data', handleSerialData);
                        port.on('close', onDisconnect);
                        connectListeners.forEach(function(listener){listener()});
                        console.log("Opened Successfully!");
                    }
                }
            );
        }, function (reject) {
            console.log("REJECT");
             setTimeout(connectToHardware, RETRY_INTERVAL);
        }
    )
}

function onDisconnect() {
    connectToHardware();
    disconnectListeners.forEach(function(disc){disc()});
}

function getDevicePort(result_cb, reject_cb) {
    console.log("Get Device Port");
    SerialPort.list().then(
        function (res) {
            console.log(res);
            const port = res.find(function (item) {
                return item.comName.indexOf(deviceName) > 0 || item.manufacturer === manufacturerName
            })
            if (port) {
                result_cb(port);
            } else {
                if(!port) {
                    reject_cb();
                }
            }
        },
        function(err) {
            console.error(err);
        }
    )

    // result_cb(res);
}

module.exports = {
    addSerialListener: function (listener) {
        serialListeners.push(listener);
    },
    addConnectListener: function(listener) {
        connectListeners.push(listener);
    },
    addDisconnectListener: function(listener) {
        disconnectListeners.push(listener);
    }
}
