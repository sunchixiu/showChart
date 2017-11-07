//全局变量
var datajson;
function getdata(data){
    var chaptertype = "1";		//1:章节，2:知识点
    $.ajax({
        url: resourceurl + '/common/assmbly_rolequerychapter',
        data: JSON.stringify({
            "chaptertype":chaptertype,
            "chapterlist":data
        }),
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(data.code){
                datajson = data.data;
                getgrade(datajson);
            }else{
                alert('目录：'+data.errorMessage);
            };
        }
    });
};

function getgrade(dataarr){
    for(var i=0; i<dataarr.length; i++){
        if(i == 0){
            classname = ' class="current"';
            blockstatus = ' style="display:block"';
        };
        $('#gradeid').html('');
        $('.menu2-left').append('<p'+classname+'>'+dataarr[i].nodename+'</p>');
        if(dataarr[i].children.length > 0){
            var lihtml = '';
            for(var j=0; j<dataarr[i].children.length; j++){
                lihtml += '<li data-nodeid="'+dataarr[i].children[j].nodeid+'" data-intid="'+dataarr[i].children[j].intid+'">'+dataarr[i].children[j].nodename+'</li>';
            };
            $('#gradeid').append(lihtml);
        };
    };
    $('#gradeid').find('li').bind('click',function(){
        $('#memu-class label').html($(this).html());
        var tempjson = [];
        for(var i = 0; i<dataarr.length; i++){
            for(var j=0; j<dataarr[i].children.length; j++){
                if (dataarr[i].children[j].nodeid == $(this).attr("data-nodeid")){
                    tempjson = dataarr[i].children[j].children;
                    gradeid = $(this).attr("data-intid");
                    getsubject(tempjson);
                };
            };
        };
    });
    $('#gradeid').find('li').eq(0).click();
};

function getsubject(dataarr){
    $('#subjectid').html('');
    var lihtml = '';
    for(var i=0; i<dataarr.length; i++){
        lihtml += '<li data-nodeid="'+dataarr[i].nodeid+'" data-intid="'+dataarr[i].intid+'">'+dataarr[i].nodename+'</li>';
    };
    $('#subjectid').append(lihtml);
    $('#subjectid').find('li').bind('click',function(){
        $('#memu-subject label').html($(this).html());
        var tempjson = [];
        for(var i = 0; i<dataarr.length; i++){
            if (dataarr[i].nodeid == $(this).attr("data-nodeid")){
                tempjson = dataarr[i].children;
                getvertion(tempjson);
                subjectid = $(this).attr("data-intid");
            };
        };
    });
    $('#subjectid').find('li').eq(0).click();
};

function getvertion(dataarr){
    $('#versionid').html('');
    var lihtml = '';
    for(var i=0; i<dataarr.length; i++){
        if(dataarr[i].children.length > 0){
            for(var j=0; j<dataarr[i].children.length; j++){
                lihtml += '<li data-nodeid="'+dataarr[i].children[j].nodeid+'" data-intid="'+dataarr[i].children[j].intid+'">'+(dataarr[i].nodename+dataarr[i].children[j].nodename)+'</li>';
            };
        };
    };
    $('#versionid').append(lihtml);
    $('#versionid').find('li').bind('click',function(){
        $('#memu-edition label').html($(this).html());
        var tempjson = [];
        var nodeid = $(this).attr("data-nodeid");
        vertionid = $(this).attr("data-intid");
        getupdown(nodeid);
    });
    $('#versionid').find('li').eq(0).click();
};

function getupdown(nodeid){
    var nodetype = '1';
    $.ajax({
        url: resourceurl + '/common/assmbly_chapterquery',
        data: JSON.stringify({
            "nodetype": nodetype,
            "nodeid": nodeid
        }),
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(data.code){
                var json = data.data;
                getunit(json);
            };
        }
    })
};

