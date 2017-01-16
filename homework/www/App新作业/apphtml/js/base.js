/**
 * Created by Wilson on 2016/11/28.
 */
var currentAjax = null;     //ajax参数，为组卷时，需要停止准备；
document.addEventListener('touchstart', function(){});
var ounit = document.documentElement.clientWidth/36;
document.documentElement.style.fontSize=ounit+'px';

function tab(liclass, conclass, wrap, event,fn) {
    var a_li = $(liclass);

    a_li.on(event || 'mouseover', function () {
        if(typeof fn=='function'){
            fn();
        }
        var _thisli = $(this);
        var o_wrap = _thisli.parents(wrap);
        var a_con = o_wrap.find(conclass);

        a_con.hide();
        _thisli.addClass('current').siblings(liclass).removeClass('current');
        a_con.eq(_thisli.index()).show();


    })
};