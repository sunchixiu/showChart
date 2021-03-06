/**
 * Created by sun on 2015/10/28.
 */
document.addEventListener('touchstart', function(){});
document.documentElement.style.fontSize=document.documentElement.clientWidth/18+'px';
document.onselectstart = function(){
    return false;
};
function loaded (id) {
    //var myScroll = new IScroll('#'+id+'', {click: true, preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/, className: /(^|\s)btn(\s|$)/ },scrollbars: false});
    var myScroll = new iScroll(id, {click: true, preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI|A)$/, className: /(^|\s)btn(\s|$)/ },scrollbars: false,checkDOMChanges:true});
}
//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

//弹出层
function showWindow(id){
    var oDivBg = document.createElement('div');
    oDivBg.id = 'bg';
    oDivBg.style.backgroundColor = 'rgba(0,0,0,0)';
    oDivBg.style.width = '100%';
    oDivBg.style.height = '100%';
    oDivBg.style.zIndex = '9998';
    oDivBg.style.position = 'fixed';
    oDivBg.style.top = 0;
    oDivBg.style.left = 0;
    oDivBg.style.transition = '0.3s all ease';
    oDivBg.style.webkitTransition = '0.3s all ease';
    oDivBg.onclick = function(){hideWindow(id);};
    document.body.appendChild(oDivBg);

    var oDivWindow = document.getElementById(id);
    var oDivWindowBg = document.getElementById('bg');
    oDivWindow.style.zIndex = '9999';

    setTimeout(function(){
        oDivWindow.style.opacity = 1;
        oDivWindowBg.style.opacity = 1;
        oDivWindowBg.style.backgroundColor = 'rgba(0,0,0,0.7)';
    },10);
};
function hideWindow(id){
    var oDivWindow = document.getElementById(id);
    var oDivWindowBg = document.getElementById('bg');
    oDivWindowBg.style.opacity = 0;
    oDivWindow.style.opacity = 0;
    setTimeout(function(){
        document.body.removeChild(oDivWindowBg);
        document.body.removeChild(oDivWindow);
        //oDivWindow.style.zIndex = '-1';
    },300);
};

function showCharts(content){
    alert(content);
    var oDivCharts = document.createElement('div');
    oDivCharts.id = 'chartsDiv';
    oDivCharts.style.position = 'absolute';
    oDivCharts.style.background = '#fff';
    oDivCharts.style.top = '5%';
    oDivCharts.style.left = '5%';
    oDivCharts.style.width = '90%';
    oDivCharts.style.height = '90%';
    oDivCharts.innerHTML = content;
    //oDivCharts.style.transform = 'rotate(90deg)';
    oDivCharts.style.zIndex = -1;
    document.body.appendChild(oDivCharts);

    showWindow('chartsDiv');
};