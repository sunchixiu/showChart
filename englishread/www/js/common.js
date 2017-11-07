/**
 * Created by Wilson on 2017/10/17.
 */
document.addEventListener('touchstart', function(){});
document.documentElement.style.fontSize=document.documentElement.clientWidth/36+'px';

var indexvue = new Vue({
    el: '#home',
    data: {
        nodata: false,
        usertype: usertype,
        teacherid: '',
        bookarr: [],
        unitarr: [],
        classhourdata: {},
        activebook: 0
    },
    created: function(){
        this.getunitdata();
    },
    methods: {
        getunitdata: function(){
            var _this = this;
            if(_this.usertype == 'teacher'){
                _this.teacherid = userId;
                var params = {
                    "teacherid": _this.teacherid
                };
                var url = urlapi+"/TSB_ISCHOOL_LCS_SERVER/tchmyroom/getgradecourseunitlist";
            }else if(_this.usertype == 'student'){
                var params = {
                    "studentid": userId
                };
                var url = urlapi+"/TSB_ISCHOOL_LCS_SERVER/stumyroom/getgradecourseunitlist";
            };

            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data.code == 1){
                        _this.bookarr = [];
                        if(_this.usertype == 'teacher'){
                            for(var i=0; i<data.data.courselist.length; i++){
                                if(data.data.courselist[i].subjectid == "19"){
                                    _this.bookarr.push(data.data.courselist[i]);
                                };
                            };
                        }else if(_this.usertype == 'student'){
                            for(var i=0; i<data.data.subjectlist.length; i++){
                                if(data.data.subjectlist[i].subjectid == "19"){
                                    if(_this.usertype == 'student'){
                                        _this.teacherid = data.data.subjectlist[i].teacherid;
                                    };
                                    _this.bookarr.push(data.data.subjectlist[i]);
                                };
                            };
                        };
                        if(_this.bookarr.length == 0){
                            _this.nodata = true;
                            return;
                        };

                        //初始化书本
                        var mySwiper = new Swiper('.swiper-container',{
                            pagination: '.pagination',
                            grabCursor: true,
                            paginationClickable: true,
                            onSlideChangeEnd: function(){
                                if(_this.activebook != mySwiper.activeIndex){
                                    _this.activebook = mySwiper.activeIndex;
                                    _this.unitarr = _this.bookarr[_this.activebook].unitlist;
                                };
                            }
                        });
                        _this.activebook = mySwiper.activeIndex;
                        _this.unitarr = _this.bookarr[_this.activebook].unitlist;
                    };
                },
                error: function(data){
                    alert('接口error');
                }
            });
        },
        getteaclasshourdata: function(unitid){
            var _this = this;
            var url = urlapi+"/TSB_ISCHOOL_LCS_SERVER/tchmyroom/getunitpointlist";
            var params = {
                "teacherid": _this.teacherid,
                "gradenum": _this.bookarr[_this.activebook].gradenum,
                "gradename": _this.bookarr[_this.activebook].gradename,
                "classid": _this.bookarr[_this.activebook].classid,
                "subjectid": _this.bookarr[_this.activebook].subjectid,
                "termtype": _this.bookarr[_this.activebook].termtype,
                "versionid": _this.bookarr[_this.activebook].versionid,
                "unitid": unitid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.classhourarr = [];
                    if(data.code == 1){
                        var json = {};
                        json[unitid] = data.data;
                        _this.classhourdata = json;
                    };
                },
                error: function(data){
                    alert('接口error');
                }
            });
        },
        getstuclasshourdata: function(unitid){
            var _this = this;
            var url = urlapi+"/TSB_ISCHOOL_LCS_SERVER/stumyroom/getunitpointlist";
            var params = {
                "studentid": userId,
                "teacherid": _this.teacherid,
                "gradename": _this.bookarr[_this.activebook].gradename,
                "subjectid": _this.bookarr[_this.activebook].subjectid,
                "termtype": _this.bookarr[_this.activebook].termtype,
                "versionid": _this.bookarr[_this.activebook].versionid,
                "unitid": unitid
            };
            $.ajax({
                url: url,
                data: JSON.stringify(params),
                type:'post',
                dataType:'json',
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    _this.classhourarr = [];
                    var pointdata = data.data.unitcourselist;
                    if(data.code == 1){
                        var json = {};

                        var urlsecond = eurl+"/services/studyroomList.ashx";
                        var eparams = {
                            "userid": userId,
                            "gradeid": _this.bookarr[_this.activebook].gradenum,
                            "termid": _this.bookarr[_this.activebook].termtype,
                            "versionID": _this.bookarr[_this.activebook].versionid,
                            "uniteID": unitid,
                            "type": _this.usertype,
                            "IINum": IINum
                        };
                        $.ajax({
                            url: urlsecond,
                            data: JSON.stringify(eparams),
                            type:'post',
                            dataType:'json',
                            contentType: "application/json; charset=utf-8",
                            success: function(jsonarr){
                                for(var obj in jsonarr){
                                    for(var j=0; j<pointdata.length; j++){
                                        if(pointdata[j].pointid == obj){
                                            pointdata[j].linktype = true;
                                        };
                                    };
                                };
                                json[unitid] = pointdata;
                                _this.classhourdata = json;
                                console.log(JSON.stringify(json));
                            },
                            error: function(data){
                                for(var i=0; i<pointdata.length; i++){
                                    pointdata[i].linktype = false;
                                    json[unitid] = pointdata;
                                    _this.classhourdata = json;
                                };

                            }
                        });
                    };
                },
                error: function(data){
                    alert('接口error');
                }
            });
        },
        getewordtext: function(unitid, pointid, title, type){
            if(type){
                window.location.href = '#&section';
                setTitle(title);
                detailvue.nodata = false;
                detailvue.wordloading = true;
                detailvue.textloading = true;
                setTimeout(function(){
                    detailvue.getworddata(unitid, pointid);
                    detailvue.gettextdata(unitid, pointid);
                },300);
            }else{
                window.location.href = '#&section';
                setTitle(title);
                detailvue.nodata = true;
                //return;
            };
        }
    }
});

