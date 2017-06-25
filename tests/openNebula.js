var OpenNebula = require('opennebula');

//var credencials = 'root:opennebula';
var credencials = 'oneadmin:opennebula';
var host = 'http://192.168.56.101:2633/RPC2';
var one = new OpenNebula(credencials, host);


one.version(function(err, data) {
  console.log(data);
});
