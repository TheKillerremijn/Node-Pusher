var exports = module.exports;

exports.match = function(route, tomatch){

    var routesplit = route.split(':');
    var tomatchsplit = tomatch.split(':');

    for(var i=0;i<tomatchsplit.length;i++){
        if(tomatchsplit[i] == "*" || routesplit[i] == "*") return true;
        if(tomatchsplit[i] == routesplit[i]){
            continue;
        }else{
            return false;
        }
    }
    return true;
};