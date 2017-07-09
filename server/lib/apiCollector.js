var express = require('express'),
    utils = require('./utils'),
    generateFiles = require('./GenerateFiles'),
    cp = require('child_process'),
    bodyParser = require('body-parser'),

var ApiCollector = function(port, station, databaseName) {
    this.station = station;

    this.port = port;
    this.databaseName = databaseName;
    this.app = express();

    this.app.use(express.static('./public'));
    this.app.use(bodyParser.json());

    this.httpServer = require('http').Server(this.app);
};


ApiCollector.prototype.init = function() {
    var self = this;

    this.httpServer.listen(this.port);
    console.log('(server) CollectorConfig listening on port ' + this.port);

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

module.exports = ApiCollector;
