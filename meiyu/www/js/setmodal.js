var imgurl = '182.48.117.90:801';
var apiurl = '182.48.117.90:6070';
var rowserurl = '192.168.20.121';



// meiyu/index.html?apiurl=182.48.117.90:6070 

// &imgurl=182.48.117.90:801

//获取地址栏参数
$.getUrlParam = function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");    //正则？？？？！！！
    var r = window.location.search.substr(1).match(reg);     // substr( ) 抽取字符    match() 匹配
    if (r!=null) return unescape(r[2]); return null;        //unescape() 函数可对通过 escape() 编码的字符串进行解码。
};
if ($.getUrlParam('apiurl')) {
    apiurl = $.getUrlParam('apiurl');
};
if ($.getUrlParam('imgurl')) {
    imgurl = $.getUrlParam('imgurl');
};
if ($.getUrlParam('rowserurl')) {
    rowserurl = $.getUrlParam('rowserurl');
};
// 自定义过滤
Vue.filter('substr', function (str, startnum, endnum) {
    if(str){
        var val = str.substring(startnum,endnum);
        return val;
    };
});
// 首页
var indexvue = new Vue({
    el: '#home',
    data: {
        loading: true,
        noMore: false,
        empty: true,
        curpage: 1,
        classifydata: '',
        videodata: '',
        url:'http://'+imgurl,
        typeid: '0',

        imgurl:imgurl,
        apiurl:apiurl,
        rowserurl:rowserurl
    },
    created: function(){
        this.getclassifyjson();
        this.getvideojson();
    },
    methods: {
        // 分类列表
        getclassifyjson: function(){
            var _this = this;
            $.ajax({
                url:'http://'+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/skillshowcategory/queryall",
                // data: JSON.stringify(),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.classifydata = data.data;
                    }else{
                         
                    };
                },
                error: function(data){
                     
                }
            });
        },
        // 视频列表
        getvideojson: function(str){
            if(str){
                this.typeid = str;
            };            
            var _this = this;
            var params = {
                pagesize: 6,
                curpage: _this.curpage,
                status:3
            };
            if(_this.typeid != '0'){
                params.categoryid = _this.typeid;
            };
            $.ajax({
                url: 'http://'+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengevideo/getvideolist",
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.loading = false;
                        if(_this.curpage == 1){
                            _this.videodata = data.data.dataList;
                            if (data.data.dataList.length < 3) {
                                _this.noMore = false;
                            };
                            if (_this.videodata.length == 0) {
                                _this.empty = true;
                            }else{
                                _this.empty = false;
                            };
                        }else{
                            _this.videodata = _this.videodata.concat(data.data.dataList);
                            if (data.data.dataList.length < 6) {
                                _this.noMore = true;
                            };
                        };
                    }else{
                         
                    };
                },
                error: function(data){
                    alert('网络异常');
                }
            });
        },
        queryall: function(str){
            this.curpage = 1;
            this.videodata = [];
            this.getvideojson(str);
        },
        govideodetail: function(id) {
            videodetailvue.getdetailjson(id);
            //videodetailvue.getrelatedjson(id);
            //videodetailvue.getcommentjson(id);
        }
    },
});
// 搜索
var searchvue = new Vue({
    el: '#search',
    data: {
        keyword:'',
        keytype: 'title'
    },
    methods: {
        setname: function(key) {
            this.keytype = key;
        },
        gosearch: function() {
            searchResultvue.curpage = 1;
            searchResultvue.videodata = '';
            searchResultvue.getvideojson(this.keytype,this.keyword);
        }
    }
});
// 搜索结果
var searchResultvue = new Vue({
    el: '#searchResult',
    data: {
        loading: true,
        noMore: false,
        empty: true,
        curpage: 1,
        videodata: '',
        url: 'http://'+imgurl,
        keytype: '',
        keyword: ''
    },
    methods: {
        // 视频列表
        getvideojson: function(keytype,keyword){
            var _this = this;
            var params = {
                pagesize: 8,
                curpage: _this.curpage,
                status:3
            };
            if(keyword == undefined){
                params[_this.keytype] = _this.keyword;
            }else{
                _this.keytype = keytype;
                _this.keyword = keyword;
                params[keytype] = keyword;
            };
            $.ajax({
                url: 'http://'+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengevideo/getvideolist",
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.loading = false;
                        if(_this.curpage == 1){
                            _this.videodata = data.data.dataList;
                            if (_this.videodata.length == 0) {
                                _this.empty = true;
                            }else{
                                _this.empty = false;
                            };
                        }else{
                            _this.videodata = _this.videodata.concat(data.data.dataList);
                            if (data.data.dataList.length < 8) {
                                _this.noMore = true;
                            };
                        };
                    }else{
                         
                    };
                },
                error: function(data){
                    alert('网络异常');
                }
            });
        },
        govideodetail: function(id) {
            videodetailvue.getdetailjson(id);
            //videodetailvue.getrelatedjson(id);
            //videodetailvue.getcommentjson(id);
        }
    },
});
// 视频详情
var videodetailvue = new Vue({
    el: '#videodetail',
    data: {
        loading: true,
        praise: true,
        url:'http://'+imgurl,
        detaildata: '',
        relateddata:'',
        commentdata: '',
        rowserurl: 'http://'+rowserurl
    },
    methods: {
        // 视频
        getdetailjson: function(id){
            var _this = this;
            $.ajax({
                url: 'http://'+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengevideo/getvideobyid",
                data: JSON.stringify({'videoid':id}),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.detaildata = data.data;
                    }else{
                         
                    };
                },
                error: function(data){
                    alert('网络异常');
                }
            });
        },
        // 相关视频
        // getrelatedjson: function(id){
        //     var _this = this;
        //     $.ajax({
        //         url: 'http://'+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengevideo/getrelevantvideolist",
        //         data: JSON.stringify({'videoid':id, 'curpage':1, 'pagesize':5}),
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
        //             alert('网络异常');
        //         }
        //     });
        // },
        // 评论列表
        // getcommentjson: function(id){
        //     var _this = this;
        //     $.ajax({
        //         url: 'http://'+apiurl+"/TSB_ISCHOOL_CHALLENGE_SERVER/challengereply/getreplys",
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
        //             alert('网络异常');
        //         }
        //     });
        // },
        // govideodetail:function(id) {
        //     this.getdetailjson(id);
        //     this.getrelatedjson(id);
        //     this.getcommentjson(id);
        // }
    },
});
// 滚动到底
$(window).scroll(function(){
    if($(window).scrollTop() != 0){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
            if ($('.in').attr('id') == "home") {
                indexvue.curpage += 1;
                indexvue.getvideojson();
            }else if ($('.in').attr('id') == "searchResult") {
                searchResultvue.curpage += 1;
                searchResultvue.getvideojson();
            }
        };
    };
});

// 回车键
$(document).keydown(function(event){
    if($('.search-test input').is(":focus")){
        if(event.keyCode == 13  ){
            gosearch();
        };
    };
});

function gosearch(){
    searchvue.gosearch();
    gonextpage('搜索结果','searchResult');
};
// titie
function gonextpage(title, id, num) {
    window.location.href = '#&'+id;
    $('#'+id).attr('data-title',title);
    setTitle(title, num);
};
function goback() {
        if(document.webkitIsFullScreen){ //视频全屏时返回，只退出全屏。
            document.webkitExitFullscreen();
            return false; 
        };
        if( $('input').is(':focus') ){
            $('input').blur();
        };
        var curtitle = $('.in').attr('data-title');
        if(curtitle == '甘肃美育'){
            destroypage(1);
        }else{
            setTimeout(function(){
                var title = $('.in').attr('data-title');
                if(title == '甘肃美育'){
                    setTitle(title, 1);
                }else{
                    setTitle(title, 0); 
                }
            },10);    
            history.go(-1);
        };    
    };
document.addEventListener("backbutton", goback, false);