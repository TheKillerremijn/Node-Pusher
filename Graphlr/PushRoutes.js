var exports = module.exports;

exports.match = function(route, tomatch){

    var routesplit = route.split(':');
    var tomatchsplit = tomatch.split(':');

    for(var i=0;i<tomatchsplit.length;i++){
        if(tomatchsplit[i] == "*" || routesplit[i] == "*") continue;
        if(tomatchsplit[i] == routesplit[i]){
            continue;
        }else{
            return false;
        }
    }
    return true;
};
exports.matchDirectional = function(route, tomatch){

    var routesplit = route.split(':');
    var tomatchsplit = tomatch.split(':');

    for(var i=0;i<tomatchsplit.length;i++){
        if(routesplit[i] == "*") continue;
        if(tomatchsplit[i] == routesplit[i]){
            continue;
        }else{
            return false;
        }
    }
    return true;
};