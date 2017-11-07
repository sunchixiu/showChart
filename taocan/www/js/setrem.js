
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

         
 })






