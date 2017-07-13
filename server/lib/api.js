var express = require('express'),
    utils = require('./utils'),
    generateFiles = require('./GenerateFiles'),
    cp = require('child_process'),
    bodyParser = require('body-parser'),
    sqlite3 = require('sqlite3').verbose(),
    db = require('./database.js'),
    opennebula = require('./openNebula.js'),
    nginx = require('./nginx.js'),
    net = require('net'),
    request = require('request');

var Api = function(port, station, databaseName) {
    this.station = station;

    this.port = port;
    this.databaseName = databaseName;
    this.app = express();

    this.app.use(express.static('./public'));
    this.app.use(bodyParser.json());

    this.httpServer = require('http').Server(this.app);
};


Api.prototype.init = function() {
    var self = this;

    this.httpServer.listen(this.port);
    console.log('(server) Dashboard server listening on port ' + this.port);
    db.initBD(this.databaseName);

    this.app.get('/api/stats/:hostname', function(req, res) {
        var keys = Object.keys(self.station.collectors);

        var hostname = req.params.hostname;
        if (hostname === 'all') {
            hostname = undefined;
        }
        var outputStats;
        var outputCacheStats;

        for (var i = 0; i < keys.length; i++) {
            var collector = self.station.collectors[keys[i]];
            if (hostname === keys[i] || hostname === undefined) {

                outputStats = collector.appendStatistics(outputStats, collector.statistics);
                outputCacheStats = collector.appendData(outputCacheStats, collector.cacheStatistics);
            }
        }

        if (outputStats.requesttime) {
            outputStats.requesttime /= keys.length;
        }
        if (outputStats.upstreamtime) {
            outputStats.upstreamtime /= keys.length;
        }

        res.json({
            'statistics': outputStats,
            'hostnames': keys,
            'top': {
                'error': self.station.topErrors,
                'requests': self.station.topRequests,
                'sites': self.station.topHostnames
            },
            'cache': outputCacheStats,
            'date': new Date().getTime()
        });
    });

    this.app.post('/api/nginx/reload', function(req, res) {
        console.log('\n------------------------- /nginx/reload -------------------------\n');
        nginx.reloadNginx(req, function(response) {
            res.send(response)
        })
    });

    this.app.post('/api/nginx/test', function(req, res) {
        console.log('\n------------------------- /nginx/test -------------------------\n');
        nginx.testNginx(req, function(response) {
            res.send(response)
        })
    });

    this.app.post('/api/newHost', function(req, res) {
        console.log('\n------------------------- /newHost -------------------------\n');
        nginx.configureVhost(req, function(response) {
            res.send(response)
        })
    });

    this.app.delete('/api/deleteUpstream/:id/:name/:instance', function(req, res) {
        console.log('\n------------------------- /deleteUpstream -------------------------\n');
        nginx.deleteUpstream(req, function(response) {
            res.send(response)
        })
    });

    this.app.post('/api/insertVHostV2', function(req, res) {
        console.log('\n------------------------- /insertVHostV2 -------------------------\n');
        console.log('ID do HOST', req.body.id);
        var vhost = {
            'id': req.body.id,
            'instance': req.body.instance == undefined ? '' : req.body.instance,
            'name': req.body.name,
            'port': req.body.port,
            'config': req.body.config
        };

        db.insertVHostV2(vhost, function(message) {
            res.send(message);
        });
    });

    this.app.get('/api/getVHost/:id', function(req, res) {
        db.selectVHost(req.params.id, function(message) {
            console.log(message);
            res.send(message);
        });
    });

    this.app.get('/api/getAllVHosts', function(req, res) {
        db.selectAllVHosts(function(message) {
            res.send(message);
        });
    });

    this.app.get('/api/getAllUpstreams', function(req, res) {
        db.selectAllUpstreams(function(message) {
            res.send(message);
        });
    });

    this.app.post('/api/newHost', function(req, res) {
        nginx.configureVhost(req, function(response) {
            res.send(response)
        })
    });

    /********************** VMS **********************/

    this.app.post('/api/newVM', function(req, res) {
        console.log('\n------------------------- /newVM -------------------------\n');
        var vm = {
            'id': req.body.id,
            'name': req.body.name,
            'hostname': req.body.hostname,
            'ip': req.body.ip,
            'templateId': req.body.templateId,
        };
        db.insertVM(vm, function(response) {
            res.send(response)
        })
    });

    this.app.delete('/api/deleteVM/:id', function(req, res) {
        console.log('\n------------------------- /deleteVM -------------------------\n');
        db.deleteVM(req.params.id, function(response) {
            res.send(response)
        })
    });

    this.app.get('/api/getAllVMS', function(req, res) {
        console.log('\n------------------------- /getAllVMS -------------------------\n');
        db.selectAllVMS(function(message) {
            res.send(message);
        });
    });

    this.app.get('/api/getVMById/:id', function(req, res) {
        db.selectVMByID(req.params.id, function(message) {
            res.send(message);
        });
    });

    /*************************************************/

    this.app.post('/api/newUpstream', function(req, res) {
        nginx.configureUpstream(req, function(response) {
            res.send(response)
        })
    });

    this.app.delete('/api/deleteVHost2/:id/:name/:port/:instance', function(req, res) {
        nginx.deleteVhost(req, function(response) {
            res.send(response)
        })
    });

    this.app.get('/api/getAllDirectives', function(req, res) {
        console.log('\n------------------------- /getAllDirectives -------------------------\n');
        db.selectAllDirectives(function(message) {
            //console.log('Response:', message);
            res.send(message);
        });
    });

    this.app.get('/api/getDirectivesFilter/:context', function(req, res) {
        console.log('\n------------------------- /getDirectivesFilter -------------------------\n');
        console.log('Req.params.context:', req.params.context);
        db.selectDirectivesFilter(req.params.context, function(message) {
            //console.log('Response:', message);
            res.send(message);
        });
    });


    this.app.post('/api/opennebula/createVM', function(req, res) {
        opennebula.createNewVM(req.body, function(message) {
            res.send(message);
        })
    })

    this.app.get('/api/opennebula/listTemplates', function(req, res) {
        opennebula.listTemplates(function(message) {
            //  {"status":"ok","message":[{"id":"4","name":"ttylinux - kvm","user":"oneadmin","groupUser":"0.1"},{"id":"5","name":"CentOS 7 - KVM","user":"oneadmin","groupUser":"0.1"},{"id":"8","name":"Cent-Os 7 - Basic deployment NginxAdmin","user":"oneadmin","groupUser":"0.1"}]}
            res.send(message);
        })
    })

    this.app.get('/api/opennebula/listVMs', function(req, res) {
        opennebula.listVMs(function(message) {
            //  {"status":"ok","message":[{"id":"121","name":"To Image","user":"oneadmin","state":"8","deplyId":"one-121","realTime_CPU":"0.0","realTime_MEMORY":"0","templateId":"5"},{"id":"138","name":"Dash","user":"oneadmin","state":"3","deplyId":"one-138","realTime_CPU":"0.0","realTime_MEMORY":"524288","realTime_STATE":"a","templateId":"8"},{"id":"143","name":"Name","user":"oneadmin","state":"3","deplyId":"one-143","realTime_CPU":"1.01","realTime_MEMORY":"681512","realTime_STATE":"a","templateId":"8"},{"id":"144","name":"undefined","user":"oneadmin","state":"3","deplyId":"one-144","realTime_CPU":"0.0","realTime_MEMORY":"563456","realTime_STATE":"a","templateId":"8"}]}
            //https://docs.opennebula.org/5.2/operation/references/vm_states.html
            // se estado != 3 não esta a running
            res.send(message);
        })
    })

    this.app.get('/api/opennebula/rebootVM/:id', function(req, res) {
        var id = parseInt(req.params.id);
        opennebula.rebootVM(id, function(message) {
            res.send(message);
        })
    })
    this.app.get('/api/opennebula/resumeVM/:id', function(req, res) {
        var id = parseInt(req.params.id);
        opennebula.resumeVM(id, function(message) {
            res.send(message);
        })
    })
    this.app.get('/api/opennebula/poweroffVM/:id', function(req, res) {
        var id = parseInt(req.params.id);
        opennebula.poweroffVM(id, function(message) {
            res.send(message);
        })
    })
    this.app.get('/api/opennebula/deleteVM/:id', function(req, res) {
        var id = parseInt(req.params.id);
        opennebula.deleteVM(id, function(message) {
            res.send(message);
        })
    })
};

module.exports = Api;
