var SocketManager = function(io, connManager){
    this.io = io;
    this.initServer();
    this.connManager = connManager;
};

SocketManager.prototype.initServer = function(){
    var self = this;
    console.log('Init Socket.io Listener');
    this.io.on('connection', function(socket){
        console.log('new connection');
        var connection = {
            SessionCookie: null,
            SubscribedTo: [
            ],
            Environment: '',
            Permitted: [],
            Metadata: {},
            Channel: {
                type: "websocket",
                socket: socket,
                state: 'connected'
            }
        };
        self.connManager.addConnection(connection);
        socket.on('init', function(data){
            console.log('init');
            if(typeof data.session !== "undefined") connection.SessionCookie = data.session;
            if(typeof data.subscribe !== "undefined") connection.SubscribedTo = data.subscribe;
            if(typeof data.metadata !== "undefined") connection.Metadata = data.metadata;
            if(typeof data.environment !== "undefined") connection.Environment = data.environment;
            self.connManager.verifySession(connection);
        });

        socket.on('subscribe', function(data){
            if(typeof data === "undefined" || typeof(data[0]) == "undefined") return;
            console.log('sub to ' + data.join(', '));

            connection.SubscribedTo = connection.SubscribedTo.concat(data);
        });

        socket.on('disconnect', function(){
            //cleanup
            console.log('disconnect');
            self.connManager.removeConnection(connection);
            delete connection;
        });
    });
};

SocketManager.prototype.push = function(connection, data, matchedroute, route){
    if(connection.Channel.type !== "websocket") return;

    data = {data: data, route: matchedroute, dataroute: route};

    console.log('sent ' + data + " to ", connection.SessionCookie);
    connection.Channel.socket.emit('data', data);
};

module.exports = SocketManager;