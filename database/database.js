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
            db.run("CREATE TABLE IF NOT EXISTS vhosts (id INTEGER PRIMARY KEY AUTOINCREMENT, instance TEXT,name TEXT, port INT , config TEXT, UNIQUE(instance,name,port))");  
        });  
        
        closeBD();
    },
    insertVHost: function(vhost, response) {
        openBD();

        //db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)"
        db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)"
            , vhost.instance
            , vhost.name
            , vhost.port
            , vhost.config
            , function(err) {
                if(err) { 
                    //SE ERRO, JÁ EXISTE
                     db.run("UPDATE vhosts set config = ? where instance = ? and name = ? and port = ?"
                                , vhost.config
                                , vhost.instance
                                , vhost.name
                                , vhost.port
                                , function(err) {
                                    if(err) { 
                                        console.log({'STATUS':'FAILED','MESSAGE':err});
                                        return response({'STATUS':'FAILED','MESSAGE':err});  
                                    }else{
                                        db.all("SELECT id FROM vhosts where instance = ? and name = ? and port = ?"
                                        , vhost.instance
                                        , vhost.name
                                        , vhost.port
                                        , function(err, rows) {
                                            if(err) { 
                                                console.log({'STATUS':'FAILED','MESSAGE':err,'JSON':{}});
                                                return response({'STATUS':'FAILED','MESSAGE':err,'JSON':{}});  
                                            }
                                            if (rows == 0) {
                                                console.log({'STATUS':'OK','MESSAGE':'SUCCESS - NO ROWS','JSON':{}});
                                                response({'STATUS':'OK','MESSAGE':'SUCCESS - NO ROWS','JSON':{}});
                                            }else{
                                                rows.forEach(function (row) {  
                                                    console.log({'STATUS':'OK','MESSAGE':'UPDATED ID: '+ row.id,'JSON': {'id': row.id }});  
                                                    response({'STATUS':'OK','MESSAGE':'UPDATED ID: '+ row.id,'JSON': {'id': row.id }});
                                                });  
                                                
                                            }
                                        });
                                    }
                                });


                }else{
                    console.log({'STATUS':'OK','MESSAGE':'INSERTED ID: '+this.lastID,'JSON': {'id':this.lastID}});
                    return response({'STATUS':'OK','MESSAGE':'INSERTED ID: '+this.lastID,'JSON': {'id':this.lastID}});
                }
            });
 
        closeBD();
    },
    insertVHostV2: function(vhost, response) {
        openBD();
        //não tem ID, faz insert
        if(vhost.id==undefined || vhost.id==null || isNaN(vhost.id)){
            db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)"
            , vhost.instance
            , vhost.name
            , vhost.port
            , vhost.config
            , function(err) {
                if(err) { 
                    console.log({'STATUS':'FAILED','MESSAGE':err});
                    response({'STATUS':'FAILED','MESSAGE':err});  
                }else{
                    console.log('\nInsert com id '+this.lastID);
                    response({'STATUS':'OK','MESSAGE': {'id':this.lastID}});
                }
            });
        }else{
            db.run("UPDATE vhosts set config = ? where instance = ? and name = ? and port = ? and id = ?"
                , vhost.config
                , vhost.instance
                , vhost.name
                , vhost.port
                , vhost.id
                , function(err) {
                    if(err) { 
                        console.log({'STATUS':'FAILED','MESSAGE':err});
                        return response({'STATUS':'FAILED','MESSAGE':err});  
                    }else{
                        db.all("SELECT id FROM vhosts where instance = ? and name = ? and port = ? and id = ?"
                        , vhost.instance
                        , vhost.name
                        , vhost.port
                        , vhost.id
                        , function(err, rows) {
                            if(err) { 
                                console.log('MESSAGE: ',err);
                                return response({'STATUS':'FAILED','MESSAGE':err});  
                            }
                            if (rows == 0) {
                                console.log('Sem linhas');
                                response({'STATUS':'OK','MESSAGE': 'Registo não existe'});
                            }else{
                                rows.forEach(function (row) {  
                                    console.log('\nUpdate ao ID ',row.id);  
                                    response({'STATUS':'OK','MESSAGE': {'id': row.id }});
                                });  
                                
                            }
                        });
                    }
                });
        }
        closeBD();
    },
    selectVHost: function(id, response) {
    
        openBD();
        
        db.all("SELECT id,instance, name, port,config FROM vhosts where id = ?"
        , id
        , function(err, rows) {
            if(err) { 
                return response({'STATUS':'FAILED','MESSAGE':{}});  
            }
            if (rows == 0) {
                    response({'STATUS':'OK','MESSAGE':{}});
            }else{
                response({'STATUS':'OK','MESSAGE':JSON.parse(JSON.stringify(rows))[0]});
            }
        });
 
        closeBD();
    },
    selectAllVHosts: function(response) {
    
        openBD();
        
        db.all("SELECT id,instance, name, port,config FROM vhosts"
        , function(err, rows) {
            if(err) { 
                return response({'STATUS':'FAILED','MESSAGE':err});  
            }
            if (rows == 0) {
                    response({'STATUS':'OK','MESSAGE':{}});
            }else{
                response({'STATUS':'OK','MESSAGE':JSON.parse(JSON.stringify(rows))});
            }
        });
 
        closeBD();
    },
    deleteVHost: function(id, response) {
    
        openBD();
        
        db.all("DELETE FROM vhosts where id = ?"
            , id
            , function(err, rows) {
                if(err) { 
                    return response({'STATUS':'FAILED','MESSAGE':err});  
                }else{
                    response({'STATUS':'OK','MESSAGE':'SUCCESS'});
                }
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