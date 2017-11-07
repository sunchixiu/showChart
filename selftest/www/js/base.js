/**
 * Created by Wilson on 2016/11/28.
 */
var currentAjax = null;     //ajax参数，为组卷时，需要停止准备；
document.addEventListener('touchstart', function(){});
var ounit = document.documentElement.clientWidth/36;
document.documentElement.style.fontSize=ounit+'px';
var clientheight = document.documentElement.clientHeight;

function tab(liclass, conclass, wrap, event,fn) {
    var a_li = $(liclass);

    a_li.on(event || 'mouseover', function () {
        if(typeof fn=='function'){
            var state = fn();
        };

        //开始是tab切换，后又提需求点击同一个tab隐藏显示并且兼顾tab切换效果
        var liindex = $(this).index();
        var divindex = 99;
        for(var i=0; i<$('.memu-con').length; i++){
            if($('.memu-con').eq(i).css('display') == 'block'){
                divindex = i;
            };
        };
        if(liindex == divindex){
            hidemask();
            return false;
        };

        var _thisli = $(this);
        var o_wrap = _thisli.parents(wrap);
        var a_con = o_wrap.find(conclass);

        a_con.hide();
        _thisli.addClass('current').siblings(liclass).removeClass('current');
        a_con.eq(_thisli.index()).show();


    })
};

//加载script和css
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.setAttribute('src', url);
    if(typeof callback != "undefined"){
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
    };
    var heads = document.getElementsByTagName("head");
    if(heads.length){
        heads[0].appendChild(script);
    };
};
function geturl(url, callback){
    var $css1 = '<link rel="stylesheet" href="'+url+'/Public/static/examengine/css/examengine.css">';
    $(document).find('head').append($css1);
    loadScript(url+'/Public/static/examengine/examengine.js', function(){
        loadScript(url+'/Public/static/examengine/examengine.moblie.js', callback)
    });
};

(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);