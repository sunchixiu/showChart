/**
 * Created by Wilson on 2017/4/14.
 */

var urlapi = 'sy.ischool100.com';
var userId = '75a7a3d3ba4f484faab264e9fc2d2d3a';

//var urlapi = '182.48.117.90:8085/TSB_ISCHOOL2_REST_COMMERCE';
//var userId = '1';

//获取地址栏参数
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
if ($.getUrlParam('userid')) {
    userId = $.getUrlParam('userid');
};
if ($.getUrlParam('urlapi')) {
    urlapi = $.getUrlParam('urlapi');
};
urlapi = 'http://' + urlapi;

var client = 2;
if(document.documentElement.clientWidth > 420){
    client = 3;
}else{
    client = 2;
};

//自定义方法
Vue.filter('substr', function (str, startnum, endnum) {
    if(str){
        var val = str.substring(startnum,endnum);
        return val;
    };
});

//首页
var indexvue = new Vue({
    el: '#q-home',
    data: {
        nodata: false,
        url: urlapi,
        goodslist: '',
        livegoodslist: ''
    },
    created: function(){
        this.getgoodlist();
        this.getlivegoodslist();
    },
    methods: {
        getgoodlist: function(){
            var _this = this;
            var url = urlapi+"/frontgoods/courselist.rest";
            var params = {
                "userId": userId,
                "currentPage": 1,
                "pageSize": 6,
                "sortttype": 1
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        $('#coureseloadingid').remove();
                        $('#q-home .q-home').show();
                        if(data.data.dataList.length == 0){
                            _this.nodata = true;
                        }else{
                            _this.nodata = false;
                            _this.goodslist = data.data.dataList;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        gomycourse: function(){
            courselistvue.loading = true;
            setTimeout(function(){
                courselistvue.getmycoursecount();
                courselistvue.gettypecourse(2,'course');
            },300);
        },
        gobuycart: function(){
            buycartvue.loading = true;
            setTimeout(function(){
                buycartvue.allscore = 0;
                buycartvue.getbuycartlist();
            },300);
        },
        gomyorder: function(){
            myorderlistvue.loading = true;
            setTimeout(function(){
                myorderlistvue.getmyorderlist();
            },300);
        },
        gomorecourse: function(){
            morecoursevue.setreset();
            morecoursevue.loading = true;
            morecoursevue.goodstype = 'goods';
            morecoursevue.curpage = 1;
            setTimeout(function(){
                morecoursevue.getmorecourse();
                morecoursevue.getdirect();
            },300);
        },
        getgoodsdetail: function(goodsid){
            var url = urlapi + '/goods/getGoodsDetail.rest';
            var params = {
                userId: userId,
                goodsId: goodsid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        goodsdetailvue.loading = false;
                        goodsdetailvue.tabshow = 1;
                        goodsdetailvue.goodsid = goodsid;
                        goodsdetailvue.courseid = data.data.goods.courseid;
                        goodsdetailvue.goodsdetailjson = data.data;
                        goodsdetailvue.isbuy = data.data.isBuy;
                        goodsdetailvue.getcommentjson();
                        goodsdetailvue.detailtype = 'goods';

                        //根据产品需要，如果已购买默认显示目录
                        if(data.data.isBuy == 1){
                            goodsdetailvue.getdirectjson();
                            goodsdetailvue.tabshow = 2;
                        };
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },

        getlivegoodslist: function(){
            var _this = this;
            var url = urlapi+"/frontlive/excellentcourselive.rest";
            var params = {
                "type": 1,
                "pageSize": 6
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        $('#coureseloadingid').remove();
                        $('#q-home .q-home').show();
                        if(!data.data){
                            _this.nodata = true;
                        }else if(data.data.length == 0){
                            _this.nodata = true;
                        }else{
                            _this.nodata = false;
                            _this.livegoodslist = data.data;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },

        gomorelive: function(){
            morecoursevue.setreset();
            morecoursevue.loading = true;
            morecoursevue.goodstype = 'live';
            morecoursevue.curpage = 1;
            setTimeout(function(){
                morecoursevue.getlivegoodslist();
                morecoursevue.getdirect();
            },300);
        },
        getlivegoodsdetail: function(goodsid,courseid){
            var url = urlapi + '/frontcourselive/getLiveCourseDetail.rest';
            var params = {
                userId: userId,
                goodsId: goodsid,
                courseId: courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        goodsdetailvue.loading = false;
                        goodsdetailvue.tabshow = 1;
                        goodsdetailvue.goodsid = goodsid;
                        goodsdetailvue.courseid = courseid;
                        goodsdetailvue.goodsdetailjson = data.data;
                        goodsdetailvue.goodsdetailjson.goods = data.data.goodsRelCourseBean;    //为了和点播统一，多添加goods字段
                        goodsdetailvue.coursejson = data.data.course;                           //直播带的课程数据，为了取得版本等信息
                        goodsdetailvue.courseteacher = data.data.courseTeacher;                 //为了获取主讲老师数组
                        goodsdetailvue.courselivejson = data.data.courseLive;                   //为了获取有效开始时间和有效结束时间及
                        goodsdetailvue.isbuy = data.data.isBuy;
                        goodsdetailvue.detailtype = 'livegoods';                                //为了和点播区分开，detail页面和目录用
                        goodsdetailvue.getcommentjson();

                        //根据产品需要，如果已购买默认显示目录
                        if(data.data.isBuy == 1){
                            goodsdetailvue.getdirectjson();
                            goodsdetailvue.tabshow = 2;
                        };
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});

//课程列表
Vue.component('courselist-component',{
    template: '#courselist',
    props: {
        url: '',
        loading: true,
        nodata: false,
        coursejson: Array,
        livejson: Array,
        coursetype: '',
        scrollstatus: 0
    },
    methods: {
        getdetail: function(courseid,goodsid){
            coursedetailvue.loading = true;
            coursedetailvue.tabshow = 1;
            var url = urlapi + '/course/getCourseDetail.rest';
            var params = {
                userId: userId,
                courseId: courseid,
                goodsId: goodsid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        coursedetailvue.loading = false;
                        coursedetailvue.courseid = courseid;
                        coursedetailvue.goodsid = goodsid;
                        coursedetailvue.coursedetailjson = data.data;
                        coursedetailvue.getcommentjson();

                        //根据产品需要默认显示目录
                        coursedetailvue.getdirectjson();
                        coursedetailvue.tabshow = 2;
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getlivegoodsdetail: function(goodsid,courseid){
            var url = urlapi + '/frontcourselive/getLiveCourseDetail.rest';
            var params = {
                userId: userId,
                goodsId: goodsid,
                courseId: courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        goodsdetailvue.loading = false;
                        goodsdetailvue.tabshow = 1;
                        goodsdetailvue.goodsid = goodsid;
                        goodsdetailvue.courseid = courseid;
                        goodsdetailvue.goodsdetailjson = data.data;
                        goodsdetailvue.goodsdetailjson.goods = data.data.goodsRelCourseBean;    //为了和点播统一，多添加goods字段
                        goodsdetailvue.coursejson = data.data.course;                           //直播带的课程数据，为了取得版本等信息
                        goodsdetailvue.courseteacher = data.data.courseTeacher;                 //为了获取主讲老师数组
                        goodsdetailvue.courselivejson = data.data.courseLive;                   //为了获取有效开始时间和有效结束时间及
                        goodsdetailvue.isbuy = data.data.isBuy;
                        goodsdetailvue.detailtype = 'livegoods';                                //为了和点播区分开，detail页面和目录用
                        goodsdetailvue.getcommentjson();

                        //根据产品需要，如果已购买默认显示目录
                        if(data.data.isBuy == 1){
                            goodsdetailvue.getdirectjson();
                            goodsdetailvue.tabshow = 2;
                        };
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});
var courselistvue = new Vue({
    el: '#mycourses',
    data: {
        urlapi: urlapi,
        loading: true,
        nodata: false,
        mycoursecount: {"unstudy":0,"studyed":0,"studying":0},
        coursejson: null,
        curpage: 1,
        pagenum: 10,
        tabtype: 2,
        coursetype: 'course',
        scrollstatus: 0
    },
    methods: {
        gettypecourse: function(typenum,type,init){
            var _this = this;
            if(init){
                this.curpage = 1;
            };
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            this.tabtype = typenum;
            this.coursetype = type;
            var url = urlapi+"/mycourse/mycourse.rest";
            var params = {
                "userId": userId,
                "curpage": _this.curpage,
                "pagesize": _this.pagenum,
                "studyStatus": typenum,
                "courseType": 1
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){
                                _this.nodata = true;
                            }else{
                                _this.nodata = false;
                                _this.coursejson = data.data.dataList;
                                _this.scrollstatus = 0;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.scrollstatus = 0;
                                _this.coursejson = _this.coursejson.concat(data.data.dataList);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getmycoursecount: function(){
            var _this = this;
            var url = urlapi+"/mycourse/getMyCourseCount.rest";
            var params = {
                "userId": userId
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        _this.mycoursecount = data.data;
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },

        getmylivelist: function(typenum,type,init){
            if(init){
                this.curpage = 1;
            };
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            this.tabtype = typenum;
            this.coursetype = type;
            var _this = this;
            var url = urlapi+"/frontcourselive/mycourselive.rest";
            var params = {
                "userId": userId,
                "studyStatus": typenum
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        if(!data.data){
                            _this.loading = false;
                            _this.nodata = true;
                        }else{
                            var url = urlapi+"/frontlive/courselist.rest";
                            var params = {
                                "courseids": data.data,
                                "status": "1",
                                "currentPage": _this.curpage,
                                "pageSize": _this.pagenum
                            };
                            $.ajax({
                                url: url,
                                data: JSON.stringify(params),
                                type:'post',
                                dataType:'json',
                                contentType: "application/json; charset=utf-8",
                                success: function(data){
                                    _this.loading = false;
                                    if(data.code == 1){
                                        if(_this.curpage == 1){
                                            if(data.data.dataList.length == 0){
                                                _this.nodata = true;
                                            }else{
                                                _this.nodata = false;
                                                _this.coursejson = data.data.dataList;
                                            };
                                        }else{
                                            if(data.data.dataList.length > 0){
                                                _this.coursejson = _this.coursejson.concat(data.data.dataList);
                                            };
                                        };
                                    }else{
                                        mall.layout.alert('提示',data.errorMessage);
                                    };
                                },
                                error: function(data){
                                    mall.layout.alert('提示','接口error');
                                }
                            });
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});

//商品列表
Vue.component('morecourselist-component',{
    template: '#morecourselist',
    props: {
        url: '',
        loading: true,
        nodata: false,
        morecoursejson: Array,
        goodstype: '',
        scrollstatus: 0
    },
    methods: {
        getgoodsdetail: function(goodsid,courseid){
            goodsdetailvue.tabshow = 1;
            if(this.goodstype == 'goods'){
                var url = urlapi + '/goods/getGoodsDetail.rest';
                var params = {
                    userId: userId,
                    goodsId: goodsid
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1){
                            goodsdetailvue.loading = false;
                            goodsdetailvue.goodsid = goodsid;
                            goodsdetailvue.courseid = data.data.goods.courseid;
                            goodsdetailvue.goodsdetailjson = data.data;
                            goodsdetailvue.isbuy = data.data.isBuy;
                            goodsdetailvue.getcommentjson();

                            //根据产品需要，如果已购买默认显示目录
                            if(data.data.isBuy == 1){
                                goodsdetailvue.getdirectjson();
                                goodsdetailvue.tabshow = 2;
                            };
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });
            }else if(this.goodstype == 'live'){
                this.getlivegoodsdetail(goodsid,courseid);
            };
        },
        getlivegoodsdetail: function(goodsid,courseid){
            var url = urlapi + '/frontcourselive/getLiveCourseDetail.rest';
            var params = {
                userId: userId,
                goodsId: goodsid,
                courseId: courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        goodsdetailvue.loading = false;
                        goodsdetailvue.tabshow = 1;
                        goodsdetailvue.goodsid = goodsid;
                        goodsdetailvue.courseid = courseid;
                        goodsdetailvue.goodsdetailjson = data.data;
                        goodsdetailvue.goodsdetailjson.goods = data.data.goodsRelCourseBean;    //为了和点播统一，多添加goods字段
                        goodsdetailvue.coursejson = data.data.course;                           //直播带的课程数据，为了取得版本等信息
                        goodsdetailvue.courseteacher = data.data.courseTeacher;                 //为了获取主讲老师数组
                        goodsdetailvue.courselivejson = data.data.courseLive;                   //为了获取有效开始时间和有效结束时间及
                        goodsdetailvue.isbuy = data.data.isBuy;
                        goodsdetailvue.detailtype = 'livegoods';                                //为了和点播区分开，detail页面和目录用
                        goodsdetailvue.getcommentjson();

                        //根据产品需要，如果已购买默认显示目录
                        if(data.data.isBuy == 1){
                            goodsdetailvue.getdirectjson();
                            goodsdetailvue.tabshow = 2;
                        };
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});
var morecoursevue = new Vue({
    el: '#morecourse',
    data: {
        urlapi: urlapi,
        loading: true,
        nodata: false,
        coursejson: null,
        curpage: 1,
        pagenum: 20,
        sorttype: 2,
        stage: '',
        stagearr: [],
        grade: '',
        gradearr: [],
        subject: '',
        subjectarr: [],
        version: '',
        versionarr: [],
        childversion: '',
        childversionarr: [],
        price_small: '',
        price_large: '',
        type: 2,
        id: '',
        keyword: '',
        starttime: '',
        endtime: '',
        goodstype: 'goods',
        scrollstatus: 0
    },
    methods: {
        getmorecourse: function(data){
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            var _this = this;
            var url = urlapi+"/frontgoods/courselist.rest";
            var params = {
                "userId": userId,
                "currentPage": _this.curpage,
                "pageSize": _this.pagenum,
                "sortttype": _this.sorttype,
                "stage": _this.stage,
                "grade": _this.grade,
                "subject": _this.subject,
                "version": _this.version,
                "subversion": _this.childversion,
                "price_small": _this.price_small,
                "price_large": _this.price_large,
                "goodsName": _this.keyword
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){
                                _this.nodata = true;
                            }else{
                                _this.coursejson = data.data.dataList;
                                _this.nodata = false;
                                _this.scrollstatus = 0;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.scrollstatus = 0;
                                _this.coursejson = _this.coursejson.concat(data.data.dataList);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        setsort: function(typenum){
            this.sorttype = typenum;
            this.loading = true;
            if(this.goodstype == 'goods'){
                this.curpage = 1;
                this.getmorecourse();
            }else if(this.goodstype == 'live'){
                this.curpage = 1;
                this.getlivegoodslist();
            };
        },
        setreset: function(){
            this.stage = '';
            this.grade = '';
            this.subject = '';
            this.version = '';
            this.price_small = '';
            this.price_large = '';
            this.sorttype = 2;
            this.type = 2;
            this.keyword = '';
            this.starttime = '';
            this.endtime = '';
            this.childversion = '';
            $('.zb-time input').val('');
        },
        getdirect: function(id){

            var _this = this;
            var url = urlapi+"/datatypeDataRelate/getDatatypeDataRelate.rest";
            var params = {};
            if(id){
                params = {"parentid": id};
            }else{
                params = {"root": "K12基础教育"};
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        switch (_this.type){
                            case 2:
                                _this.stagearr = data.data;
                                _this.settype(3,data.data[0].id);
                                break;
                            case 3:
                                _this.gradearr = data.data;
                                _this.settype(4,data.data[0].id);
                                break;
                            case 4:
                                _this.subjectarr = data.data;
                                _this.settype(5,data.data[0].id);
                                break;
                            case 5:
                                _this.versionarr = data.data;
                                _this.settype(6,data.data[0].id);
                                break;
                            case 6:
                                _this.childversionarr = data.data;
                                break;
                            default:
                                _this.stagearr = data.data;
                                break;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        settype: function(typenum, id){
            this.type = typenum;
            if(id){
                this.id = id;
            };
            this.getdirect(this.id);
        },

        getfilter: function(){
            var _this = this;
            var input1 = $('.filtergoods .check').find('.rmb').eq(0);
            var input2 = $('.filtergoods .check').find('.rmb').eq(1);
            if (input1.val() == '' && input2.val() == '') {
                _this.price_small = '';
                _this.price_large = '';
            }else{
                var val1 = parseInt(input1.val()) || 0;
                var val2 = parseInt(input2.val()) || 0;
                if(val1 < val2){
                    input1.val(val1);
                    input2.val(val2);
                }else{
                    input1.val(val2);
                    input2.val(val1);
                };
                _this.price_small = input1.val();
                _this.price_large = input2.val();
            };
            if(this.goodstype == 'goods'){
                var ofilterarr = $('.filtergoods .oselect').children('.directfilter');
            }else if(this.goodstype == 'live'){
                var ofilterarr = $('.filterlive .oselect').children('.directfilter');
            };
            for(var i=0; i<ofilterarr.length; i++){
                if(ofilterarr.eq(i).find('a.active').attr('data-intid')){
                    switch (i){
                        case 0:
                            _this.stage = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        case 1:
                            _this.grade = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        case 2:
                            _this.subject = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        case 3:
                            _this.version = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        case 4:
                            _this.childversion = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        default:
                            break;
                    };
                }else{
                    switch (i){
                        case 0:
                            _this.stage = '';
                            break;
                        case 1:
                            _this.grade = '';
                            break;
                        case 2:
                            _this.subject = '';
                            break;
                        case 3:
                            _this.version = '';
                            break;
                        case 4:
                            _this.childversion = '';
                            break;
                        default:
                            break;
                    };
                };
            };
            if(this.goodstype == 'goods'){
                _this.curpage = 1;
                _this.getmorecourse();
            }else if(this.goodstype == 'live'){
                _this.curpage = 1;
                _this.getlivegoodslist();
            };
            closeoselect();
        },

        getlivegoodslist: function(){
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            var _this = this;
            var url = urlapi+"/frontlive/courselist.rest";
            var params = {
                "userId": userId,
                "currentPage": _this.curpage,
                "pageSize": _this.pagenum,
                "sortttype": _this.sorttype,
                "stage": _this.stage,
                "grade": _this.grade,
                "subject": _this.subject,
                "version": _this.version,
                "subversion": _this.childversion,
                "price_small": _this.price_small,
                "price_large": _this.price_large,
                "starttime": _this.starttime,
                "endtime": _this.endtime,
                "goodsName": _this.keyword
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){
                                _this.nodata = true;
                            }else{
                                _this.coursejson = data.data.dataList;
                                _this.nodata = false;
                                _this.scrollstatus = 0;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.scrollstatus = 0;
                                _this.coursejson = _this.coursejson.concat(data.data.dataList);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        settimelist: function(){
            var starttime = $('.zb-time').find('input').eq(0).val();
            var endtime = $('.zb-time').find('input').eq(1).val();
            this.starttime = starttime;
            this.endtime = endtime;
            this.curpage = 1;
            this.getlivegoodslist();
            closeoselect();
        }
    },
    watch: {
        coursejson: function (jsonarr) {
            var _this = this;
            for(var i=0; i<jsonarr.length; i++){
                var str = jsonarr[i].goodsName;
                if(_this.keyword){
                    str = str.replace(_this.keyword,'<font class="red">'+_this.keyword+'</font>');
                };
                jsonarr[i].goodsName = str;
            };
        }
    }
});


//课程目录组件
Vue.component('coursedirect-component', {
    template: '#coursedirect',
    props: {
        directjson: '',
        type: '',
        isbuy: 0
    },
    methods: {
        getgoodsvideo: function (videoid, type, lasttime, id, isListening, courseid, videoname){
            if(isListening == 0){
                return false;
            };
            goplay(videoid, type, lasttime, id, courseid, videoname);
        },
        gotolive: function(coursebodyid){
            gotolive(coursebodyid);
        },
        gotoplayback: function(coursebodyid){
            gotoplayback(coursebodyid);
        }
    }
});

//获取课程评论、评价组件
Vue.component('coursecomment-component', {
    template: '#coursecomment',
    props: {
        commentjson: '',
        commentlabel: '',
        commentscore: '',
        url: ''
    },
    methods: {
        giveliked: function(id){
            var _this = this;
            var url = urlapi+"/userAction/switchUserAction.rest";
            var params = {
                "objectId": id,
                "createUserId": userId
            };
            var beforetimes = parseInt($('#'+id).find('label').html());
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        $('#'+id).find('label').html(data.data.times);
                        if(data.data.times > beforetimes){
                            $('#'+id).attr('class','r q-fabulous_active');
                        }else{
                            $('#'+id).attr('class','r q-fabulous');
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});

//课程详情
var coursedetailvue = new Vue({
    el: '#q-course',
    data: {
        urlapi: urlapi,
        loading: true,
        curpage: 1,
        pagesize: 50,
        courseid: '',
        goodsid: '',
        iscomment: false,
        tabshow: 1,
        coursedetailjson: '',
        coursedirectjson: '',
        coursecommentjson: '',
        coursecommentlabel: '',
        coursecommentscore: '',
        commentcount: 0,
        detailtype: 'course'
    },
    methods: {
        getdirectjson: function(){
            this.tabshow = 2;
            var _this = this;
            var url = urlapi+"/courseBody/getCourseCatalogue.rest";
            var params = {
                "courseId": _this.courseid,
                "userId": userId,
                "goodsId": _this.goodsid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        for(var i=0; i<data.data.length; i++){
                            if(data.data[i].studyStatus == null){
                                data.data[i].studyStatus = 1;
                            };
                            for(var j=0; j< data.data[i].childCourseBody.length; j++){
                                if(data.data[i].childCourseBody[j].studyStatus == null){
                                    data.data[i].childCourseBody[j].studyStatus = 1;
                                };
                            };
                        };
                        _this.coursedirectjson = data.data;
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },

        getcommentjson: function(){
            var _this = this;
            var url = urlapi+"/userComment/queryUserComment.rest";
            var params = {
                "objectId": _this.courseid,
                "curpage": _this.curpage,
                "pagesize": _this.pagesize,
                "createUserId": userId
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.commentcount = data.data.totalRecord;
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){

                            }else{
                                _this.coursecommentjson = data.data.dataList;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.coursecommentjson = _this.coursecommentjson.concat(data.data.dataList);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getcommentlabel: function(){
            var _this = this;
            var url = urlapi+"/evaluate/queryDicLable.rest";
            var params = {
                "objectId": _this.courseid,
                "createUserId": userId
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.coursecommentlabel = data.data.dicLabs;
                        if(data.data.userEvl != 0){
                            _this.iscomment = true;
                        }else{
                            _this.iscomment = false;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };

                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getcommentscore: function(){
            var _this = this;
            var url = urlapi+"/evaluate/queryAvgEvlByObjId.rest";
            var params = {
                "objectId": _this.courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.coursecommentscore = parseInt(data.data);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };

                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getcommentall: function(){
            this.tabshow = 3;
            this.curpage = 1;
            this.getcommentjson();
            this.getcommentlabel();
            this.getcommentscore();
        },

        getcoursedesc: function(){
            this.tabshow = 1;
        },

        turncomment: function(){
            submitcommentvue.courseid = this.courseid;
            submitcommentvue.iscomment = this.iscomment;
            submitcommentvue.type = 'course';
            submitcommentvue.getcommentlabel();
        },

        getgoodsvideo: function (videoid, type, lasttime, id, isListening, courseid, videoname){
            if(isListening == 0){
                return false;
            };
            goplay(videoid, type, lasttime, id, courseid, videoname);
        },
        getvideoparam: function(){
            var _this = this;
            var url = urlapi+"/play/getVideoDetail.rest";
            var params = {
                "userId": userId,
                "goodsId": _this.goodsid,
                "courseId": _this.courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.getgoodsvideo(data.data.videoCcId, 1, data.data.lastStudyTime, data.data.courseBodyId, 1, data.data.courseId, data.data.courseBodyName);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});

//商品详情
var goodsdetailvue = new Vue({
    el: '#q-goods',
    data: {
        urlapi: urlapi,
        loading: true,
        curpage: 1,
        pagesize: 50,
        goodsid: '',
        courseid: '',
        iscomment: false,
        tabshow: 1,
        goodsdetailjson: '',
        coursedirectjson: '',
        coursecommentjson: '',
        coursecommentlabel: '',
        coursecommentscore: '',
        commentcount: 0,
        detailtype: 'goods',
        isbuy: 0,
        coursejson : '',
        courseteacher: [],
        courselivejson: ''
    },
    methods: {
        getdirectjson: function(){
            this.tabshow = 2;
            var _this = this;
            var url = urlapi+"/courseBody/getCourseCatalogue.rest";
            var params = {
                "courseId": _this.courseid,
                "userId": userId,
                "goodsId": _this.goodsid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        for(var i=0; i<data.data.length; i++){
                            if(data.data[i].studyStatus == null){
                                data.data[i].studyStatus = 1;
                            };
                            for(var j=0; j< data.data[i].childCourseBody.length; j++){
                                if(data.data[i].childCourseBody[j].studyStatus == null){
                                    data.data[i].childCourseBody[j].studyStatus = 1;
                                };
                            };
                        };
                        _this.coursedirectjson = data.data;
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },

        getcommentjson: function(){
            var _this = this;
            var url = urlapi+"/userComment/queryUserComment.rest";
            var params = {
                "objectId": _this.courseid,
                "curpage": _this.curpage,
                "pagesize": _this.pagesize,
                "createUserId": userId
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.commentcount = data.data.totalRecord;
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){

                            }else{
                                _this.coursecommentjson = data.data.dataList;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.coursecommentjson = _this.coursecommentjson.concat(data.data.dataList);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };

                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getcommentlabel: function(){
            var _this = this;
            var url = urlapi+"/evaluate/queryDicLable.rest";
            var params = {
                "objectId": _this.courseid,
                "createUserId": userId
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.coursecommentlabel = data.data.dicLabs;
                        if(data.data.userEvl != 0){
                            _this.iscomment = true;
                        }else{
                            _this.iscomment = false;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };

                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getcommentscore: function(){
            var _this = this;
            var url = urlapi+"/evaluate/queryAvgEvlByObjId.rest";
            var params = {
                "objectId": _this.courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.coursecommentscore = parseInt(data.data);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };

                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getcommentall: function(){
            this.tabshow = 3;
            this.curpage = 1;
            this.getcommentjson();
            this.getcommentlabel();
            this.getcommentscore();
        },

        getcoursedesc: function(){
            this.tabshow = 1;
        },

        turncomment: function(){
            submitcommentvue.courseid = this.courseid;
            submitcommentvue.iscomment = this.iscomment;
            submitcommentvue.type = 'goods';
            submitcommentvue.getcommentlabel();
        },

        insertbuycart: function(id){
            var _this = this;
            var url = urlapi+"/goodsCart/insertGoodsCart.rest";
            var params = {
                "userId": userId,
                "goodsId": id,
                "client": client
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        mall.layout.alert('提示','添加购物车成功！');
                        _this.gobuycart();
                        getgoodsstatus();
                    }else if(data.code == 2){
                        mall.layout.alert('提示','购物车中已有该商品！');
                    }else if(data.code == 3){
                        mall.layout.confirm('提示','该商品已生成订单，是否去结算？',function(){
                            _this.gomyorder();
                        });
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        gomyorder: function(){
            myorder();
            myorderlistvue.getmyorderlist(1);
        },
        gobuycart: function(){
            shopcart();
            buycartvue.getbuycartlist();
        },
        confirmorderdetail: function(name){
            var _this = this;
            var url = urlapi+"/goodsCart/insertGoodsCart.rest";
            var params = {
                "userId": userId,
                "goodsId": _this.goodsdetailjson.goods.goodsId,
                "client": client
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1 || data.code == 2){
                        var buycartid = data.data.cardId;
                        var orderlist = [];
                        var goodsjson = {};
                        var goodsids = [];
                        var json = {};
                        json.goodsName = _this.goodsdetailjson.goods.goodsName;
                        if(_this.goodsdetailjson.goods.goodsDiscountPrice){
                            json.payPrice = _this.goodsdetailjson.goods.goodsDiscountPrice;
                        }else{
                            json.payPrice = _this.goodsdetailjson.goods.goodsPrice;
                        };
                        json.goodsImg = _this.goodsdetailjson.goods.goodsImg;
                        orderlist.push(json);
                        goodsjson.orderList = orderlist;
                        goodsjson.totalCount = 1;
                        goodsjson.payAmount = json.payPrice;
                        orderconfirmvue.orderdetaillist = goodsjson;
                        goodsids.push(buycartid);
                        orderconfirmvue.isbuycart = true;
                        orderconfirmvue.goodsids = goodsids;
                        window.location.href = '#&confirmOrder';
                        getgoodsstatus();
                        setTitle('确认订单','99');
                        setbacktitle(name,buycartvue.status,'q-goods');
                    }else if(data.code == 3){
                        mall.layout.confirm('提示','此商品已在待支付订单中，确定去支付吗？',function(){
                            _this.gomyorder();
                            getgoodsstatus();
                            setTitle('我的订单','99');
                            setbacktitle(name,buycartvue.status,'q-goods');
                        });
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        goinstantorder: function(){//暂时没用到
            instantorder();
        },

        getgoodsvideo: function (videoid, type, lasttime, id, isListening, courseid, videoname){
            if(isListening == 0){
                return false;
            };
            goplay(videoid, type, lasttime, id, courseid, videoname);
        },
        getvideoparam: function(){
            var _this = this;
            var url = urlapi+"/play/getVideoDetail.rest";
            var params = {
                "userId": userId,
                "goodsId": _this.goodsid,
                "courseId": _this.courseid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.getgoodsvideo(data.data.videoCcId, 1, data.data.lastStudyTime, data.data.courseBodyId, 1, data.data.courseId, data.data.courseBodyName);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});

//课程评论、评价提交
var submitcommentvue = new Vue({
    el: '#q-evaluate',
    data: {
        urlapi: urlapi,
        loading: true,
        courseid: '',
        iscomment: false,
        coursecommentlabel: '',
        type: ''
    },
    methods: {
        getcommentlabel: function(){
            var _this = this;
            var url = urlapi+"/evaluate/queryDicLable.rest";
            _this.coursecommentlabel = '';
            var params = {
                "objectId": _this.courseid,
                "createUserId": userId
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(data.data.userEvl != 0){
                            _this.iscomment = true;
                        }else{
                            _this.iscomment = false;
                        };
                        _this.coursecommentlabel = data.data.dicLabs;
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        submitcomment: function(){
            var _this = this;
            var commenttext = $('#q-evaluate').find('textarea').val();
            var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
            if(commenttext.match(regRule)) {
                mall.layout.alert("提示","不支持墨迹表情评论!");
                return;
            }
            if($('#q-evaluate').find('.q-my-evaluate').length > 0){
                var contairner = $('#q-evaluate').find('.q-my-evaluate');
                var scoreclass = contairner.find('.q-star').attr('class');
                var score = parseInt(scoreclass.substring(scoreclass.length-1,scoreclass.length));
                var labelarr = [];
                for(var i=0; i<contairner.find('.q-evaluate-tab a[class="active"]').length; i++){
                    var id = contairner.find('.q-evaluate-tab a[class="active"]').eq(i).attr('data-id');
                    labelarr.push(id);
                };

                //提交评价
                var url = urlapi + '/evaluate/addEvaluate.rest';
                var params = {
                    "createUserId": userId,
                    "objectId": _this.courseid,
                    "score": score,
                    "dicLableIds": labelarr
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    async:false,
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1){

                        }else{
                            alert('提交评价没有成功！');
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });

                //提交评论
                if(commenttext == ''){
                    goback();
                    if(_this.type == 'course'){
                        coursedetailvue.getcommentall();
                    }else if(_this.type == 'goods'){
                        goodsdetailvue.getcommentall();
                    };
                }else{
                    var url = urlapi + '/userComment/addUserComment.rest';
                    var params = {
                        "createUserId": userId,
                        "objectId": _this.courseid,
                        "commentContent": commenttext
                    };
                    $.ajax({
                        url: url,
                        data: JSON.stringify(params),
                        type:'post',
                        dataType:'json',
                        async:false,
                        contentType: "application/json; charset=utf-8",
                        success: function(data){
                            if(data.code == 1){
                                goback();
                                if(_this.type == 'course'){
                                    coursedetailvue.getcommentall();
                                }else if(_this.type == 'goods'){
                                    goodsdetailvue.getcommentall();
                                };
                            };
                        },
                        error: function(data){
                            mall.layout.alert('提示','接口error');
                        }
                    });
                };
            }else{
                //提交评论
                if(commenttext == ''){
                    mall.layout.alert("提示","评论不能为空!");
                }else{
                    var url = urlapi + '/userComment/addUserComment.rest';
                    var params = {
                        "createUserId": userId,
                        "objectId": _this.courseid,
                        "commentContent": commenttext
                    };
                    $.ajax({
                        url: url,
                        data: JSON.stringify(params),
                        type:'post',
                        dataType:'json',
                        async:false,
                        contentType: "application/json; charset=utf-8",
                        success: function(data){
                            if(data.code == 1){
                                goback();
                                if(_this.type == 'course'){
                                    coursedetailvue.getcommentall();
                                }else if(_this.type == 'goods'){
                                    goodsdetailvue.getcommentall();
                                };
                            };
                        },
                        error: function(data){
                            mall.layout.alert('提示','接口error');
                        }
                    });
                };
            };
        }

    }
});

//购物车
var buycartvue = new Vue({
    el: '#q-buycart',
    data: {
        loading: true,
        nodata: false,
        curpage: 1,
        pagesize: 50,
        buycartlist: [],
        invalidlist: [],
        url: urlapi,
        allnum: 0,
        allscore: 0,
        status: '1'
    },
    methods: {
        getbuycartlist: function(){
            var _this = this;
            var url = urlapi+"/goodsCart/getGoodsCart.rest";
            var params = {
                "userId": userId
            };
            _this.buycartlist = [];
            _this.invalidlist = [];
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(data.data.length > 0){
                            for(var i=0; i<data.data.length; i++){
                                if(data.data[i].goodsStatus == 3){
                                    _this.buycartlist.push(data.data[i]);
                                }else{
                                    _this.invalidlist.push(data.data[i]);
                                };
                            };
                            _this.nodata = false;
                        }else{
                            _this.nodata = true;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        setallscore: function(){
            var _this = this;
            _this.allscore = 0;
            setTimeout(function(){
                _this.allnum = $('.q-buy-rad input:checked').length;
                $('.q-buy-rad input:checked').each(function(){
                    _this.allscore = (parseFloat(_this.allscore) + parseFloat($(this).attr('data-price'))).toFixed(2);
                });
            },0);
        },
        turnorderdetail: function(){
            var orderlist = [];
            var goodsjson = {};
            var goodsids = [];
            for(var i=0; i<$('.q-buy-rad input:checked').length; i++){
                var json = {};
                var name = $('.q-buy-rad input:checked').eq(i).attr('data-name');
                var price = $('.q-buy-rad input:checked').eq(i).attr('data-price');
                var imgurl = $('.q-buy-rad input:checked').eq(i).attr('data-img');
                goodsids.push($('.q-buy-rad input:checked').eq(i).attr('data-id'));
                json.goodsName = name;
                json.payPrice = price;
                json.goodsImg = imgurl;
                orderlist.push(json);
            };
            goodsjson.orderList = orderlist;
            goodsjson.totalCount = this.allnum;
            goodsjson.payAmount = this.allscore;
            orderconfirmvue.orderdetaillist = goodsjson;
            orderconfirmvue.isbuycart = true;
            orderconfirmvue.loading = false;
            orderconfirmvue.goodsids = goodsids;
        },
        deletegoods: function(id){
            var _this = this;
            var url = urlapi+"/goodsCart/updateGoodsCart.rest";
            var params = {
                "cardId": id,
                "isUse": 0
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        getgoodsstatus();
                        if(_this.status == '1'){
                            _this.nodata = true;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        deleteall: function(){
            var _this = this;
            for(var i=0; i<_this.buycartlist.length; i++){
                if(_this.buycartlist[i].goodsCartId){
                    _this.deletegoods(_this.buycartlist[i].goodsCartId);
                };
            };
            _this.status = '1';
            _this.nodata = true;
        },
        deleteinvalid: function(){
            var _this = this;
            for(var i=0; i<_this.invalidlist.length; i++){
                if(_this.invalidlist[i].goodsCartId){
                    _this.deletegoods(_this.invalidlist[i].goodsCartId);
                };
            };
            _this.invalidlist = [];
        }
    }
});


//我的订单
var myorderlistvue = new Vue({
    el: '#myorder',
    data: {
        loading: true,
        nodata: false,
        url: urlapi,
        curpage: 1,
        pagesize: 20,
        myorderlist: '',
        ordertype: 0,
        scrollstatus: 0
    },
    methods: {
        getmyorderlist: function(type,init){
            var _this = this;
            if(init){
                _this.curpage = 1;
            };
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            var url = urlapi+"/order/querymyorder.rest";
            var status = '';
            var ordertype = '';
            if(type){
                ordertype = type;
                _this.ordertype = type;
            }else{
                ordertype = '';
                _this.ordertype = 0;
            };
            var params = {
                "userId": userId,
                "payStatus": ordertype,
                "currentPage": _this.curpage,
                "pageSize": _this.pagesize
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(_this.curpage == 1){
                            if(data.data.dataList.length > 0){
                                _this.myorderlist = data.data.dataList;
                                _this.nodata = false;
                                for(var i=0; i<_this.myorderlist.length; i++){
                                    _this.myorderlist[i].ordertitle = '';
                                    _this.myorderlist[i].goodsids = [];
                                    for(var j=0; j<_this.myorderlist[i].orderList.length; j++){
                                        if(j==0){
                                            _this.myorderlist[i].ordertitle += _this.myorderlist[i].orderList[j].goodsName;
                                        }else{
                                            _this.myorderlist[i].ordertitle += ',' + _this.myorderlist[i].orderList[j].goodsName;
                                        };
                                        _this.myorderlist[i].goodsids.push(_this.myorderlist[i].orderList[j].goodsId);
                                    };
                                };
                                _this.scrollstatus = 0;
                            }else{
                                _this.nodata= true;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.scrollstatus = 0;
                                _this.myorderlist = _this.myorderlist.concat(data.data.dataList);
                                for(var i=0; i<_this.myorderlist.length; i++){
                                    _this.myorderlist[i].ordertitle = '';
                                    _this.myorderlist[i].goodsids = [];
                                    for(var j=0; j<_this.myorderlist[i].orderList.length; j++){
                                        if(j==0){
                                            _this.myorderlist[i].ordertitle += _this.myorderlist[i].orderList[j].goodsName;
                                        }else{
                                            _this.myorderlist[i].ordertitle += ',' + _this.myorderlist[i].orderList[j].goodsName;
                                        };
                                        _this.myorderlist[i].goodsids.push(_this.myorderlist[i].orderList[j].goodsId);
                                    };
                                };
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        cancelmyorder: function(id){
            var _this = this;
            mall.layout.confirm('提示','确定取消此订单吗？',function(){
                var url = urlapi+"/order/switchorder.rest";
                var params = {
                    "userId": userId,
                    "orderId": id,
                    "payStatus": 3
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1){
                            var type = '';
                            if(_this.ordertype != 0){
                                type = _this.ordertype;
                            };
                            _this.getmyorderlist(type);
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });
            });
        },
        delmyorder: function(id){
            var _this = this;
            mall.layout.confirm('提示','确定删除此订单？',function(){
                var url = urlapi+"/order/switchorder.rest";
                var params = {
                    "userId": userId,
                    "orderId": id,
                    "isUse": 0
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1){
                            var type = '';
                            if(_this.ordertype != 0){
                                type = _this.ordertype;
                            };
                            _this.getmyorderlist(type);
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });
            });
        },
        goorderdetail: function(id){
            orderdetailvue.getorderlist(id);
        },
        confirmorderdetail: function(idarr){
            var _this = this;
            var curdivid = $('.in').attr('id');
            var orderlist = [];
            var goodsjson = {};
            var goodsids = [];
            var payAmount = 0;
            var ifgoon = true;
            for(var i=0; i<idarr.length; i++){
                var json = {};
                var url = urlapi+"/goods/getGoodsDetail.rest";
                var params = {
                    "goodsId": idarr[i],
                    "userId": userId
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function(data){
                        if(data.code == 1){
                            json.goodsName = data.data.goods.goodsName;
                            if(data.data.goods.goodsDiscountPrice){
                                json.payPrice = data.data.goods.goodsDiscountPrice;
                            }else{
                                json.payPrice = data.data.goods.goodsPrice;
                            };
                            payAmount += parseFloat(json.payPrice);
                            json.goodsImg = data.data.goods.goodsImg;
                            orderlist.push(json);
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });

                var url = urlapi+"/goodsCart/insertGoodsCart.rest";
                var params = {
                    "userId": userId,
                    "goodsId": idarr[i],
                    "client": client
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1 || data.code == 2){
                            var buycartid = data.data.cardId;
                            goodsids.push(buycartid);
                        }else if(data.code == 3){
                            mall.layout.alert('提示','有商品已生成订单！');
                            ifgoon = false;
                            return;
                        }else if(data.code == 0){
                            mall.layout.alert('提示',data.errorMessage);
                            ifgoon = false;
                            return;
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                            ifgoon = false;
                            return;
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                        ifgoon = false;
                        return;
                    }
                });
            };
            if(!ifgoon){
                return false;
            };
            goodsjson.orderList = orderlist;
            goodsjson.totalCount = idarr.length;
            goodsjson.payAmount = payAmount;
            orderconfirmvue.orderdetaillist = goodsjson;
            orderconfirmvue.goodsids = goodsids;
            orderconfirmvue.isbuycart = true;
            window.location.href = '#&confirmOrder';
            setTitle('确认订单','99');
            if(curdivid == 'myorder'){
                setbacktitle('我的订单','99','myorder');
            }else{
                setbacktitle('订单详情','99','orderdetail');
            };
        }
    }
});
//订单提交页
var orderconfirmvue = new Vue({
    el: '#confirmOrder',
    data: {
        loading: true,
        nodata: false,
        curpage: 1,
        pagesize: 50,
        totalCount: 0,
        payAmount: 0,
        orderdetaillist: '',
        url: urlapi,
        isbuycart: false,
        goodsids: [],
        ordertitle: ''
    },
    methods: {
        submitgoodslist: function(){
            var _this = this;

            var isgoon = true;
            var url = urlapi+"/goods/getGoodsDetailById.rest";
            var params = {
                "goodsIds": _this.goodsids
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data){
                    for(var i=0; i<data.length; i++){
                        if(data[i].code == 3){
                            isgoon = false;
                            return;
                        };
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
            if(!isgoon){
                mall.layout.alert('提示','商品已下架，请返回购物车');
                return;
            };

            sebmitorder();
            var url = urlapi+"/goodsCart/settlement.rest";
            var params = {
                "userId": userId,
                "goodsCartIds": _this.goodsids
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        orderdetailvue.getorderlist(data.data);
                        myorderlistvue.getmyorderlist(1);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        }
    }
});

//订单详情页
var orderdetailvue = new Vue({
    el: '#orderdetail',
    data: {
        loading: true,
        nodata: false,
        curpage: 1,
        pagesize: 50,
        totalCount: 0,
        payAmount: 0,
        orderdetaillist: '',
        url: urlapi,
        isbuycart: false,
        goodsids: [],
        ordertitle: '',
        validtime: ''
    },
    methods: {
        getorderlist: function(id){
            var _this = this;
            _this.loading = true;
            _this.goodsids = [];
            var url = urlapi+"/order/querymyorder.rest";
            var params = {
                "userId": userId,
                "orderId": id,
                "currentPage": _this.curpage,
                "pageSize": _this.pagesize
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    _this.isbuycart = false;
                    if(data.code == 1){
                        _this.orderdetaillist = data.data.dataList[0];
                        _this.ordertitle = '';
                        for(var i=0; i<_this.orderdetaillist.orderList.length; i++){
                            if(i == 0){
                                _this.ordertitle += _this.orderdetaillist.orderList[i].goodsName;
                            }else{
                                _this.ordertitle += ',' + _this.orderdetaillist.orderList[i].goodsName;
                            };
                            _this.goodsids.push(_this.orderdetaillist.orderList[i].goodsId);
                        };
                        backarr = [];
                        if(_this.orderdetaillist.payStatus == 1){
                            var ordertime = _this.orderdetaillist.createTime;
                            var timestamp = Date.parse(new Date(ordertime))/1000 + 24*60*60;
                            var curstamp = Date.parse(new Date())/1000;
                            var distimestamp = timestamp-curstamp;
                            var h = parseInt(distimestamp/(60*60));
                            var m = parseInt(distimestamp%(60*60)/60);
                            var s = parseInt(distimestamp%(60*60)%60);
                            if(h < 10){
                                h = '0'+h;
                            };
                            if(m < 10){
                                m = '0'+m;
                            };
                            if(s < 10){
                                s = '0'+s;
                            };
                            _this.validtime = h + '：' + m + '：' + s;
                        };
                        setbacktitle('生命大学','0','q-home');
                        setbacktitle('我的订单','99','myorder');
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };

                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        goorderlist: function(){
            myorder();
            myorderlistvue.ordertype = 1;
        },
        cancelmyorder: function(id){
            var _this = this;
            mall.layout.confirm('提示','确定取消此订单吗？',function(){
                var url = urlapi+"/order/switchorder.rest";
                var params = {
                    "userId": userId,
                    "orderId": id,
                    "payStatus": 3
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1){
                            myorderlistvue.ordertype = 1;
                            myorderlistvue.getmyorderlist(1);
                            myorder();
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });
            });
        },
        delmyorder: function(id){
            var _this = this;
            mall.layout.confirm('提示','确定删除此订单？',function(){
                var url = urlapi+"/order/switchorder.rest";
                var params = {
                    "userId": userId,
                    "orderId": id,
                    "isUse": 0
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1){
                            myorderlistvue.ordertype = 3;
                            myorderlistvue.getmyorderlist(3);
                            myorder();
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });
            });
        },
        confirmorderdetail: function(idarr){
            var _this = this;
            var curdivid = $('.in').attr('id');
            var orderlist = [];
            var goodsjson = {};
            var goodsids = [];
            var payAmount = 0;
            var ifgoon = true;
            for(var i=0; i<idarr.length; i++){
                var json = {};
                var url = urlapi+"/goods/getGoodsDetail.rest";
                var params = {
                    "goodsId": idarr[i],
                    "userId": userId
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    success: function(data){
                        if(data.code == 1){
                            json.goodsName = data.data.goods.goodsName;
                            if(data.data.goods.goodsDiscountPrice){
                                json.payPrice = data.data.goods.goodsDiscountPrice;
                            }else{
                                json.payPrice = data.data.goods.goodsPrice;
                            };
                            payAmount += parseFloat(json.payPrice);
                            json.goodsImg = data.data.goods.goodsImg;
                            orderlist.push(json);
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                    }
                });

                var url = urlapi+"/goodsCart/insertGoodsCart.rest";
                var params = {
                    "userId": userId,
                    "goodsId": idarr[i],
                    "client": client
                };
                $.ajax({
                    url: url,
                    data: JSON.stringify(params),
                    type:'post',
                    dataType:'json',
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function(data){
                        if(data.code == 1 || data.code == 2){
                            var buycartid = data.data.cardId;
                            goodsids.push(buycartid);
                        }else if(data.code == 3){
                            mall.layout.alert('提示','有商品已生成订单！');
                            ifgoon = false;
                            return;
                        }else if(data.code == 0){
                            mall.layout.alert('提示',data.errorMessage);
                            ifgoon = false;
                            return;
                        }else{
                            mall.layout.alert('提示',data.errorMessage);
                            ifgoon = false;
                            return;
                        };
                    },
                    error: function(data){
                        mall.layout.alert('提示','接口error');
                        ifgoon = false;
                        return;
                    }
                });
            };
            if(!ifgoon){
                return false;
            };
            goodsjson.orderList = orderlist;
            goodsjson.totalCount = idarr.length;
            goodsjson.payAmount = payAmount;
            orderconfirmvue.orderdetaillist = goodsjson;
            orderconfirmvue.goodsids = goodsids;
            orderconfirmvue.isbuycart = true;
            window.location.href = '#&confirmOrder';
            setTitle('确认订单','99');
            if(curdivid == 'myorder'){
                setbacktitle('我的订单','99','myorder');
            }else{
                setbacktitle('订单详情','99','orderdetail');
            };
        }
    }
});

//搜索
var searchvue = new Vue({
    el: '#q-search',
    data:{
        keyword:'',
        searchtype: 1
    },
    methods: {
        search: function(keyword){
            if(typeof keyword == 'string'){
                this.keyword = keyword;
            };
            if (this.searchtype == 1) {
                morecoursevue.goodstype = 'goods';
                morecoursevue.setreset();
                morecoursevue.keyword = this.keyword;
                morecoursevue.loading = true;
                morecoursevue.nodata = false;
                morecourse();
                setTimeout(function(){
                    morecoursevue.getmorecourse();
                    //morecoursevue.getdirect();
                },300);
                if(!window.localStorage.getItem('coursehistory')){
                    if(this.keyword){
                        window.localStorage.setItem('coursehistory',this.keyword);
                    };
                }else{
                    if((window.localStorage.getItem('coursehistory') + ',').indexOf(this.keyword) == -1 && (',' + window.localStorage.getItem('coursehistory')).indexOf(this.keyword) == -1 && this.keyword){
                        var newstr = window.localStorage.getItem('coursehistory') + ',' +this.keyword;
                        window.localStorage.setItem('coursehistory',newstr);
                    };
                };
            }else if (this.searchtype == 4) {
                morecoursevue.goodstype = 'live';
                morecoursevue.setreset();
                morecoursevue.keyword = this.keyword;
                morecoursevue.loading = true;
                morecoursevue.nodata = false;
                morelive();
                setTimeout(function(){
                    morecoursevue.getlivegoodslist();
                    morecoursevue.getdirect();
                },300);
                if(!window.localStorage.getItem('livehistory')){
                    if(this.keyword){
                        window.localStorage.setItem('livehistory',this.keyword);
                    };
                }else{
                    if((window.localStorage.getItem('livehistory') + ',').indexOf(this.keyword) == -1 && (',' + window.localStorage.getItem('livehistory')).indexOf(this.keyword) == -1 && this.keyword){
                        var newstr = window.localStorage.getItem('livehistory') + ',' +this.keyword;
                        window.localStorage.setItem('livehistory',newstr);
                    };
                };
            }else if (this.searchtype == 2) {
                searchflsh();
                searchResultvue.keyword = this.keyword;
                searchResultvue.loading = true;
                searchResultvue.curpage = 1;
                setTimeout(function(){
                    searchResultvue.getunit();
                },300);
                if(!window.localStorage.getItem('unithistory')){
                    if(this.keyword){
                        window.localStorage.setItem('unithistory',this.keyword);
                    };
                }else{
                    if((window.localStorage.getItem('unithistory') + ',').indexOf(this.keyword) == -1 && (',' + window.localStorage.getItem('unithistory')).indexOf(this.keyword) == -1 && this.keyword){
                        var newstr = window.localStorage.getItem('unithistory') + ',' +this.keyword;
                        window.localStorage.setItem('unithistory',newstr);
                    };
                };
            }else if (this.searchtype == 3){
                searchflsh();
                searchResultvue.keyword = this.keyword;
                searchResultvue.loading = true;
                searchResultvue.curpage = 1;
                setTimeout(function(){
                    searchResultvue.getteacher();
                },300);
                if(!window.localStorage.getItem('teacherhistory')){
                    if(this.keyword){
                        window.localStorage.setItem('teacherhistory',this.keyword);
                    };
                }else{
                    if((window.localStorage.getItem('teacherhistory') + ',').indexOf(this.keyword) == -1 && (',' + window.localStorage.getItem('teacherhistory')).indexOf(this.keyword) == -1 && this.keyword){
                        var newstr = window.localStorage.getItem('teacherhistory') + ',' +this.keyword;
                        window.localStorage.setItem('teacherhistory',newstr);
                    };
                };
            };
        },
        setsearchtype: function (num) {
            this.searchtype = num;
            searchResultvue.searchtype = num;
        }
    }
});
//搜索结果
var searchResultvue = new Vue({
    el: '#searchResult',
    data: {
        loading: true,
        nodata: false,
        searchtype: 1,
        curpage: 1,
        pagesize: 20,
        teacherdata: '',
        unitdata: '',
        url: urlapi,
        keyword: '',
        scrollstatus: 0
    },
    methods: {
        // 教师
        getteacher: function () {
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            this.searchtype = 3;
            var _this = this;
            var url = urlapi+"/frontgoods/teacherlist.rest";
            var params = {
                realName: _this.keyword,
                curpage: _this.curpage,
                pagesize: _this.pagesize,
                isUse: 1
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        _this.nodata = false;
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){
                                _this.nodata = true;
                            }else{
                                _this.scrollstatus = 0;
                                _this.teacherdata = data.data.dataList;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.scrollstatus = 0;
                                _this.teacherdata = _this.teacherdata.concat(data.data.dataList);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        // 机构
        getunit: function () {
            if(this.curpage == 1){
                this.loading = true;
            }else{
                this.loading = false;
            };
            this.searchtype = 2;
            var _this = this;
            var url = urlapi+"/frontgoods/organizationlist.rest";
            var params = {
                unitName: _this.keyword,
                currentPage: _this.curpage,
                pageSize: _this.pagesize,
                sorttype:2
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        _this.nodata = false;
                        if(_this.curpage == 1){
                            if(data.data.dataList == null || data.data.dataList.length == 0){
                                _this.nodata = true;
                            }else{
                                _this.scrollstatus = 0;
                                _this.unitdata = data.data.dataList;
                            };
                        }else{
                            if(data.data.dataList.length > 0){
                                _this.scrollstatus = 0;
                                _this.unitdata = _this.unitdata.concat(data.data.dataList);
                            }else{
                                _this.scrollstatus = 2;
                                setTimeout(function(){
                                    _this.scrollstatus = 0;
                                },1000);
                            };
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        teacherparticulars: function (id) {
            agencyparticularsvue.setreset();
            agencyparticularsvue.getTeachersdetails(id);
            agencyparticularsvue.nochildlist = false;
        },
        unitparticulars: function function_name(id,num) {
            agencyparticularsvue.setreset();
            agencyparticularsvue.getunitdetails(id,num);
            agencyparticularsvue.nochildlist = false;
            agencyparticularsvue.getdirect();
        }
    },
    watch: {
        unitdata: function (jsonarr) {
            var _this = this;
            for(var i=0; i<jsonarr.length; i++){
                var str = jsonarr[i].unitName;
                if(_this.keyword){
                    str = str.replace(_this.keyword,'<font class="red">'+_this.keyword+'</font>');
                };
                jsonarr[i].unitName = str;
                if(jsonarr[i].provinceCode == null){
                    jsonarr[i].provinceCode = '';
                };
                if(jsonarr[i].cityCode == null){
                    jsonarr[i].cityCode = '';
                };
                if(jsonarr[i].countryCode == null){
                    jsonarr[i].countryCode = '';
                };
            };
        },
        teacherdata: function (jsonarr) {
            var _this = this;
            for(var i=0; i<jsonarr.length; i++){
                var str = jsonarr[i].realName;
                if(_this.keyword){
                    str = str.replace(_this.keyword,'<font class="red">'+_this.keyword+'</font>');
                };
                jsonarr[i].realName = str;
            };
        }
    }
});
// 单个教师、机构详情
var agencyparticularsvue = new Vue ({
    el: '#agencyparticulars',
    data: {
        loading: true,
        curpage: 1,
        detailstype: 1,
        pagesize: 20,
        url: urlapi,
        id: '',
        typeid: '',
        Tdetailsdata: '',
        Tdetailsdatag: '',
        TdetailsdatagL: '',
        unitdata: '',
        unitdatac: '',
        unitdatal: [],
        num: 0,
        sorttype: 2,
        stage: '',
        stagearr: [],
        grade: '',
        gradearr: [],
        subject: '',
        subjectarr: [],
        price_small: '',
        price_large: '',
        type: 2,
        nochildlist: false
    },
    methods: {
        // 教师
        getTeachersdetails: function (id) {
            if(id){
                this.typeid = id;
                this.curpage = 1;
            };
            this.detailstype = 1;
            var _this = this;
            var url = urlapi+"/frontgoods/queryTeacherDetail.rest";
            var params = {
                teacherId: _this.typeid,
                currentPage: _this.curpage,
                pageSize: _this.pagesize,
                sortttype: _this.sorttype,
                price_small: _this.price_small,
                price_large: _this.price_large
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        _this.Tdetailsdata = data.data.teacher;
                        if(_this.curpage == 1){
                            if(data.data.goodslist && data.data.goodslist.dataList.length > 0){
                                _this.nochildlist = false;
                                _this.Tdetailsdatag = data.data.goodslist;
                                _this.TdetailsdatagL = data.data.goodslist.dataList;
                                var countarr = data.data.goodslist.dataList;
                                var num = 0;
                                for(var i=0; i<countarr.length; i++){
                                    num += countarr[i].buycount;
                                };
                                _this.num = num;
                            }else{
                                _this.nochildlist = true;
                                _this.Tdetailsdatag = {};
                                _this.Tdetailsdatag.totalRecord = 0;
                            };
                        }else{
                            if(data.data.goodslist.dataList.length > 0){
                                alert(_this.TdetailsdatagL.length);
                                _this.TdetailsdatagL = _this.TdetailsdatagL.concat(data.data.goodslist.dataList);
                            };
                        };

                        setTimeout(function(){
                            setheight();
                        },0);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        // 机构
        getunitdetails: function (id,num) {
            if(id){
                this.typeid = id;
                this.curpage = 1;
            };
            if(num || num == 0){
                this.num = num;
            };
            this.detailstype = 2;
            var _this = this;
            var url = urlapi+"/frontgoods/queryUnitDetail.rest";
            var params = {
                schoolid:_this.typeid,
                currentPage: _this.curpage,
                pageSize: _this.pagesize,
                sortttype: _this.sorttype,
                price_small: _this.price_small,
                price_large: _this.price_large,
                stage: _this.stage,
                grade: _this.grade,
                subject: _this.subject
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.loading = false;
                    if(data.code == 1){
                        if(!data.data.unit.country){
                            data.data.unit.country = {};
                            data.data.unit.country.fullName = '';
                        };
                        _this.unitdata = data.data.unit;
                        if(_this.curpage == 1){
                            if(data.data.courses){
                                _this.unitdatac = data.data.courses;
                                if(data.data.courses.dataList && data.data.courses.dataList.length > 0){
                                    _this.nochildlist = false;
                                    _this.unitdatal = data.data.courses.dataList;
                                }else{
                                    _this.nochildlist = true;
                                };
                            }else{
                                _this.nochildlist = true;
                            };
                        }else{
                            if(data.data.courses.dataList.length > 0){
                                _this.unitdatal = _this.unitdatal.concat(data.data.courses.dataList);
                            };
                        };

                        setTimeout(function(){
                            setheight();
                        },0);
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },

        //筛选
        setsort: function(id,typenum){
            this.curpage = 1;
            this.sorttype = typenum;
            this.loading = true;
            if(this.detailstype == 1){
                this.getTeachersdetails(id);
            }else if(this.detailstype == 2){
                this.getunitdetails(id, this.num);
            };
        },
        setreset: function(){
            this.stage = '';
            this.grade = '';
            this.subject = '';
            this.price_small = '';
            this.price_large = '';
            this.sorttype = 2;
            this.type = 2;
            this.keyword = '';
        },
        getdirect: function(id){
            var _this = this;
            var url = urlapi+"/datatypeDataRelate/getDatatypeDataRelate.rest";
            var params = {};
            if(id){
                params = {"parentid": id};
            }else{
                params = {"root": "K12基础教育"};
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        switch (_this.type){
                            case 2:
                                _this.stagearr = data.data;
                                _this.settype(3,data.data[0].id);
                                break;
                            case 3:
                                _this.gradearr = data.data;
                                _this.settype(4,data.data[0].id);
                                break;
                            case 4:
                                _this.subjectarr = data.data;
                                _this.settype(5,data.data[0].id);
                                break;
                            default:
                                break;
                        };
                    }else{
                        mall.layout.alert('提示',data.errorMessage);
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        settype: function(typenum, id){
            this.type = typenum;
            if(id){
                this.id = id;
            };
            this.curpage = 1;
            this.getdirect(this.id);
        },
        getgoodsdetail: function(goodsid){
            goodsdetailvue.tabshow = 1;
            var url = urlapi + '/goods/getGoodsDetail.rest';
            var params = {
                userId: userId,
                goodsId: goodsid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        goodsdetailvue.loading = false;
                        goodsdetailvue.goodsid = goodsid;
                        goodsdetailvue.courseid = data.data.goods.courseid;
                        goodsdetailvue.goodsdetailjson = data.data;
                        goodsdetailvue.isbuy = data.data.isBuy;
                        goodsdetailvue.getcommentjson();
                    };
                },
                error: function(data){
                    mall.layout.alert('提示','接口error');
                }
            });
        },
        getunitfilter: function(){
            this.curpage = 1;
            var _this = this;
            var input1 = $('.filterunit .check').find('.rmb').eq(0);
            var input2 = $('.filterunit .check').find('.rmb').eq(1);
            if (input1.val() == '' && input2.val() == '') {
                _this.price_small = '';
                _this.price_large = '';
            }else{
                var val1 = parseInt(input1.val()) || 0;
                var val2 = parseInt(input2.val()) || 0;
                if(val1 < val2){
                    input1.val(val1);
                    input2.val(val2);
                }else{
                    input1.val(val2);
                    input2.val(val1);
                };
                _this.price_small = input1.val();
                _this.price_large = input2.val();
            };
            var ofilterarr = $('.filterunit .oselect').children('.directfilter');
            for(var i=0; i<ofilterarr.length; i++){
                if(ofilterarr.eq(i).find('a.active').attr('data-intid')){
                    switch (i){
                        case 0:
                            _this.stage = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        case 1:
                            _this.grade = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        case 2:
                            _this.subject = ofilterarr.eq(i).find('a.active').attr('data-intid');
                            break;
                        default:
                            break;
                    };
                }else{
                    switch (i){
                        case 0:
                            _this.stage = '';
                            break;
                        case 1:
                            _this.grade = '';
                            break;
                        case 2:
                            _this.subject = '';
                            break;
                        default:
                            break;
                    };
                };
            };
            _this.getunitdetails();
            closeoselect();
        },
        getteacherfilter: function(){
            this.curpage = 1;
            var _this = this;
            var input1 = $('.filterteacher .check').find('.rmb').eq(0);
            var input2 = $('.filterteacher .check').find('.rmb').eq(1);
            if (input1.val() == '' && input2.val() == '') {
                _this.price_small = '';
                _this.price_large = '';
            }else{
                var val1 = parseInt(input1.val()) || 0;
                var val2 = parseInt(input2.val()) || 0;
                if(val1 < val2){
                    input1.val(val1);
                    input2.val(val2);
                }else{
                    input1.val(val2);
                    input2.val(val1);
                };
                _this.price_small = input1.val();
                _this.price_large = input2.val();
            };
            _this.getTeachersdetails();
            closeoselect();
        }
    }
});
