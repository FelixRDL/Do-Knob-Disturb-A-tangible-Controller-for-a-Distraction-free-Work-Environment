// TODO: this list should be adapted accordingly
const lists = {
    blacklist: [
        'facebook.com',
        'instagram.com'
    ],
    graylist: [
        'wikipedia.org',
        'youtube.com'
    ]
};

var origin = undefined;
/**
 * The "criticality" of the site:
 * 0: uncritical (not listed)
 * 1: distrupting (listed as graylist)
 * 2: critical (listed in blacklist)
 * @type {number}
 */
var criticality = 0;
var isBlocked = false;

onOpen();

//
//
//


function onOpen() {

    origin = window.location.origin;
    criticality = assessCriticality(origin);
    if(criticality > 0) {
        sendChromeMessage("PAGE_OPENED", origin);
    } else {
        sendChromeMessage("PAGE_OPENED", '<UNLISTED_PAGE>');
    }

    chrome.runtime.onMessage.addListener(onChromeMessage);
}

function onChromeMessage(message, sender, sendResponse) {
    const msg = message;
    if (msg.type === 'set_blocking_level') {
        const level = msg.value;
        if (criticality === 1) {
            if (level === '2') {
                blockSite();
            } else {
                unblockSite();
            }
        } else if (criticality === 2) {
            if (level === '1' || level === '2') {
                blockSite();
            } else {
                unblockSite()
            }

        }
    }
}

function sendChromeMessage(type, value) {
    chrome.runtime.sendMessage({type: type, value: value});
}


//
//
// Assessment of page criticality

function assessCriticality(in_origin) {
    isAddressInBlacklists(lists.blacklist, in_origin);
    isAddressInBlacklists(lists.graylist, in_origin);
    if (isAddressInBlacklists(lists.graylist, in_origin)) {
        return 1;
    } else if (isAddressInBlacklists(lists.blacklist, in_origin)) {
        return 2;
    } else {
        return 0;
    }
}

function isAddressInBlacklists(list, value) {
    const processedVal = value.replace("http://www.", "").replace("https://www.", "").replace(" ", "");

    var addressInBlacklistFlag = false;
    for (var i = 0; i < list.length; i++) {
        const item = list[i];
        if (item === processedVal) {
            addressInBlacklistFlag = true;
        }
    }
    return addressInBlacklistFlag;
}

//
//
// blocking logic

function blockSite() {
    if (!isBlocked) {
        sendChromeMessage("ON_PAGE_BLOCKED", origin);
        isBlocked = true;
        document.documentElement.innerHTML = '<body><h1>We blocked this page for you!</h1><h2>Time to do some actual work right now... ;-)</h2></body>';

    }
}

function unblockSite() {
    if (isBlocked) {
        sendChromeMessage("ON_PAGE_UNBLOCKED", origin);
        location.reload();
    }
}