function getunit(dataarr){
    if(dataarr.length > 0){
        $('.yiji').html('');
        var lihtml = '';
        for(var i=0; i<dataarr.length; i++){
            lihtml += '<li><a href="#" class="inactive" data-childs="'+dataarr[i].haschild+'" data-nodeid="'+dataarr[i].nodeid+'">'+dataarr[i].nodename+'</a><ul></ul></li>';
        };
        $('.yiji').html(lihtml);
        $('.yiji li a').bind('click',function(){
            var nodeid = $(this).attr('data-nodeid');
            var nodetype = '1';
            getpoint(nodeid, nodetype);
        });
        $('.yiji li a').eq(0).click();
    };
};

function getpoint(nodeid, nodetype){
    if(!$('a[data-nodeid="'+nodeid+'"]').next('ul').html()){
        var lihtml = '';
        $.ajax({
            url: resourceurl + '/common/assmbly_chapterquery',
            data: JSON.stringify({
                "nodetype": nodetype,
                "nodeid": nodeid
            }),
            type: 'post',
            contentType: "application/json; charset=utf-8",
            success: function(data){
                if(data.code){
                    var json = data.data;
                    for(var i=0; i<json.length; i++){
                        if(json[i].haschild == 0){
                            lihtml += '<li class="three"><a class="pitch" href="#" data-nodeid="'+json[i].nodeid+'"><i></i>'+json[i].nodename+'</a></li>';
                        }else{
                            lihtml += '<li><a class="inactive" href="#" data-nodeid="'+json[i].nodeid+'"><i></i>'+json[i].nodename+'</a></li>';
                        };
                    };
                    $('a[data-nodeid="'+nodeid+'"]').next('ul').html(lihtml);
                    $('.yiji li a.inactive').bind('click',function(){
                        var nodeid = $(this).attr('data-nodeid');
                        var nodetype = '1';
                        getpoint(nodeid, nodetype);
                    });
                    $('.yiji li.three a').bind('click',function(){
                        setTimeout(function(){
                            var pointarr = [];
                            for(var i=0; i<$('.yiji').find('a.pitch-on').length; i++){
                                pointarr.push($('.yiji').find('a.pitch-on').eq(i).attr('data-nodeid'));
                            };
                            if(pointarr.length > 0){
                                gettesttype(pointarr);
                            };
                        },0);
                    });
                };
                if($('.pitch-on').length == 0){
                    $('.type-quantity').find('ul').html('');
                };
            }
        });
    };
};

function gettesttype(pointarr){
    $.ajax({
        url: resourceurl + '/common/assmbly_qtypelistC',
        data: JSON.stringify({
            "chapterid": pointarr
        }),
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(data.code){
                $('.type-quantity').find('ul').html('');
                var jsondata = data.data;
                var testtype = '';
                for(var i=0; i<jsondata.length; i++){
                    var testnum = 2;
                    if(jsondata[i].qcount < testnum){
                        testnum = jsondata[i].qcount;
                    };
                    testtype += '<li>' +
                    '<label data-id="'+jsondata[i].qtypeid+'">'+jsondata[i].qtypename+'</label>' +
                    '<span class="subtract">-</span>' +
                    '<font>'+testnum+'</font>' +
                    '<span class="plus" data-maxnum="'+jsondata[i].qcount+'">+</span>' +
                    '</li>';
                };
                $('.type-quantity').find('ul').html(testtype);
                var linum = $('.type-quantity').find('li').length;
                if(linum > 3){
                    $('.type-quantity p a').show();
                }else{
                    $('.type-quantity p a').hide();
                    $('.type-quantity').removeClass('regain');
                };
            };
        }
    });
};

