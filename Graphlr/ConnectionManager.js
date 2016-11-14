var exports = module.exports;
var pushRoutes = require('./PushRoutes');
var SocketManager = require('./SocketManager');
var WebPushManager = require('./WebPushManager');

var ConnectionManager = function(){
    this.webPushManager = new WebPushManager(this);
    this.webPushManager.initServer();
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
        for(var i=0;i<relevantConnections[matchedroute].length;i++){
            this.pushToConnection(relevantConnections[matchedroute][i], data, matchedroute, route);
        }
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
        if(matched != false){
            if(typeof matching[matched] === "undefined"){
                matching[matched] = [];
            }
            matching[matched].push(this.connections[i]);
        }
    }
    return matching;
};

ConnectionManager.prototype.pushToConnection = function(connection, data, matchedroute, route){
    switch(connection.Channel.type){
        case "console":
            console.log("[" + connection.SessionCookie + "] - " + JSON.stringify(data));
            break;
        case "websocket":
            this.socketManager.push(connection, data, matchedroute, route);
            break;
        case "notification":
            this.webPushManager.push(connection, data, matchedroute, route);
            break;
    }
};

ConnectionManager.prototype.addConnection = function(conn){
    this.connections.push(conn);
};

ConnectionManager.prototype.removeConnection = function(conn){
    for(var i=0;i<this.connections.length;i++){
        if(this.connections[i].SessionCookie == conn.SessionCookie){
            this.connections.splice(i, 1);
        }
    }
};

ConnectionManager.prototype.initSocket = function(io){
    this.socketManager = new SocketManager(io, this);
};

module.exports = ConnectionManager;