var https = require("https"),
	cheerio = require('cheerio'),
	request = require('request');

var options = {
    host: 'nginx.org',
	path: '/en/docs/'
};

var listModules = [];
var listDirectives = [];

https.get(options, function (http_res) {
    // initialize the container for our data
    var data = "";

    // this event fires many times, each time collecting another piece of the response
    http_res.on("data", function (chunk) {
        // append this chunk to our growing `data` var
        data += chunk;
    });

    // this event fires *one* time, after all the `data` events/chunks have been gathered
    http_res.on("end", function () {
        // you can use res.send instead of console.log to output via express
		parseModules(data);
		parseDirectives2(0);
		//parseDirectives();
		
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


var parseDirectives = function() {
	//console.log(list);
	var backupPath = options.path;
	var start = 1;
	var auxLink="";
	var idDirectives=1;
	
	//ciclo for
	
	for(var nrModule=0;i<listModules.length;nrModule++){
		options.path = backupPath;
		options.path = options.path + listModules[nrModule].linka;
		console.log("PATH",options.path);
		
		https.get(options, function (http_res) {
			// initialize the container for our data
			var data = "";

			// this event fires many times, each time collecting another piece of the response
			http_res.on("data", function (chunk) {
				// append this chunk to our growing `data` var
				data += chunk;
			});

			// this event fires *one* time, after all the `data` events/chunks have been gathered
			http_res.on("end", function () {
				
				var $ = cheerio.load(data);
				$('#content table tbody tr td a').each(function(i, element){
					var a = $(this);
					
					if(start=1){
						auxLink = options.host+options.path.trim()+a.attr('href').toString().trim();
						listDirectives.push({"id": idDirectives,"idModule":listModules[nrModule].id ,"nome": a.text().trim(),"link":auxLink});
						console.log("id:", idDirectives,"idModule:",listModules[nrModule].id ,"nome:", a.text().trim(),"link:",auxLink);
					}
					//esta depois para ainda copiar o proprio
					if(a.text().trim() == "Embedded Variables"){
						start=0;
					}
					
					idDirectives++;
				});
			});	
		});
		idDirectives = 1;
	}//fim ciclo for
}


var backupPath = options.path;

var parseDirectives2 = function(nrModule) {
	var start = 1;
	var auxLink="";
	var idDirectives=1;
	
	options.path = backupPath;
	options.path = options.path + listModules[nrModule].linka;
	console.log("PATH",options.path,"\n");
	
	https.get(options, function (http_res) {
		// initialize the container for our data
		var data = "";

		// this event fires many times, each time collecting another piece of the response
		http_res.on("data", function (chunk) {
			// append this chunk to our growing `data` var
			data += chunk;
		});

		// this event fires *one* time, after all the `data` events/chunks have been gathered
		http_res.on("end", function () {
			var $ = cheerio.load(data);
			$('#content table tbody tr td a').each(function(i, element){
				var a = $(this);
				auxLink = options.host+options.path.trim()+a.attr('href').toString().trim();
				listDirectives.push({"id": idDirectives,"idModule":listModules[nrModule].id ,"nome": a.text().trim(),"link":auxLink});
				console.log	("id:", idDirectives,"idModule:",listModules[nrModule].id ,"nome:", a.text().trim(),"link:",auxLink,"\n");
				idDirectives++;
			});
			nrModule++;
			
			if(nrModule<listModules.length){
				parseDirectives2(nrModule);
			}
		});	
	});

}