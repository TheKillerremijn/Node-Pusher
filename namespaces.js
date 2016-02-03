var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json")); //parse json config to variable

var namespaces = function(io){
    this.io = io;
    this.initNamespaces();
};

namespaces.prototype.getNamespace = function(namespace){ //Get a namespace as specified in config variable
    for(var i=0;i < config.length; i++){
        if(namespace === config[i].name){
            return config[i];
        }
    }
    return null; //No namespace by that name exists, return null
};

namespaces.prototype.getNamespaces = function(){ //Get all namespaces
    return config;
};

namespaces.prototype.createNamespace = function(namespace, apiKey, persistent){ //Create a namespace
    var space = {name: namespace, auth: apiKey, persistent: persistent};
    config.push(space); //Write the namespace to the config variable
    this.io.of(space.name); //Register the namespace with socket.io
    fs.writeFile("config.json", JSON.stringify(config, null, 4), function(err){
        if(err) console.error(err);
        else console.log("saved file")
    }); //Write the config var to disk
    return space;
};

namespaces.prototype.deleteNameSpace = function(namespace){ //Delete a namespace
    for(var i=0;i < config.length; i++){
        if(namespace.name === config[i].name){
            config.splice(i, 1); //Remove the namespace from the config variable
            fs.writeFile("config.json", JSON.stringify(config, null, 4), function(err){
                if(err) console.error(err);
            }); //Write the config var to disk
            return true;
        }
    }
    return false;
};

namespaces.prototype.getNameSpaceUsers = function(nsp){
    nsp = "/"+nsp;
    var clients = [];
    if(typeof(this.io.nsps[nsp]) === "undefined") return []; //This namespace might be registered, but has not had any mesages
    for(var id in this.io.nsps[nsp].connected){
        clients.push({ip: this.io.nsps[nsp].connected[id].client.conn.remoteAddress, id: this.io.nsps[nsp].connected[id].id});
    }
    return clients;
};

namespaces.prototype.sendMessage = function(namespace, message){
    this.io.of(namespace).emit("data",message); //Emit to websockets listening to namespace
};

namespaces.prototype.initNamespaces = function(){ //Users cant reconnect to namespace that doesnt exists, so create it on startup
    for(nsp in config){
        this.io.of(config[nsp].name);
    }
};

module.exports = namespaces;