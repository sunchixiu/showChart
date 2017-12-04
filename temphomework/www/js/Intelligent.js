//全局变量
var datajson;
function getdata(subjectid,zjtype){
    var subjectid = parseInt(subjectid);
    var chaptertype = zjtype;		//1:章节，2:知识点
    var allgradejson = {};
    allgradejson.chaptertype = chaptertype;
    allgradejson.chapterlist = [];
    var primaryschool = {};
    var middleschool = {};
    var highschool = {};

    //小学
    primaryschool.sectionid = 17;
    primaryschool.gradelist = [];
    for(var i=0; i<6; i++){
        var json = {};
        json.gradeid = (i+1);
        json.subjectlist = [{"subjectid": subjectid}];
        primaryschool.gradelist.push(json);
    };

    //初中
    middleschool.sectionid = 31;
    middleschool.gradelist = [];
    for(var i=0; i<3; i++){
        var json = {};
        json.gradeid = (i+6+1);
        json.subjectlist = [{"subjectid": subjectid}];
        middleschool.gradelist.push(json);
    };

    //高中
    highschool.sectionid = 72;
    highschool.gradelist = [];
    for(var i=0; i<1; i++){
        var json = {};
        json.gradeid = (i+9+1);
        json.subjectlist = [{"subjectid": subjectid}];
        highschool.gradelist.push(json);
    };

    allgradejson.chapterlist.push(primaryschool);
    allgradejson.chapterlist.push(middleschool);
    allgradejson.chapterlist.push(highschool);
    $.ajax({
        url: resourceurl + '/common/assmbly_rolequerychapter',
        data: JSON.stringify(allgradejson),
        type: 'post',
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(data.code){
                datajson = data.data;
                if(chaptertype == '1'){
                    getgrade(datajson);
                }else if(chaptertype == '2'){
                    getknowladgepoint(datajson);
                };
            }else{
                alert('目录：'+data.errorMessage);
            };
        }
    });
};

//按章节开始
function getgrade(dataarr){
    $('#gradeid').html('');
    var lihtml = '';
    for(var i=0; i<dataarr.length; i++){
        //$('.menu2-left').append('<p>'+dataarr[i].nodename+'</p>');
        if(dataarr[i].children.length > 0){
            for(var j=0; j<dataarr[i].children.length; j++){
                if(dataarr[i].children[j].intid == gradenum){
                    var tempjson = dataarr[i].children[j].children;
                    getsubject(tempjson);
                    $('#memu-class label').html(dataarr[i].children[j].nodename);
                };
                lihtml += '<li data-intid="'+dataarr[i].children[j].intid+'">'+dataarr[i].children[j].nodename+'</li>';
            };
        };
    };
    $('#gradeid').append(lihtml);

    $('#gradeid').find('li').bind('click',function(){
        $('#memu-class label').html($(this).html());
        for(var i = 0; i<dataarr.length; i++){
            for(var j=0; j<dataarr[i].children.length; j++){
                if (dataarr[i].children[j].intid == $(this).attr("data-intid")){
                    var tempjson = dataarr[i].children[j].children;
                    getsubject(tempjson);
                };
            };
        };
    });
};

function getsubject(dataarr){
    if(dataarr == ''){
        examengine.layout.alert('提示','请先添加任教信息！');
        $('.yiji').html('');
        return false;
    };
    $('#subjectid').html('');
    for(var i=0; i<dataarr.length; i++){
        if(dataarr[i].children.length > 0){
            if(dataarr[i].intid == subjectid){
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
        getupdown(nodeid,'1');
    });
    $('#versionid').find('li').eq(0).click();
};

function getupdown(nodeid,zjtype){
    var nodetype = zjtype;
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
        $('.yiji').html('<span class="loadding"></span>');
        var lihtml = '';
        for(var i=0; i<dataarr.length; i++){
            lihtml += '<li><a href="#" class="inactive" data-childs="'+dataarr[i].haschild+'" data-nodeid="'+dataarr[i].nodeid+'">'+dataarr[i].nodename+'</a><ul></ul></li>';
        };
        $('.yiji').html(lihtml);
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
                            lihtml += '<li class="three"><a class="pitch" href="#" data-nodeid="'+json[i].nodeid+'">'+json[i].nodename+'</a></li>';
                        }else{
                            lihtml += '<li><a class="inactive" href="#" data-nodeid="'+json[i].nodeid+'">'+json[i].nodename+'</a><ul></ul></li>';
                        };
                    };
                    $('a[data-nodeid="'+nodeid+'"]').next('ul').html(lihtml);
                };
                if($('.pitch-on').length == 0){
                    $('.type-quantity').find('ul').html('');
                };
            }
        });
    };
};
//按章节结束

//按知识点开始
function getknowladgepoint(dataarr){
    var sectionid = 0;
    if(gradenum >= 1 && gradenum <= 6){
        sectionid = 17;
    }else if(gradenum >= 7 && gradenum <= 9){
        sectionid = 31;
    }else{
        sectionid = 72;
    };
    for(var i=0; i<dataarr.length; i++){
        if(sectionid == parseInt(dataarr[i].intid)){
            var nodeid = dataarr[i].children[0].nodeid;
            getupdown(nodeid,'1');
        };
    };
};
//按知识点结束

