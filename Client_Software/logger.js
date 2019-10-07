const fs = require('fs');

module.exports = {
  log: function(type, data, timestamp) {
      const fileName = getFileName();
      const datastring = '"{0}","{1}","{2}"\n'.format(timestamp, type, data);
      fs.appendFileSync('./'+fileName, datastring, 'utf8');
  }
}

function getFileName() {
  var date = new Date();
  date.setHours(0,0,0);
  date = date.toLocaleDateString("de",{timezone:"UTC"})
  var fileName = "log_" + date + ".csv";
  return fileName;
}
// retrieved from https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/32202320#32202320
String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};
