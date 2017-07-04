var OpenNebula = require('opennebula');

//var credencials = 'root:opennebula';
var credencials = 'oneadmin:fbc2e553ad9fa747cf12f83bb072c5f8';
var host = 'http://192.168.1.190:2633/RPC2';
var one = new OpenNebula(credencials, host);


one.version(function(err, data) {
  //console.log(data);
});

one.getVMs(function(err, data) {
  //console.log(data);
});

one.getHosts(function(err, data) {
  //console.log(data);
});

var vm = one.getVM(1);

// query API for vm info
vm.info(function (err, data) {
  console.log(data['VM']['TEMPLATE']['NIC']);
});
