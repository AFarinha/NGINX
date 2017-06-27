var express = require('express'),
  fs = require('fs'),
  utils = require('./lib/utils'),
  generateFiles = require('./lib/GenerateFiles'),
  cp = require('child_process'),
  bodyParser = require('body-parser'),
  sqlite3 = require('sqlite3').verbose(),
  db = require('./lib/database.js');

var Collector = require('./lib/collector');

var app = express();
var databaseName = "nginx";
//para Dashboard
var collectorProcess = new Collector();
collectorProcess.init();

app.use(express.static('./public'));
app.use(bodyParser.json());

app.post('/nginx/reload', function(req, res) {
  var output = cp.spawnSync('/usr/sbin/nginx', ['-s', 'reload'], {
    encoding: 'utf8'
  });

  res.send({
    'status': 'ok',
    'stdout': output.stdout.toString(),
    'stderr': output.stderr.toString(),
  });
});

app.post('/nginx/test', function(req, res) {
  var output = cp.spawnSync('/usr/sbin/nginx', ['-t'], {
    encoding: 'utf8'
  });

  res.send({
    'status': 'ok',
    'stdout': output.stdout.toString(),
    'stderr': output.stderr.toString(),
  });
});

app.post('/host', function(req, res) {
  //console.log(req.body);
  var confcontent = generateFiles.createServerConf(req.body);

  var confUpdtreamContent = generateFiles.createUpstreamConf(req.body.arrayLocations);
  try{
    utils.writeFileSync(req.body.host,confcontent)

    confUpdtreamContent.forEach(function (item) {
      utils.writeFileSync(item.name,item.conf)
    });

    //chamar insertVHostV2

    var vhost = {
             'id'      :req.body.id
            ,'instance':req.body.instance || ''
            ,'name'    :req.body.host
            ,'port'    :req.body.port
            ,'config'  :req.body
          };

      db.insertVHostV2(vhost,function(message){
        console.log("Erro:",message);
        return res.send(
          message
        );
      });

  }catch(err){
    console.log("Erro:",err);
    res.send({
      'STATUS': 'FAILED',
      'MESSAGE': err
    });
  }

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
              ,'instance':req.body.instance == undefined ? '' : req.body.instance
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
    console.log(message);
    res.send(message);
  });
});

app.get('/getAllVHosts', function(req, res) {

  db.selectAllVHosts(function(message){
    res.send(message);
  });
});

app.delete('/deleteVHost/:id', function(req, res) {

  db.deleteVHost(req.params.id,function(message){
    res.send(message);
  });

});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  db.initBD(databaseName);
  console.log('Dashboard listening on port ' + port);
});
