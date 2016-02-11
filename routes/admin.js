var express = require("express");
var passport = require('passport');
var ejs = require("ejs");

var ensureAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){return next();}
    res.redirect('/admin/login');
};

var printLogin = function(req, res, next){
    console.log(req.user);
    return next();
};

var AdminRoute = function(namespaces) {
    this.router = express.Router({mergeParams: true});

    this.router.get("/", printLogin, ensureAuthenticated, function(req, res){
        res.render("admin/pages/index.ejs");
    });
    this.router.get("/namespaces", printLogin, ensureAuthenticated, function(req, res){ //TODO Don't show all namespaces for security reasons
        var returnnamespaces = [];
        var registered = namespaces.getNamespaces();
        for (var i = 0; i < registered.length; i++) {
            var namespace = {name: registered[i].name, apiKey: registered[i].auth, clients: namespaces.getNameSpaceUsers(registered[i].name).length};

            returnnamespaces.push(namespace);
        }
        res.json(returnnamespaces);
    });
    this.router.get("/login", printLogin, function(req, res){
        res.render("admin/pages/login.ejs", {message: null});
    });
    this.router.post('/login', printLogin, function(req, res, next) {
        req.logout();
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.render("admin/pages/login.ejs", {message: info.message}) }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/admin');
            });
        })(req, res, next);
    });
    this.router.get('/logout', printLogin, function(req, res) {
        req.logout();
        res.redirect('/admin/login');
    });

};

module.exports = AdminRoute;