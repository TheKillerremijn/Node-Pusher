var express = require("express");

var NSPRoute = function(namespaces) {
    this.router = express.Router({mergeParams: true});

    this.router.use(function logging(req, res, next) {
        console.log("Request made");
        next();
    });

    this.router.get("/users", function (req, res) {
        var namespace = namespaces.getNamespace(req.params.namespace); //Get namespace from url
        if (namespace == null) { //Namespace doesn't exist
            res.status(400);
            res.json({message: 'Malformed request: namespace does not exists'});
            return;
        }
        console.log(req.query);
        if (typeof (req.query.apiKey) === "undefined") {
            res.status(400);
            res.json({message: 'Malformed request: no apiKey sent with the request'});
            return;
        } else if (req.query.apiKey != namespace.auth) {
            res.status(401);
            res.json({message: 'Malformed request: apiKey does not match the one on the namespace'});
            return;
        }
        res.json(namespaces.getNameSpaceUsers(namespace.name));
    });
    this.router.post("/", function(req, res){ //All /something requests
        console.log("Received data " + JSON.stringify(req.body) + " on namespace " + req.params.namespace + " from ip: " + req.ip);
        var namespace = namespaces.getNamespace(req.params.namespace); //Get the settings for this namespace, auth etc.
        if(namespace == null){ //Check if namespace exists
            res.status(400);
            res.json({ message: 'Malformed request: namespace does not exist' });
            return;
        }
        if (typeof (req.body.apiKey) === "undefined"){
            res.status(400);
            res.json({ message: 'Malformed request: no apiKey sent with the request' });
            return;
        }else if(req.body.apiKey != namespace.auth){
            res.status(401);
            res.json({ message: 'Malformed request: apiKey does not match the one on the namespace' });
            return;
        }
        if(typeof (req.body.data) === "undefined" ){ //No Data post element was included
            res.status(400);
            res.json({ message: "Malformed request, use 'data' post element"});
        }else{
            namespaces.sendMessage("/"+namespace.name, req.body.data);
            res.status(200);
            res.json({namespace: namespace.name});
        }
    });
    this.router.get("/", function(req, res) { //All /something requests
        console.log("Received data " + JSON.stringify(req.query) + " on namespace " + req.params.namespace + " from ip: " + req.ip);
        var namespace = namespaces.getNamespace(req.params.namespace); //Get the settings for this namespace, auth etc.
        var data = req.query.data;
        if(typeof(data) === "undefined"){
            data = req.query.message;
        }
        if(namespace == null){ //Check if namespace exists
            res.status(400);
            res.json({ message: 'Malformed request: namespace does not exist' });
            return;
        }
        if (typeof (req.query.apiKey) === "undefined"){
            res.status(400);
            res.json({ message: 'Malformed request: no apiKey sent with the request' });
            return;
        }else if(req.query.apiKey != namespace.auth){
            res.status(401);
            res.json({ message: 'Malformed request: apiKey does not match the one on the namespace' });
            return;
        }
        if(typeof (data) === "undefined" ){ //No Data post element was included
            res.status(400);
            res.json({ message: "Malformed request, use 'data' or 'message' get query"});
        }else{
            namespaces.sendMessage("/"+namespace.name, req.body.data);
            res.status(200);
            res.json({namespace: namespace.name});
        }
    });

    this.router.post("/create", function(req, res){ //Crate a namespace
        var namespace = namespaces.getNamespace(req.params.namespace); //Get namespace from url
        var persistent = true;
        if (typeof (req.body.persistent) !== "undefined"){
            if((req.body.persistent.toLowerCase() === 'false'))
                persistent = false;
        }
        if (typeof (req.body.apiKey) === "undefined"){
            res.status(400);
            res.json({ message: 'Malformed request: no apiKey sent with the request' });
            return;
        }
        var apiKey = req.body.apiKey;
        if(namespace != null){ //Namespace already exists
            res.status(400);
            res.json({ message: 'Malformed request: namespace already exists' });
            return;
        }
        console.log("Creating namespace: " + req.params.namespace);
        namespace = namespaces.createNamespace(req.params.namespace, apiKey, persistent); //Create a namespace and send the name back as confirmation
        res.json({namespace: namespace.name, persistent: persistent});
    });

    this.router.post("/delete", function(req, res){ //Delete a namespace
        var namespace = namespaces.getNamespace(req.params.namespace); //Get namespace from url
        if(namespace == null){ //Namespace doesn't exist
            res.status(400);
            res.json({ message: 'Malformed request: namespace does not exists' });
            return;
        }
        if (typeof (req.body.apiKey) === "undefined"){
            res.status(400);
            res.json({ message: 'Malformed request: no apiKey sent with the request' });
            return;
        }else if(req.body.apiKey != namespace.auth){
            res.status(401);
            res.json({ message: 'Malformed request: apiKey does not match the one on the namespace' });
            return;
        }
        console.log("Deleting namespace: " + req.params.namespace);
        namespaces.deleteNameSpace(namespace); //Delete the namespace and send back the name as confirmation
        res.json({namespace: namespace.name});
    });
};

module.exports = NSPRoute;