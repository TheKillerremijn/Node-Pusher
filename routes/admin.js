var express = require("express");
var ejs = require("ejs");

var AdminRoute = function() {
    this.router = express.Router({mergeParams: true});

    this.router.get("/", function(req, res){
        res.render("admin/pages/index.ejs");
    });
};

module.exports = AdminRoute;