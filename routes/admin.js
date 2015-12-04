var express = require("express");

var AdminRoute = function() {
    this.router = express.Router({mergeParams: true});

    this.router.get("/", function(req, res){
        res.json("Admin root");
    });
};

module.exports = AdminRoute;