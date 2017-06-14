var express = require('express'),
  fs = require('fs'),
  utils = require('./utils'),
  exec = require('child_process').execSync;


var app = express();

app.use(express.static('./public'));

app.post('/host', function(req, res) {

  var confcontent = utils.prepareConf('simpleproxy', {
    'SERVERNAME': 'xpto.pt',
    'PORT': '80',
    'PROXY': 'http://127.0.0.1:3001'
  });

  fs.writeFile("/etc/nginx/conf.d/xpto.conf", confcontent, function(err) {
    if (err) {
      return res.status(500).send({
        'status': 'failed',
        'message': err
      });
    }

    /*
    var options = {
      encoding: 'utf8'
    };

    var output = exec('service nginx restart', options).toString('utf8');
    console.log(output);
    */

    res.send({
      'status': 'created'
    });
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Dashboard listening on port ' + port);
});
