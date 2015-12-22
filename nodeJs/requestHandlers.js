/**
 * Created by Wilson on 2015/12/17.
 */
var exec = require('child_process').exec;
var querystring = require('querystring');

function start(response,postData){
    console.log('Request handler "start" was called');
    var body ='<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" method="post">'+
        '<textarea name="text" rows="20" cols="60"></textarea><br><br>'+
        '<input type="submit" value="Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(body);
    response.end();

    //exec("ls -lah",
    //    function(error, stdout, stderr){
    //        response.writeHead(200,{"Content-Type":"text/plain"});
    //        response.write(stdout);
    //        response.end();
    //    }
    //);
    //function sleep(milliseconds){
    //    var startTime = new Date().getTime();
    //    while(new Date().getTime() < startTime + milliseconds);
    //};
    //sleep(5000);
    //return 'hello start delay';
};
function upload(response,postData){
    console.log('Request handler "upload" was called');
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write("You've sent: " + postData);
    response.end();
};

exports.start = start;
exports.upload = upload;