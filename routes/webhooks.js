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

    console.log(req.body);

    if(connectionManager.verifyAuth(publickey, secret) == false){
        res.json({error: true, message: 'Not Authorized'});
        return;
    }

    var jsondata = req.body;
    var pushdata = {
        data: jsondata,
        route: req.body.route
    };
    connectionManager.push(pushdata);
    res.json(pushdata);
});


module.exports = router;

module.exports.socket = function(io){
    connectionManager.initSocket(io);
};


