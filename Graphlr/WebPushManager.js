var webpush = require('web-push');

var WebPushManager = function(connManager){
    this.connManager = connManager;
    this.vapidKeys = webpush.generateVAPIDKeys();
    this.initServer();
};

WebPushManager.prototype.initServer = function(){
    var self = this;

    webpush.setGCMAPIKey('AIzaSyBs1dXii4Ild2MBJTRU6Fr0ikV7FTy-HH8');
    webpush.setVapidDetails(
        'mailto:nick.remijn@gmail.com',
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey
    );
};

WebPushManager.prototype.subscribe = function(data){
    var connection = {
        SessionCookie: data.sessionID,
        SubscribedTo: data['subscribeTo[]'],
        Metadata: {},
        Channel: {
            type: "notification",
            subscription: JSON.parse(data.subscription)
        }
    };
    this.connManager.addConnection(connection);
};

WebPushManager.prototype.push = function(connection, data, matchedroute, route){
    webpush.sendNotification(connection.Channel.subscription, JSON.stringify(data));
};

module.exports = WebPushManager;