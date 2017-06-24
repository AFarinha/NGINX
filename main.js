var express = require('express'),
  fs = require('fs'),
  utils = require('./utils'),
  cp = require('child_process'),
  bodyParser = require('body-parser'),
  sqlite3 = require('sqlite3').verbose(),
  db = require('./examples/SiteNGINX/database.js');

var app = express();
var databaseName = "nginx";

app.use(express.static('./public'));
app.use(bodyParser.json());

app.post('/nginx/reload', function(req, res) {
  var output = cp.spawnSync('/usr/sbin/nginx', ['-s', 'reload'], {
    encoding: 'utf8'
  });

  res.send({
    'STATUS': 'OK',
    'stdout': output.stdout.toString(),
    'stderr': output.stderr.toString(),
  });
});

app.post('/nginx/test', function(req, res) {
  var output = cp.spawnSync('/usr/sbin/nginx', ['-t'], {
    encoding: 'utf8'
  });

  res.send({
    'STATUS': 'OK',
    'stdout': output.stdout.toString(),
    'stderr': output.stderr.toString(),
  });
});

app.post('/host', function(req, res) {
  console.log(req.body);

  var confcontent = utils.prepareConf('simpleproxy', {
    'SERVERNAME': req.body.host,
    'PORT': req.body.port,
    'PROXY': req.body.destination,
    'CACHE': req.body.cache === true ? 'include /etc/nginx/dashboard/cache.conf;' : '',
    'EXTENSIONS' : req.body.extensions,
    'CACHEBROWSER' : req.body.cacheBrowser,
  });

  fs.writeFile('/etc/nginx/conf.d/' + req.body.host + '.conf', confcontent, function(err) {
    if (err) {
      return res.STATUS(500).send({
        'STATUS': 'FAILED',
        'MESSAGE': err
      });
    }

    res.send({
      'STATUS': 'created'
    });
  });
});


app.post('/insertVHost', function(req, res) {

  var vhost = {'instance':req.body.instance
              ,'name'    :req.body.name
              ,'port'    :req.body.port
              ,'config'  :req.body.config
            };
  
  db.insertVHost(vhost,function(message){
    res.send(message);
  });

});

app.post('/insertVHostV2', function(req, res) {
  
  var vhost = {
               'id'      :req.body.id
              ,'instance':req.body.instance
              ,'name'    :req.body.name
              ,'port'    :req.body.port
              ,'config'  :req.body.config
            };
  
  db.insertVHostV2(vhost,function(message){
    res.send(message);
  });

});

app.get('/getVHost/:id', function(req, res) {

  db.selectVHost(req.params.id,function(message){
    res.send(message);
  });
});

app.get('/getAllVHosts', function(req, res) {

  db.selectAllVHosts(req.params.id,function(message){
    res.send(message);
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  db.initBD(databaseName);
  console.log('Dashboard listening on port ' + port);
});
