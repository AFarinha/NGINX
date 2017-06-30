var Station = require('./server/lib/station.js'),
    Dashboard = require('./server/lib/dashboard.js'),
    Collector = require('./collector/collector.js');
    Api = require('./server/lib/api.js');



var databaseName = "nginx";
var port = process.env.PORT || 3000;
var colectServer = process.env.SERVER;

//Inicia processos para para Dashboard
var station = new Station(8080);
station.init();
var api = new Api(port, station, databaseName);
api.init();
var collector = new Collector(8080);
collector.init();
