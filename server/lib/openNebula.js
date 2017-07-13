var OpenNebula = require('opennebula'),
    fs = require('fs'),
    db = require('./database.js');

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

        if (params.isCollector == 'true') {
            installer = './Installer/installCentOsNginxAdminCollector.sh';
        } else {
            installer = './Installer/installCentOsNginxAdmin.sh';
        }

        fs.readFile(installer, function(err, data) {
            console.log(data.toString('utf-8'));
            if (params.isCollector == 'true') {
                data = data.toString('utf-8').replace('[IPStation]', params.ipStation.replace('https://', '').replace('http://', ''))
            }
            console.log(data.toString('utf-8'));
            var base64data = new Buffer(data).toString('base64');
            initScript = base64data
            initScript = initScript.slice(0, -4)
            var context = 'CONTEXT = [ SET_HOSTNAME = "' + params.hostname + '", NETWORK = "YES",SSH_PUBLIC_KEY = "' + params.sshKey + '",START_SCRIPT_BASE64 ="' + initScript + '",TARGET = "hda" ]\n'

            one.createVM(context + 'GRAPHICS=[TYPE="vnc",LISTEN="0.0.0.0"]\nMEMORY="512"\n HYPERVISOR="kvm"\nVCPU="1"\nNAME="' + params.vmName + '"\nOS=[ARCH="x86_64"]\n NIC=[NETWORK="private"]\nLOGO="images/logos/centos.png"\nCPU="0.5"\n DISK=[IMAGE_ID="' + params.templateId + '",IMAGE_UNAME="oneadmin"]\nTEMPLATE_ID = "' + params.templateId + '"\n', false, function(err, vm) {

                vm.info(function(err, data) {
                    if (err) {
                        return response({ 'status': 'failed', 'message': err });
                    } else {
                        var vm = {
                            'id': data.VM.ID,
                            'name': data.VM.NAME,
                            'hostname': data.VM.TEMPLATE.CONTEXT.SET_HOSTNAME,
                            'ip': data.VM.TEMPLATE.NIC.IP,
                            'templateId': data.VM.TEMPLATE.TEMPLATE_ID
                        };
                        db.insertVM(vm, function(respInsert) {
                            console.log('Data', respInsert);
                            return response(respInsert);
                        })
                    }
                });
            });
        });
    },

    listTemplates: function(response) {
        one.getTemplates(function(err, data) {
            var arrTemplates = [];
            if (err) {
                return response({
                    'status': 'failed',
                    'message': err
                })
            } else {
                for (var i = 0, len = data.length; i < len; i++) {
                    arrTemplates.push({
                        'id': data[i].ID,
                        'name': data[i].NAME,
                        'user': data[i].UNAME,
                        'groupUser': data[i].GNAME,
                        'groupUser': data[i].TEMPLATE.CPU,
                    })
                }
                return response({
                    'status': 'ok',
                    'message': arrTemplates
                })
            }
        }, null, 0, 1000)
    },

    listVMs: function(response) {
        one.getVMs(function(err, data) {
            var arrVMs = [];
            var arrVMsDB = [];
            if (err) {
                return response({
                    'status': 'failed',
                    'message': err
                })
            } else {
                db.selectAllVMS(function(respSelect) {
                    if (respSelect.status === 'failed') {
                        return response({
                            'status': 'failed',
                            'message': respSelect.message
                        })
                    } else {
                        arrVMsDB = respSelect.message;
                        for (var i = 0, len = data.length; i < len; i++) {
                            var stateString = null;
                            switch (data[i].STATE) {
                                case '0':
                                    stateString = 'INIT'
                                    break;
                                case '1':
                                    stateString = 'PENDING'
                                    break;
                                case '2':
                                    stateString = 'HOLD'
                                    break;
                                case '3':
                                    stateString = 'ACTIVE'
                                    break;
                                case '4':
                                    stateString = 'STOPPED'
                                    break;
                                case '5':
                                    stateString = 'SUSPENDED'
                                    break;
                                case '8':
                                    stateString = 'POWEROFF'
                                    break;
                                case '9':
                                    stateString = 'UNDEPLOYED'
                                    break;
                                case '10':
                                    stateString = 'CLONING'
                                    break;
                                case '11':
                                    stateString = 'CLONING_FAILURE'
                                    break;
                                default:
                                    stateString = 'ERROR!!'
                            }
                            console.log('Antes for');
                            console.log('arrVMs', arrVMs);
                            console.log('arrVMsDB', arrVMsDB);
                            for (var j = arrVMsDB.length - 1; j >= 0; j--) {
                                console.log('if', arrVMsDB[j].id == data[i].ID);
                                console.log('arrVMsDB[i].id', arrVMsDB[j].id);
                                console.log('data[i].ID', data[i].ID);
                                if (arrVMsDB[j].id == data[i].ID) {
                                    console.log('Encontrou VM');
                                    arrVMs.push({
                                        'id': data[i].ID,
                                        'name': data[i].NAME,
                                        'user': data[i].UNAME,
                                        'state': stateString,
                                        'deplyId': data[i].DEPLOY_ID,
                                        'realTime_CPU': data[i].MONITORING.CPU,
                                        'realTime_MEMORY': data[i].MONITORING.MEMORY,
                                        'realTime_STATE': data[i].MONITORING.STATE,
                                        'templateId': data[i].TEMPLATE.TEMPLATE_ID,
                                        'templateName': data[i].TEMPLATE.DISK.IMAGE,
                                        'IP': data[i].TEMPLATE.NIC.IP,
                                    })
                                }
                            }
                        }
                        return response({
                            'status': 'ok',
                            'message': arrVMs
                        })
                    }
                })
            }
        }, null, 0, 1000)
    },
    rebootVM: function(id, response) {
        var vm = one.getVM(id);
        vm.action('reboot', function(err, data) {
            if (err) {
                return response({ 'status': 'failed', 'message': err })
            } else {
                return response({ 'status': 'ok', 'message': data })
            }
        });
    },
    resumeVM: function(id, response) {
        var vm = one.getVM(id);
        vm.action('resume', function(err, data) {
            if (err) {
                return response({ 'status': 'failed', 'message': err })
            } else {
                return response({ 'status': 'ok', 'message': data })
            }
        });
    },
    poweroffVM: function(id, response) {
        var vm = one.getVM(id);
        vm.action('poweroff', function(err, data) {
            if (err) {
                return response({ 'status': 'failed', 'message': err })
            } else {
                return response({ 'status': 'ok', 'message': data })
            }
        });
    },
    deleteVM: function(id, response) {
        var vm = one.getVM(id);
        vm.action('delete', function(err, data) {
            if (err) {
                return response({ 'status': 'failed', 'message': err })
            } else {
                console.log('Delete VM from DB');
                db.deleteVM(id, function(respDelete) {
                    console.log('Data', respDelete);
                    return response(respDelete);
                });
            }
        });
    }
};
