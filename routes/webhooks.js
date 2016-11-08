var express = require('express');
var ConnectionManager = require('../Graphlr/ConnectionManager');
var connectionManager = new ConnectionManager();
var router = express.Router();


router.post('/push', function(req, res, next){
    //TODO Auth, Verification

    var jsondata = JSON.parse(req.body.data);
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