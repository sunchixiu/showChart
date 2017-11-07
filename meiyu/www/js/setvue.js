var imgurl = 'res.gs10086edu.com';
var apiurl = 'passport.gs10086edu.com:70';
var rowserurl = '182.48.117.90:6070';

//?apiurlk=192.168.20.122:70
if ($.getUrlParam('apiurl')) {
    apiurl = $.getUrlParam('apiurl'); 
};
if ($.getUrlParam('imgurl')) {
    imgurl = $.getUrlParam('imgurl'); 
};

if ($.getUrlParam('rowserurl')) {
    rowserurl = $.getUrlParam('rowserurl'); 
};
var indexvue = new Vue({
    el: '#home',
    data: { 
        loading: true,
        empty:true,
        noMore: false,
        bannerImg:'',


        url:'http://'+imgurl,
        homeList:'',
        curpage:1,
        menutype:1,
        menudata:'',
        menudataTwo:'',
        menudataThree:'',
        secondmenudata: '',
        thirdmenudata: '',

        imgurl:imgurl,
        apiurl:apiurl,
        rowserurl:rowserurl,

        lengZero:true

         
    }, 
    created: function(){
        this.getBanner();
        this.getList();

        this.getmenu(1);
         

         
        
    },
    methods: {
        getBanner: function(){ 
            var _this = this; 
            var dataparam={ 
                            "curpage":1,
                            "pagesize":5
                            };
            $.ajax({

                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengecarousel/getalladvert",  
                data: JSON.stringify(dataparam), 
                type: 'post',  
                dataType: 'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",  
                success: function (data) {
                    if(data.code == 1){ 
                        _this.bannerImg = data.data.dataList; 
                        
                     
                    }else{
                        alert('else');
                    };
                },
                error: function( ){  
                    
                        
                     
                }
            });
             
        },
        getList: function(){ 
            var _this = this; 
            var dataparam={ 
                        "curpage":_this.curpage,
                        "pagesize":10
                        }
            $.ajax({

                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengescore/querychallengescorelist",  
                data: JSON.stringify(dataparam), 
                type: 'post',  
                dataType: 'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",  
                success: function (data) {
                    if(data.code == 1){

                        _this.loading = false;
                        var homelistarr = data.data.dataList;

                        var timecode;
                        
                        for(var i=0;i<homelistarr.length;i++){ 

                            //时录盲脳陋禄禄鲁脡时分秒
                            if( homelistarr[i].score.indexOf('|') >-1){
                                timecode = homelistarr[i].ratingstandard;

                                var arrTime1=homelistarr[i].score.split('|');
                                var arrtime = [];
                                if(arrTime1[0] > 0){
                                    arrtime.push(arrTime1[0]+'时');
                                };
                                if(arrTime1[1] > 0){
                                    arrtime.push(arrTime1[1]+'分');
                                };
                                arrtime.push(arrTime1[2]+'秒');


                                //arrTime1.push(arrTime1);

                                homelistarr[i].scoreturn=arrtime.join('');


                            }


                        }                            
                        $.ajax({

                            url:"http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengecategory/getdic",  
                            data:  '', 
                            type: 'post',   
                            contentType: "application/json; charset=utf-8",  
                            success: function (data) {


                                if(data.code == 1){ 
                                     var arrDictionaryUnit=data.data.ratingRuleList;


                                     var Inum;
                                     var arrunit=[];

                                     
                                     for(var i=0;i< homelistarr.length;i++){


                                        for(var n=0;n< arrDictionaryUnit.length;n++){ //碌楼脦禄脌脿脨脥

                                            if(homelistarr[i].ratingstandard==arrDictionaryUnit[n].code){
                                                
                                                // &&  arrDictionaryUnit[n].code>1  脡赂脩隆脤玫录镁鲁媒脠楼时录盲

                                                
                                                Inum=n; 
                                            }
                                        }

                                        var AnowTypeUnits=arrDictionaryUnit[Inum].ratingUnitsList;

                                        for(var x=0;x<AnowTypeUnits.length;x++){ //戮脽脤氓碌楼脦禄
                                                    
                                                if(homelistarr[i].ratingunits == AnowTypeUnits[x].code){
                                                   // console.log( '碌楼脦禄拢潞'+AnowTypeUnits[x].name);

                                                    arrunit.push(AnowTypeUnits[x].name);




                                                }
                                                
                                                

                                        }
                                       // alert(arrunit[i]);
                                        

                                       if(homelistarr[i].ratingstandard == timecode){
                                            homelistarr[i].unitType = homelistarr[i].scoreturn;
                                       }else{
                                        homelistarr[i].unitType = homelistarr[i].score + arrunit[i];
                                       };
                                        
                                             
                                     };

                                     if(_this.curpage == 1){
                                        _this.homeList = homelistarr;
                                        if (homelistarr.length == 0) {
                                            _this.empty = true;
                                        }else{
                                            _this.empty = false;
                                        };
                                     }
                                     else{ 
                                        _this.homeList=_this.homeList.concat(homelistarr);
                                        if (arrDictionaryUnit.length < 10) {
                                            _this.noMore = true;
                                        };
                                     }
                                     
                                }
                                else{

                                }
                            }

                        })                       
                    }else{
                        alert('data.code:'+data.code);
                    };
                },
                error: function( ){ 
                    
                      alert('网络异常');   
                }
            });
             
        },

        getmenu: function(menutype){ 
            var _this = this; 
            var dataparam = {
                "vtype": menutype
            };
            $.ajax({

                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengecategory/queryall",  
                data: JSON.stringify(dataparam), 
                type: 'post',  
                dataType: 'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",  
                success: function (data) {
                    if(data.code == 1){

                        _this.menudata= data.data;
                        _this.getsecondmenu(_this.menudata[0].categoryid);

                        
                        
                    }else{
                         
                    };
                },
                error: function( ){ 
                    
                }
            });
             
        },
        getsecondmenu: function(categoryid){
            var _this = this; 


            for(var i=0; i<_this.menudata.length; i++){
                if(_this.menudata[i].categoryid == categoryid){
                    _this.secondmenudata = _this.menudata[i].categorySubList;
                    _this.getthirdmenu(_this.secondmenudata[0].categoryid);
                    break;
                };
            };
        },
        getthirdmenu: function(categoryid){
            var _this= this;
            var dataparam = {
                "curpage":1,
                "pagesize":100,
                "categoryid": categoryid
            };

            $.ajax({
                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengeitem/finditembycategoryid", 
                data: JSON.stringify(dataparam),
                type: 'post',
                dataType: 'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1){
                        if(data.data.dataList.length == 0){
                            _this.lengZero=true;
                        }
                        else{
                            _this.lengZero=false;
                            _this.thirdmenudata= data.data.dataList;
                        }
                    }else{
                        
                    };
                },
                error: function( ){ 
                    
                }
            });
        },
        gorank:function(itimeId){ 
 
            explainvue.rankList(itimeId);
            explainvue.regulation(itimeId);


        },
        videodetail: function(id) {
            videodetailvue.getdetailjson(id);
            //videodetailvue.getrelatedjson(id);
            //videodetailvue.getcommentjson(id);
        }


         
         
    }
});
var searchvue = new Vue({
    el: '#search',
    data: {
        keyword:''
    },
    methods: { 
        gosearch: function() { 
            searchResultvue.getSearchResult(this.keyword);


        }
    }
}); 
var searchResultvue = new Vue({
    el: '#search-result',
    data: {
        loading: true,
        noMore: false,
        empty: true,
        curpage: 1,
        SearchResultData: '', 
        keyword: '',
        url:'http://'+imgurl,
    },
    methods: { 
        getSearchResult: function(keyword){
            var _this = this;
            var params = { 
                pagesize: 10,
                curpage: _this.curpage 
            };
            if(keyword == undefined){
                params.title = _this.keyword;
            }else{
                _this.keyword = keyword;
                params.title = keyword;
            };
            $.ajax({
                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengescore/querychallengescorelist",
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.loading = false;
                        var homelistarr = data.data.dataList;
                        var timecode;
                        for(var i=0;i<homelistarr.length;i++){ 
                            //时录盲脳陋禄禄鲁脡时分秒
                            if( homelistarr[i].score.indexOf('|') >-1){
                                timecode = homelistarr[i].ratingstandard;
                                var arrTime1=homelistarr[i].score.split('|');
                                var arrtime = [];
                                if(arrTime1[0] > 0){
                                    arrtime.push(arrTime1[0]+'时');
                                };
                                if(arrTime1[1] > 0){
                                    arrtime.push(arrTime1[1]+'分');
                                };
                                arrtime.push(arrTime1[2]+'秒');
                                homelistarr[i].scoreturn=arrtime.join('');
                            }
                        }
                        $.ajax({
                            url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengecategory/getdic",  
                            data:  '', 
                            type: 'post',   
                            contentType: "application/json; charset=utf-8",  
                            success: function (data) {
                                if(data.code == 1){ 
                                     var arrDictionaryUnit=data.data.ratingRuleList;
                                     var Inum;
                                     var arrunit=[];
                                     for(var i=0;i< homelistarr.length;i++){
                                        for(var n=0;n< arrDictionaryUnit.length;n++){ //碌楼脦禄脌脿脨脥
                                            if(homelistarr[i].ratingstandard==arrDictionaryUnit[n].code){                                                
                                                // &&  arrDictionaryUnit[n].code>1  脡赂脩隆脤玫录镁鲁媒脠楼时录盲                                                
                                                Inum=n; 
                                            }
                                        }
                                        var AnowTypeUnits=arrDictionaryUnit[Inum].ratingUnitsList;
                                        for(var x=0;x<AnowTypeUnits.length;x++){ //戮脽脤氓碌楼脦禄                                                    
                                                if(homelistarr[i].ratingunits == AnowTypeUnits[x].code){
                                                   // console.log( '碌楼脦禄拢潞'+AnowTypeUnits[x].name);
                                                    arrunit.push(AnowTypeUnits[x].name);
                                                }
                                        }                                     

                                       if(homelistarr[i].ratingstandard == timecode){
                                            homelistarr[i].unitType = homelistarr[i].scoreturn;//时间用时分秒
                                       }else{
                                        homelistarr[i].unitType = homelistarr[i].score + arrunit[i]; //其他加单位
                                       };                                       
                                             
                                     };

                                     if(_this.curpage == 1){
                                        _this.SearchResultData = homelistarr;
                                        if (homelistarr.length == 0) {
                                            _this.empty = true;
                                        }else{
                                            _this.empty = false;
                                        };
                                     }
                                     else{ 
                                        _this.SearchResultData=_this.SearchResultData.concat(homelistarr);
                                        if (arrDictionaryUnit.length < 10) {
                                            _this.noMore = true;
                                        };
                                     } 
                                }
                                else{

                                }
                            }
                        }) 
                    }else{
                         
                    };
                },
                error: function( ){  
                        alert('网络异常'); 
                }
            });
        },
        videodetail: function(id) {
            videodetailvue.getdetailjson(id);
            //videodetailvue.getrelatedjson(id);
            //videodetailvue.getcommentjson(id);
        }
    },
});
var abouttvue = new Vue({
    el: '#about',
    data: {
        context:'' ,
        text:''

    },
    methods: {
        // 脢脫脝碌脕脨卤铆
        getSearchResult: function(){
            var _this = this; 
             
            $.ajax({
                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengeabout/query",
                data: '',
                type:'post',
                dataType:'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                         _this.context=data.data.content;


                         document.getElementById("about-texts").innerHTML = _this.context;
                    }else{
                       
                    };
                },
                error: function( ){ 
                    alert('网络异常');
                }
            });
        }
    },
});
var explainvue = new Vue({
    el: '#explain',
    data: {
        loading:true,
        empty:true,
        noMore:false,
        curpage:1,
        rankListData:'',
        regulationText:'',
        itimeId:'',
        url:'http://'+imgurl,
    },

    methods: {
        rankList: function(itimeId){  
            var _this = this;
            if(itimeId){
                _this.itimeId=itimeId;
            }; 
            var dataparam={ 
                "curpage":_this.curpage,
                "pagesize":10,
                "itemid":_this.itimeId
                };
            $.ajax({
                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengeclient/getscorelist",  
                data: JSON.stringify(dataparam), 
                type: 'post',  
                dataType: 'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",  
                success: function (data) {
                    if(data.code == 1){ 
                        //alert(data.code);
                        _this.loading = false;
                        var homelistarr = data.data.dataList;
                       // alert(data.data.dataList.length);
                        var timecode;                        
                        for(var i=0;i<homelistarr.length;i++){ 
                            //时录盲脳陋禄禄鲁脡时分秒
                            if( homelistarr[i].score.indexOf('|') >-1){
                                timecode = homelistarr[i].ratingstandard;
                                var arrTime1=homelistarr[i].score.split('|');
                                var arrtime = [];
                                if(arrTime1[0] > 0){
                                    arrtime.push(arrTime1[0]+'时');
                                };
                                if(arrTime1[1] > 0){
                                    arrtime.push(arrTime1[1]+'分');
                                };
                                arrtime.push(arrTime1[2]+'秒');
                                //arrTime1.push(arrTime1);
                                homelistarr[i].scoreturn=arrtime.join('');
                            }
                        }  
                        $.ajax({

                            url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengecategory/getdic",  
                            data:  '', 
                            type: 'post',   
                            contentType: "application/json; charset=utf-8",  
                            success: function (data) {
                                if(data.code == 1){ 
                                     var arrDictionaryUnit=data.data.ratingRuleList;
                                     var Inum;
                                     var arrunit=[];                                     
                                     for(var i=0;i< homelistarr.length;i++){
                                        for(var n=0;n< arrDictionaryUnit.length;n++){ //碌楼脦禄脌脿脨脥

                                            if(homelistarr[i].ratingstandard==arrDictionaryUnit[n].code){
                                                Inum=n; 
                                            }
                                        }
                                        var AnowTypeUnits=arrDictionaryUnit[Inum].ratingUnitsList;
                                        for(var x=0;x<AnowTypeUnits.length;x++){ //戮脽脤氓碌楼脦禄                                                    
                                                if(homelistarr[i].ratingunits == AnowTypeUnits[x].code){
                                                   // console.log( '碌楼脦禄拢潞'+AnowTypeUnits[x].name);
                                                    arrunit.push(AnowTypeUnits[x].name);
                                                }
                                        }                                       

                                       if(homelistarr[i].ratingstandard == timecode){
                                            homelistarr[i].unitType = homelistarr[i].scoreturn;
                                       }else{
                                        homelistarr[i].unitType = homelistarr[i].score + arrunit[i];
                                       };                                       
                                             
                                     };

                                     if(_this.curpage == 1){
                                        _this.rankListData = homelistarr;
                                        if (homelistarr.length == 0) {
                                            _this.empty = true;
                                        }else{
                                            _this.empty = false;
                                        };
                                     }
                                     else{ 
                                        _this.rankListData=_this.rankListData.concat(homelistarr);
                                        if (arrDictionaryUnit.length < 10) {
                                            _this.noMore = true;
                                        };
                                     }
                                     
                                }
                                else{

                                }
                            }

                        })   
                        //end

                    }else{
                        

                    };
                },
                error: function( ){ 
                    alert('网络异常');
                }
            });
             
        },
        regulation:function(itimeId){
            var _this = this; 
            var dataparam={ 
                "itemid":itimeId
                };
            $.ajax({

                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengeitem/querybyid",  
                data: JSON.stringify(dataparam), 
                type: 'post',  
                dataType: 'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",  
                success: function (data) {
                    if(data.code == 1){ 
                        _this.regulationText=data.data.ruledesc;
                    }else{                      

                    }
                },
                error: function( ){                     
                         
                    
                }
            })

        } ,
        videodetail: function(id) {
            videodetailvue.empty = true;
            videodetailvue.getdetailjson(id);
            //videodetailvue.getrelatedjson(id);
           // videodetailvue.getcommentjson(id);
        }

         
         
    }
}); 
// 视频详情
var videodetailvue = new Vue({
    el: '#videodetail',
    data: {
        loading: true,
        empty:true,
        praise: true,
        url:'http://'+imgurl,
        detaildata: '',
        relateddata:'',
        commentdata: '',
        rowserurl: rowserurl ,
        classify1:'',
        classify2:''

    },
    methods: {
        // 视频
        getdetailjson: function(id){
            var _this = this;
            $.ajax({
                url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengeclient/getscoredetails",
                data: JSON.stringify({'scoreid':id}),
                type:'post',
                dataType:'json',
                timeout:8000,
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){ 
                        _this.loading=false; 
                        _this.detaildata = data.data;
                        if (null==_this.detaildata) {
                             
                            _this.empty = true;
                        }else{
                            _this.empty = false;
                        };

                        var thisvtype= data.data.vtype;
                        $.ajax({
                            url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengecategory/queryall",
                            data: JSON.stringify({'vtype':thisvtype}),
                            type:'post',
                            dataType:'json',
                            timeout:8000,
                            contentType: "application/json; charset=utf-8",
                            success: function(data){
                                if(data.code == 1){ 
                                    var arrclassify1= data.data;
                                    var arrclassify2;
                                    for(var i=0;i<arrclassify1.length;i++){                                        
                                        if(arrclassify1[i].categoryid== _this.detaildata.parentid ){
                                            _this.classify1= arrclassify1[i].title;                                            
                                            arrclassify2= arrclassify1[i].categorySubList;
                                            for(var n=0;n<arrclassify2.length;n++){
                                                if(arrclassify2[n].categoryid== _this.detaildata.categoryid ){
                                                    _this.classify2= arrclassify2[n].title;
                                                }                                                                           
                                            }
                                        }                                                                           
                                    }
                                }else{
                                     
                                };
                            },
                            error: function( ){ 
                                 
                            }
                        });
                    }else{
                       
                    };
                },
                error: function( ){  
                        alert('网络异常');
                     
                }
            });
        },
        // 相关视频
        // getrelatedjson: function(id){
        //     var _this = this;
        //     $.ajax({
        //         url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengeclient/getrelevantscorelist",
        //         data: JSON.stringify({'scoreid':id, 'curpage':1, 'pagesize':5}),
        //         type:'post',
        //         dataType:'json',
        //         contentType: "application/json; charset=utf-8",
        //         success: function(data){
        //             if(data.code == 1){ 
        //                 _this.relateddata = data.data.dataList;
        //             }else{
        //                  
        //             };
        //         },
        //         error: function(data){
        //             
        //         }
        //     });
        // },
        // 评论列表
        // getcommentjson: function(id){
        //     var _this = this;
        //     $.ajax({
        //         url: "http://"+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengereply/getreplys",
        //         data: JSON.stringify({'videoid':id, 'curpage':1, 'pagesize':5}),
        //         type:'post',
        //         dataType:'json',
        //         contentType: "application/json; charset=utf-8",
        //         success: function(data){
        //             if(data.code == 1){ 
        //                 _this.commentdata = data.data;
        //             }else{
        //                 
        //             };
        //         },
        //         error: function(data){
        //              
        //         }
        //     });
        // },
        govideodetail:function(id) {
            
            this.getdetailjson(id);
            //this.getrelatedjson(id);
            //this.getcommentjson(id);
        }
    },
});
function gosearch(){
    searchvue.gosearch(); 
    gonextpage('搜索结果','search-result',0);
};

