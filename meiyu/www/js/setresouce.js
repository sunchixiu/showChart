/**
 * Created by Wilson on 2017/8/15.
 */
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]);
    return null;
};
var apiurl = 'gsmeiyuso.gs10086edu.com/newjspui';
var orgid = '620000';

//获取地址栏参数
var LocString=String(window.document.location.href);
function GetQueryString(str){
    var rs=new RegExp("(^|)"+str+"=([^&]*)(&|$)","gi").exec(LocString),tmp;
    if(tmp=rs)return tmp[2];
    // return "没有这个参数";
};
if (GetQueryString('apiurl')) {
    apiurl = GetQueryString('apiurl');
};
if (GetQueryString('orgid')) {
    orgid = GetQueryString('orgid');
};

apiurl = 'http://' + apiurl;


// 首页
var indexvue = new Vue({
    el: '#home',
    data: {
        subjectdata: '',
        resoucedata: '',
        weikedata: '',
        subjectid: [],
        wkloading: true,
        tbloading: true
    },
    created: function(){
        this.getsubjectdata();
    },
    methods: {
        getsubjectdata: function(){
            var _this = this;
            var params = {
                nodetype: "1"
            };
            $.ajax({
                url: apiurl + "/rest/catalog/dim",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        var dataarr = [];
                        if(data.data){
                            dataarr = data.data;
                        };
                        if(dataarr.length > 0){
                            _this.getsubjectarr(dataarr);
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        getsubjectarr: function (arr) {
            if(arr[0].nodetypename == '学科'){
                this.subjectdata = arr;
                this.getalldata(arr[0].nodeid);

                setTimeout(function(){
                    var swiper = new Swiper('.home-swiper',{
                        slidesPerView: 6,
                        spaceBetween: 30,
                        freeMode: true
                    });
                },10);

                //设置微课和同步资源的学科列表
                weikevue.subjectdata = arr;
                tongbuvue.subjectdata = arr;
            }else{
                if(arr[0].children){
                    this.getsubjectarr(arr[0].children);
                }else{
                    return;
                };
            };
        },
        getindexresoucedata: function(subjectid){
            var arr = [];
            arr.push(subjectid);
            this.subjectid = arr;
            this.getresoucedata();
        },
        getindexweikedata: function(subjectid){
            var arr = [];
            arr.push(subjectid);
            this.subjectid = arr;
            this.getweikedata();
        },
        getresoucedata: function(){
            var _this = this;
            _this.tbloading = true;
            var params = {
                "curpage": 1,
                "pagesize": 4,
                "dims": _this.subjectid
            };
            $.ajax({
                url: apiurl + "/rest/resource/searchResource",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        _this.tbloading = false;
                        if(data.data.datalist.length > 0){
                            _this.resoucedata = data.data.datalist;
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        getweikedata: function () {
            var _this = this;
            _this.wkloading = true;
            var resourcetype = [];
            resourcetype.push('1');
            var params = {
                "curpage": 1,
                "pagesize": 4,
                "dims": _this.subjectid,
                "resourcetype": resourcetype
            };
            $.ajax({
                url: apiurl + "/rest/resource/searchResource",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        _this.wkloading = false;
                        if(data.data.datalist.length > 0){
                            _this.weikedata = data.data.datalist;
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        getalldata: function(subjectid){
            this.wkloading = true;
            this.tbloading = true;
            this.getindexresoucedata(subjectid);
            this.getindexweikedata(subjectid);

        },
        getdetail: function(id){
            getdetail(id);
        },

        setweikesubject: function(){
            weikevue.loading = true;
            setTimeout(function(){
                weikevue.setsubjectarr();
            },300);
        },
        settongbusubject: function(){
            tongbuvue.loading = true;
            setTimeout(function(){
                tongbuvue.setsubjectarr();
                tongbuvue.getdoctype();
            },300);
        }
    }
});

//列表组件
Vue.component('sourcelist-component',{
    template: '#sourcelist',
    props: {
        sourcedata: '',
        loading: true,
        empty: false,
        type: '',
        scrollstatus: 0
    },
    methods: {
        getdetail: function(id){
            getdetail(id);
        }
    }
});

//微课程
var weikevue = new Vue({
    el: '#weilist',
    data: {
        subjectdata: '',
        weikedata: '',
        subjectid: [],
        loading: true,
        type: 'weike',
        empty: false,
        curpage: 1,
        pagesize: 10,
        version: '',
        unitfirst: [],
        unitsecond: [],
        unitthird: [],
        commodityids: [],
        collectionids: [],
        scrollstatus: 0
    },
    methods: {
        setsubjectarr: function () {
            if(this.subjectdata.length > 0){
                var subjectarr = [];
                subjectarr.push(this.subjectdata[0].nodeid);
                this.subjectid = subjectarr;
                this.getweikedata();
                setTimeout(function(){
                    var swiper = new Swiper('.weilist-swiper',{
                        slidesPerView: 6,
                        spaceBetween: 30,
                        freeMode: true
                    });
                },10);
                this.version = this.subjectdata[0].children[0].nodeid;
                this.getunitlist(0);
            };
        },
        changesubject: function(subjectid){
            $(window).scrollTop(0);
            var arr = [];
            arr.push(subjectid);
            this.subjectid = arr;
            this.curpage = 1;
            for(var i=0; i<this.subjectdata.length; i++){
                if(this.subjectdata[i].nodeid == subjectid){
                    this.version = this.subjectdata[i].children[0].nodeid;
                    this.collectionids = [];
                    this.unitsecond = [];
                    this.unitthird = [];
                };
            };
            this.getweikedata();
            this.getunitlist(0);
        },
        getweikedata: function () {
            var _this = this;
            _this.loading = true;
            var resourcetype = [];
            resourcetype.push('1');
            var params = {
                "curpage": _this.curpage,
                "pagesize": _this.pagesize,
                "dims": _this.subjectid,
                "resourcetype": resourcetype,
                "commodityids": _this.commodityids,
                "collectionids": _this.collectionids
            };
            $.ajax({
                url: apiurl + "/rest/resource/searchResource",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        _this.loading = false;
                        if(_this.curpage == 1){
                            if(data.data.datalist.length > 0){
                                _this.empty = false;
                                _this.weikedata = data.data.datalist;
                                _this.scrollstatus = 0;
                            }else{
                                _this.empty = true;
                            };
                        }else{
                            if(data.data.datalist.length > 0){
                                _this.scrollstatus = 0;
                                _this.weikedata = _this.weikedata.concat(data.data.datalist);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        gosearch: function(){
            searchvue.subjectid = this.subjectid;
            searchvue.type = this.type;
        },
        getunitlist: function(type,id,haschild,nodetype,nodename){
            //type: 0-版本获取章节，1-第一层章节，2-第二层章节
            var _this = this;
            switch (type){
                case 0:
                    var params = {
                        "nodeid": _this.version
                    };
                    $('.wkfiltername').html('目录筛选');
                    break;
                case 1:
                    if(!haschild && nodetype == '3'){
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = [];
                        _this.collectionids = nodeidarr;
                        _this.curpage = 1;
                        _this.getweikedata();
                        $('.wkfiltername').html(nodename);
                        hidelayout();
                        return;
                    };
                    var params = {
                        "nodeid": id
                    };
                    break;
                case 2:
                    if(!haschild && nodetype == '3'){
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = [];
                        _this.collectionids = nodeidarr;
                        _this.curpage = 1;
                        _this.getweikedata();
                        $('.wkfiltername').html(nodename);
                        hidelayout();
                        _this.unitthird = [];
                        return;
                    };
                    var params = {
                        "nodeid": id
                    };
                    break;
                case 3:
                    if(haschild && nodetype == '4'){
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = nodeidarr;
                        _this.collectionids = [];
                        _this.curpage = 1;
                        _this.getweikedata();
                        $('.wkfiltername').html(nodename);
                        hidelayout();
                    }else{
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = [];
                        _this.collectionids = nodeidarr;
                        _this.curpage = 1;
                        _this.getweikedata();
                        $('.wkfiltername').html(nodename);
                        hidelayout();
                    };
                    return;
                    break;
                default :
                    break;
            };

            $.ajax({
                url: apiurl + "/rest/catalog/chapter",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        if(data.data.length > 0){
                            switch (type){
                                case 0:
                                    _this.unitfirst = data.data;
                                    break;
                                case 1:
                                    _this.unitsecond = data.data;
                                    _this.unitthird = [];
                                    break;
                                case 2:
                                    _this.unitthird = data.data;
                                    break;
                                default:
                                    break;
                            };
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        }
    }
});

//同步资源
var tongbuvue = new Vue({
    el: '#morelist',
    data: {
        subjectdata: '',
        tongbudata: '',
        subjectid: [],
        loading: true,
        type: 'tongbu',
        empty: false,
        curpage: 1,
        pagesize: 10,
        version: '',
        unitfirst: [],
        unitsecond: [],
        unitthird: [],
        commodityids: [],
        collectionids: [],
        scrollstatus: 0,
        doctype: [],
        doctypeid: ''
    },
    methods: {
        setsubjectarr: function () {
            if(this.subjectdata.length > 0){
                var subjectarr = [];
                subjectarr.push(this.subjectdata[0].nodeid);
                this.subjectid = subjectarr;
                this.gettongbudata();

                setTimeout(function(){
                    var swiper = new Swiper('.morelist-swiper',{
                        slidesPerView: 6,
                        spaceBetween: 30,
                        freeMode: true
                    });
                },10);
                this.version = this.subjectdata[0].children[0].nodeid;
                this.getunitlist(0);
            };
        },
        changesubject: function(subjectid){
            $(window).scrollTop(0);
            var arr = [];
            arr.push(subjectid);
            this.subjectid = arr;
            this.curpage = 1;
            for(var i=0; i<this.subjectdata.length; i++){
                if(this.subjectdata[i].nodeid == subjectid){
                    this.version = this.subjectdata[i].children[0].nodeid;
                    this.collectionids = [];
                    this.doctypeid = '';
                    this.unitsecond = [];
                    this.unitthird = [];
                };
            };
            this.gettongbudata();
            this.getunitlist(0);
        },
        gettongbudata: function () {
            var _this = this;
            _this.loading = true;
            var params = {
                "curpage": _this.curpage,
                "pagesize": _this.pagesize,
                "dims": _this.subjectid,
                "commodityids": _this.commodityids,
                "collectionids": _this.collectionids,
                "doctype": _this.doctypeid
            };
            $.ajax({
                url: apiurl + "/rest/resource/searchResource",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        _this.loading = false;
                        if(_this.curpage == 1){
                            if(data.data.datalist.length > 0){
                                _this.empty = false;
                                _this.tongbudata = data.data.datalist;
                                _this.scrollstatus = 0;
                            }else{
                                _this.empty = true;
                            };
                        }else{
                            if(data.data.datalist.length > 0){
                                _this.scrollstatus = 0;
                                _this.tongbudata = _this.tongbudata.concat(data.data.datalist);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        getunitlist: function(type,id,haschild,nodetype,nodename){
            //type: 0-版本获取章节，1-第一层章节，2-第二层章节
            var _this = this;
            switch (type){
                case 0:
                    var params = {
                        "nodeid": _this.version
                    };
                    $('.tbfiltername').html('目录筛选');
                    $('.tbsourcename').html('全部资源');
                    break;
                case 1:
                    if(!haschild && nodetype == '3'){
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = [];
                        _this.collectionids = nodeidarr;
                        _this.curpage = 1;
                        _this.gettongbudata();
                        $('.tbfiltername').html(nodename);
                        hidelayout();
                        return;
                    };
                    var params = {
                        "nodeid": id
                    };
                    break;
                case 2:
                    if(!haschild && nodetype == '3'){
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = [];
                        _this.collectionids = nodeidarr;
                        _this.curpage = 1;
                        _this.gettongbudata();
                        $('.tbfiltername').html(nodename);
                        hidelayout();
                        _this.unitthird = [];
                        return;
                    };
                    var params = {
                        "nodeid": id
                    };
                    break;
                case 3:
                    if(haschild && nodetype == '4'){
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = nodeidarr;
                        _this.collectionids = [];
                        _this.curpage = 1;
                        _this.gettongbudata();
                        $('.tbfiltername').html(nodename);
                        hidelayout();
                    }else{
                        var nodeidarr = [];
                        nodeidarr.push(id);
                        _this.commodityids = [];
                        _this.collectionids = nodeidarr;
                        _this.curpage = 1;
                        _this.gettongbudata();
                        $('.tbfiltername').html(nodename);
                        hidelayout();
                    };
                    return;
                    break;
                default :
                    break;
            };

            $.ajax({
                url: apiurl + "/rest/catalog/chapter",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        if(data.data.length > 0){
                            switch (type){
                                case 0:
                                    _this.unitfirst = data.data;
                                    break;
                                case 1:
                                    _this.unitsecond = data.data;
                                    _this.unitthird = [];
                                    break;
                                case 2:
                                    _this.unitthird = data.data;
                                    break;
                                default:
                                    break;
                            };
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        gosearch: function(){
            searchvue.subjectid = this.subjectid;
            searchvue.type = this.type;
        },
        getdoctype: function(){
            var _this = this;
            $.ajax({
                url: apiurl + "/rest/resource/searchParam",
                type: 'post',
                dataType: 'json',
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        var typedata = data.data;
                        for(var i=0; i<typedata.length; i++){
                            if(typedata[i].ptypeid == '7'){
                                if(typedata[i].plist.length > 0){
                                    var docarr = [];
                                    for(var j=0; j<typedata[i].plist.length; j++){
                                        if(typedata[i].plist[j].paramid != '4'){
                                            docarr.push(typedata[i].plist[j]);
                                        };
                                    };
                                    _this.doctype = docarr;
                                    return;
                                };
                            };
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        },
        changedoctype: function(id,name){
            this.curpage = 1;
            this.doctypeid = id;
            this.gettongbudata();
            if(!id){
                $('.tbsourcename').html('全部资源');
            }else{
                $('.tbsourcename').html(name);
            };
        }
    }
});

//搜索页
var searchvue = new Vue({
    el: '#search',
    data: {
        subjectid: [],
        type: '',
        keyword: ''
    },
    methods: {
        gosearch: function () {
            resultvue.keyword = this.keyword;
            resultvue.subjectid = this.subjectid;
            resultvue.type = this.type;
            resultvue.loading = true;
            resultvue.curpage = 1;
            setTimeout(function(){
                resultvue.getsourcedata();
            },300);
        }
    }
});

//搜索结果页
var resultvue = new Vue({
    el: '#searchResult',
    data: {
        sourcedata: '',
        subjectid: [],
        loading: true,
        type: 'weike',
        keyword: '',
        empty: false,
        curpage: 1,
        pagesize: 10,
        scrollstatus: 0
    },
    methods: {
        getsourcedata: function () {
            var _this = this;
            if(_this.type == 'weike'){
                var resourcetype = [];
                resourcetype.push('1');
                var params = {
                    "curpage": _this.curpage,
                    "pagesize": _this.pagesize,
                    "dims": _this.subjectid,
                    "resourcetype": resourcetype,
                    "keywords": _this.keyword
                };
            }else{
                var params = {
                    "curpage": _this.curpage,
                    "pagesize": _this.pagesize,
                    "dims": _this.subjectid,
                    "keywords": _this.keyword
                };
            };
            $.ajax({
                url: apiurl + "/rest/resource/searchResource",
                data: JSON.stringify(params),
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if(data.code == 1) {
                        _this.loading = false;
                        if(_this.curpage == 1){
                            if(data.data.datalist.length > 0){
                                _this.empty = false;
                                _this.sourcedata = data.data.datalist;
                                _this.scrollstatus = 0;
                            }else{
                                _this.empty = true;
                            };
                        }else{
                            if(data.data.datalist.length > 0){
                                _this.scrollstatus = 0;
                                _this.sourcedata = _this.sourcedata.concat(data.data.datalist);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        alert('接口返回错误');
                    };
                },
                error: function (data) {
                    alert('网络异常');
                }
            });
        }
    }
});

function tab(liclass, conclass, wrap, event) {
    var a_li = $(liclass);
    a_li.on(event || 'mouseover', function () {
        var _thisli = $(this);
        var o_wrap = _thisli.parents(wrap);
        var a_con = o_wrap.find(conclass);

        a_con.hide();
        _thisli.addClass('current').siblings(liclass).removeClass('current');
        a_con.eq(_thisli.index()).show();
    })
};

document.addEventListener("backbutton", goback, false);
function goback(){
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
            setTitle(title, 0);
             
        },10);
        history.go(-1);
        if(player){
            player.pause();
            player = null;
        };
    };
    hidelayout();
};

//分享
var sharejson = {};
function getshare(){
    if(player){
        player.pause();
    };
    intentInfo(JSON.stringify(sharejson));
};
function intentInfo(intro) {
    try
    {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.intentInfo(function success(arg) {
                }, function error(arg) {
                }, [intro]);

            }, false);
        } else {
            cordova.plugins.traceclass.intentInfo(function success(arg) {
            }, function error(arg) {
            }, [intro]);
        }

    }
    catch (e)
    {
    }
};

var player = null;
function godetail(title){
    window.location.href = '#&detail';
};
function getdetail(presid){
    var iwinwidth=$(window).width();
    $('#resouce-wrap').html('');
    $('#resouce-wrap').css('height','23.7rem');
    $('#resourcename').html('');
    $('.detail-person').html('贡献者：');
    $('.detail-time').html('贡献时间：');
    $('.detail-con .text').html('');
    $.ajax({
        url:apiurl+'/rest/assemble/resourceDetail',
        type:'post',
        dataType:'json',
        data:JSON.stringify({'orgid':orgid,'orglevel':'2','itemid':presid}),
        contentType: "application/json; charset=utf-8",
        success: function(data){
            //alert(data.data.doctype);
            if(data.code){
                $('#resourcename').html( data.data.resourcename);
                $('.detail-tit p span').addClass('x'+data.data.starlevel);
                $('.detail-person').html('贡献者：'+data.data.submitterName);
                $('.detail-time').html('贡献时间：'+data.data.uploadtime);
                $('.detail-con .text').html(data.data.abstr);

                var title = data.data.resourcename;
                if(title){
                    setTitle(title,0);
                };

                /*
                 资源名称：data.data.resourcename
                 贡献者：data.data.submitterName
                 贡献时间data.data.uploadTime,

                 简介：data.data.abstr
                 */
                //分享
                var picurl = data.data.coverpath;
                var intro = data.data.abstr;

                sharejson.title = title;
                sharejson.picurl = picurl;
                sharejson.intro = intro;
                sharejson.presid = presid;


                var videoarr = ['mp4','flv'];
                if(videoarr.indexOf(data.data.doctype) > -1){


                    $('#resouce-wrap').html('');
                    (function(){
                        var option ={"auto_play":"0","file_id":data.data.fileid,"app_id":"1251972963",'width':iwinwidth,'height':290};
                        player = new qcVideo.Player("resouce-wrap", option);
                    })();


                };
                var pptarr = ['pptx','doc','ppt','xls','xlsx','vsd','pot','pps','rtf','wps','et','dps','pdf','txt','epub'];
                if(pptarr.indexOf(data.data.doctype) > -1){

                    //alert('docId: '+data.data.docid +'token: '+data.data.token+'host:'+data.data.host);
                    $('#resouce-wrap').html('');
                    (function () {
                        var option = {
                            docId: data.data.docid,
                            token: data.data.token,
                            host: data.data.host,
                            width: 830, //文档容器宽度
                            height:290,
                            pn: 1,  //定位到第几页，可选
                            ready: function (handler) {  // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
                                handler.setFontSize(3);
                                handler.setBackgroundColor('#000');
                                handler.setFontColor('#fff');
                            },
                            flip: function (data) {    // 翻页时回调函数, 可供客户进行统计等
                                console.log(data.pn);
                            },
                            fontSize:'big',
                            toolbarConf: {
                                page: true, //上下翻页箭头图标
                                pagenum: true, //几分之几页
                                full: true, //是否显示全屏图标,点击后全屏
                                copy: true, //是否可以复制文档内容
                                position: 'center',// 设置 toolbar中翻页和放大图标的位置(值有left/center)
                            } //文档顶部工具条配置对象,必选
                        };
                        if(data.data.docid){
                            new Document('resouce-wrap', option);
                        }else{
                            return;
                        };
                    })();
                };

                //images
                var picarr = ['jpegjpg','jpeg','jpg','png','gif'];
                if(picarr.indexOf(data.data.doctype) > -1){

                    var html="";
                    html+='<img class="detail-img" src='+data.data.playaddress+' style="vertical-align: middle;" alt="">';
                    $('#resouce-wrap').html(html);

                };

                //音频
                var mp3tarr = ['mp3', 'amr'];
                if(mp3tarr.indexOf(data.data.doctype) > -1){
                    $('#resouce-wrap').html('');
                    player = cyberplayer("resouce-wrap").setup({
                        width: '100%',
                        file: data.data.playaddress,
                        image: "",
                        autostart: true,
                        stretching: "uniform",
                        repeat: false,
                        volume: 100,
                        controls: true,
                        ak: '34f319b1f2424ca1ad0db966e1ad2bec'
                    });
                };
            }else{
                alert('请求失败，请重试！');
            };
        },
        error: function(data){

        }
    });
};

//学科切换样式
$('.swiper-container').delegate('li','click',function(){
    $(this).addClass('active').siblings().removeClass('active');
    hidelayout();
});

function hidelayout(){
    if($('.tabCon:visible').length > 0){
        $('.tabCon').hide();
        $('.pop-mask').hide();
        $('body').css('overflow', 'visible');
        $('.page').css('overflow', 'visible');
    };
    $('.twoselect .select').removeClass('active');
};

$(window).scroll(function(){
    //滚动到底
    if($(window).scrollTop() != 0){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
            switch ($('.in').eq(0).attr('id')){
                case 'weilist':
                    weikevue.scrollstatus = 1;
                    weikevue.curpage += 1;
                    weikevue.getweikedata();
                    break;
                case 'morelist':
                    tongbuvue.scrollstatus = 1;
                    tongbuvue.curpage += 1;
                    tongbuvue.gettongbudata();
                    break;
                case 'searchResult':
                    resultvue.scrollstatus = 1;
                    resultvue.curpage += 1;
                    resultvue.getsourcedata();
                default :
                    break;
            };
        };
    };
});

//回车键搜索
$(document).keydown(function(event){
    if($('.sear-text').is(":focus")){
        if(event.keyCode == 13){
            gonextpage('搜索结果','searchResult',0);
            searchvue.gosearch();
            $('input,textarea').blur();
        };
    };
});