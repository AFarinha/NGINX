
var OpenNebula = require('opennebula');

one.version(function(err, data) {

  console.log(data);
});


var OpenNebulaManager = function() {
  var listVms = [];
  var listTemplates = [];
  //declare variables
};

OpenNebulaManager.prototype.init = function() {
  //connect to OpenNebula
  var credencials = 'oneadmin:opennebula';
  var host = 'http://192.168.56.101:2633/RPC2';
  var one = new OpenNebula(credencials, host);

};

OpenNebulaManager.prototype.listVm = function() {
  one.getVMs(callback, userFilter, startID, endID, stateFilter);
};

OpenNebulaManager.prototype.listTemplates = function() {
  one.getTemplates(callback, userFilter, startID, endID);
};

OpenNebulaManager.prototype.createVM = function() {
  one.createVM(template, state, callback);
};


module.exports = OpenNebula;
