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
        var output = cp.spawnSync('/usr/sbin/nginx', ['-t'], {
            encoding: 'utf8'
        });

        res.send({
            'status': 'ok',
            'stdout': output.stdout.toString(),
            'stderr': output.stderr.toString(),
        });
    });

    this.app.post('/api/hostOld', function(req, res) {

        db.selectNextSeedVHost(function(message1) {
            db.selectNextSeedUpstream(function(message2) {
                seedVHosts = JSON.parse(JSON.stringify(message1)).message.seed;
                seedUptreams = JSON.parse(JSON.stringify(message2)).message.seed;
                VHostFileName = seedVHosts + '-' + req.body.host + req.body.port;

                console.log('Desejado para VHost:', VHostFileName);

                var confcontent = generateFiles.createServerConf(req.body);
                var confUpdtreamContent = generateFiles.createUpstreamConfMulti(req.body.arrayLocations);

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

    this.app.post('/api/host', function(req, res) {
        console.log('\n------------------------- POST /host -------------------------\n');
        db.selectNextSeedVHost(function(message1) {
            //Este Id é para inserir no config o futuro id
            var idToObj = req.body.id;
            if(req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id)){
              seedVHosts = JSON.parse(JSON.stringify(message1)).message.seed;
              req.body.id = (seedVHosts - 1000).toString();
            }else{
              seedVHosts = parseInt(req.body.id)+1000;
            }

            VHostFileName = seedVHosts + '-' + req.body.host + req.body.port;

            try {
                console.log('Desejado para VHost:', VHostFileName);

                var confcontent = generateFiles.createServerConf(req.body);
                utils.writeFileSync(VHostFileName, confcontent);
                //Este Id é para saber se é insert ou update


                var vhost = {
                    'id': idToObj,
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

        });
    });

    this.app.post('/api/insertVHost', function(req, res) {

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
    // NOTA:
    this.app.delete('/api/deleteUpstream/:id/:name', function(req, res) {
        var idToDelete = parseInt(req.params.id) + 100;
        var fileName = idToDelete + '-' + req.params.name;
        console.log('Apagar ficheiro' + fileName + '.config');
        utils.deleteFile(fileName, function(message) {
            console.log('Resultado:', message);
            if (message.status === 'failed') {
                res.send(message);
            } else {
                db.deleteUpstream(req.params.id, function(message) {
                    res.send(message);
                });
            }
        });
    });

    this.app.post('/api/insertUpstream', function(req, res) {
        console.log('\n------------------------- POST UPSTREAM -------------------------\n');
        var jsonConfig = JSON.parse(JSON.stringify(req.body));
        var confUpdtreamContent = generateFiles.createUpstreamConfSingle(jsonConfig);

        if ((req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id))) {
            db.selectNextSeedUpstream(function(message2) {
                seedUptreams = JSON.parse(JSON.stringify(message2)).message.seed;

                try {
                    // é só uma upstream por isso só faz o ciclo 1x
                    confUpdtreamContent.forEach(function(item) {

                        UpstreamFileName = seedUptreams + '-' + item.name.replace('https://', '').replace('http://', '');
                        UpstreamDBName = item.name.replace('https://', '').replace('http://', '');

                        console.log('Desejado para upstream:', UpstreamFileName);

                        utils.writeFileSync(UpstreamFileName, item.conf);
                        // Deixa o ID original para fazer distincao entre insert e update
                        var idFromReq = req.body.id;

                        // Se não tiver ID, guardar futuro ID (para ficar no config) no JSON antes de inserir na BD
                        if (req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id)) {
                            req.body.id = (seedUptreams - 100).toString();
                        }
                        var upstream = {
                            'id': idFromReq,
                            'instance': req.body.instance || '',
                            'name': req.body.upstreamName,
                            'config': JSON.stringify(req.body)
                        };

                        db.insertUpstream(upstream, function(message) {
                            console.log("Resultado do insertUpstream (INSERT):", message);
                            res.send(message);
                        });

                        seedUptreams++;
                    });

                } catch (err) {
                    console.log('Erro:', err);
                }
            }); // fim selectNextSeedUpstream
        } else {
            //fazer update
            seedUptreams = parseInt(req.body.id) + 100;
            console.log('Update stream ', seedUptreams);
            try {
                // é só uma upstream por isso só faz o ciclo 1x
                confUpdtreamContent.forEach(function(item) {

                    UpstreamFileName = seedUptreams + '-' + item.name.replace('https://', '').replace('http://', '');
                    UpstreamDBName = item.name.replace('https://', '').replace('http://', '');

                    console.log('Desejado para upstream:', UpstreamFileName);

                    utils.writeFileSync(UpstreamFileName, item.conf);
                    // Deixa o ID original para fazer distincao entre insert e update
                    var idFromReq = req.body.id;

                    // Se não tiver ID, guardar futuro ID (para ficar no config) no JSON antes de inserir na BD
                    if (req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id)) {
                        req.body.id = (seedUptreams - 100).toString();
                    }
                    var upstream = {
                        'id': idFromReq,
                        'instance': req.body.instance || '',
                        'name': req.body.upstreamName,
                        'config': JSON.stringify(req.body)
                    };

                    db.insertUpstream(upstream, function(message) {
                        console.log("Resultado do insertUpstream (UPDATE):", message);
                        res.send(message);
                    });

                    seedUptreams++;
                });

            } catch (err) {
                console.log('Erro:', err);
            }
        }

    });

    this.app.post('/api/insertVHostV2', function(req, res) {
        console.log('\n------------------------- /insertVHostV2 -------------------------\n');
        console.log('ID do HOST',req.body.id);
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

    this.app.delete('/api/deleteVHost/:id/:name/:port', function(req, res) {
        console.log('\n------------------------- /deleteVHost -------------------------\n');
        var idToDelete = parseInt(req.params.id) + 1000;
        var fileName = idToDelete + '-' + req.params.name + req.params.port;
        console.log('Apagar ficheiro' + fileName + '.config');
        utils.deleteFile(fileName, function(message) {
            console.log('Resultado:', message);
            if (message.status === 'failed') {
                res.send(message);
            } else {
                db.deleteVHost(req.params.id, function(message) {
                    res.send(message);
                });
            }
        });
    });

};

module.exports = Api;
