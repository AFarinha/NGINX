var fs = require('fs'),
  utils = require('./utils'),
  cp = require('child_process'),
  bodyParser = require('body-parser')

var arrayLocations = [
  {    'SERVERNAME': '98',
      'PORT': '98',
      'PROXY': '98',
      'CACHE': true === true ? 'include /etc/nginx/dashboard/cache.conf;' : '',
      'EXTENSIONS' : '',
      'CACHEBROWSER' : ''
}, {    'SERVERNAME': '98',
        'PORT': '98',
        'PROXY': '98',
        'CACHE': true === true ? 'include /etc/nginx/dashboard/cache.conf;' : '',
        'EXTENSIONS' : '',
        'CACHEBROWSER' : ''
    }];

var arrayGenericServer = [ { 'PROPERTIENAME': 'sdfsdf', 'PROPERTIEVALUE': 'sdfsdf' }, { 'PROPERTIENAME': 'sdfsdf', 'PROPERTIEVALUE': 'sdfsdfsdf' } ]

 function createServerConf() {
   var serverItems = '';
   var loc = '';

   arrayGenericServer.forEach(function (item) {
     serverItems += utils.prepareConf('serverGenericItem',item)
   });

   arrayLocations.forEach(function (item) {
     arrayLocations.forEach(function (item1) {

     });
     loc += utils.prepareConf('location',item)
   });

   var confcontent = utils.prepareConf('server', {
     'SERVERNAME': '98',
     'PORT': '98',
     'GNERICITEMS' : serverItems,
     'LOCATION' : loc
   });



  console.log(confcontent);
 }


function createServerConf1(){
  var confcontent = utils.prepareConf('location', {
    'SERVERNAME': '98',
    'PORT': '98',
    'PROXY': '98',
    'CACHE': true === true ? 'include /etc/nginx/dashboard/cache.conf;' : '',
    'EXTENSIONS' : '',
    'CACHEBROWSER' : '' ,
  });

  fs.writeFile('/etc/nginx/conf.d/' + 'teste' + '.conf', confcontent, function(err) {
    if (err) {
      return res.STATUS(500).send({
        'STATUS': 'FAILED',
        'MESSAGE': err
      });
    }
  });
}
createServerConf();
