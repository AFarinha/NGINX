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

var vm = one.getVM(143);

// query API for vm info
// vm.info(function(err, data) {
//   console.log(data);
//   console.log(data['VM']['TEMPLATE']['NIC']);
// });

// vm.action('poweroff', function(err, data) {
//   if(err){
//     return response({'status': 'failed', 'message': err})
//   }else{
//     return response({'status': 'ok', 'message': data})
//   }
// });

// one.getTemplates(function(err, data){
//   var arrTemplates= [] ;
//   if(err){
//     return response({'status': 'failed', 'message': err})
//   }else {
//     for (var i = 0, len = data.length; i < len; i++) {
//       arrTemplates.push({
//         'id' : data[i].ID,
//         'name' : data[i].NAME,
//         'user' : data[i].UNAME,
//         'groupUser' : data[i].GNAME,
//         'groupUser' : data[i].TEMPLATE.CPU,
//       })
//     }
//     return response({'status': 'ok', 'message': arrTemplates})
//   }
// }, null, 0, 1000)


one.getVMs(function(err, data) {
  var arrVms = [];
  if (err) {
    //return response({
    //  'status': 'failed',
    //  'message': err
    //})
  } else {
    for (var i = 0, len = data.length; i < len; i++) {
      arrVms.push({
        'id': data[i].ID,
        'name': data[i].NAME,
        'user': data[i].UNAME,
        'state': data[i].STATE,
        'deplyId': data[i].DEPLOY_ID,
        'realTime_CPU': data[i].MONITORING.CPU,
        'realTime_MEMORY': data[i].MONITORING.MEMORY,
        'realTime_STATE': data[i].MONITORING.STATE,
        'templateId': data[i].TEMPLATE.TEMPLATE_ID,
      })
    }
    //return response({
    //  'status': 'ok',
    //  'message': arrVms
    //})
    console.log(data);
    console.log(arrVms);
  }
}, null, 0, 1000)
