var https = require("https"),
	cheerio = require('cheerio'),
	request = require('request'),
	sqlite3 = require('sqlite3').verbose(),
	db = require('/vagrant/server/lib/database.js'),
	fs = require('fs');

var dbName = 'nginx';
var scriptName = 'script.txt';
var db;

var options = {
    host: 'nginx.org',
	path: '/en/docs/'
};

var originalPath = options.path;
var listModules = [];
var listDirectives = [];


fs.exists(scriptName, function(exists) {
  if(exists) {
    fs.unlink(scriptName);
  } 
});

db.initBDSite(dbName);


https.get(options, function (http_res) {
	


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
				//console.log("id:",idModules,"nome: ", a.text().trim(),"linka: ",a.children().attr('href').toString().trim());
				var insert = "INSERT INTO modules (id, name, link) VALUES ("+idModules+",'"+ a.text().trim()+"','"+a.children().attr('href').toString().trim()+"');\r\n";
				fs.appendFile(scriptName, insert, function (err) {
				  if (err) throw err;
				});
				
				idModules++;				
			}
			
			if(a.text().trim() == "Core functionality"){
					start = 1;
			}
			
	});
	
}

var parseDirectives = function(nrModule) {
	var start = 1;
	var idDirectives=1;
	var auxLink="";

	options.path = originalPath;
	options.path = options.path + listModules[nrModule].linka;
	console.log('\n------------------------------------------\n');
	console.log("\nPATH: ",options.path,"\n");
	
	https.get(options, function (http_res) {
		// initialize the container for our data
		var data = "";

		// evento onde se vai recebendo a resposta
		http_res.on("data", function (chunk) {
			data += chunk;
		});
		var excludeTags = ['Directives','Example Configuration','Embedded Variables'];

		//Ao ter a resposta toda
		http_res.on("end", function () {
			var $ = cheerio.load(data);
			$('#content table tbody tr td a').each(function(i, element){
				var a = $(this);
				//console.log("id", idDirectives,"idModule",listModules[nrModule].id ,"nome", a.text().trim(),"link",auxLink);
				//if(excludeTags.indexOf(a.text().trim()) === -1){
				if(a.text().trim() !== 'Directives' && a.text().trim() !== 'Example Configuration' && a.text().trim() !== 'Embedded Variables' ){
					auxLink = options.host+options.path.trim()+a.attr('href').toString().trim();
					listDirectives.push({"id": idDirectives,"idModule":listModules[nrModule].id ,"nome": a.text().trim(),"link":auxLink});
					//console.log	("id:", idDirectives,"idModule:",listModules[nrModule].id ,"nome:", a.text().trim(),"link:",auxLink,"\n");
					var insert = "INSERT INTO directives (id, idModule, name, link) VALUES ("+idDirectives+","+listModules[nrModule].id+",'"+a.text().trim()+"','"+auxLink+"');\r\n";	

					fs.appendFile(scriptName, insert, function (err) {
					  if (err) throw err;
					});
					idDirectives++;
				}
			});
			nrModule++;
			
			//Se houver mais modules, passa ao proximo
			if(nrModule < listModules.length){
				console.log('nrModule: ',nrModule);
				parseDirectives(nrModule);
			}
		});	
	});

}
