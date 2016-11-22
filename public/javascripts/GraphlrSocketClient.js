var GraphlrSocketClient = function(){
    this.socket = null;
    this.subscribed = [];
    this.state = "disconnected";
    this.routes = {};
};

GraphlrSocketClient.prototype.init = function(sessionid, environment){
    var initdata = {
        session: sessionid,
        subscribe: this.subscribed,
        environment: environment
    };

    this.socket.emit('init', initdata);
};

GraphlrSocketClient.prototype.bind = function(addres, sessionid, environment){
    var self = this;
    this.socket = io(addres);
    this.state = "connecting";
    this.socket.on('connect', function(){
        self.state = "connected";
        console.log('[GraphSocket] Connected to ' + addres);
        self.init(sessionid, environment);
    });
    this.socket.on('error', function(data){
        console.error('[GraphSocket] ', data);
    });
    this.socket.on('disconnect', function () {
        self.state = "disconnected";
        console.log('[GraphSocket] Disconnected from ' + addres);
    });
    this.socket.on('reconnect', function (data) {
        console.log('[GraphSocket] Reconnected to ' + addres + " after " + data + " Tries");
    });
    this.socket.on('data', function(data){
        var callback = self.routes[data.route];
        if(typeof callback == "undefined"){
            console.error('[GraphSocket] Something went very wrong');
            return;
        }
        callback(data.data);
    });
};

GraphlrSocketClient.prototype.subscribe = function(subscribeto, callback){
    if(typeof subscribeto == "string") subscribeto = [subscribeto];

    this.routes[subscribeto] = callback;

    for(var i=0;i<subscribeto.length;i++){
        this.subscribed.push(subscribeto[i]);
    }

    if(this.state == "connected"){
        this.socket.emit('subscribe', subscribeto);
    }
    console.log('[GraphSocket] Subscribed to ' + subscribeto.join(', '));
};

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}