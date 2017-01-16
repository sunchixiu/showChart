var basicjson = [];
var strdate = new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate()+"日";
function loadbasicinfo() {
    $(".paper_types").find(".select_tag").eq(2).show();
    $(".paper_types").find(".select_tag").eq(4).show();
    $(".paper_types").find(".select_tag").eq(5).show();
    
    if ($("#select_type").find(".active").attr("data-id") == "2") {
        $(".paper_types").find(".select_tag").eq(2).hide();
        $(".paper_types").find(".select_tag").eq(4).hide();
        $(".paper_types").find(".select_tag").eq(5).hide();
    }
    $.ajax({
        url: "/Volume/Setvolume/ajax_dimquery", type: "post", dataType: "json", data: { chaptertype: $("#select_type").find(".active").attr("data-id"),usertype:TestPaper.usertype },
        success: function (json) {
            basicjson = json.data;
            var html = "";
            for (var i = 0; i < basicjson.length; i++) {
                html = html + "<li data-id='" + basicjson[i].nodeid + "' data-numid='" + basicjson[i].intid + "'>" + basicjson[i].nodename + "</li>";
            }
            $("#select_section").html(html);
            $("#select_section").find("li").bind("click", function () {
                $(this).parent().find("li").removeClass("active");
                $(this).addClass("active");
                var _tempjson = [];

                for (var i = 0; i < basicjson.length; i++) {

                    if (basicjson[i].nodeid == $(this).attr("data-id")) {
                        _tempjson = basicjson[i].children;

                    }
                }
                if ($("#select_type").find(".active").attr("data-id") == "2")
                { loadbasicinfo_subject(_tempjson); }
                else
                {
                    loadbasicinfo_grade(_tempjson);
                }
            });
            $("#select_section").find("li").eq(0).click();
        }
    });
}
$("#select_type").find("li").bind("click", function () {
    $(this).parent().find("li").removeClass("active");
    $(this).addClass("active");
    $("#usetagnname").html("已选" + $(this).html().replace("出题",""))
    loadbasicinfo();
    
});
function loadbasicinfo_grade(json) {
    var html = "";

    for (var i = 0; i < json.length; i++) {
        html = html + "<li data-id='" + json[i].nodeid + "' data-numid='" + json[i].intid + "'>" + json[i].nodename + "</li>";
    }
    $("#select_grade").html(html);
    $("#select_grade").find("li").bind("click", function () {
        TestPaper.gradeid = $(this).attr("data-numid");
		examengine.gradeid = $(this).attr("data-numid");
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");
        var _tempjson = [];
        for (var i = 0; i < json.length; i++) {
            if (json[i].nodeid == $(this).attr("data-id"))
            { _tempjson = json[i].children; }
        }
        loadbasicinfo_subject(_tempjson);
    });
    $("#select_grade").find("li").eq(0).click();
}
function loadbasicinfo_subject(json) {
    var html = "";
    for (var i = 0; i < json.length; i++) {
        html = html + "<li data-id='" + json[i].nodeid + "' data-numid='" + json[i].intid + "'>" + json[i].nodename + "</li>";
    }
    
    $("#select_subject").html(html);
    $("#select_subject").find("li").bind("click", function () {
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");
        //TestPaper.subjectid = $(this).attr("data-numid");
        examengine.courseid= $(this).attr("data-numid");
		examengine.coursename= $(this).html();
        $("#testName").val(strdate + $(this).html() + $("input[name='paper_type']").attr("data-name"));
        var _tempjson = [];
        for (var i = 0; i < json.length; i++) {
            if (json[i].nodeid == $(this).attr("data-id"))
            { _tempjson = json[i].children; }
        }
        if ($("#select_type").find(".active").attr("data-id") == "2")
        {
            loadkchapter( $(this).attr("data-id"),0,0);
        }
        else
        {
            loadbasicinfo_version(_tempjson);
        }
        teacherlastclass();
    });
    $("#select_subject").find("li").eq(0).click();
}
function loadbasicinfo_version(json) {
    var html = "";
    for (var i = 0; i < json.length; i++) {
        html = html + "<li data-id='" + json[i].nodeid + "' data-numid='" + json[i].intid + "'>" + json[i].nodename + "</li>";
    }
    $("#select_version").html(html);
    $("#select_version").find("li").bind("click", function () {
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");
        TestPaper.versionid = $("#select_version").find(".active").attr("data-numid");
		examengine.versionid= $("#select_version").find(".active").attr("data-numid");
        var _tempjson = [];
        for (var i = 0; i < json.length; i++) {
            if (json[i].nodeid == $(this).attr("data-id"))
            { _tempjson = json[i].children; }
        }
        $("#questiontype").html("");
        loadbasicinfo_subversion(_tempjson);
    });
    $("#select_version").find("li").eq(0).click();
}
function loadbasicinfo_subversion(json) {
    var html = "";
    for (var i = 0; i < json.length; i++) {
        html = html + "<li data-id='" + json[i].nodeid + "' data-numid='" + json[i].intid + "'>" + json[i].nodename + "</li>";
    }
    $("#select_subversion").html(html);
    $("#select_subversion").find("li").bind("click", function () {
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");
        $("#questiontype").html("");
        loadkchapter($(this).attr("data-id"), 0, 0);
    });
    $("#select_subversion").find("li").eq(0).click();
}
function loadchart(type, nodeid) {
    $("#usetag").html("");
    $.ajax({
        url: "/Volume/Setvolume/ajax_chapterquery",
        type: "post",
        data: { nodetype: 1, nodeid: nodeid },
        dataType: "json",
        success: function (json) {

            var html = "";
            for (var i = 0; i < json.data.length; i++) {
                html = html + "<li data-id='" + json.data[i].nodeid + "'>" + json.data[i].nodename + "</li>";
            }

            $(".chapters").html(html);
            $(".chapters").find("li").unbind();
            $(".chapters").find("li").bind("click", function () {
                $(this).parent().find("li").removeClass("active");
                $(this).addClass("active");
                $.ajax({
                    url: "/Volume/Setvolume/ajax_chapterquery",
                    type: "post",
                    data: { nodetype: 1, nodeid: $(this).attr("data-id") },
                    dataType: "json",
                    success: function (json) {

                        var html = "";
                        for (var i = 0; i < json.data.length; i++) {
                            html = html + "<li data-id='" + json.data[i].nodeid + "' data-parentid='" + $(this).attr("data-id") + "'><input type='checkbox' name='chksection' value='" + json.data[i].nodeid + "'>" + json.data[i].nodename + "</li>";
                        }

                        $(".chapterssection").html(html);
                        $(".chapterssection").find("li").unbind();
                        $(".chapterssection").find("li").bind("click", function () {
                            if ($(this).find("input[type='checkbox']").is(':checked')) {
                                if ($("#usetag").find("[data-id='" + $(this).attr("data-id") + "']").length == 0) {
                                    var objhtml = $("<div>" + $(this).html() + "</div>");
                                    objhtml.find("input").remove();

                                    $("#usetag").append("<li data-id='" + $(this).attr("data-id") + "' data-parentid='" + $(this).attr("data-parentid") + "'><a>" + objhtml.html() + "</a></li>");
                                   

                                }

                            }
                            else {
                                $("#usetag").find("[data-id='" + $(this).attr("data-id") + "']").remove();

                            }
                            $("#usetagcount").html($("#usetag").find("li").length);
                            questiontype();
                        });
                    }
                });
            });
            $(".chapters").find("li").eq(0).click();
        }
    });
}
function loadkchapter(nodeid,index,top)
{
    if (index == 0)
    {
        $("#usetag").html("");
        $("#usetagcount").html("0");
    }
    $.ajax({
        url: "/Volume/Setvolume/ajax_chapterquery",
        type: "post",
        data: { nodetype: 1, nodeid: nodeid },
        dataType: "json",
        success: function (json) {
            var html = "";
            for (var i = 0; i < json.data.length; i++) {
                html = html + "<li data-id='" + json.data[i].nodeid + "' data-parentid='" + nodeid + "' data-index='" + index + "' data-top='" + top + "'>";
                if (index !=0)
                {
                    var check = '';
                    for(var j=0; j<$('#usetag').find('li').length; j++){
                        if($('#usetag').find('li').eq(j).attr('data-id') == json.data[i].nodeid){
                            check = " checked='checked'";
                            break;
                        };
                    };
                    if ($("#select_type").find(".active").attr("data-id") == "1") {
                        html = html + "<input type='checkbox'"+check+" value='" + json.data[i].nodeid + "' class='pointcheck'/>";
                    }
                    else {
                        if (index == 2)
                        {
                            html = html + "<input type='checkbox'"+check+" value='" + json.data[i].nodeid + "' class='pointcheck'/>";
                        }
                    }
                }
                html = html + "  <a href='javascript:void(0)' class='nowrap' title=" + json.data[i].nodename + ">" + json.data[i].nodename + "</a></li>";
            }
            if (index == 0)
                $(".chapterscontainer").html("<ul class='points'>" + html + "</ul>");
            else {
                if (index == 1) {
                    $(".points").eq(2).remove();
                    $(".points").eq(1).remove();
                }
                else {
                    $(".points").eq(2).remove();
                }
                var leng = $(".points").eq(0).find("li").length - $(".points").eq(0).find(".active").index() + 1;
                var ullength = $("<ul>" + html + "</ul>").find("li").length;
                var leftcss = "top:" + top * 31 + "px";
              
                if (ullength > leng)
                {leftcss="bottom:0;"

                }
                $(".chapterscontainer").append("<ul class='points' style=' position:absolute;left:" + ($(".points").length * $(".points").eq(0).width() + 2) + "px;" + leftcss + "'>" + html + "</ul>");
            }
            
        }
    });
}
$(document).ready(function () {
    $(document).on("click", "#usetag>li", function () {

        if ($(this).attr("data-teacherlastclass") == "1") {
            $(".teacherlastclass").remove();
        }
       
        $(this).remove();
        questiontype();
        $("#usetagcount").html($("#usetag").find("li").length);
        $('ul.points').find('li[data-id="' + $(this).attr('data-id') + '"]').eq(0).find('input').eq(0).prop('checked', false);
    })
    $(document).on("click", ".pointcheck", function () {

        var _id = $(this).parent().attr("data-id");
        var _parentid = $(this).parent().attr("data-parentid");
        var _index = $(this).parent().attr("data-index");
        if ($(this).is(':checked')) {
            if ($("#usetag").find("[data-id='" + _id + "']").length == 0) {
                $("#usetag").append("<li data-id='" + _id + "' data-parentid='" + _parentid + "'><a>" + $(this).next().html() + "</a></li>");
            }

        }
        else {
            $("#usetag").find("[data-id='" + _id + "']").remove();
        }
        $("#usetagcount").html($("#usetag").find("li").length);
        questiontype();

    });
    $(document).on("click", ".points>li>a", function () {
        $(this).parent().parent().find("li").removeClass("active");
        $(this).parent().addClass("active");
        var index = parseInt($(this).parent().attr("data-index"), 10);
       
        if (index == 3) {
                   
        }
        else {
            loadkchapter($(this).parent().attr("data-id"), index + 1, $(this).parent().index() + parseInt($(this).parent().attr("data-top")));
        }
            
        
        
    } );
});
function questiontype() {
    var ids = [];
    $("#usetag").find("li").each(function (u) {
        ids.push($(this).attr("data-id"));
    });
    $("#showmessage").hide();
    if (ids.length == 0) {
        $("#btnexampaper").hide();
        $("#showmessage").show();
        $("#questiontype").html("");
        //console.log("=====")
    }
    else {
        $.ajax({
            url: "/Volume/Setvolume/ajax_qtypelistc",
            type: "post",
            data: { chapterid: ids },
            dataType: "json",
            success: function (json) {
                var html = "";
                if (json.status) {
                    $.each(json.data, function (i, subject) {
                        if (subject.qcount > 0) {
                            var minquestion = 2;
                            if (subject.qcount < minquestion)
                                minquestion = subject.qcount;
                            html = html + "<div class=\"item type_item\">";
                            html = html + "<label data-id='" + subject.qtypeid + "' data-questioncount='" + subject.qcount + "'>";
                            html = html + " <span class=\"select_question_title\">" + subject.qtypename + "</span>";
                            html = html + "<span class=\"select_question_minus\">-</span>";
                            html = html + "       <input type=\"text\" readonly=\"readonly\" class=\"item_count\" value=\"" + minquestion + "\">";
                            html = html + "       <span class=\"select_question_plus\">+</span>";
                            html = html + "       <span class=\"alert_text\"></span>";
                            html = html + "</label>";
                            html = html + "</div>";
                            $("#btnexampaper").show();
                        }
                    });
                }
                $("#questiontype").html(html);
                $(".select_question_minus").bind("click", function () {
                    var val = parseInt($(this).next().val(), 10);
                    val = val - 1;
                    if (val <= 0){
                        val = 0;
                        $(this).css('background-color','#ccc');
                    };
                    $(this).parent().find('span.select_question_plus').css('background-color','#fbfbfb');
                    $(this).parent().find('span.alert_text').html('');
                    $(this).next().val(val)
                });
                $(".select_question_plus").bind("click", function () {
                    var val = parseInt($(this).prev().val(), 10);
                    var maxcount = parseInt($(this).parent().attr("data-questioncount"), 10);
                    val = val + 1;
                    if (val >= maxcount){
                        val = maxcount;
                        $(this).css('background-color','#ccc');
                        $(this).next('span').html('达到最大值！');
                    };
                    $(this).parent().find('span.select_question_minus').css('background-color','#fbfbfb');
                    $(this).prev().val(val)
                });
            }
        });
    }
}
    $("input[name='paper_type']").bind("click", function () {
        $("#testName").val(strdate + $("#select_subject").find(".active").html() + $(this).attr("data-name"));
        TestPaper.paperType = $(this).val();
		examengine.paperid= $(this).val();
    })
    $("#btnexampaper").bind("click", function () {
        var ids = [];
        $("#usetag").find("li").each(function (u) {
            ids.push($(this).attr("data-id"));
        });
        var model = "";
        if (ids.length == 0) {
            ischool.layout.alert("组卷提示","没有选择章节！");
            return;
        }
        $("#questiontype").find("label").each(function () {
            //题型设置为0，不出题
            if ($(this).find("input").val() != "0") {
                if (model != "") {
                    model = model + ",";
                }
                model = model + "{\"QuestionType\":\"" + $(this).attr("data-id") + "\",\"QuestionCount\":" + $(this).find("input").val() + ",\"SubQuestionCount\":0,\"PointIDs\": []}";
            }
        })
        if (model=="") {
            ischool.layout.alert("组卷提示", "没有选择题型！");
            return;
        }
		var _chapters=ids.join(",").replace(/,/g, "\",\"")
	    var _points="";
		/*if($("#select_type").find(".active").attr("data-id")=="2")
		{
		    _points=ids.join(",").replace(/,/g, "\",\"");
		}
		else
		{
		_chapters=ids.join(",").replace(/,/g, "\",\"");
		}*/
        var examjson = "\"Title\":\"" + $("#testName").val() + "\",\"CourseID\":\"" + $("#select_subject").find("li.active").attr("data-id") + "\",\"Chapters\": [\"" + _chapters + "\"], \"PointIDs\": [],\"ExamModelQuestions\": [" + model + "]";



       intelligent(eval("({" + examjson + "})"));

    });
    loadbasicinfo();
 function intelligent (exammodeljson) {
		 var layouthtml = "<div class=\"PaperLoadLayout\" id=\"PaperLoadLayout\"></div>" +
                        "<div class=\"PaperLoadLayoutContainer\" id=\"PaperLoadLayoutContainer\">" +
                        " <img src=\"/Public/static/volume/images/balls.gif\" style=\" float:left\" />" +
                        " <div style=\"margin-top:50px;\" id=\"PaperLoadLayoutContainer_title\">正在智能分析扫描题库中。。。</div>" +
                        "</div>";
        $(".paperseting_change").show();
        //TestPaper.exampermodel = exammodeljson;
		 if (!document.getElementById("PaperLoadLayout")) {
            $("body").append(layouthtml);
           
            
        }
		$("#testpaper").show();
		 $('#PaperLoadLayoutContainer_title').html('正在智能分析扫描题库中。。。')

        $("#PaperLoadLayout").show();
        $("#PaperLoadLayoutContainer").show();
        setTimeout("$('#PaperLoadLayoutContainer_title').html('快马加鞭组卷中。。。');setTimeout(\"$('#PaperLoadLayoutContainer_title').html('正在装订试卷中，马上呈现试卷。。。')\", 1200)", 1500)
        $("#PaperLoadLayout").height($(document).height());
        var top = ((
            $(window).height() - $("#PaperLoadLayoutContainer").height()) / 2 + $(document).scrollTop());
        if (top < 0)
            top = 10;
        $("#PaperLoadLayoutContainer").css("top", top + "px");

        $("#PaperLoadLayoutContainer").css("left", ($(document).width() / 2 - $("#PaperLoadLayoutContainer").width() / 2) + "px");

        $.ajax({
            type: "POST",
            url: "/Volume/Setvolume/ajax_testpaper", data: exammodeljson, dataType: "json",
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
						examengine.init(json.Data);
                    }
                    else {
                        ischool.layout.error("服务器异常")
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
    }
    function teacherlastclass()
    {
        $.ajax({
            url: "/Volume/Setvolume/ajax_userlastclass",
            type: "post",
            dataType: "json",
            data: { subjectid: $("#select_subject").find(".active").attr("data-numid"), type: $("#select_type").find(".active").attr("data-id") },
            success: function (json) {
                if (json.status) {
               
                    for (var i = 0; i < json.data.length; i++) {
                        if ($("#usetag").find("[data-id='" + json.data[i].nodeid + "']").length == 0) {
                            $("#usetag").append("<li data-id='" + json.data[i].nodeid + "' data-parentid='' data-teacherlastclass='1'><a>" + json.data[i].nodename + "</a></li>");
                        }
                    }
                    if (json.data.length>0)
                        $(".teacherlastclass").html("（温馨提示：已默认为您教授的最近一堂课的课时） <span onclick='$(this).parent().remove()' style='curor:pointer;color:#f00;'>关闭</span>");
                    $("#usetagcount").html($("#usetag").find("li").length);
                    questiontype();
                }
            }

        })
    }