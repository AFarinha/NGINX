var io = require('socket.io-client');
var socket = io.connect('http://192.168.56.1:8072');


socket.on('svr', function(msg1) {
  console.log('svr' + msg1);
});