$(document).delegate('.yiji li a.inactive','click',function(){
    var nodeid = $(this).attr('data-nodeid');
    var nodetype = '1';
    getpoint(nodeid, nodetype);
});
$(document).delegate('.yiji li.three a','click',function(){
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
                var _arrjson = ["选择", "单选", "单项选择", "多选", "多项选择", "不定项选择", "判断题","填空"];
                var _tempdata = [];
                $.each(_arrjson, function (i, item) {
                    $.each(data.data, function (s, subject) {
                        if (subject.qtypename.indexOf(item) >= 0) {
                            _tempdata.push(subject);
                        }
                    });
                });
                $.each(data.data, function (i, subject) {
                    var _isexister = false;
                    $.each(_tempdata, function (s, tsubject) {
                        if (tsubject.qtypeid == subject.qtypeid) {
                            subject.selectcount = 2;
                            _isexister = true;
                        }
                    });
                    if (_isexister==false){
                        subject.selectcount = 0;
                        _tempdata.push(subject);
                    };
                });

                $('.type-quantity').find('ul').html('');
                var jsondata = data.data;
                var testtype = '';
                for(var i=0; i<_tempdata.length; i++){
                    if(_tempdata[i].selectcount > 0){
                        _tempdata[i].selectcount = 2;
                        if(_tempdata[i].qcount < _tempdata[i].selectcount){
                            _tempdata[i].selectcount = _tempdata[i].qcount;
                        };
                    };
                    var minquestion =  _tempdata[i].selectcount;
                    var questiontype = '';
                    if(minquestion>0){
                        if ( _tempdata[i].qcount < minquestion)
                            minquestion =  _tempdata[i].qcount;
                    }else{
                        questiontype = 'subjective';
                    }
                    testtype += '<li data-type="'+questiontype+'">' +
                    '<label data-id="'+_tempdata[i].qtypeid+'" data-minquestion="'+minquestion+'">'+_tempdata[i].qtypename+'</label>' +
                    '<span class="subtract">-</span>' +
                    '<font>'+_tempdata[i].selectcount+'</font>' +
                    '<span class="plus" data-maxnum="'+_tempdata[i].qcount+'">+</span>' +
                    '</li>';
                };
                //testtype = "<li style='margin-left: 20px;' class='selecttype'><label><input type='checkbox' id='chkkeguan' checked='checked' value='1'/>只选客观题</label></li>"+testtype;
                $('.type-quantity').find('ul').html(testtype);
                var linum = $('.type-quantity').find('li').length;
                if(linum > 3){
                    $('.type-quantity p a').show();
                }else{
                    $('.type-quantity p a').hide();
                    $('.type-quantity').removeClass('regain');
                };
                $('.type-quantity li.selecttype').find('input').bind('change',function(){
                    var _this = $(this);
                    if($(this).is(':checked')){
                        var selecttype = false;
                        $('.type-quantity li[data-type="subjective"]').each(function(){
                            if($(this).find('font').html() != '0'){
                                selecttype = true;
                            };
                        });
                        if(selecttype){
                            _this.prop('checked',false);
                            examengine.layout.confirm('提示','你已选择主观题题型，确定仅选择客观题题型吗？',function(){
                                _this.prop('checked',true);
                                $('.type-quantity li[data-type="subjective"]').find('font').html(0);
                                examengine.layout.close();
                            });
                        };
                    };
                });
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
        examengine.layout.alert("提示","没有选择章节！");
        return;
    };
    $(".type-quantity").find("li").each(function () {
        //题型设置为0，不出题
		if ($(this).find("font").length==1)
		{
		
		   if ($(this).find("font").html() != "0") {
				if (model != "") {
					model = model + ",";
				};
				model = model + "{\"QuestionType\":\"" + $(this).find('label').attr("data-id") + "\",\"QuestionCount\":" + $(this).find("font").html() + ",\"SubQuestionCount\":0,\"PointIDs\": []}";
			};
		}
    });
    if (model=="") {
        examengine.layout.alert("提示", "没有选择题型！");
        return;
    }
    var _chapters=ids.join(",").replace(/,/g, "\",\"");
    var _points="";
	var _isObjective=2;
		//if($("#chkkeguan").is(":checked"))
		//{
		//    _isObjective=1;
		//}
    var examjson = "\"Title\":\"" + $("#testName").val() + "\",\"CourseID\":\"" + subjectid + "\","+
		"\"IsObjective\":"+_isObjective+",\"Chapters\": [\"" + _chapters + "\"], \"PointIDs\": [],\"ExamModelQuestions\": [" + model + "]";
     // alert(examjson);
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
                    turnThirdpage();  //组卷成功，跳转页面
                    setClick("保存","试卷预览");
                }
                else {
                    ischool.layout.error(json.Message);
                    $("#PaperLoadLayout").hide();
                    $("#PaperLoadLayoutContainer").hide();
                }
            }
        }, error: function () {
            ischool.layout.error("服务器异常");
            $("#PaperLoadLayout").hide();
            $("#PaperLoadLayoutContainer").hide();
        }
    });
}
