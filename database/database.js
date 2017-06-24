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
                                        console.log({'status':'failed','message':err});
                                        return response({'status':'failed','message':err});  
                                    }else{
                                        db.all("SELECT id FROM vhosts where instance = ? and name = ? and port = ?"
                                        , vhost.instance
                                        , vhost.name
                                        , vhost.port
                                        , function(err, rows) {
                                            if(err) { 
                                                console.log({'status':'failed','message':err});
                                                return response({'status':'failed','message':err});  
                                            }
                                            if (rows == 0) {
                                                console.log({'status':'ok','message':'success - no rows'});
                                                response({'status':'ok','message':'success - no rows'});
                                            }else{
                                                rows.forEach(function (row) {  
                                                    console.log({'status':'ok','message': {'id': row.id }});  
                                                    response({'status':'ok','message': {'id': row.id }});
                                                });  
                                                
                                            }
                                        });
                                    }
                                });


                }else{
                    console.log({'status':'ok','message': {'id':this.lastID}});
                    return response({'status':'ok','message': {'id':this.lastID}});
                }
            });
 
        closeBD();
    },
    insertVHostV2: function(vhost, response) {
        openBD();

        console.log('\nVHOST',vhost,'\n');
        //não tem ID, faz insert
        if(vhost.id==undefined || vhost.id==null || vhost.id=='' || isNaN(vhost.id)){
            db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)"
            , vhost.instance
            , vhost.name
            , vhost.port
            , JSON.stringify(vhost.config)
            , function(err) {
                if(err) { 
                    console.log({'status':'failed','message':err});
                    response({'status':'failed','message':err});  
                }else{
                    console.log('\nInsert com id '+this.lastID);
                    response({'status':'ok','message': {'id':this.lastID}});
                }
            });
        }else{
            console.log("vhost.config",vhost.config,"vhost.instance", vhost.instance,"vhost.name", vhost.name,"vhost.port", vhost.port,"vhost.id", vhost.id);

            db.run("UPDATE vhosts set config = ? where instance = ? and name = ? and port = ? and id = ?"
                , vhost.config
                , vhost.instance
                , vhost.name
                , vhost.port
                , parseInt(vhost.id)
                , function(err) {
                    if(err) { 
                        console.log({'status':'failed update','message':err});
                        return response({'status':'failed','message':err});  
                    }else{
                        db.all("SELECT id FROM vhosts where instance = ? and name = ? and port = ? and id = ?"
                        , vhost.instance
                        , vhost.name
                        , vhost.port
                        , vhost.id
                        , function(err, rows) {
                            if(err) { 
                                console.log('message: ',err);
                                return response({'status':'failed select do update','message':err});  
                            }
                            if (rows == 0) {
                                console.log('Sem linhas');
                                response({'status':'ok','message': 'Registo não existe'});
                            }else{
                                rows.forEach(function (row) {  
                                    console.log('\nUpdate ao ID ',row.id);  
                                    response({'status':'ok','message': {'id': row.id }});
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
                return response({'status':'failed','message':{}});  
            }
            if (rows == 0) {
                    response({'status':'ok','message':{}});
            }else{
                response({'status':'ok','message':JSON.parse(JSON.stringify(rows))[0]});
            }
        });
 
        closeBD();
    },
    selectAllVHosts: function(response) {
    
        openBD();
        
        db.all("SELECT id,instance, name, port,config FROM vhosts"
        , function(err, rows) {
            if(err) { 
                return response({'status':'failed','message':err});  
            }
            if (rows == 0) {
                    response({'status':'ok','message':{}});
            }else{
                response({'status':'ok','message':JSON.parse(JSON.stringify(rows))});
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
                    return response({'status':'failed','message':err});  
                }else{
                    response({'status':'ok','message':{}});
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