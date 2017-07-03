var express = require('express'),
    utils = require('./utils'),
    generateFiles = require('./GenerateFiles'),
    cp = require('child_process'),
    bodyParser = require('body-parser'),
    sqlite3 = require('sqlite3').verbose(),
    db = require('./database.js');

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

    this.app.get('/stats/:hostname', function(req, res) {
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

    this.app.post('/nginx/reload', function(req, res) {
        var output = cp.spawnSync('/usr/sbin/nginx', ['-s', 'reload'], {
            encoding: 'utf8'
        });

        res.send({
            'status': 'ok',
            'stdout': output.stdout.toString(),
            'stderr': output.stderr.toString(),
        });
    });

    this.app.post('/nginx/test', function(req, res) {
        var output = cp.spawnSync('/usr/sbin/nginx', ['-t'], {
            encoding: 'utf8'
        });

        res.send({
            'status': 'ok',
            'stdout': output.stdout.toString(),
            'stderr': output.stderr.toString(),
        });
    });

    this.app.post('/host', function(req, res) {

        db.selectNextSeedVHost(function(message1) {
            db.selectNextSeedUpstream(function(message2) {
                seedVHosts = JSON.parse(JSON.stringify(message1)).message.seed;
                seedUptreams = JSON.parse(JSON.stringify(message2)).message.seed;
                VHostFileName = seedVHosts + '-' + req.body.host + req.body.port;

                console.log('Desejado para VHost:', VHostFileName);

                var confcontent = generateFiles.createServerConf(req.body);
                var confUpdtreamContent = generateFiles.createUpstreamConf(req.body.arrayLocations);

                /*
                código replicado em baixo, mas para poder seguir o processo, é necessário validar
                antes de criar o que quer que seja, se as upstreams existem
                */
                /*
                db.canInsertUpstream(confUpdtreamContent, req.body.instance || '', function(canInsertResponse) {
                    console.log("Resultado do canInsertUpstream:", canInsertResponse);
                    if (canInsertResponse.status == 'failed') {
                        return res.send(
                            canInsertResponse
                        );
                    } else {*/
                try {

                    utils.writeFileSync(VHostFileName, confcontent);

                    confUpdtreamContent.forEach(function(item) {

                        UpstreamFileName = seedUptreams + '-' + item.name.replace('https://', '').replace('http://', '');
                        UpstreamDBName = item.name.replace('https://', '').replace('http://', '');

                        console.log('Desejado para upstream:', UpstreamFileName);

                        var upstream = {
                            'instance': req.body.instance || '',
                            'name': UpstreamDBName
                        };

                        utils.writeFileSync(UpstreamFileName, item.conf);

                        db.insertUpstream(upstream, function(message) {
                            console.log("Resultado do insertUpstream:", message);
                        });

                        seedUptreams++;
                    });

                    var vhost = {
                        'id': req.body.id,
                        'instance': req.body.instance || '',
                        'name': req.body.host,
                        'port': req.body.port,
                        'config': req.body
                    };

                    db.insertVHostV2(vhost, function(message) {
                        console.log("Erro:", message);
                        return res.send(
                            message
                        );
                    });

                } catch (err) {
                    console.log('Caiu no catch ' + err);
                    res.send({
                        'status': 'failed',
                        'message': err
                    });
                }
                //}
                // });

            });
        });
    });

    this.app.post('/insertVHost', function(req, res) {

        var vhost = {
            'instance': req.body.instance,
            'name': req.body.name,
            'port': req.body.port,
            'config': req.body.config
        };

        db.insertVHost(vhost, function(message) {
            res.send(message);
        });

    });

    this.app.post('/insertUpstream', function(req, res) {
        db.selectNextSeedUpstream(function(message1) {
            seedUptreams = JSON.parse(JSON.stringify(message1)).message.seed;
            console.log('\n',req.body,'\n');
            var upstream = {
                'instance': req.body.instance || '',
                'name': req.body.upstreamName,
                'config': req.body.arrayUpstreamItems
            };

            try {
                var confUpdtreamContent = generateFiles.createUpstreamConf(req.body.config.arrayUpstreamItems);
                console.log('confUpdtreamContent\n:', confUpdtreamContent, '\n');
                confUpdtreamContent.forEach(function(item) {

                    UpstreamFileName = seedUptreams + '-' + item.name.replace('https://', '').replace('http://', '');
                    UpstreamDBName = item.name.replace('https://', '').replace('http://', '');

                    console.log('Desejado para upstream:', UpstreamFileName);

                    var upstream = {
                        'instance': req.body.instance || '',
                        'name': UpstreamDBName
                    };

                    utils.writeFileSync(UpstreamFileName, item.conf);

                    db.insertUpstream(upstream, function(message) {
                        console.log("Resultado do insertUpstream:", message);
                    });

                    seedUptreams++;
                });
            } catch (err) {
                console.log('Erro:', err);
            }
        }); // fim selectNextSeedUpstream
    });

    this.app.post('/insertVHostV2', function(req, res) {

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

    this.app.get('/getVHost/:id', function(req, res) {
        db.selectVHost(req.params.id, function(message) {
            console.log(message);
            res.send(message);
        });
    });

    this.app.get('/getAllVHosts', function(req, res) {
        db.selectAllVHosts(function(message) {
            res.send(message);
        });
    });

    this.app.get('/getAllUpstreams', function(req, res) {
        db.selectAllUpstreams(function(message) {
            res.send(message);
        });
    });

    this.app.delete('/deleteVHost/:id', function(req, res) {
        db.deleteVHost(req.params.id, function(message) {
            res.send(message);
        });
    });

};

module.exports = Api;