var detailvue = new Vue({
    el: '#section',
    data: {
        nodata: false,
        wordloading: true,
        textloading: true,
        wordarr: [],
        textarr: [],
        wordjson: null,
        textjson: null
    },
    methods: {
        getworddata: function(unitid, pointid){
            var _this = this;
            var url = eurl+"/api/Word.ashx";
            console.log(indexvue.bookarr[indexvue.activebook].termtype);
            var params = {
                "IINum": IINum,
                "userid": userId,
                "gradeid": indexvue.bookarr[indexvue.activebook].gradenum,
                "classid": indexvue.bookarr[indexvue.activebook].classid,
                "termid": indexvue.bookarr[indexvue.activebook].termtype,
                "versionid": indexvue.bookarr[indexvue.activebook].versionid,
                "unitid": unitid,
                "pointid": pointid
            };
            $.ajax({
                url: url,
                data: params,
                type:'post',
                dataType:'json',
                success: function(data){
                    _this.wordloading = false;
                    _this.wordarr = data;
                    _this.wordjson = data;
                },
                error: function(data){
                    _this.wordloading = false;
                    _this.wordarr = [];
                    //alert('接口error');
                }
            });
        },
        gettextdata: function(unitid, pointid){
            var _this = this;
            var url = eurl+"/api/Text.ashx";
            var params = {
                "IINum": IINum,
                "userid": userId,
                "gradeid": indexvue.bookarr[indexvue.activebook].gradenum,
                "classid": indexvue.bookarr[indexvue.activebook].classid,
                "termid": indexvue.bookarr[indexvue.activebook].termtype,
                "versionid": indexvue.bookarr[indexvue.activebook].versionid,
                "unitid": unitid,
                "pointid": pointid
            };
            $.ajax({
                url: url,
                data: params,
                type:'post',
                dataType:'json',
                success: function(data){
                    _this.textloading = false;
                    _this.textarr = data.List;
                    _this.textjson = data;
                },
                error: function(data){
                    _this.wordloading = false;
                    _this.textarr = [];
                    //alert('接口error');
                }
            });
        }
    }
});

