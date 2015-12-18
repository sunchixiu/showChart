/**
 * Created by Wilson on 2015/12/17.
 */
function route(handle,pathname,response){
    console.log('about to rout a request for' + pathname);
    if(typeof handle[pathname] === 'function'){
        return handle[pathname](response);
    }else{
        console.log("No request handler found for "+ pathname);
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write('404 not found');
        response.end();
        //return '404 not found';
    };
};

exports.route = route;