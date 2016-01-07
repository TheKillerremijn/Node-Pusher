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

var AdminRoute = function() {
    this.router = express.Router({mergeParams: true});

    this.router.get("/", printLogin, ensureAuthenticated, function(req, res){
        res.render("admin/pages/index.ejs");
    });
    this.router.get("/login", printLogin, function(req, res){
        res.render("admin/pages/login.ejs", {message: null});
    });
    //this.router.post('/login',
    //    passport.authenticate('local', { successRedirect: '/admin',
    //        failureRedirect: '/admin/login',
    //        failureFlash: false })
    //);
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