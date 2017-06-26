// Server
var io1 = require('socket.io').listen(8321);

io1.on('connection', function(socket1) {

  var i= 0;
  var interval = setInterval(function(str1, str2) {
    i++;
    socket1.emit('svr', 'emitiu do server');
  }, 1000);

});
