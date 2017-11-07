var ifont=document.documentElement.clientWidth/36;        
if(ifont< 8.8){ //最小缩放到320px
	ifont=8;
}
else if(ifont > 30){ //最大放大到1080px
	ifont =30;
};
document.documentElement.style.fontSize=ifont+'px';


$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]);
    return null;
};

//tab切换
function tab(liclass, conclass, wrap, event) {
    var a_li = $(liclass);
    a_li.on(event || 'mouseover', function () {
        var _thisli = $(this);
        var o_wrap = _thisli.parents(wrap);
        var a_con = o_wrap.find(conclass);

        a_con.hide();   
        _thisli.addClass('active').siblings(liclass).removeClass('active');
        a_con.eq(_thisli.index()).show();
    })
};
 
document.addEventListener("backbutton", goback, false); 
function goback(){

    var urlhref=window.location.href ;
   
    if(urlhref.indexOf("list.html") > 0){
         
        destroypage(1);
    }
    else{

        history.go(-1);  
    }
 
} 
//销毁
function destroypage(state) {
    try {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.page_finish(function success(arg) {
                }, function error(arg) {
                }, [state]);

            }, false);
        } else {
            cordova.plugins.traceclass.page_finish(function success(arg) {
            }, function error(arg) {
            }, [state]);
        }
    }catch (e) {

    };
}; 



 