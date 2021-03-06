//全局变量
var datajson;
function getdata(data){
    var chaptertype = "1";		//1:章节，2:知识点
    $.ajax({
        url: cloudurl + '/newjspui/common/assmbly_rolequerychapter',
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
            $('.menu2-left').html('');
            $('.menu2-right').html('');
            $('.menu2-left').append('<p'+classname+'>'+dataarr[i].nodename+'</p>');
            if(dataarr[i].children.length > 0){
                var ulhtml = '<ul class="rightul"'+blockstatus+'></ul>';
                var lihtml = '';
                for(var j=0; j<dataarr[i].children.length; j++){
                    lihtml += '<li data-nodeid="'+dataarr[i].children[j].nodeid+'">'+dataarr[i].children[j].nodename+'</li>';
                };
                $('.menu2-right').append(ulhtml);
                $('.menu2-right ul').append(lihtml);
            };
        };
        $('.menu2-right').find('li').bind('click',function(){
            $('#memu-class label').html($(this).html());
            var tempjson = [];
            for(var i = 0; i<dataarr.length; i++){
                for(var j=0; j<dataarr[i].children.length; j++){
                    if (dataarr[i].children[j].nodeid == $(this).attr("data-nodeid")){
                        tempjson = dataarr[i].children[j].children;
                        getsubject(tempjson);
                    };
                };
            };
        });
        $('.menu2-right ul').find('li').eq(0).click();
    };

function getsubject(dataarr){
    $('#subjectid').html('');
    for(var i=0; i<dataarr.length; i++){
        if(dataarr[i].children.length > 0){
            if(dataarr[i].nodeid == subjectid){
                var tempjson = dataarr[i].children;
                getvertion(tempjson);
            };
        };
    };
};

function getvertion(dataarr){
    $('#versionid').html('');
    var lihtml = '';
    for(var i=0; i<dataarr.length; i++){
        if(dataarr[i].children.length > 0){
            for(var j=0; j<dataarr[i].children.length; j++){
                lihtml += '<li data-nodeid="'+dataarr[i].children[j].nodeid+'">'+(dataarr[i].nodename+dataarr[i].children[j].nodename)+'</li>';
            };
        };
    };
    $('#versionid').append(lihtml);
    $('#versionid').find('li').bind('click',function(){
        $('#memu-edition label').html($(this).html());
        var tempjson = [];
        var nodeid = $(this).attr("data-nodeid");
        getupdown(nodeid);
    });
    $('#versionid').find('li').eq(0).click();
};

function getupdown(nodeid){
    var nodetype = '1';
    $.ajax({
        url: cloudurl + '/newjspui/common/assmbly_chapterquery',
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
            url: cloudurl + '/newjspui/common/assmbly_chapterquery',
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
            }
        });
    };
};

function gettesttype(pointarr){
    $.ajax({
        url: cloudurl + '/newjspui/common/assmbly_qtypelistC',
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
    var examjson = "\"Title\":\"" + $("#testName").val() + "\",\"CourseID\":\"" + subjectid + "\",\"Chapters\": [\"" + _chapters + "\"], \"PointIDs\": [],\"ExamModelQuestions\": [" + model + "]";

    TestPaper.intelligent(eval("({" + examjson + "})"));
};