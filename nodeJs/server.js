/**
 * Created by Wilson on 2015/12/17.
 */
var http = require('http');
var url = require('url');

function start(route,handle){
    function onRequest(request,response){
        if(request.url!=="/favicon.ico"){
            var postData = '';
            var pathname = url.parse(request.url).pathname;
            var query = url.parse(request.url).query;
            console.log("Request for "+ pathname + "," + query +" received.");
            request.setEncoding('utf8');

            request.addListener('data',function(postDataChunk){
                postData += postDataChunk;
                console.log('Received Post data chunk ' + postDataChunk);
            });
            request.addlistener('end',function(){
                route(handle,pathname,response,postData);
            });
        };

    };

    http.createServer(onRequest).listen(8888);
    console.log('server has started');
};

exports.start = start;