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


 