var WebSocket = function(endpoint){
    var self = this;
    console.log("connecting to " + endpoint);
    this.socket = io(endpoint);
    self.onStatusChange("connecting");
    this.socket.on('data', function (data) {
        self.onData(data);
    });
    this.socket.on("connect", function(){
        self.onStatusChange("connected");
    });
    this.socket.on("connect_timeout", function(){
        self.onStatusChange("timeout");
    });
    this.socket.on("reconnecting", function(){
        self.onStatusChange("reconnecting");
    });
    this.socket.on("reconnect", function(){
        self.onStatusChange("reconnected");
    })
};

WebSocket.prototype.onData = function(data){
    console.log("Register a callback for .onData");
};

WebSocket.prototype.onStatusChange = function(status){
    console.log("Status Changed: " + status);
};