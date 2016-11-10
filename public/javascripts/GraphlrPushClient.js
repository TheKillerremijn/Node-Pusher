var GraphlrPushClient = function(){
    this.socket = null;
    this.subscribed = [];
    this.state = "disconnected";
    this.routes = {};
};

GraphlrPushClient.prototype.init = function(sessionid) {
    this.sessionId = sessionid;
    var self = this;
    Notification.requestPermission();
    this.subscribe();

    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('sw.js').then(function(){self.initialiseState()});
    }else{
        console.log('Service workers are not supported by this browser');
    }
};

GraphlrPushClient.prototype.initialiseState = function(){
    var self = this;
    if(!('showNotification' in ServiceWorkerRegistration.prototype)){
        console.log('Notifications are not supported by this browser');
    }
    if(Notification.permission == "denied"){
        console.log('Notifications have been disabled by the user');
        return;
    }
    if(!('PushManager' in window)){
        console.log('Push messaging is not supported by this browser');
        return;
    }
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription){
                if(!subscription){
                    return;
                }
                self.sendSubscriptionToServer(subscription);
            })
            .catch(function(err){
                console.error('Error during getSubscription' + err);
            });
    });
};

GraphlrPushClient.prototype.sendSubscriptionToServer = function(subscription){
    console.log(subscription);

    $.ajax({
        method: 'POST',
        url: '/notification/subscribe',
        data: {
            sessionID: this.sessionId,
            subscribeTo: [ "notification:test:*", "manage:dag6:publish" ],
            subscription: JSON.stringify(subscription)
        },
        success: function(msg){
            console.log(msg);
        }
    })
};

GraphlrPushClient.prototype.bind = function(addres, sessionid){
};

GraphlrPushClient.prototype.subscribe = function(subscribeto, callback){
    var self = this;
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription){
                return self.sendSubscriptionToServer(subscription);
            }).catch(function(e){
                if(Notification.permission === "denied"){
                    console.log('Notification Permission was denied');
                }else{
                    console.error('Unable to subscribe to push', e);
                }
            });
    });
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
