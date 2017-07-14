var express = require('express'),
  utils = require('./utils'),
  generateFiles = require('./GenerateFiles'),
  cp = require('child_process'),
  bodyParser = require('body-parser'),
  nginx = require('./nginx.js');

var ApiCollector = function(port) {
  this.port = port;
  this.app = express();
  this.app.use(bodyParser.json());
  this.httpServer = require('http').Server(this.app);
};


ApiCollector.prototype.init = function() {
  var self = this;

  this.httpServer.listen(this.port);
  console.log('(server) CollectorConfig listening on port ' + this.port);

  this.app.post('/nginx/reload', function(req, res) {
    console.log('\n------------------------- /nginx/reload -------------------------\n');
    nginx.reloadNginx(req, function(response) {
        res.send(response)
    })
  });

  this.app.post('/nginx/test', function(req, res) {
    console.log('\n------------------------- /nginx/test -------------------------\n');
    nginx.testNginx(req, function(response) {
        console.log(response);
        res.send(response)
    })
  });

  //acho que tanto pode escrever upstreams como Vhosts
  this.app.post('/write', function(req, res) {
    //Tem de receber o nome do ficheiro e o conteudo
    if (req.body.filename == 'undefined' || req.body.fileContent == 'undefined') {
      res.send({
        'status': 'failed',
        'message': 'parameters undefined'
      })
    } else {
      utils.writeFile(req.body.filename, req.body.fileContent, function(message) {
        res.send({
          'status': message.status,
          'message': message.message
        })
      });
    }
  });
  //acho que tanto pode apagar upstreams como Vhosts
  this.app.delete('/delete/:filename', function(req, res) {
    //Tem de receber o nome do ficheiro
    if (req.params.filename == 'undefined') {
      res.send({
        'status': 'failed',
        'message': 'parameters undefined'
      })
    } else {
      utils.deleteFile(req.params.filename, function(message) {
        res.send({
          'status': message.status,
          'message': message.message
        })
      });
    }
  });
};

module.exports = ApiCollector;
