document.addEventListener('touchstart', function(){});
var remValue = document.documentElement.clientWidth/18;
if(remValue >= 23) remValue=23;
document.documentElement.style.fontSize = remValue+'px';