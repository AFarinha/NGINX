#!/usr/bin/env node

var Tail = require('tail').Tail,
  parser = require('./parser'),
  os = require('os'),
  io = require('socket.io').listen(8081);


var Collector = function() {
  this.requests = [];
};

Collector.prototype.init = function() {
  var self = this;

  this.path = '/var/log/nginx/access.log';
  this.tail = new Tail(this.path);

  this.tail.on('line', function(data) {
    var req = parser(data);

    if (self.isValid(req)) {
      self.processDashode(req);
    } else {
      console.log('Discarding request:');
      console.log(req);
      if (self.statsd) {
        self.counter('http', 'parser.nok', 1);
      }
    }
  });

  this.tail.on('error', function(error) {
    console.log('TAIL ERROR: ', error);
  });
  //inicia o timmer para estar sempre a enviar para a pagina
  this.loadDashode();

  console.log('(collector) Started!');
  console.log('(collector) Watching log: ' + this.path);
};


Collector.prototype.isValid = function(req) {
  if (!req.remote_addr || req.remote_addr.indexOf(' ') !== -1 || !req.host || req.host.indexOf(' ') !== -1 || !req.http_method || req.http_method.indexOf(' ') !== -1 || !req.status || !req.remote_user) {
    /*
        console.log(!req.remote_addr );
        console.log(req.remote_addr.indexOf(' ') !== -1);
        console.log(!req.host);
        console.log(req.host.indexOf(' ') !== -1);
        console.log(!req.http_method);
        console.log(req.http_method.indexOf(' ') !== -1);
        console.log(!req.status);
        console.log(!req.remote_user);
        console.log('1');
    */
    return false;
  }

  if (req.cache && req.cache !== null && /\d/.test(req.cache)) {
    return false;
  }

  if (/\d/.test(req.http_method)) {
    return false;
  }

  return true;
};

Collector.prototype.loadDashode = function() {
  var self = this;

  //vai enviar para a pagina
  io.on('connection', function(socket) {
    //??retirar e enviar apenas no event on('line')
    setInterval(function() {

      var payload = {
        'info': {
          'freemem': bytesToSize(os.freemem()),
          'usedmem': bytesToSize(os.totalmem() - os.freemem()),
          'totalmem': bytesToSize(os.totalmem()),
          'load': parseInt((os.loadavg()[0] * 100) / os.cpus().length),
          'uptime': secondsToString(os.uptime()),
          'networkInterfaces': os.networkInterfaces(),
          'hostname': os.hostname(),
          'osTypePlatform': os.type() + ' ' + os.platform(),
          'cpus': os.cpus(),
          'loadavg': os.loadavg()
        },
        'requests': self.requests
      };
      self.requests = [];
      socket.emit('svr', payload);
    }, 1000);
  });

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  function secondsToString(seconds) {
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;
    return numdays + " days " +  numhours + ":" + numminutes + ":" + numseconds;
  }
};


Collector.prototype.processDashode = function(req) {
  this.requests.push(req);
};


module.exports = Collector;
