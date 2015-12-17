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
            var content = route(handle,pathname);
            response.writeHead(200,{'Content-Type':'text/plain'});
            response.write(content);
            response.end();
        };

    };

    http.createServer(onRequest).listen(8888);
    console.log('server has started');
};

exports.start = start;