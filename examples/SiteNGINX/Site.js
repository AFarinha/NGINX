var https = require("https"),
	cheerio = require('cheerio'),
	request = require('request'),
	sqlite3 = require('sqlite3').verbose(),
	db = require('./database.js');

var dbName = 'nginx';

var db;

var options = {
    host: 'nginx.org',
	path: '/en/docs/'
};

var originalPath = options.path;
var listModules = [];
var listDirectives = [];


https.get(options, function (http_res) {
	db.initBD(dbName);

	var vhost = {'instance':'teste'
				, 'name':'teste'
				, 'port':'1234'
				, 'config' : 'teste'};

	db.insertVHost(vhost);

    var data = "";

    http_res.on("data", function (chunk) {
        data += chunk;
    });

    http_res.on("end", function () {
		parseModules(data);
		parseDirectives(0);
		
		//console.log(listModules);
		//console.log(listDirectives);
    });
	
	
});


var parseModules = function(response) {
	var start = 0;
	var idModules = 1;
    //READ HTML
    var $ = cheerio.load(response);

	$('#content ul.compact li').each(function(i, element){
			var a = $(this);
			if(start==1){
				listModules.push({"id":idModules,"nome": a.text().trim(),"linka":a.children().attr('href').toString().trim()});	
				idModules++;				
			}
			
			if(a.text().trim() == "Core functionality"){
					start = 1;
			}
			
	});
	
	//console.log(list);
	
}

var parseDirectives = function(nrModule) {
	var start = 1;
	var idDirectives=1;
	var auxLink="";
	
	options.path = originalPath;
	options.path = options.path + listModules[nrModule].linka;
	
	//console.log("PATH",options.path,"\n");
	
	https.get(options, function (http_res) {
		// initialize the container for our data
		var data = "";

		// evento onde se vai recebendo a resposta
		http_res.on("data", function (chunk) {
			data += chunk;
		});

		//Ao ter a resposta toda
		http_res.on("end", function () {
			var $ = cheerio.load(data);
			$('#content table tbody tr td a').each(function(i, element){
				var a = $(this);
				auxLink = options.host+options.path.trim()+a.attr('href').toString().trim();
				listDirectives.push({"id": idDirectives,"idModule":listModules[nrModule].id ,"nome": a.text().trim(),"link":auxLink});
				//console.log	("id:", idDirectives,"idModule:",listModules[nrModule].id ,"nome:", a.text().trim(),"link:",auxLink,"\n");
				idDirectives++;
			});
			nrModule++;
			
			//Se houver mais modules, passa ao proximo
			if(nrModule<listModules.length){
				parseDirectives(nrModule);
			}
		});	
	});

}

var createBD = function(nome) {
	db = new sqlite3.Database('./'+nome+'.db');
	console.log('Criada a BD:',nome);

	db.serialize(function() {  
		db.run("CREATE TABLE IF NOT EXISTS modules (id INT, name TEXT, link TEXT)");
		console.log("Criada tabela modules");
		db.run("CREATE TABLE IF NOT EXISTS directives (id INT, idModule INT, name TEXT, link TEXT)");  
		console.log("Criada tabela directives");
		db.run("CREATE TABLE IF NOT EXISTS vhost (instancia TEXT,name TEXT, port INT, config TEXT)");  
		console.log("Criada tabela vhost");
	});  
	console.log("CLOSE BD");
	db.close(); 

}