// 回车键
$(document).keydown(function(event){
    if($('.sear-text').is(":focus")){
        if(event.keyCode == 13){
            gosearch();
        };
    };
});

// titie
function gonextpage(title, id, num) { 
     $('.page').css('overflow', 'visible');
    $('body').css('overflow', 'visible');
    window.location.href = '#&'+id;
    $('#'+id).attr('data-title',title);
    setTitle(title, num);

};
//浏览器点击回退按钮时触发的事件
window.onpopstate = function(){
    $('#Video')[0].pause();

    $('.selectCon').hide();
    $('#pop-mask').hide(); 
    $('.page').css('overflow', 'visible');
    $('body').css('overflow', 'visible');
    $('.select ').removeClass('active');
    
       
    $('.context').css('height','60px');
    $('.btn-span').removeClass('close');


};

// 返回
function goback() {
    if(document.webkitIsFullScreen){ //视频全屏时返回，只退出全屏。
        document.webkitExitFullscreen();
        return false; 
    };  
    if( $('input').is(':focus') ){
        $('input').blur();
    };  
    var curtitle = $('.in').attr('data-title');
    if(curtitle == '甘肃美育'){  // 首页退出
        destroypage(1);
    }else{
        setTimeout(function(){
            var title = $('.in').attr('data-title');
            if(title == '甘肃美育'){ //退回到首页
                setTitle(title, 2); 
            }else{
                //返回到项目中首页之外的页面。
                setTitle(title, 0); 

            }
        },10);    
        history.go(-1);
    };
    
       
}; 

document.addEventListener("backbutton", goback, false);
