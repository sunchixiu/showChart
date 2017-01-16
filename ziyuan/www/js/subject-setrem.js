var urlapi = 'http://cloudso.iischool.com/newjspui';

var ifont=Math.floor( $(window).width()/36 ) ;


if(ifont< 8.8){
    ifont=8;
}
else if(ifont > 30){
    ifont =30;
};
document.documentElement.style.fontSize=ifont+'px';


 $(window).resize(function(){
     
    window.location = window.location ; 

         
 });

function loaded (id) {
    var myScroll = new iScroll(id, {click: true, preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI|A)$/, className: /(^|\s)btn(\s|$)/ },scrollbars: false,checkDOMChanges:true, hScrollbar: false});
}
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





