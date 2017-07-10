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
        var output = cp.spawnSync('/usr/sbin/nginx', ['-s', 'reload'], {
            encoding: 'utf8'
        });

        res.send({
            'status': 'ok',
            'stdout': output.stdout.toString(),
            'stderr': output.stderr.toString(),
        });
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

    this.app.post('/api/opennebula/createVM', function(req, res) {
        opennebula.createNewVM(req.body, function(message) {
            res.send(message);
        })
    })
};

module.exports = Api;
