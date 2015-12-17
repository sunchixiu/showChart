/**
 * Created by Wilson on 2015/12/17.
 */
function route(handle,pathname){
    console.log('about to rout a request for' + pathname);
    if(typeof handle[pathname] === 'function'){
        handle[pathname]();
    }else{
        console.log("No request handler found for "+ pathname);
        return '404 not found';
    };
};

exports.route = route;