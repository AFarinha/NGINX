var request = require('request');

var urls = ["http://www.google.com","http://www.sapo.pt","http://www.hotmail.com"];

var requestLoop = setInterval(function(){
  var url = urls[Math.floor(Math.random()*urls.length)];
  console.log(url);
  request({
      url: url,
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
  },function(error, response, body){
      if(!error && response.statusCode == 200){
          console.log('success!');
      }else{
          console.log('error' + response.statusCode);
      }
  });
}, 1000);
