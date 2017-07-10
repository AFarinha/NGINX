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
    writeFiles: function(idToObj, req, file, responseWriteFiles) {
        if (req.body.instance == 'localhost') {
            utils.writeFile(file.filename, file.fileContent, function(message) {
                return responseWriteFiles({ 'status': message.status, 'message': message.message })
            });
        } else {
            console.log('aquielse');
            var opts = {
                'url': 'http://' + req.body.instance + '/writeHost',
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
