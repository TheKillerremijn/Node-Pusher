var express = require('express');
var app = express();
var fs = require("fs");
var constants = require("constants");
var config = JSON.parse(fs.readFileSync("config.json")); //import config.json as the config variable

var sslOptions;
var ssl = true;

try{
    sslOptions = { //Specify tls options
        key: fs.readFileSync(__dirname + '/ssl/nodejs.key'),
        cert: fs.readFileSync(__dirname + '/ssl/nodejs_doelgroep_tv.crt'),
        ca: [fs.readFileSync(__dirname + '/ssl/COMODORSAAddTrustCA.crt'), fs.readFileSync(__dirname + '/ssl/COMODORSADomainValidationSecureServerCA.crt')],
        secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
        ciphers: [
            "ECDHE-RSA-AES128-SHA256",
            "DHE-RSA-AES128-SHA256",
            "AES128-GCM-SHA256",
            "!RC4",
            "HIGH",
            "!MD5",
            "!aNULL"
        ].join(':'),
        honorCipherOrder: true
    };
}catch (e){
    console.error(e);
    ssl = false;
}

if(!ssl) console.log("Starting without ssl");

//Create servers
if(ssl == true) var https = require('https').createServer(sslOptions, app);
var http = require("http").createServer(app);

var ioServer = require('socket.io'); //Create socket io server
var io = new ioServer();
io.attach(http); //Attach it so it listens to both http and https
if(ssl == true) io.attach(https);

var bodyParser = require("body-parser");
var formidable = require("express-formidable");
var path = require('path');
var favicon = require('serve-favicon');

var Namespaces = require("./namespaces"); //Namespace handlers
var namespaces = new Namespaces(io);
var NSPRoute = require("./routes/namespaces"); // /:namespace:/ route
var nsproute = new NSPRoute(namespaces);

var AdminRoute = require("./routes/admin");
var adminroute = new AdminRoute();

app.use(bodyParser.urlencoded({ extended: true })); //Allow normal url encoded post
app.use(formidable.parse()); //Allow multipart post data
app.use(bodyParser.json()); //Allow raw json data
app.use("/public", express.static(path.join(__dirname, 'public'))); //Expose /public as a normal webserver
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

var sslport = process.env.SSLPORT || 443; //Run on port 443 or otherwise specified
var port = process.env.PORT || 80; //Run on port 80 or otherwise specified

if(ssl == true) https.listen(sslport);
if(ssl == true) console.log("Listening on port " + sslport);
http.listen(port);
console.log("Listening on port " + port);

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' }); //Dumb little message on /
});

app.get('/pingdom', function(req, res){ //Pingdom check url
    res.json({error: false, data: "I'm okay friend. All is good!", success: true});
});

//TODO Secure this
app.get('/namespaces', function(req, res) { //List namespaces and users
    var returnnamespaces = [];
    var registered = namespaces.getNamespaces();
    for(var i=0;i<registered.length;i++){
        var namespace = {name: registered[i].name, clients: namespaces.getNameSpaceUsers(registered[i].name).length};

        returnnamespaces.push(namespace);
    }
    res.json(returnnamespaces);
});

app.use("/admin", adminroute.router); //Bind /admin to use the admin router
app.use("/:namespace", nsproute.router); //Bind /:namespace to use namespace router

io.on('connection', function(socket){ //connecting sockets
    console.log("User has connected ip: " + socket.client.conn.remoteAddress + " id: " + socket.client.id);
});