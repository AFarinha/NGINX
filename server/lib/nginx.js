var express = require('express'),
  utils = require('./utils'),
  generateFiles = require('./GenerateFiles'),
  cp = require('child_process'),
  bodyParser = require('body-parser'),
  sqlite3 = require('sqlite3').verbose(),
  db = require('./database.js'),
  request = require('request');

module.exports = {

  configureVhost: function(req, responseToApiConfigHost) {
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

      self.writeFiles(req, fileobj, function(responseFiles) {
        console.log('passou1');
        if (responseFiles.status == 'ok') {
          console.log('Escreveu o ficheiro responde');
          self.insertDBVHost(idToObj, req, function(responseBD) {
            return responseToApiConfigHost(responseBD);
          });
        } else {
          console.log('Erro: nao escreve na BD');
          console.log(responseFiles);
          return responseToApiConfigHost(responseFiles);
        }
      });

    });
  },
  configureUpstream: function(req, responseToApi) {
    console.log('\n------------------------- configureUpstream -------------------------\n');
    var self = this;
    db.selectNextSeedUpstream(function(message2) {
      var idToObj = req.body.id;

      if ((req.body.id == undefined || req.body.id == null || req.body.id == '' || isNaN(req.body.id))) {
        seedUptreams = JSON.parse(JSON.stringify(message2)).message.seed;
        req.body.id = (seedUptreams - 100).toString();
        console.log('Insert stream ', seedUptreams);
      } else {
        seedUptreams = parseInt(req.body.id) + 100;
        console.log('Update stream ', seedUptreams);
      }
      console.log(req.body);
      UpstreamFileName = seedUptreams + '-' + req.body.upstreamName.replace('https://', '').replace('http://', '');
      console.log('Desejado para Upstream:', UpstreamFileName);

      var confUpdtreamContent = generateFiles.createUpstreamConfSingle(req.body);

      var fileobj = {
        'filename': UpstreamFileName,
        'fileContent': confUpdtreamContent
      }
      self.writeFiles(req, fileobj, function(responseFiles) {
        console.log('passou1');
        if (responseFiles.status == 'ok') {
          console.log('Escreveu o ficheiro responde');
          self.insertDBUpstream(idToObj, req, function(responseBD) {
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
  writeFiles: function(req, file, responseWriteFiles) {
    if (req.body.instance == 'localhost') {
      utils.writeFile(file.filename, file.fileContent, function(message) {
        return responseWriteFiles({
          'status': message.status,
          'message': message.message
        })
      });
    } else {
      console.log('aquielse');
      var opts = {
        'url': 'http://' + req.body.instance + '/write',
        'json': file,
        timeout: 2000
      };
      console.log('req.body.instance:', req.body.instance);
      request.post(opts, function(error, response, body) {
        console.log('post');
        if (error) {
          console.log('posterro');
          return responseWriteFiles({
            'status': 'failed',
            'message': error
          })
        } else {
          console.log('postok');
          console.log(error);
          console.log(response);
          console.log(body);
          return responseWriteFiles({
            'status': 'ok',
            'message': ''
          })
        }
      });
    }
  },
  deleteVhost: function(req, responseToApi) {
    var self = this
    console.log('nginx.js / deleteVhost / Instance :', req.params.instance);
    var idToDelete = parseInt(req.params.id) + 1000;
    var fileName = idToDelete + '-' + req.params.name + req.params.port;
    console.log('Apagar ficheiro' + fileName + '.config');

    self.deleteFiles(req, fileName, function(responseFiles) {
      if (responseFiles.status == 'ok') {
        console.log('Apagou Vhost o ficheiro responde');
        db.deleteVHost(req.params.id, function(message) {
          return responseToApi(message);
        });
      } else {
        console.log('Erro nao escreve na BD');
        console.log(responseFiles);
        return responseToApi(responseFiles);
      }
    });
  },
  deleteUpstream: function(req, responseToApi) {
    var self = this
    console.log('nginx.js / deleteUpstream / Instance :', req.params.instance);
    var idToDelete = parseInt(req.params.id) + 100;
    var fileName = idToDelete + '-' + req.params.name;
    console.log('Apagar ficheiro' + fileName + '.config');

    self.deleteFiles(req, fileName, function(responseFiles) {
      if (responseFiles.status == 'ok') {
        console.log('Apagou upstream o ficheiro responde');
        db.deleteUpstream(req.params.id, function(message) {
          return responseToApi(message);
        });
      } else {
        console.log('Erro nao escreve na BD');
        console.log(responseFiles);
        return responseToApi(responseFiles);
      }
    });
  },
  deleteFiles: function(req, fileName, responseDeleteFiles){
    if (req.params.instance == 'localhost') {
      utils.deleteFile(fileName, function(message) {
        return responseDeleteFiles({
          'status': message.status,
          'message': message.message
        });
      });
    } else {
      console.log('aquielse');
      var opts = {
        'url': 'http://' + req.params.instance + '/delete',
        'json': fileName,
        timeout: 2000
      };
      console.log('req.body.instance:', req.body.instance);
      request.post(opts, function(error, response, body) {
        console.log('post');
        if (error) {
          console.log('posterro');
          return responseDeleteFiles({
            'status': 'failed',
            'message': error
          })
        } else {
          console.log('postok');
          console.log(error);
          console.log(response);
          console.log(body);
          return responseDeleteFiles({
            'status': 'ok',
            'message': ''
          })
        }
      });
    }
  },
  insertDBVHost: function(idToObj, req, response) {
    console.log('\n------------------------- insertDBVHost -------------------------\n');
    console.log('insere' + idToObj);
    var vhost = {
      'id': idToObj,
      'instance': req.body.instance || '',
      'name': req.body.host,
      'port': req.body.port,
      'config': req.body
    };
    db.insertVHostV2(vhost, function(message) {
      console.log("Resultado do insertDBVHost:", message);
      return response(
        message
      );
    });
  },
  insertDBUpstream: function(idToObj, req, response) {
    console.log('\n------------------------- insertDBUpstream -------------------------\n');
    console.log('insere' + idToObj);
    var upstream = {
      'id': idToObj,
      'instance': req.body.instance || '',
      'name': req.body.upstreamName,
      'config': JSON.stringify(req.body)
    };
    db.insertUpstream(upstream, function(message) {
      console.log("Resultado do insertDBUpstream:", message);
      return response(
        message
      );
    });
  },
  testNginx: function(req, responseToApi) {
    console.log('testNginx', req.body.instance);
    if (req.body.instance == 'localhost') {
      var output = cp.spawnSync('/usr/sbin/nginx', ['-t'], {
        encoding: 'utf8'
      });

      responseToApi({
        'status': 'ok',
        'stdout': output.stdout.toString(),
        'stderr': output.stderr.toString(),
      });
    } else {
      console.log('aquielse');
      var opts = {
        'url': 'http://' + req.body.instance + '/testNginx',
        timeout: 2000
      };
      console.log('req.body.instance:', req.body.instance);
      request.post(opts, function(error, response, body) {
        console.log('post');
        if (error) {
          console.log('posterro');
          return responseToApi({
            'status': 'failed',
            'message': error
          })
        } else {
          console.log('postok');
          console.log(error);
          console.log(response);
          console.log(body);
          return responseToApi({
            'status': 'ok',
            'message': ''
          })
        }
      });
    }
  },
  reloadNginx: function(req, responseToApi) {
    console.log('reloadNginx', req.body.instance);
    if (req.body.instance == 'localhost') {
      var output = cp.spawnSync('/usr/sbin/nginx', ['-s', 'reload'], {
        encoding: 'utf8'
      });

      responseToApi({
        'status': 'ok',
        'stdout': output.stdout.toString(),
        'stderr': output.stderr.toString(),
      });
    } else {
      console.log('aquielse');
      var opts = {
        'url': 'http://' + req.body.instance + '/testNginx',
        timeout: 2000
      };
      console.log('req.body.instance:', req.body.instance);
      request.post(opts, function(error, response, body) {
        console.log('post');
        if (error) {
          console.log('posterro');
          return responseToApi({
            'status': 'failed',
            'message': error
          })
        } else {
          console.log('postok');
          console.log(error);
          console.log(response);
          console.log(body);
          return responseToApi({
            'status': 'ok',
            'message': ''
          })
        }
      });
    }
  }
}
