/**
 * Created by Administrator on 2015/10/29.
 */
function popIframe(url){
    removeNodeById('iframetoo');

    oDivIframe = document.createElement('div');
    oDivIframe.id = 'iframetoo';
    oDivIframe.style.width = '100%';
    oDivIframe.style.height = '100%';
    oDivIframe.style.position = 'absolute';
    oDivIframe.style.top = 0;
    oDivIframe.style.left = '100%';
    oDivIframe.style.webkitTransition = '0.2s all linear';
    oDivIframe.style.transition = '0.2s all linear';
    oDivIframe.innerHTML = '<iframe src="'+url+'" width="100%" height="100%" frameborder="0"></iframe>';
    //oDivIframe.innerHTML = '<div class="main"><div class="header"><div class="l" onclick="returnIframe();">返回</div><div class="m">书本名称</div><div class="r"></div></div><div class="section"><iframe src="" width="100%" height="100%" frameborder="0" id="iframeId" name="iframeId"></iframe></div></div>';

    document.body.appendChild(oDivIframe);
    var oDivMain = document.querySelector('.main');
    var oDivIframetoo = document.querySelector('#iframetoo');
    var oIframe = document.querySelector('#iframeId');

    setTimeout(function(){
        oDivIframetoo.style.left = 0;
        oDivMain.style.left = '-8%';
    },10);
};

function returnIframe(){
    var oDivMain = window.parent.document.querySelector('.main');
    var oDivIframetoo = window.parent.document.querySelector('#iframetoo');
    oDivIframetoo.style.left = '100%';
    oDivMain.style.left = 0;
};

function scaleIframe(url){
    removeNodeById('iframetoo');

    oDivIframe = document.createElement('div');
    oDivIframe.id = 'iframetoo';
    oDivIframe.style.width = '100%';
    oDivIframe.style.height = '100%';
    oDivIframe.style.position = 'absolute';
    oDivIframe.style.top = 0;
    oDivIframe.style.transform = 'scale(0.8,0.8)';
    oDivIframe.style.opacity = 0;
    oDivIframe.style.zIndex = 1;
    oDivIframe.style.webkitTransition = '0.2s all linear';
    oDivIframe.style.transition = '0.2s all linear';
    oDivIframe.innerHTML = '<iframe src="'+url+'" width="100%" height="100%" frameborder="0"></iframe>';

    document.body.appendChild(oDivIframe);
    var oDivIframetoo = document.querySelector('#iframetoo');
    setTimeout(function(){
        oDivIframetoo.style.transform = 'scale(1,1)';
        oDivIframe.style.opacity = 1;
    },10);

};

function returnScaleIframe(){
    var oDivIframetoo = window.parent.document.querySelector('#iframetoo');
    oDivIframetoo.style.transform = 'scale(0.8,0.8)';
    oDivIframetoo.style.opacity = 0;
    oDivIframetoo.style.zIndex = -1;
};

function removeNodeById(id) {
    var node = document.getElementById(id);
    if (node) {
        node.parentNode.removeChild(node);
    }
};