var remValue = document.documentElement.clientWidth/96;
if(remValue < 10.375) remValue = 10.375;
document.documentElement.style.fontSize = remValue+'px';

window.onresize = function(){
    remValue = document.documentElement.clientWidth/96;
    if(remValue < 10.375) remValue = 10.375;
    document.documentElement.style.fontSize = remValue+'px';
    location.reload();
};