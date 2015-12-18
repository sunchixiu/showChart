/**
 * Created by Wilson on 2015/12/17.
 */
var http = require('http');
var url = require('url');

function start(route,handle){
    function onRequest(request,response){
        if(request.url!=="/favicon.ico"){
            var pathname = url.parse(request.url).pathname;
            var query = url.parse(request.url).query;
            console.log('request recieved');
            console.log("Request for "+ pathname + "," + query +" received.");
            route(handle,pathname,response);
        };

    };

    http.createServer(onRequest).listen(8888);
    console.log('server has started');
};

exports.start = start;