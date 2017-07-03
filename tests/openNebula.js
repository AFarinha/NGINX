var OpenNebula = require('opennebula');

//var credencials = 'root:opennebula';
var credencials = 'oneadmin:opennebula';
var host = 'http://192.168.56.101:2633/RPC2';
var one = new OpenNebula(credencials, host);


one.version(function(err, data) {
  console.log(data);
});

one.getVMs(function(err, data) {
  //console.log(data);
});

one.getHosts(function(err, data) {
  //console.log(data);
});

var vm = one.getVM(0);

// query API for vm info
vm.info(function (err, data) {
  console.log(data);
});
