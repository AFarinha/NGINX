var express = require('express'),
    utils = require('./utils'),
    generateFiles = require('./GenerateFiles'),
    cp = require('child_process'),
    bodyParser = require('body-parser'),
    sqlite3 = require('sqlite3').verbose(),
    db = require('./database.js'),
    request = require('request');

module.exports = {

    configureVhost: function(req, responseToApi) {
        var self = this
        db.selectNextSeedVHost(function(message1) {
            //Este Id é para inserir no config o futuro id
            var idToObj = req.body.id;
            if (req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id)) {
                seedVHosts = JSON.parse(JSON.stringify(message1)).message.seed;
                req.body.id = (seedVHosts - 1000).toString();
            } else {
                seedVHosts = parseInt(req.body.id) + 1000;
            }
            VHostFileName = seedVHosts + '-' + req.body.host + req.body.port;
            console.log('Desejado para VHost:', VHostFileName);

            var confcontent = generateFiles.createServerConf(req.body);

            var fileobj = {
                'filename': VHostFileName,
                'fileContent': confcontent
            }
            console.log('passou2');

            self.writeFiles(idToObj, req, fileobj, function(responseFiles) {
                console.log('passou1');
                if (responseFiles.status == 'ok') {
                    console.log('Escreveu o ficheiro responde');
                    self.insertDB(idToObj, req, function(responseBD) {
                        return responseToApi(responseBD);
                    });
                } else {
                    console.log('Erro nao escreve na BD');
                    console.log(responseFiles);
                    return responseToApi(responseFiles);
                }
            });

        });
    },
    deleteVhost: function(req, responseToApi) {
        console.log('nginx.js / deleteVhost / Instance :', req.params.instance);
        if (req.params.instance == 'localhost') {
            console.log('\n------------------------- newdeleteVHost localhost -------------------------\n');
            var idToDelete = parseInt(req.params.id) + 1000;
            var fileName = idToDelete + '-' + req.params.name + req.params.port;
            console.log('Apagar ficheiro' + fileName + '.config');
            utils.deleteFile(fileName, function(message) {
                console.log('Resultado:', message);
                if (message.status === 'failed') {
                    responseToApi(message);
                } else {
                    db.deleteVHost(req.params.id, function(message) {
                        responseToApi(message);
                    });
                }
            });
        } else {
            console.log('\n------------------------- newdeleteVHost remote -------------------------\n');
            var opts = {
                'url': 'http://' + req.body.instance + '/deleteHost',
                'json': file
            };
            request.post(opts, function(error, response, body) {
                console.log('post');
                if (error) {
                    console.log('posterro');
                    return responseWriteFiles({ 'status': 'failed', 'message': error })
                } else {
                    console.log('postok');
                    console.log(error);
                    console.log(response);
                    console.log(body);
                    return responseWriteFiles({ 'status': 'ok', 'message': '' })
                }
            });
        }
    },
    deleteUpstream: function(req, responseToApi) {
        console.log('nginx.js / deleteUpstream / Instance :', req.params.instance);
        if (req.params.instance == 'localhost') {
            var idToDelete = parseInt(req.params.id) + 100;
            var fileName = idToDelete + '-' + req.params.name;
            console.log('Apagar ficheiro' + fileName + '.config');
            utils.deleteFile(fileName, function(message) {
                console.log('Resultado:', message);
                if (message.status === 'failed') {
                    responseToApi(message);
                } else {
                    db.deleteUpstream(req.params.id, function(message) {
                        responseToApi(message);
                    });
                }
            });
        } else {
            console.log('\n------------------------- deleteUpstream remote -------------------------\n');
            var opts = {
                'url': 'http://' + req.body.instance + '/deleteUpstream',
                timeout: 2000
            };
            request.post(opts, function(error, response, body) {
                console.log('post');
                if (error) {
                    console.log('post erro');
                    return responseWriteFiles({ 'status': 'failed', 'message': error })
                } else {
                    console.log('post ok');
                    console.log(error);
                    console.log(response);
                    console.log(body);
                    return responseWriteFiles({ 'status': 'ok', 'message': '' })
                }
            });
        }
    },
    configureUpstream: function(req, responseToApi) {
        if (req.body.instance == 'localhost') {
            console.log('\n------------------------- POST UPSTREAM -------------------------\n');
            var jsonConfig = JSON.parse(JSON.stringify(req.body));
            var confUpdtreamContent = generateFiles.createUpstreamConfSingle(jsonConfig);

            db.selectNextSeedUpstream(function(message2) {
                var seedUptreams = JSON.parse(JSON.stringify(message2)).message.seed;
                if ((req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id))) {
                    console.log('Insert stream ', seedUptreams);
                    seedUptreams = JSON.parse(JSON.stringify(message2)).message.seed;
                } else {
                    seedUptreams = parseInt(req.body.id) + 100;
                    console.log('Update stream ', seedUptreams);
                }
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
                            responseToApi(message);
                        });

                        seedUptreams++;
                    });

                } catch (err) {
                    console.log('Erro:', err);
                    return responseToApi({ 'status': 'failed', 'message': err })
                }
            }); // fim selectNextSeedUpstream 
        } else {
            console.log('aquielse');
            var opts = {
                'url': 'http://' + req.body.instance + '/writeUpstream',
                timeout: 2000
            };
            console.log('req.body.instance:', req.body.instance);
            request.post(opts, function(error, response, body) {
                console.log('post');
                if (error) {
                    console.log('posterro');
                    return responseToApi({ 'status': 'failed', 'message': error })
                } else {
                    console.log('postok');
                    console.log(error);
                    console.log(response);
                    console.log(body);
                    return responseToApi({ 'status': 'ok', 'message': '' })
                }
            });
        }
    },
    writeFiles: function(idToObj, req, file, responseWriteFiles) {
        if (req.body.instance == 'localhost') {
            utils.writeFile(file.filename, file.fileContent, function(message) {
                return responseWriteFiles({ 'status': message.status, 'message': message.message })
            });
        } else {
            console.log('aquielse');
            var opts = {
                'url': 'http://' + req.body.instance + '/writeHost',
                'json': file,
                timeout: 2000
            };
            console.log('req.body.instance:', req.body.instance);
            request.post(opts, function(error, response, body) {
                console.log('post');
                if (error) {
                    console.log('posterro');
                    return responseWriteFiles({ 'status': 'failed', 'message': error })
                } else {
                    console.log('postok');
                    console.log(error);
                    console.log(response);
                    console.log(body);
                    return responseWriteFiles({ 'status': 'ok', 'message': '' })
                }
            });
        }
    },
    insertDB: function(idToObj, req, response) {
        console.log('insere' + idToObj);
        console.log(idToObj);
        var vhost = {
            'id': idToObj,
            'instance': req.body.instance || '',
            'name': req.body.host,
            'port': req.body.port,
            'config': req.body
        };
        db.insertVHostV2(vhost, function(message) {
            console.log("Erro:", message);
            return response(
                message
            );
        });
    }






}
