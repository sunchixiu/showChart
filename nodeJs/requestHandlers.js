/**
 * Created by Wilson on 2015/12/17.
 */
var exec = require('child_process').exec;

function start(response){
    console.log('Request handler "start" was called');
    exec('find /',
        {'timeout':1000,'maxBuffer':20000*1024},
        function(error,stdout,stderr){
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.write(stdout);
        response.end();
    });
    //function sleep(milliseconds){
    //    var startTime = new Date().getTime();
    //    while(new Date().getTime() < startTime + milliseconds);
    //};
    //sleep(5000);
    //return 'hello start delay';
};
function upload(response){
    console.log('Request handler "upload" was called');
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write('hello upload');
    response.end();
};

exports.start = start;
exports.upload = upload;