$(function () {
    $("#jplayMP3").jPlayer({
        wmode: "window",
        supplied: "mp3",
        preload: "none"
    });
    var duration = 1000;

});

var timer = null;
var goonindex = 0;
var _minglobalstatus = 0;
var deviceheight = document.documentElement.clientHeight;
var bottomheight = $('.bottom').outerHeight();
var viewheight = deviceheight - bottomheight;
//var liheight = (document.documentElement.clientWidth/36) * 5;
function wordplay(guid, isplaylist) {
    if(_minglobalstatus == 1){
        return;
    };
    var liheight = $("#"+guid).outerHeight();
    if($("#"+guid).offset().top + liheight > viewheight){
        var disy = $("#"+guid).offset().top + liheight - viewheight + 10;
        $('#section').animate({scrollTop:($('#section').scrollTop() + disy)+'px'}, 300);
    }else if($("#"+guid).offset().top < 0){
        var litop = $("#"+guid).offset().top;
        var divtop = $('#section>div').offset().top;
        var disy = divtop - litop;
        $('#section').animate({scrollTop:(-disy)+'px'}, 300);
    };
    if(typeof guid == 'undefined' || guid == 0){
        guid = $('.readlist').eq(0).attr('id');
    };
    $("#"+guid).addClass("active");
    var speed = $("#"+guid).attr("data-speed");
    var voicename = $("#"+guid).attr("data-voice");
    var type = $("#"+guid).attr("data-type");

    if(type == 'word'){
        var url = eurl+"/services/audio.ashx?type=dict&lang=Eric&guid=" + guid + "&speed=0&pitch=0";
    }else{
        var url = eurl+"/services/audio.ashx?type=teacher&lang="+voicename+"&guid=" + guid + "&speed="+speed+"&pitch=0";
    };
    _minglobalstatus = 1;
    $("#jplayMP3").bind($.jPlayer.event.ended, function (event) {
        wordplayclear();

        if(isplaylist)
        {
            $('.readlist').removeAttr('onclick');
            var index = $('#'+guid).index('.readlist');
            if($(".readlist").length-1 == index)
            {
                $('.readlist').attr("onclick","wordplay($(this).attr('id'))");
                $(".bottom a").removeClass("current");
                goonindex = 0;
                _minglobalstatus = 0;
            }
            else
            {
                _minglobalstatus = 0;
                goonindex = index + 1;
                guid = $(".readlist").eq(goonindex).attr("id");
                clearTimeout(timer);
                timer = setTimeout("wordplay('"+guid+"',true)",1000);
            }
        }
        else
        {
            _minglobalstatus = 0;
        }
    });
    $("#jplayMP3").jPlayer("setMedia", { mp3: url }).jPlayer("play");
};

function wordplayclear()
{
    $("#jplayMP3").jPlayer("clearMedia");
    $("#jplayMP3").jPlayer("stop");
    clearTimeout(timer);
    $("#jplayMP3").unbind($.jPlayer.event.ended);
    $(".active").each(function () {
        $(this).removeClass("active");
    });
};
function closeplay(){
    wordplayclear();
    $("#jplayMP3").unbind($.jPlayer.event.ended);
    if(!$('.readlist').eq(0).attr('onclick')){
        $('.readlist').attr("onclick","wordplay($(this).attr('id'))");
    };
    $(".current").removeClass("current");
};
document.addEventListener("backbutton", gohtmlback, false);
function gohtmlback(){
    if($('.in').attr('id') == 'section'){
        closeplay();
        window.history.go(-1);
        setTitle('英语点读');
    }else{
        destroyenglish(1);
    };
    _minglobalstatus = 0;
    goonindex = 0;
};