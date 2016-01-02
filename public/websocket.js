var WebSocket = function(endpoint){
    var self = this;
    console.log("connecting to " + endpoint);
    this.socket = io(endpoint);
    self.onStatusChange("connecting");
    self.updateEvents = function(){
        self.socket.on('data', function (data) {
            self.onData(data);
        });
        self.socket.on("connect", function(){
            self.onStatusChange("connected");
        });
        self.socket.on("connect_timeout", function(){
            self.onStatusChange("timeout");
        });
        self.socket.on("reconnecting", function(){
            self.onStatusChange("reconnecting");
        });
        self.socket.on("reconnect", function(){
            self.onStatusChange("reconnected");
        });
    };
    this.updateEvents();
};

WebSocket.prototype.connect = function(endpoint){
    this.socket.disconnect();
    delete this.socket;

    console.log("connecting to " + endpoint);
    this.socket = io(endpoint);
    this.onStatusChange("connecting");

    this.updateEvents();
};

WebSocket.prototype.onData = function(data){
    console.log("Register a callback for .onData");
};

WebSocket.prototype.onStatusChange = function(status){
    console.log("Status Changed: " + status);
};