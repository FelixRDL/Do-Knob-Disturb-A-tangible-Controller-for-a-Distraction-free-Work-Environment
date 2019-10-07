// NOTE: you may need to enable system control in security settings for terminal first!sdf

mouseClickListeners = [];
keyStrokeListeners = [];

ioHook = require('iohook');

// Used https://wilix-team.github.io/iohook/usage.html as boilerplate

module.exports = {
  addMouseClickListener: function(listener) {
    mouseClickListeners.push(listener);
  },
  addKeyStrokeListener: function(listener) {
    keyStrokeListeners.push(listener);
  }
}


ioHook.on('mousedown', event => {
  mouseClickListeners.forEach((listener) => {
    listener(event);
  })
});

ioHook.on('keydown', event => {
  keyStrokeListeners.forEach((listener) => {
    listener(event);
  })
});

// Register and start hook
ioHook.start();
