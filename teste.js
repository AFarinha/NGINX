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
      'CACHEBROWSER' : '',
      'GNERICITEMSLOCATION' : ''
}, {    'SERVERNAME': '98',
        'PORT': '98',
        'PROXY': '98',
        'CACHE': true === true ? 'include /etc/nginx/dashboard/cache.conf;' : '',
        'EXTENSIONS' : '',
        'CACHEBROWSER' : '',
        'GNERICITEMSLOCATION' : ''
    }];

var arrayGenericServer = [ { 'PROPERTIENAME': 'sdfsdf', 'PROPERTIEVALUE': 'sdfsdf' }, { 'PROPERTIENAME': 'sdfsdf', 'PROPERTIEVALUE': 'sdfsdfsdf' } ]
var arrayGenericLocation = [ { 'PROPERTIENAME': 'ghfjgj', 'PROPERTIEVALUE': 'sdfsfgjgjhdf' }, { 'PROPERTIENAME': 'sdffgjhfghsdf', 'PROPERTIEVALUE': 'fghjfgj' } ]
 function createServerConf() {
   var serverItems = '';
   var locationItems = '';
   var loc = '';

   arrayGenericServer.forEach(function (item) {
     serverItems += utils.prepareConf('serverGenericItems',item)
   });

   arrayLocations.forEach(function (item) {
     locationItems = ''
     arrayGenericLocation.forEach(function (item1) {
       locationItems += utils.prepareConf('locationGenericItems',item1)
     });
     item.GNERICITEMSLOCATION = locationItems
     loc += utils.prepareConf('location',item)
   });

   var confcontent = utils.prepareConf('server', {
     'SERVERNAME': '98',
     'PORT': '98',
     'GNERICITEMSSERVER' : serverItems,
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
