var request = require('request');
var crypto = require('crypto');

var key = null;
var secret = null;
var baseurl = "https://api.demediahub.nl/v4/";
var envname = "websocket";

var MediaHub = function(apiKey, apiSecret, envName){
    key = apiKey;
    secret = apiSecret;
    if(typeof envName !== "undefined") envname = envName;
};

MediaHub.prototype.auth = function(email, password, callback){
    var form = {
        email: email,
        password: crypto.createHash("sha512").update(password).digest("hex"),
        name: envname
    };

    this.post("users/authenticate", form, callback)

};

MediaHub.prototype.post = function(url, form, callback){

    var auth = makeAuth(url);

    form.auth_nonce = auth.auth_nonce;
    form.auth_time = auth.auth_time;
    form.auth_key = auth.auth_key;
    form.auth_hash = auth.auth_hash;
    form.environment_id = 4;

    request.post(baseurl + url, {form: form}, callback);

};

var makeAuth = function(requesturl){
    var time = Math.floor(Date.now() / 1000); //Unix time
    var value = {};

    value.auth_nonce = Math.floor(time * Math.random());
    var hash = crypto.createHmac('sha512', secret);
    hash.update(requesturl + time + value.auth_nonce);
    value.auth_hash = hash.digest('hex');
    value.auth_time = time;
    value.auth_key = key;

    return value;
};

module.exports = MediaHub;