var express = require('express'),
    fs = require('fs'),
    utils = require('./lib/utils'),
    generateFiles = require('./lib/GenerateFiles'),
    cp = require('child_process'),
    bodyParser = require('body-parser'),
    sqlite3 = require('sqlite3').verbose(),
    db = require('./lib/database.js');

//var Collector = require('./lib/collector');

var app = express();
var databaseName = "nginx";
//para Dashboard
//var collectorProcess = new Collector();
//collectorProcess.init();

app.use(express.static('./public'));
app.use(bodyParser.json());

app.post('/nginx/reload', function(req, res) {
    var output = cp.spawnSync('/usr/sbin/nginx', ['-s', 'reload'], {
        encoding: 'utf8'
    });

    res.send({
        'status': 'ok',
        'stdout': output.stdout.toString(),
        'stderr': output.stderr.toString(),
    });
});

app.post('/nginx/test', function(req, res) {
    var output = cp.spawnSync('/usr/sbin/nginx', ['-t'], {
        encoding: 'utf8'
    });

    res.send({
        'status': 'ok',
        'stdout': output.stdout.toString(),
        'stderr': output.stderr.toString(),
    });
});

app.post('/host', function(req, res) {

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


app.post('/insertVHost', function(req, res) {

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

app.post('/insertVHostV2', function(req, res) {

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

app.get('/getVHost/:id', function(req, res) {

    db.selectVHost(req.params.id, function(message) {
        console.log(message);
        res.send(message);
    });
});

app.get('/getAllVHosts', function(req, res) {

    db.selectAllVHosts(function(message) {
        res.send(message);
    });
});

app.delete('/deleteVHost/:id', function(req, res) {

    db.deleteVHost(req.params.id, function(message) {
        res.send(message);
    });

});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    db.initBD(databaseName);
    console.log('Dashboard listening on port ' + port);
});
