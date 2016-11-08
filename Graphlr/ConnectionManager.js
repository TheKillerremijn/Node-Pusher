var exports = module.exports;
var pushRoutes = require('./PushRoutes');
var SocketManager = require('./SocketManager');
var socketManager;

var ConnectionManager = function(){
    this.connections = [
        {
            SessionCookie: "test",
            SubscribedTo: [
                "prepr:538:playlist",
                "112pers:*"
            ],
            Metadata: {},
            Channel: {
                type: "console"
            }
        }
    ];
};

ConnectionManager.prototype.push = function(pushdata){
    var route = pushdata.route;
    var data = pushdata.data;

    var relevantConnections = this.getConnectionsByRoute(route);
    // console.log(relevantConnections);
    for(var matchedroute in relevantConnections){
        this.pushToConnection(relevantConnections[matchedroute], data, matchedroute, route);
    }
};

ConnectionManager.prototype.getConnectionsByRoute = function(route){
    console.log('matching');
    var matched = false;
    var matching = {};
    for(var i=0;i<this.connections.length;i++){
        matched = false;
        for(var j=0;j<this.connections[i].SubscribedTo.length;j++){
            if(pushRoutes.match(this.connections[i].SubscribedTo[j], route)){
                matched = this.connections[i].SubscribedTo[j];
                break;
            }
        }
        if(matched != false) matching[matched] = this.connections[i];
    }
    return matching;
};

ConnectionManager.prototype.pushToConnection = function(connection, data, matchedroute, route){
    switch(connection.Channel.type){
        case "console":
            console.log("[" + connection.SessionCookie + "] - " + JSON.stringify(data));
            break;
        case "websocket":
            socketManager.push(connection, data, matchedroute, route);
            break;
    }
};

ConnectionManager.prototype.addConnection = function(conn){
    this.connections.push(conn);
};

ConnectionManager.prototype.removeConnection = function(conn){
    for(var i=0;i<this.connections.length;i++){
        if(this.connections[i].SessionCookie == conn.SessionCookie){
            this.connections[i].splice(i, 1);
        }
    }
};

ConnectionManager.prototype.initSocket = function(io){
    socketManager = new SocketManager(io, this);
};

module.exports = ConnectionManager;