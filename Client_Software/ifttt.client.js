const request = require("request");
// TODO: Insert your own IFTTT key and account name there
const BASE_URL = "https://maker.ifttt.com/trigger/<IFTTT_USERNAME>_prio{0}_dev{1}/with/key/{2}"
const DEV_KEY = "YOUR_OWN_IFTTT_DEV_KEY"

const DEBOUNCE = 2000;
let debounce_active = false;
let value = -1;

module.exports = {
  /**
  * 0: do not mute
  * 1: vibrate
  * 2: silence!
  * */
  setMuteLevel: function(pid, level) {
    if(!debounce_active) {
      debounce_active = true;
      // Debounce input, since things might get mixed up on quick changes
      setTimeout(() => {
        debounce_active = false;
        setMuteValue(pid, value);
      }, DEBOUNCE);
    }
    value = level;
  }
}

function setMuteValue(pid, level) {
  const url = BASE_URL.format(level, pid, DEV_KEY);
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     url,
    body:    ""
  }, function(error, response, body){
    return;
  });
}
