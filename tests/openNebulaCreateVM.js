var OpenNebula = require('opennebula');
var fs = require('fs');

//var credencials = 'root:opennebula';
var credencials = 'oneadmin:fbc2e553ad9fa747cf12f83bb072c5f8';
var host = 'http://192.168.1.190:2633/RPC2';
var one = new OpenNebula(credencials, host);


var sshKey = '';
var vmName = 'CentOS s7 - KVM';
//var initScript = 'dXNlcm1vZCAtLXBhc3N3b3JkICQoZWNobyByb290IHwgb3BlbnNzbCBwYXNzd2QgLTEgLXN0ZGluKSByb290';
var initScript = '';

fs.readFile('../Installer/installCentOs.sh', function(err, data) {
  console.log(err);
   var base64data = new Buffer(data).toString('base64');
   initScript = base64data
   console.log('readFile');
   CreateVM();
});

function CreateVM() {
  console.log('depois');
  initScript = initScript.slice(0,-4)
  console.log(initScript);

  var context = 'CONTEXT = [ NETWORK = "YES",SSH_PUBLIC_KEY = "' + sshKey + '",START_SCRIPT_BASE64 ="' + initScript + '",TARGET = "hda" ]\n'

  one.createVM( context + 'GRAPHICS=[TYPE="vnc",LISTEN="0.0.0.0"]\nMEMORY="512"\n HYPERVISOR="kvm"\nVCPU="1"\nNAME="' + vmName + '"\nOS=[ARCH="x86_64"]\n NIC=[NETWORK="private"]\nLOGO="images/logos/centos.png"\nCPU="0.5"\n DISK=[IMAGE="CentOS 7 - KVM",IMAGE_UNAME="oneadmin"]\nTEMPLATE_ID = "5"\n', false, function(err, vm) {

    vm.info(function(err, data) {
      console.log(data);
    });
  });
}
