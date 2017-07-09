var express = require('express'),
  utils = require('./utils'),
  generateFiles = require('./GenerateFiles'),
  cp = require('child_process'),
  bodyParser = require('body-parser'),
  sqlite3 = require('sqlite3').verbose(),
  db = require('./database.js'),
  request = require('request');

module.exports = {

  configureVhost: function(req,responseToApi) {
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

      self.writeFiles(req,fileobj,function (responseFiles) {
        console.log('passou1');
        if(responseFiles.status == 'ok'){
          console.log('Escreveu o ficheiro responde');
          self.insertDB(idToObj,req,function (responseBD) {
            return responseToApi(responseBD);
          });
        }else{
          console.log('Erro nao escreve na BD');
          console.log(responseFiles);
          return responseToApi(responseFiles);
        }
      });

    });
  },
  writeFiles: function(req,file, responseWriteFiles) {
    if (req.body.instance == 'localhost') {
      utils.writeFile(file.filename, file.fileContent,function (message) {
        return responseWriteFiles({'status': message.status, 'message': message.message })
      });
    } else {
      console.log('aquielse');
      var opts = {
        'url': '/writeHost/' + req.body.instance,
        'json': file
      };
      request.post(opts, function(error, response, body) {
        console.log('post');
        if (error) {
          console.log('posterro');
          return responseWriteFiles({'status': 'failed', 'message': error })
        }else{
          console.log('postok');
          return responseWriteFiles({'status': 'ok', 'message': '' })
        }
      });
    }
  },
  insertDB: function (idToObj, req, response) {
    console.log('insere');
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
