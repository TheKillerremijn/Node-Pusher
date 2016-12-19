var express = require('express');
var ConnectionManager = require('../Graphlr/ConnectionManager');
var connectionManager = new ConnectionManager();
var router = express.Router();
var config = require('./../config');

router.post('/notification/subscribe', function(req, res, next){
    console.log('Recieved subscribe');
    connectionManager.webPushManager.subscribe(req.body);
});

router.post('/push', function(req, res, next){

    var publickey = req.body.public;
    var secret = req.body.secret;

    if(connectionManager.verifyAuth(publickey, secret) == false){
        var e = new Error('Not Authorized');
        e.status = 401;
        return next(e);
    }

    // var jsondata = req.body;
    var jsonbody;
    try{
        jsonbody = JSON.parse(req.body.data);
    }catch(e){
        return next(e);
    }

    var pushdata = {
        data: jsonbody,
        route: req.body.route
    };
    connectionManager.push(pushdata);
    pushdata.error = false;
    res.json(pushdata);
});


module.exports = router;

module.exports.socket = function(io){
    connectionManager.initSocket(io);
};


