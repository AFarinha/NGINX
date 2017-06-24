var utils = require('./utils')

module.exports = {

  createServerConf: function(body){
      console.log('cenas');
      console.log(body);

      var serverItems = '';
      var loc = '';

      //array de propriedades genericas
      body.arrayGenericServer.forEach(function (item) {
       serverItems += utils.prepareConf('serverGenericItems', {
          'PROPERTIENAME': item.nameProp,
          'PROPERTIEVALUE': item.valueProp
        });
      });
      //percorrer todas locations
      body.arrayLocations.forEach(function (item) {
         locationItems = ''
        //percorrer todas as propriedades genericas de cada locations
        item.arrayGeneric.forEach(function (item1) {
          locationItems += utils.prepareConf('locationGenericItems',{
             'PROPERTIENAME': item1.nameProp,
             'PROPERTIEVALUE': item1.valueProp
           })
        });

        loc += utils.prepareConf('location', {
          'PATH': item.pathGeneric ? item.path : '~* ^.+\.('+ item.pathFileType.join('|') + ')$',
          'PROXYPASS': (item.IsProxyPass || arrayUpstreams.length != 0) ? 'proxy_pass ' + item.proxyPass + ';' : '',
          'CACHESERVER': item.cacheServer ? 'include /etc/nginx/dashboard/cache.conf;' : '',
          'CACHECLIENT': item.cacheClient ? 'expires ' + item.cacheClientTimeNumber + ''+item.cacheClientTimeUnit.code + ';' : '' ,
          'GNERICITEMSLOCATION' : locationItems
        })
      });

      var confcontent = utils.prepareConf('server', {
        'SERVERNAME': body.host,
        'PORT': body.port,
        'GNERICITEMSSERVER' : serverItems,
        'LOCATION' : loc
      });
      console.log(confcontent);
      return confcontent;
    }

};
