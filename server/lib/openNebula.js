
var OpenNebula = require('opennebula'),
    fs = require('fs');

    var credencials = 'oneadmin:fbc2e553ad9fa747cf12f83bb072c5f8';
    var host = 'http://192.168.1.190:2633/RPC2';
    var one = new OpenNebula(credencials, host);

module.exports = {

  InitConection: function() {

    one.version(function(err, data) {
        console.log(data);
    });
  },

  createNewVM: function(params, response) {
    console.log('passou');
    var installer;

    if(params.isCollector == 'true'){
      installer = './Installer/installCentOsNginxAdminCollector.sh';
    }else{
      installer = './Installer/installCentOsNginxAdmin.sh';
    }

    fs.readFile(installer, function(err, data) {
      console.log(data.toString('utf-8'));
      if(params.isCollector == 'true'){
        data = data.toString('utf-8').replace('[IPStation]',  params.ipStation.replace('https://', '').replace('http://', '') )
      }
      console.log(data.toString('utf-8'));
       var base64data = new Buffer(data).toString('base64');
       initScript = base64data
       initScript = initScript.slice(0,-4)
       var context = 'CONTEXT = [ SET_HOSTNAME = "' + params.hostname + '", NETWORK = "YES",SSH_PUBLIC_KEY = "' + params.sshKey + '",START_SCRIPT_BASE64 ="' + initScript + '",TARGET = "hda" ]\n'

       one.createVM( context + 'GRAPHICS=[TYPE="vnc",LISTEN="0.0.0.0"]\nMEMORY="512"\n HYPERVISOR="kvm"\nVCPU="1"\nNAME="' + params.vmName + '"\nOS=[ARCH="x86_64"]\n NIC=[NETWORK="private"]\nLOGO="images/logos/centos.png"\nCPU="0.5"\n DISK=[IMAGE="CentOS 7 - KVM",IMAGE_UNAME="oneadmin"]\nTEMPLATE_ID = "5"\n', false, function(err, vm) {

         vm.info(function(err, data) {
           response(data);
           //tem de gravar na BD
         });
       });
    });

  }
};
