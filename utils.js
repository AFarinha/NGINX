var fs = require('fs');

module.exports = {
  prepareConf: function(template, options) {
    var content = fs.readFileSync('./templates/' + template + '.conf').toString('utf8');

    var keys = Object.keys(options);

    for (var i = 0; i < keys.length; i++) {
      content = content.replace('[' + keys[i] + ']', options[keys[i]]);
    }

    return content;
  }
};