function getexampaper(){
    var ids = [];
    for(var i=0; i<$('.yiji').find('a.pitch-on').length; i++){
        ids.push($('.yiji').find('a.pitch-on').eq(i).attr('data-nodeid'));
    };
    var model = "";
    if (ids.length == 0) {
        alert("没有选择章节！");
        return;
    }
    $("#questiontype").find("li").each(function () {
        //题型设置为0，不出题
        if ($(this).find("font").html() != "0") {
            if (model != "") {
                model = model + ",";
            };
            model = model + "{\"QuestionType\":\"" + $(this).find('label').attr("data-id") + "\",\"QuestionCount\":" + $(this).find("font").html() + ",\"SubQuestionCount\":0,\"PointIDs\": []}";
        };
    });
    if (model=="") {
        alert("没有选择题型！");
        return;
    }
    var _chapters=ids.join(",").replace(/,/g, "\",\"");
    var _points="";

    var examdate = new Date();
    var testyear = examdate.getFullYear().toString();
    var testmonth = (examdate.getMonth()+1) < 10 ? "0" + (examdate.getMonth()+1) : (examdate.getMonth()+1).toString();
    var testdate = examdate.getDate() < 10 ? "0" + examdate.getDate() : examdate.getDate().toString();

    titleparam = testyear + '年' + testmonth + '月' + testdate + '日' + $('#memu-subject label').html();
    var testtitle = titleparam + $('#paperType').html();

    var examjson = "\"Title\":\"" + testtitle + "\",\"CourseID\":\"" + subjectid + "\",\"Chapters\": [\"" + _chapters + "\"], \"PointIDs\": [],\"ExamModelQuestions\": [" + model + "]";

    intelligent(eval("({" + examjson + "})"));
};

function intelligent (exammodeljson) {
    var layouthtml = "<div class=\"PaperLoadLayout\" id=\"PaperLoadLayout\"></div>" +
        "<div class=\"PaperLoadLayoutContainer\" id=\"PaperLoadLayoutContainer\">" +
        " <img src=\"images/balls.gif\" style=\" float:left\" />" +
        " <div style=\"margin-top:50px;\" id=\"PaperLoadLayoutContainer_title\">正在智能分析扫描题库中。。。</div>" +
        "</div>";
    $(".paperseting_change").show();
    //TestPaper.exampermodel = exammodeljson;
    if (!document.getElementById("PaperLoadLayout")) {
        $("body").append(layouthtml);
    }

    //sc注释
    //$("#testpaper").show();
    //$('#PaperLoadLayoutContainer_title').html('正在智能分析扫描题库中。。。')

    $("#PaperLoadLayout").show();
    $("#PaperLoadLayoutContainer").show();
    setTimeout("$('#PaperLoadLayoutContainer_title').html('快马加鞭组卷中。。。');setTimeout(\"$('#PaperLoadLayoutContainer_title').html('马上呈现试卷。。。')\", 1200)", 1500)
    $("#PaperLoadLayout").height($(document).height());
    var top = ((
    $(window).height() - $("#PaperLoadLayoutContainer").height()) / 2 + $(document).scrollTop());
    if (top < 0)
        top = 10;
    $("#PaperLoadLayoutContainer").css("top", top + "px");

    $("#PaperLoadLayoutContainer").css("left", ($(document).width() / 2 - $("#PaperLoadLayoutContainer").width() / 2) + "px");

    $.ajax({
        type: "POST",
        url: testurl+"/Home/Interface/ajax_testpaper", data: exammodeljson, dataType: "json",
        success: function (json) {
            if (json == null)
            {
                ischool.layout.error("服务器异常")
                $("#PaperLoadLayout").hide();
                $("#PaperLoadLayoutContainer").hide();
            }
            else
            {
                if (json.Success) {
                    $("#Wrap").hide();
                    $("#PaperLoadLayout").hide();
                    $("#PaperLoadLayoutContainer").hide();
                    examengine.isdisplayanswersheet = false;    //不显示答题卡
                    examengine.ischangequestion = true;         //设置可以换题
                    examengine.init(json.Data);
                    turnSencondpage();  //组卷成功，跳转页面

                    //计算试卷总分;
                    var dataarr = examengine.examjson.examparts[0].examsections;
                    var tempscore = 0;
                    for(var i=0; i<dataarr.length; i++){
                        var questionarr = dataarr[i].questions;
                        for(var j=0; j<questionarr.length; j++){
                            tempscore += parseInt(questionarr[j].score);
                        };
                    };
                    scoresum = tempscore;
                    paperbean = examengine.getexamjson();
                }
                else {
                    ischool.layout.error(json.Message);
                    $("#PaperLoadLayout").hide();
                    $("#PaperLoadLayoutContainer").hide();
                }
            }
        }, error: function () {
            ischool.layout.error("服务器异常")
            $("#PaperLoadLayout").hide();
            $("#PaperLoadLayoutContainer").hide();
        }
    });
};