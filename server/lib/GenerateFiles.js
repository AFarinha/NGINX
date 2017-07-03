var utils = require('./utils')

module.exports = {

    createServerConf: function(body) {
        //console.log(body);

        var serverItems = '';
        var loc = '';

        //array de propriedades genericas
        body.arrayGenericServer.forEach(function(item) {
            serverItems += utils.prepareConf('serverGenericItems', {
                'PROPERTIENAME': item.nameProp,
                'PROPERTIEVALUE': item.valueProp
            });
        });
        //percorrer todas locations
        body.arrayLocations.forEach(function(item) {
            locationItems = ''
                //percorrer todas as propriedades genericas de cada locations
            item.arrayGeneric.forEach(function(item1) {
                locationItems += utils.prepareConf('locationGenericItems', {
                    'PROPERTIENAME': item1.nameProp,
                    'PROPERTIEVALUE': item1.valueProp
                })
            });

            loc += utils.prepareConf('location', {
                'PATH': item.pathGeneric ? item.path : '~* ^.+\.(' + item.pathFileType.join('|') + ')$',
                'PROXYPASS': (item.IsProxyPass || item.arrayUpstreams.length != 0) ? 'proxy_pass ' + item.proxyPass + ';' : '',
                'CACHESERVER': item.cacheServer ? 'include /etc/nginx/dashboard/cache.conf;' : '',
                'CACHECLIENT': item.cacheClient ? 'expires ' + item.cacheClientTimeNumber + '' + item.cacheClientTimeUnit.code + ';' : '',
                'GNERICITEMSLOCATION': locationItems
            })
        });

        var confcontent = utils.prepareConf('server', {
            'SERVERNAME': body.host,
            'PORT': body.port,
            'GNERICITEMSSERVER': serverItems,
            'LOCATION': loc
        });
        //console.log(confcontent);
        return confcontent;
    },
    createUpstreamConfMulti: function(locations) {
        //console.log(locations);
        var arrConfsUpstreams = [];
        var upstream = '';
        var upstreamItems = '';

        locations.forEach(function(item) {
            upstreamItems = '';

            item.arrayUpstreams.forEach(function(item1) {
                upstreamItems += utils.prepareConf('upstreamsItems', {
                    'HOST': item1.name,
                    'WEIGHT': item1.weight
                });
            });
            upstream = utils.prepareConf('upstreams', {
                'PROXYPASS': item.proxyPass,
                'UPSTREAMITEMS': upstreamItems
            });
            console.log(upstream);
            arrConfsUpstreams.push({ 'name': item.proxyPass, 'conf': upstream });
        });

        //console.log(arrConfsUpstreams.length);
        return arrConfsUpstreams;
    },
    createUpstreamConfSingle: function(Upstreams) {
        //console.log('createUpstreamConfV2:', Upstreams);
        var arrConfsUpstreams = [];
        var upstream = '';
        var upstreamItems = '';
        var proxyPass = Upstreams.upstreamName;

        Upstreams.arrayUpstreamItems.forEach(function(item1) {
            upstreamItems += utils.prepareConf('upstreamsItems', {
                'TYPE': item1.type,
                'SUBTYPE': item1.subType,
                'CONFIG': item1.config
            });
        });

        upstream = utils.prepareConf('upstreams', {
            'PROXYPASS': proxyPass, 
            'UPSTREAMITEMS': upstreamItems
        });
        console.log(upstream);
        arrConfsUpstreams.push({ 'name': proxyPass, 'conf': upstream });

        //console.log(arrConfsUpstreams.length);
        return arrConfsUpstreams;
    }

};
