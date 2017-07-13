var db,
    sqlite3 = require('sqlite3').verbose(),
    dbName = "";

module.exports = {
    initBD: function(name) {
        dbName = name;
        openBD();
        db.serialize(function() {
            //db.run("CREATE TABLE IF NOT EXISTS modules (id INT, name TEXT, link TEXT,PRIMARY KEY (id))");
            //db.run("CREATE TABLE IF NOT EXISTS directives (id INT, idModule INT, name TEXT, link TEXT,FOREIGN KEY(idModule) REFERENCES modules(id))");
            db.run("CREATE TABLE IF NOT EXISTS modules (id INT, name TEXT, link TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS directives (id INT, idModule INT, name TEXT, link TEXT, syntax TEXT, _default TEXT, context TEXT)");

            db.run("CREATE TABLE IF NOT EXISTS vhosts (id INTEGER PRIMARY KEY AUTOINCREMENT, instance TEXT,name TEXT, port INT , config TEXT, UNIQUE(instance,name,port))");
            db.run("CREATE TABLE IF NOT EXISTS upstreams (id INTEGER PRIMARY KEY AUTOINCREMENT, instance TEXT, name TEXT, config TEXT, UNIQUE(instance,name))");
            db.run("CREATE TABLE IF NOT EXISTS vms (id INTEGER PRIMARY KEY, name TEXT, hostname TEXT, ip TEXT, templateId TEXT)");
        });

        closeBD();
    },
    initBDSite: function(name) {
        dbName = name;
        openBDSite();
        db.serialize(function() {
            //db.run("CREATE TABLE IF NOT EXISTS modules (id INT, name TEXT, link TEXT,PRIMARY KEY (id))");
            //db.run("CREATE TABLE IF NOT EXISTS directives (id INT, idModule INT, name TEXT, link TEXT,FOREIGN KEY(idModule) REFERENCES modules(id))");
            db.run("CREATE TABLE IF NOT EXISTS modules (id INT, name TEXT, link TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS directives (id INT, idModule INT, name TEXT, link TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS vhosts (id INTEGER PRIMARY KEY AUTOINCREMENT, instance TEXT,name TEXT, port INT , config TEXT, UNIQUE(instance,name,port))");
        });

        closeBD();
    },
    insertVHost: function(vhost, response) {
        openBD();

        //db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)"
        db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)", vhost.instance, vhost.name, vhost.port, vhost.config, function(err) {
            if (err) {
                //SE ERRO, JÁ EXISTE
                db.run("UPDATE vhosts set config = ? where instance = ? and name = ? and port = ?", vhost.config, vhost.instance, vhost.name, vhost.port, function(err) {
                    if (err) {
                        console.log({ 'status': 'failed', 'message': err });
                        return response({ 'status': 'failed', 'message': err });
                    } else {
                        db.all("SELECT id FROM vhosts where instance = ? and name = ? and port = ?", vhost.instance, vhost.name, vhost.port, function(err, rows) {
                            if (err) {
                                console.log({ 'status': 'failed', 'message': err });
                                return response({ 'status': 'failed', 'message': err });
                            }
                            if (rows == 0) {
                                console.log({ 'status': 'ok', 'message': 'success - no rows' });
                                response({ 'status': 'ok', 'message': 'success - no rows' });
                            } else {
                                rows.forEach(function(row) {
                                    console.log({ 'status': 'ok', 'message': { 'id': row.id } });
                                    response({ 'status': 'ok', 'message': { 'id': row.id } });
                                });

                            }
                        });
                    }
                });


            } else {
                console.log({ 'status': 'ok', 'message': { 'id': this.lastID } });
                return response({ 'status': 'ok', 'message': { 'id': this.lastID } });
            }
        });

        closeBD();
    },
    insertVHostV2: function(vhost, response) {
        openBD();
        console.log('\n------------------------- DB insertVHostV2 -------------------------\n');
        console.log('\nVHOST', vhost, '\n');
        //não tem ID, faz insert
        if (vhost.id == undefined || vhost.id == null || vhost.id == '' || isNaN(vhost.id)) {
            console.log('DB: INSERT');
            db.run("INSERT INTO vhosts (instance, name, port,config) VALUES (?,?,?,?)", vhost.instance, vhost.name, vhost.port, JSON.stringify(vhost.config), function(err) {
                if (err) {
                    console.log({ 'status': 'failed', 'message': err });
                    response({ 'status': 'failed', 'message': err });
                } else {
                    console.log('\nInsert com id ' + this.lastID);
                    response({ 'status': 'ok', 'message': { 'id': this.lastID } });
                }
            });
        } else {
            //console.log("UPDATE vhosts set config = ",vhost.config," where instance = ", vhost.instance," and name = " , vhost.name," and port = ", vhost.port," and id = ", vhost.id);
            console.log('DB: UPDATE');
            db.run("UPDATE vhosts set config = ? where instance = ? and name = ? and port = ? and id = ?", JSON.stringify(vhost.config), vhost.instance, vhost.name, vhost.port, vhost.id, function(err) {
                if (err) {
                    console.log({ 'status': 'failed update', 'message': err });
                    return response({ 'status': 'failed', 'message': err });
                } else {
                    db.all("SELECT id FROM vhosts where instance = ? and name = ? and port = ? and id = ?", vhost.instance, vhost.name, vhost.port, vhost.id, function(err, rows) {
                        if (err) {
                            console.log('message: ', err);
                            return response({ 'status': 'failed select do update', 'message': err });
                        } else {
                            rows.forEach(function(row) {
                                console.log('\nUpdate ao ID ', row.id);
                                response({ 'status': 'ok', 'message': { 'id': row.id } });
                            });

                        }
                    });
                }
            });
        }
        closeBD();
    },
    insertVM: function(vm, response) {
        openBD();
        console.log('\n------------------------- DB insertVM -------------------------\n');
        console.log('\nVM', vm, '\n');

        console.log('DB: INSERT');
        db.run("INSERT INTO vms (id, name, hostname, ip,templateId) VALUES (?,?,?,?,?)", vm.id, vm.name, vm.hostname, vm.ip, vm.templateId, function(err) {
            if (err) {
                console.log({ 'status': 'failed', 'message': err });
                response({ 'status': 'failed', 'message': err });
            } else {
                console.log('\nInsert com id ' + this.lastID);
                response({ 'status': 'ok', 'message': { 'id': this.lastID } });
            }
        });
        closeBD();
    },
    deleteVM: function(id, response) {

        openBD();

        db.all("DELETE FROM vms where id = ?", id, function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': id.toString() });
            }
        });

        closeBD();
    },
    selectAllVMS: function(response) {

        openBD();

        db.all("SELECT id, name, hostname, ip, templateId FROM vms", function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows)) });
            }
        });

        closeBD();
    },
    selectVMByID: function(id, response) {

        openBD();

        db.all("SELECT id, name, hostname, ip, templateId FROM vms where id = ?", id, function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows)) });
            }
        });

        closeBD();
    },
    selectVHost: function(id, response) {

        openBD();

        db.all("SELECT id,instance, name, port,config FROM vhosts where id = ?", id, function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': {} });
            }
            if (rows == 0) {
                response({ 'status': 'ok', 'message': {} });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows))[0] });
            }
        });

        closeBD();
    },
    selectAllVHosts: function(response) {

        openBD();

        db.all("SELECT id,instance, name, port,config FROM vhosts", function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows)) });
            }
        });

        closeBD();
    },
    deleteVHost: function(id, response) {

        openBD();

        db.all("DELETE FROM vhosts where id = ?", id, function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': {} });
            }
        });

        closeBD();
    },
    deleteUpstream: function(id, response) {

        openBD();

        db.all("DELETE FROM upstreams where id = ?", id, function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': {} });
            }
        });

        closeBD();
    },
    selectNextSeedVHost: function(response) {
        //GET NEXT SEED = seq + 1
        //SELECT seq+1 as seed FROM SQLITE_SEQUENCE WHERE name='vhosts'
        openBD();

        db.all("SELECT name, seq+1001 as seed FROM SQLITE_SEQUENCE WHERE name='vhosts'", function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': {} });
            }
            if (rows == 0) {
                response({ 'status': 'ok', 'message': { "name": "vhosts", "seed": "1001" } });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows))[0] });
            }
        });

        closeBD();
    },
    selectNextSeedUpstream: function(response) {
        //GET NEXT SEED = seq + 1
        //SELECT seq+1 as seed FROM SQLITE_SEQUENCE WHERE name='vhosts'
        openBD();

        db.all("SELECT name, seq+101 as seed FROM SQLITE_SEQUENCE WHERE name='upstreams'", function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': {} });
            }
            if (rows == 0) {
                response({ 'status': 'ok', 'message': { "name": "upstreams", "seed": "101" } });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows))[0] });
            }
        });

        closeBD();
    },
    insertUpstream: function(upstream, response) {
        openBD();
        //console.log('\nInsert Upstream: ', upstream, '\n');
        // Insert
        if (upstream.id == undefined || upstream.id == null || upstream.id == '' || isNaN(upstream.id)) {

            db.run("INSERT INTO upstreams (instance, name, config) VALUES (?,?,?)", upstream.instance, upstream.name, upstream.config, function(err) {
                if (err) {
                    console.log('Erro no insertUpstream');
                    console.log({ 'status': 'failed', 'message': err });
                    response({ 'status': 'failed', 'message': err });
                } else {
                    console.log('\nInsert upstream com id ' + this.lastID);
                    response({ 'status': 'ok', 'message': { 'id': this.lastID } });
                }
            });
        } else {
            // UPDATE
            //console.log("UPDATE upstreams set config = ? where instance = ? and name = ?", upstream.config, upstream.instance, upstream.name);
            db.run("UPDATE upstreams set config = ? where instance = ? and name = ?", upstream.config, upstream.instance, upstream.name, function(err) {
                if (err) {
                    console.log('Erro no UpdateUpstream');
                    console.log({ 'status': 'failed', 'message': err });
                    response({ 'status': 'failed', 'message': err });
                } else {
                    console.log('\nUpdate upstream com id ' + upstream.id);
                    response({ 'status': 'ok', 'message': { 'id': upstream.id } });
                }
            });
        }
        closeBD();
    },
    canInsertUpstreamMulti: function(confUpdtreamContent, instance, response) {
        //NOTA: NÃO ESTÁ SINCRONO...
        openBD();

        var alreadyRes = false;
        var count = 0;

        console.log('confUpdtreamContent.length:', confUpdtreamContent.length);

        var processItems = function(x) {
            if (x < confUpdtreamContent.length) {
                console.log('confUpdtreamContent:', confUpdtreamContent);
                UpstreamDBName = confUpdtreamContent[x].name.replace('https://', '').replace('http://', '');
                console.log('canInsertUpstream', UpstreamDBName);
                db.all("SELECT * FROM upstreams WHERE name = ? and instance = ?", UpstreamDBName, instance, function(err, rows) {
                    if (err) {
                        console.log("ERRO")
                        alreadyRes = true;
                        return response({ 'status': 'failed', 'message': err });
                    } else {
                        console.log("Já existe");
                        alreadyRes = true;
                    }
                });
                count = count + 1;
                processItems(x + 1);
            }
        };
        processItems(0);

        closeBD();

        //se correr tudo bem
        if (alreadyRes == false && count == confUpdtreamContent.length) {
            console.log('Pode inserir');
            return response({ 'status': 'ok', 'message': {} });
        } else {
            return response({ 'status': 'failed', 'message': 'A uptream ' + UpstreamDBName + ' na instancia ' + instance + ' já existe' });
        }
    },
    canInsertUpstreamSingle: function(confUpdtreamContent, instance, response) {
        openBD();
        UpstreamDBName = confUpdtreamContent[0].name.replace('https://', '').replace('http://', '');
        console.log('canInsertUpstream', UpstreamDBName);
        db.all("SELECT * FROM upstreams WHERE name = ? and instance = ?", UpstreamDBName, instance, function(err, rows) {
            if (err) {
                console.log("ERRO")
                return response({ 'status': 'failed', 'message': err });
            }
            if (rows == 0) {
                return response({ 'status': 'ok', 'message': {} });
            } else {
                console.log("Já existe");
                return response({ 'status': 'failed', 'message': 'A uptream ' + UpstreamDBName + ' na instancia ' + instance + ' já existe' });
            }
        });

        closeBD();
    },
    selectAllUpstreams: function(response) {

        openBD();

        db.all("SELECT id,instance, name, config FROM upstreams", function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows)) });
            }
        });

        closeBD();
    },
    selectAllDirectives: function(response) {
        openBD();
        db.all("select name, syntax, _default, context, link from directives where context like '%location%' or context like '%server%' or context like '%upstream%'", function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows)) });
            }
        });
        closeBD();
    },
    selectDirectivesFilter: function(context, response) {
        openBD();
        console.log('DB Context:', context);
        db.all("select name as value, name as text, syntax, _default, context, link from directives where context like ?", '%' + context + '%', function(err, rows) {
            if (err) {
                return response({ 'status': 'failed', 'message': err });
            } else {
                response({ 'status': 'ok', 'message': JSON.parse(JSON.stringify(rows)) });
            }
        });

        closeBD();
    }

};

var openBD = function() {
    //console.log('./database/' + dbName + '.db');
    try {
        db = new sqlite3.Database('./database/' + dbName + '.db'); //main normal
    } catch (e) {
        console.log(e);
    }
}
var openBDSite = function() {
    console.log('./database/' + dbName + '.db');
    try {
        db = new sqlite3.Database('/vagrant/database/' + dbName + '.db'); //examples
    } catch (e) {
        console.log(e);
    }
}

var closeBD = function() {
    db.close();
}
