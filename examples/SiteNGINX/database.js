var db,
    sqlite3 = require('sqlite3').verbose(),
    dbName = "";

module.exports = {
    initBD: function(name) {
        dbName = name;
        openBD();

        db.serialize(function() {  
            db.run("CREATE TABLE IF NOT EXISTS modules (id INT, name TEXT, link TEXT,PRIMARY KEY (id))");
            db.run("CREATE TABLE IF NOT EXISTS directives (id INT, idModule INT, name TEXT, link TEXT,PRIMARY KEY (id),FOREIGN KEY(idModule) REFERENCES modules(id))");  
            db.run("CREATE TABLE IF NOT EXISTS vhosts (id INTEGER PRIMARY KEY AUTOINCREMENT, instance TEXT,name TEXT, port INT, config TEXT)");  
        });  
        
        closeBD();
    },
    insertVHost: function(vhost, callback) {
        openBD();

        db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)"
            , vhost.instance
            , vhost.name
            , vhost.port
            , vhost.config
            , function(err) {
                if(callback) { 
                    callback(err); 
                }
            });
 
        closeBD();
    },
    selectVHost: function(id, callback) {
   
        openBD();

        db.all("SELECT instance, name, port,config FROM vhosts where id = ?"
        , id
        , function(err, rows) {
          console.log(JSON.stringify(rows));
        });
 
        closeBD();
    }
}

var openBD = function() {
        db = new sqlite3.Database('./'+dbName+'.db');
    }

var closeBD = function() {
        db.close(); 
    }