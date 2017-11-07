var versionjson = [];
var questionlistjson = [];
var pagecount = 0;
var pageindex = 1;
var pagesize = 10;
var strdate = new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日";
function loadbasicinfo() {
    $(".paper_types").find(".select_tag").eq(2).show();
    $(".paper_types").find(".select_tag").eq(4).show();
    $(".paper_types").find(".select_tag").eq(5).show();
    if ($("#select_type").find(".active").attr("data-id") == "2") {
        $(".paper_types").find(".select_tag").eq(2).hide();
        $(".paper_types").find(".select_tag").eq(4).hide();
        $(".paper_types").find(".select_tag").eq(5).hide();
    }
   // console.log($("#select_type").find(".active").attr("data-id"))
    $.ajax({
        url: "/Volume/Setvolume/ajax_dimquery", type: "post", dataType: "json", data: { chaptertype: $("#select_type").find(".active").attr("data-id"),usertype:examengine.useridentity},
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
$(document).ready(function () { $("#select_type").find("li").bind("click", function () {
    $(this).parent().find("li").removeClass("active");
    $(this).addClass("active");
    loadbasicinfo();

});
})

function loadbasicinfo_grade(json) {
    var html = "";

    for (var i = 0; i < json.length; i++) {
        html = html + "<li data-id='" + json[i].nodeid + "' data-numid='" + json[i].intid + "'>" + json[i].nodename + "</li>";
    }
    $("#select_grade").html(html);
    $("#select_grade").find("li").bind("click", function () {
        //TestPaper.gradeid = $(this).attr("data-numid");
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
        examcart.clear();
       // TestPaper.subjectid = $(this).attr("data-numid");
		examengine.courseid= $(this).attr("data-numid");
		examengine.coursename= $(this).html();
        $(this).parent().find("li").removeClass("active");
        $(this).addClass("active");
        $("#testName").val(strdate + $(this).html());
        var _tempjson = [];
        for (var i = 0; i < json.length; i++) {
            if (json[i].nodeid == $(this).attr("data-id"))
            { _tempjson = json[i].children; }
        }
        if ($("#select_type").find(".active").attr("data-id") == "2") {
            loadkchapter($(this).attr("data-id"), 0, 0);
        }
        else {
            loadbasicinfo_version(_tempjson);
        }
        loadquestiontype();
    });
    $("#select_subject").find("li").eq(0).click();
}
function loadbasicinfo_version(json) {
    var html = "";
    for (var i = 0; i < json.length; i++) {
        html = html + "<li data-id='" + json[i].nodeid + "' data-numid='" + json[i].intid + "' data-type='1' data-index='0'><i class='close'></i><a href='javascript:void(0)'>" + json[i].nodename + "</a></li>";
    }
    $("#chapterpoint").html("<ul class='tree' data-type='1'>" + html + "</ul>");
    versionjson = json;
}

function loadkchapter(nodeid, index,obj) {
    ischool.layout.loadding("加载数据中....");
    $.ajax({
        url: "/Volume/Setvolume/ajax_chapterquery",
        type: "post",
        data: { nodetype: 1, nodeid: nodeid },
        dataType: "json",
        success: function (json) {
            var html = "";
            for (var i = 0; i < json.data.length; i++) {
                html = html + "<li data-id='" + json.data[i].nodeid + "' data-parentid='" + nodeid + "' data-index='" + index + "'>";
                var temphtml = "";
                temphtml = "  <i class='close'></i>";
                if (index >= 2)
                {
                    if ($(".tree").attr("data-type") == "1") {
                        if (index == 3)
                        {
                            temphtml = "  <i class='section'></i>";
                        }
                    }
                    else {
                        temphtml = "  <i class='section'></i>";
                    }
                }

                

                html = html + temphtml+" <a href='javascript:void(0)'>" + json.data[i].nodename + "</a></li>";
            }
            if (index == 0)
                $("#chapterpoint").html("<ul class='tree'>" + html + "</ul>");
            else {
                if (index == 1) {
                    $(".points").eq(2).remove();
                    $(".points").eq(1).remove();
                }
                else {
                    $(".points").eq(2).remove();
                }
                obj.after("<ul  class='tree line' >" + html + "</ul>");
            }
            ischool.layout.hide();
        }
    });
}
function loadquestiontype()
{
    $.ajax({
        
        url: "/Volume/Setvolume/ajax_txtypelis", data: { stageid: $("#select_section").find(".active").attr("data-id"), subjectid: $("#select_subject").find(".active").attr("data-id") }, type: "post", dataType: "json", success: function (json) {
            var html = "<a href=\"javascript:void(0)\" data-value=\"\" class='active'>全部</a>";
            $.each(json, function (i, type) {
                html = html + "<a href='javascript:void(0)' data-id='" + type.id + "'>" + type.relatename + "</a>";
            });
            $("#questiontype").html(html);
            $(".questionselectcontaineritem").find("a").unbind();
            $(".questionselectcontaineritem").find("a").bind("click", function () {
                $(this).parent().find("a").removeClass("active");
                $(this).addClass("active");
               
                getquestionlist();
            });
        }
    });
    getquestionlist();
}

function getquestionlist()
{

    $("#questionlist").html("<div style='text-align:center;padding-top:50px;'><img src='/Public/static/volume/images/ajax-loader.gif'/>数据加载中</div>");
    $.ajax({
        url: "/Volume/Setvolume/ajax_getquestionlist", data: {
            subjectid: $("#select_subject").find(".active").attr("data-id"),
            questiontype: $("#questiontype").find(".active").attr("data-id"),
            chapterid: $(".tree").find(".active").parent().attr("data-id"),
            diff: $("[data-type='difficulty']").find(".active").attr("data-value"),
            pagesize:10,
            p: pageindex
        }, type: "post",
        dataType: "json", success: function (json) {
            var html = "";
            var index = 1
            questionlistjson = json.Data.list;
            pagecount = json.Data.totalcount/10;
            $.each(json.Data.list, function (q, question) {
                html = html + "<div class='paperquestionmanual'>";
                html = html + "<span class='paperquestionmanualnum'>" + index + "</span>"
                html = html + examengine.handdlequestion(question);
                html = html + "<div class='paperquestionmanualfooter'><a href='javascript:void(0)' class='viewdetail'>查看详情</a><a class='addbasket'>加入试题篮</a></div>";
                html = html + "</div>";
                index = index + 1;
            });

            $("#questionlist").html(html);
            $(".viewdetail").unbind()
            $(".viewdetail").bind("click", function () {
                if ($(this).html() == "查看详情") {
                    $(this).html("隐藏详情")
                    $(this).parent().parent().find(".analyse").show();
                    $(this).parent().parent().find(".answer").show();
                    $(this).parent().parent().find(".diff").show();
                    $(this).parent().parent().find(".analysis").show();
                    $(this).parent().parent().find(".knowledges").show();
					$(this).parent().parent().find(".chapters").show();
                }
                else {
                    $(this).html("查看详情")
                    $(this).parent().parent().find(".analyse").hide();
                    $(this).parent().parent().find(".answer").hide();
                    $(this).parent().parent().find(".diff").hide();
                    $(this).parent().parent().find(".analysis").hide();
                    $(this).parent().parent().find(".knowledges").hide();
					$(this).parent().parent().find(".chapters").hide();
                }
            });
            setpager();
        }

    })
}


function animate_to_basket($thiz) {
    var $item = $thiz.clone();
    //相对父元素偏移量
    var item_top = $thiz.offset().top;
    var item_left = $thiz.offset().left;
    var thiz_width = $thiz.width();
    var thiz_height = $thiz.height();
    //相对视窗偏移量 加的数字是为了居中
    var basket_top = $(".examcart").offset().top + 15;;
    var basket_left = $(".examcart").offset().left - 40;

    var item_clone = document.createElement('div')
    item_clone.className = 'item_clone item';
    item_clone.innerHTML = $item.html();
    $("#questionlist").append(item_clone.outerHTML);
    var $item_clone = $(".item_clone");
    $item_clone.css({ "position": "absolute", "top": item_top, "left": item_left, "width": thiz_width, "height": thiz_height, "background-color": "#bce8f1", "z-index": 1001, "overflow": "hidden" });

    $item_clone.animate({ "postion": "fixed", "top": basket_top, "left": basket_left, "width": "0px", "height": "0px", "overflow": "inherit" }, 650);

}

function setpager() {

    $(".pager").html("");
    var beginindex = 1;
    var endindex = 1;
    if (pagecount == 1) {

    }
    else {
        if (pageindex <= 1) {
            beginindex = 1;
        }
        if (pagecount > 10)
            endindex = 10;
        else
            endindex = pagecount;
        if (pageindex > 8) {
            beginindex = pageindex - 2;
            endindex = beginindex + 9;
            if (endindex > pagecount)
                endindex = pagecount;
        }
        //console.log(pagecount + "__" + beginindex + "###" + endindex)
        var html = "";
        for (var i = beginindex; i <= endindex; i++) {
            var strclass = "";
            if (i == pageindex) {
                strclass = " class='active' ";
            }
            html = html + "<a href='javascript:void(0)' data-index='" + i + "'" + strclass + ">" + i + "</a>";

        }
        $(".pager").html(html);
        $(".pager").find("a").bind("click", function () {
            pageindex = $(this).attr("data-index");
            setpager();
            getquestionlist()
        })
    }
}

var examcart = {
    init: function () {
        $(".examcart").bind("mouseover", function () {
          //  examcart.showcart();
            $(".examcartlist").show();
        }).bind("mouseleave", function () {
            $(".examcartlist").hide();
        });
        $("#clearcart").bind("click", function () {
            examcart.clear();

        });
        $("#savecart").bind("click", function () {
            examcart.save();
        });
    },
    isselect: function () {
        
        $(".removebasket").removeClass("removebasket").addClass("addbasket").text("加入试题篮");
        $.each(examcart.cartjson, function (i, cart) {

            $.each(cart.Examinationquestions, function (i, q) {
                var obj = $(".paperbody_bq[data-id='" + q.GUID + "']");
                if (obj.length > 0) {
                    
                    obj.parent().find(".addbasket").removeClass("addbasket").addClass("removebasket").text("移出试题篮");
                }
            });
        })

    },
    cartjson: [],
    add: function (index, typeid) {
	    var _name=$("#questiontype").find("[data-id='" + typeid + "']").html()
        var json = "{\"title\":\"" + _name+ "\",\"questions\":[]}"
        $.each(examcart.cartjson, function (k, v) {
           
            if (v.title == _name)
            {
                json = "";
            }
        })
        if (json != "") {
            examcart.cartjson.push(eval("(" + json + ")"));
        }
        $.each(examcart.cartjson, function (k, v) {
            if (v.title == _name) {
                var isexist = false;
                $.each(v.questions, function (i, q) {
                    if (q.id == questionlistjson[index].id)
                    { isexist = true;}
                })
                if (!isexist)
                   v.questions.push(questionlistjson[index]);
            }
        })
        examcart.showcart()
        examcart.showcartcount();
    },
    remove: function (questionid) {
        var tempexamcart = [];
        console.log(examcart.cartjson)
        $.each(examcart.cartjson, function (e, bigquestion) {
            var qjson = [];
            json = "{\"title\":\"" + bigquestion.Title + "\",\"questions\":[]}";
           // console.log(json)
            $.each(bigquestion.questions, function (q, question) {
                if (question.id != questionid)
                {
                    qjson.push(question);
                }
            });
            if (qjson.length > 0) {
                var _tempjson = eval("(" + json + ")");
                _tempjson.questions = qjson;
                tempexamcart.push(_tempjson);
            }
        })
        
        examcart.cartjson = tempexamcart;
        tempexamcart = null;
        examcart.showcart();
        examcart.showcartcount();
    },
    removequestiontype: function (type) {
       // console.log(type);
        var tempexamcart = [];
        for (var i = 0; i < examcart.cartjson.length; i++) {
            if (examcart.cartjson[i].Type != type) {
                tempexamcart.push(examcart.cartjson[i]);
            }
        }
        examcart.cartjson = tempexamcart;
       // console.log(examcart.cartjson)
        tempexamcart = null;
        examcart.showcartcount();
        examcart.isselect();
        examcart.showcart();
    },
    clear: function () {
        examcart.cartjson = [];
        examcart.showcart();
        examcart.showcartcount();
        examcart.isselect();
        $("#savecart").attr("disabled", true);
    },
    save: function () {
        $("#savecart").removeAttr('disabled');
        if (examcart.cartjson.length == 0) {
            alert("试题篮中无试题");
        }
        else {
            var jsonpart = "{\"title\":\"\"," +
                "\"index\":\"\"," +
                "\"examsections\":[]}";
            var json = "{\"title\":\"" + $("#testName").val()+ "\"," +
                "\"desc\":\"\"," +
				"\"type\":\"\"," +
                "\"examparts\":[" + jsonpart + "]," +
                "\"answertime\":\"\"," +
                "\"score\":\"\"," +
                "\"kpcoverage\":\"\"," +
                "\"diffdegree\":\"\"," +
                "\"reliability\":\"\"," +
                "\"validity\":\"\"," +
                "\"Source\":\"\"," +
                "\"extend\":{}}";
            var exam = eval("(" + json + ")");
            exam.examparts[0].examsections = examcart.cartjson;
          $("#Wrap").remove();
				 $("#testpaper").show();
examengine.init(exam);
            //TestPaper.manual(exam);
        }
    },
    showcartcount: function () {
        var qcount = 0;
        $.each(examcart.cartjson, function (e, type) {
            qcount = qcount+type.questions.length;

        });
        $(".examcartcount").html(qcount);
    },
    showcart: function () {
        var html = "<tr><th style=\"width:40%\">题型</th><th style=\"width:20%\">题数</th>" +
        "<th style=\"width:20%\">删除</th></tr>";
       
        var examtype = [];
        console.log(examcart.cartjson)
        $.each(examcart.cartjson, function (e, type) {
            html = html + "<tr>" +
                      "<td>" + type.title + "</td>" +
                      "<td>" + type.questions.length + "</td>" +
                       //"<td><a href=\"javascript:void(0)\" class=\"examcartdel\" data-id=\"" + type.Type + "\" onclick=\"alert('1')\" >删除</a></td>"
                      "<td><img src=\"/Public/static/volume/images/delete_16.png\" data-id=\"" + type.title + "\" class='examcartdel' style='cursor:pointer'/></td>" +
                      "</tr>";
        });
        $("#examlist").html(html);
        $("#examlist").find(".examcartdel").click(function () {
          
            examcart.removequestiontype($(this).attr("data-id"));
        })
    }
}


$(document).ready(function () {
    loadbasicinfo();
    examcart.init();
    $(".addallbasket").bind("click", function () {
        $(".paperquestionmanual").each(function (i) {
            $(this).find(".addbasket").click();
            //examcart.add(i,$(this).next().attr("data-questiontype"))
        })
    })
   
    $(document).on("click.tree.i", ".tree>li>i", function () {
        $(this).next().click();
    });
    $(document).on("click.tree.a", ".tree>li>a", function () {
        var type = $("#chapterpoint").children().attr("data-type") || "0";
        var _this = $(this);

        var index = parseInt(_this.parent().attr("data-index"), 10) + 1;
        var tempindex = parseInt(_this.parent().attr("data-index"), 10)
        if (type == "1") {
            tempindex = tempindex - 1;
        }
        if (tempindex == 2) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            }
            else {
                $(this).addClass("active");

            }
            getquestionlist();
        }
        else {
            if ($(this).prev().hasClass("close")) {
                $(this).prev().removeClass("close").addClass("open");

                if (type == "1") {

                    $.each(versionjson, function (k, v) {
                        if (v.nodeid == _this.parent().attr("data-id")) {
                            var html = "";
                            $.each(v.children, function (s, sv) {
                                html = html + "<li data-id='" + sv.nodeid + "' data-numid='" + sv.intid + "' data-index='1'><i class='close'></i><a href='javascript:void(0)'>" + sv.nodename + "</a></li>";
                            });

                            _this.after("<ul class='tree line'>" + html + "<li>");
                        }
                    });
                }

                loadkchapter(_this.parent().attr("data-id"), index, _this);

            }
            else {
                $(this).prev().removeClass("open").addClass("close");

                $(this).next().remove();

            }
        }

    });
    $("#questionlist").on("click", ".addbasket", function () {
        var obj = $(this).parent().prev();
        var index = parseInt($(this).parent().parent().find(".paperquestionmanualnum").html(), 10) - 1;
        var count = obj.find(".paperbody_question").size();
        if (count == 1)
            count = 0;
        examcart.add(index, obj.attr("data-typeid"))
        animate_to_basket(obj);
        $(this).removeClass("addbasket").addClass("removebasket").text("移出试题篮");

    }).on("click", ".removebasket", function () {
        examcart.remove($(this).parent().prev().attr("data-id"))

        $(this).removeClass("removebasket").addClass("addbasket").text("加入试题篮");
    });
});