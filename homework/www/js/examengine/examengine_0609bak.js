var examengine = {
    //试卷类型
    type: 1,
    //来源
    sourcetype:1,
    //是否单题显示
    issingledisplay: false,
    singleindex: 0,
    //是否分数显示百分比
    ispercentage: false,
    //用户身份
    useridentity: "teacher",
    //是否显示卷头
    isdisplayheader: true,
    //是否支持换题
    ischangequestion:false,
    //学生作答试卷id
    studentpaperid:"",
    //学生作答
    studentanswerjson: {},
    //学生得分
    studentscore:0,
    //学生作答状态0 保存，1待批阅，2完成
    studentanswerstatus:0,
    //试卷作答时间（分）
    examtime: 120,
    //试卷作答暂停
    ispause: false,
    //view,edit,do,piyue,look(这个只能查看卷干) 试卷状态,insert
    status: "edit",
    examjson: {},
    publishtotype:"test",
    publishbtnname: "发布作业",
    //是否显示发布作业保存按钮
    isdisplaypublishsavebtn: true,
    //发布作业
    postpublish: function () {

        examengine.layout.loadding("加载数据中");
        if (examengine.useridentity == "teacher") {
            $.ajax({
                url: "/Volume/Setvolume/ajax_teacherclass", dataType: "json", success: function (json) {
                    var classlist = "";

                    $.each(json.data, function (k, obj) {


                        classlist = classlist + "<input type='checkbox' name='examclassid' value='" + obj.classid + "'/>" + obj.classname + "&nbsp;&nbsp;&nbsp;&nbsp;"
                    });
                    var temphtml = "<div style='margin-bottom:10px'><span style='color:red'>*</span>选择班级：" + classlist + "<span style='color:red' class='errchk'></span></div>";
                    temphtml = temphtml + "<div><span style='color:red'>*</span>截止时间：<input type='text' id='exampublishdate' class='input date' onClick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-{%d+1}'})\"/><span style='color:red' class='errdate'></span></div>"
                    examengine.layout.init({
                        title: "发布测验", content: temphtml, width: 500,
                        ishidencancel:true,isshowbtn:true,
                        callback: function () {
                            var ischeck = false;
                            $("input[name='examclassid']").each(function () {
                                if ($(this).is(':checked')) {
                                    ischeck = true;
                                }
                            });
                            if (!ischeck) {
                                $(".errchk").html("选择班级");
                                return;
                            } else {
                                $(".errchk").html("");
                            }
                            if ($("#exampublishdate").val() == "") {
                                $(".errdate").html("请选择截止时间");
                                return;
                            } else {
                                $(".errdate").html("");
                            }
                            examengine.examsave(2);
                            
                        }
                    })
                }
            });
        }
        if (examengine.useridentity == "parent") {
            $.ajax({
                url: "/Volume/Setvolume/ajax_childrens", dataType: "json", success: function (json) {
                    var classlist = "";

                    $.each(json.data, function (k, obj) {


                        classlist = classlist + "<input type='checkbox' name='chkexamstulist' value='" + obj.userId + "'/>" + obj.realName + "&nbsp;&nbsp;&nbsp;&nbsp;"
                    });
                    var temphtml = "<div style='margin-bottom:10px'><span style='color:red'>*</span>选择孩子：" + classlist + "<span style='color:red' class='errchk'></span></div>";
                    temphtml = temphtml + "<div><span style='color:red'>*</span>截止时间：<input type='text' id='exampublishdate' class='input date' onClick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-{%d+1}'})\"/><span style='color:red' class='errdate'></span></div>"
                    examengine.layout.init({
                        title: "发布测验", content: temphtml, ishidencancel: true, isshowbtn: true, callback: function () {
                            var ischeck = false;
                            $("input[name='chkexamstulist']").each(function () {
                                if ($(this).is(':checked')) {
                                    ischeck = true;
                                }
                            });
                            if (!ischeck) {
                                $(".errchk").html("选择孩子");
                                return;
                            } else {
                                $(".errchk").html("");
                            }
                            if ($("#exampublishdate").val() == "") {
                                $(".errdate").html("请选择截止时间");
                                return;
                            } else {
                                $(".errdate").html("");
                            }
                            examengine.examsave(2);
                        }
                    })
                }
            });
        }

        if (examengine.useridentity == "student") {

            var temphtml = "";
            temphtml = temphtml + "<div><span style='color:red'>*</span>截止时间：<input type='text' id='exampublishdate' class='input date' onClick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-{%d+1}'})\"/><span style='color:red' class='errdate'></span></div>"
            ischool.layout.init({
                title: "发布测验", content: temphtml, ishidencancel: true, isshowbtn: true, callback: function () {
                    if ($("#exampublishdate").val() == "") {
                        $(".errdate").html("请选择截止时间");
                        return;
                    } else {
                        $(".errdate").html("");
                    }
                    examengine.examsave(2);
                }
            })
        }
    },
    //保存作业
    savepublish: function () { examengine.examsave(1); },
    //提交答案
    postanswer: function () {
        var answertime = examengine.dateDiff("s",examengine.useranswerbegintime, new Date());
        $.ajax({
            url: "/Volume/Setvolume/ajax_stuexamsave", data: { paperid: examengine.paperid, answertime: answertime, questionItemBean: examengine.getmyanswerjson()}, type: "post", dataType: "json",
            success: function (data) {
                if (data.status) {
                    window.location.href = '/Volume/Setvolume/stuvolume';
                } else {
                    ischool.layout.error(data.msg);
                }
            }
        });
    },
    //保存答案
    saveanswer: function () {
        $.ajax({
            url: ischool.ExamPaper.saveanswerapi, data: { workid: examengine.paperid, stuid: "", answercontent: examengine.getmyanswerjson() }, type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    //var msg = "已经成功暂存作业进度。你还有" + (3 - 1 - ischool.ExamPaper.savecount) + "次暂存作业机会。"
                    examengine.layout.alert("提示", "保存成功", function () {
                        location.href = location.href;
                    });

                }
                else {
                    ischool.layout.error(json.msg);
                   // $(".btn-post").show();
                }
            }
        });
    },
    //提交批阅
    postpiyue: function () {

        var _tempjson = "";
        $(".replycontainer").each(function () {
            var reg = /\d{1,2}/;
            var score = parseInt($(this).parent().attr("data-score"), 10);
            var pid = $(this).parent().attr("data-stuqueid");
            var value = $(this).find(".pingscore").val()
            if (reg.test(value)) {
                if (_tempjson != "")
                    _tempjson = _tempjson + ",";
                if (parseInt(value, 10) > score)
                    value = score;
                _tempjson = _tempjson + "{\"pid\":\"" + pid + "\",\"queid\":\"" + $(this).parent().attr("data-id") + "\",\"score\":" + value + ",\"quetype\":2}";
            }

        });
        if (_tempjson == "") {
            examengine.layout.alert("批阅", "没有给试卷批阅分数");
        }
        else {
            examengine.layout.loadding("批阅数据提交中...");
            
            var json = "{\"stupaperid\":\"" + examengine.studentpaperid + "\",\"topiclist\":[" + _tempjson + "]}";
            $.ajax({
                url: "/Volume/Setvolume/ajax_saveteapiyue", data: eval("(" + json + ")"), type: "post", dataType: "json", success: function (json) {

                    if (json.status) {
                       // examengine.layout.success("批阅成功");
                        if (typeof callback == "function")
                            callback();
                    }
                    else {
                        //ischool.layout.error("提交失败");
                    }
                }
            });
        }
    },
    htmlcontainerid: "#testpaper",
    paperid: "",//试卷id
    courseid: "",//学科id
    coursename: "",//学科名称,
    versionid: "",//版本
    gradeid:"",//年级
    htmlanswersheet: "",
    useranswerbegintime: new Date(),
    //是否显示答题卡
    isdisplayanswersheet:true,
   
    loadexam: function (url,data) {
        $.ajax({
            url: url, data: data, type: "post", dataType: "json", success: function (json) {
                if (typeof json.data.answerBean != "undefined")
                {
                    examengine.studentpaperid = json.data.depid;
                    examengine.studentanswerjson = json.data.answerBean;
                    if (json.data.answerBean!=null)
                        examengine.studentscore =Math.round( json.data.answerBean.angetscore / json.data.answerBean.andesignscore*100);
                   
                }
                else
                {
                    examengine.studentpaperid = json.data.depid;
                    examengine.studentanswerjson = json.data.answerbean;
                    if (typeof json.data.score != "undefined")
                        examengine.studentscore = json.data.score;
                    else
                        examengine.studentscore = json.data.answerbean.score;
                  
                }
                examengine.studentanswerstatus = parseInt(json.data.status, 10);
                examengine.init(json.data.paperbean);
            }
        })
    },
    init: function (json) {
        examengine.examjson = json;
        examengine.ispause = false;
        //console.log(json.answertime)
        examengine.examtime = json.answertime;
        //如果学生作答等于null
        if (examengine.studentanswerjson == null)
            examengine.studentanswerjson = {};
      
        if (examengine.publishtotype == "newtask" || examengine.publishtotype == "bookroom") {
            examengine.publishbtnname = examengine.publishtotype == "bookroom" ? "保存到书房" : "保存到新作业";
            examengine.isdisplaypublishsavebtn = false;
            examengine.postpublish = function () {
                $.ajax({
                    url: "/Bookroom/Bookroom/ajax_volpaperbean",
                    data: { pbname: examengine.publishtotype, paperbean: examengine.getexamjson() },
                    type: "post", dataType: "json",
                    success: function (json) {
                        if (json.status) {
                            examengine.layout.alert("消息提示", "保存成功，请返回到新作业")
                            window.opener = null;
                            window.open('', '_self', '');
                            window.close();
                        }
                    }
                });

            }
        }
        if (examengine.issingledisplay)
            examengine.isdisplayanswersheet = false;
        //判断是否当前
        if (examengine.useridentity == "student" && examengine.status == "do")
        {
            if (examengine.studentanswerstatus > 0)
                examengine.status == "view";
        }
        examengine.allexamshow();
 
    },
    layout:{
        init: function (json) {
            var winhtml = "<div id='examlayoutbg' class='examlayoutbg'></div>";

            winhtml = winhtml + "<div id='examlayoutbox' class='examlayoutbox'>";
            winhtml = winhtml + "<div class='examlayoutbox_title'><h2>试卷弹层</h2><span onclick=' examengine.layout.close()'>X</span></div>";
            winhtml = winhtml + "<div class='examlayoutbox_content examengine'></div>";
            winhtml = winhtml + "<div class='examlayoutbox_btn'><a href='javascript:void(0)' class='btn btn_white' id='examlayoutbtn_c' onclick=' examengine.layout.close()'>取消</a>";
            winhtml = winhtml + "<a href='javascript:void(0)' class='btn' id='examlayoutbtn_sure'>确定</a></div>";
            winhtml = winhtml + "</div>";
            if (!document.getElementById("examlayoutbg")) {
                $("body").append(winhtml);
             
            }
            $(".examlayoutbox_title").find("h2").html(json.title);
            $(".examlayoutbox_content").html(json.content);
            if (typeof json.width == "undefined")
                json.width = 260;
            if (typeof json.width == "number")
                $(".examlayoutbox").css({ width: json.width + "px" });
            if (typeof json.width == "string")
                $(".examlayoutbox").css({ width: json.width });
            if (typeof json.surename == "string")
                $("#examlayoutbtn_sure").html(json.surename);
            else
                $("#examlayoutbtn_sure").html("确定");
            if (typeof json.btnalign == "string")
                $(".examlayoutbox_btn").css("text-align", json.btnalign)
            else
                $(".examlayoutbox_btn").css("text-align", "right")
            $(".examlayoutbox_btn").css("display", "none");
            //console.log(json.isshowbtn)
            if (typeof json.isshowbtn != "boolean")
                json.isshowbtn = false;
            if(typeof json.ishidencancel != "boolean")
                json.ishidencancel = false;
            if (typeof json.ispositionfixed != "boolean")
                json.ispositionfixed = true;
            if (json.isshowbtn==true)
            {
                $(".examlayoutbox_btn").show();
            }
            $("#examlayoutbtn_c").show();
            if (json.ishidencancel == true) {
                $("#examlayoutbtn_c").hide();
            }
            if (typeof json.callback == "function")
            {
                $("#examlayoutbtn_sure").bind('click', function () { json.callback();})
            }
            if (json.ispositionfixed == false)
            {
                $("#examlayoutbox").css("position", "absolute");
            }
            $("#examlayoutbox").css("left", ($("body").width() - $("#examlayoutbox").width() - 10) / 2);
            $("#examlayoutbox").css("top", (($("body").height() - ($("#examlayoutbox").height()))/2 - 20));
            $("#examlayoutbg").css("height", $("body").height());
           
            $("#examlayoutbox").css("display", "block");
            $("#examlayoutbg").css("display", "block");
           
        
        },
        loadding:function(content)
        {
            this.init({ title: "提示", content: "<div class='examloadding'>" + content+"</div>", width: 260, isshowbtn: false })
        }
        ,
        alert: function (title,content) {
            this.init({ title: title, content: content, isshowbtn: true, width: 260, ishidencancel: true, callback: function () { examengine.layout.close(); } })
        },
        confirm: function (title, content,callback) {
            this.init({ title: title, content: content, isshowbtn: true, width: 260, ishidencancel: false, callback: callback })
        },
        error: function (content, fn) {
            this.init({
                title: "错误提示", content: content, isshowbtn: true,
                width: 260,
                ishidencancel: true,
                callback: function () {
                    examengine.layout.close();
                }
            });
        },
        success: function (content, url) {
            this.init({
                title: "提示", content: content, isshowbtn: true,
                width: 260,
                ishidencancel: true,
                callback: function () { examengine.layout.close(); }
            });
            var url = url || 2000;
            if (typeof url=="number")
                setTimeout(examengine.layout.close, url);
            else
                location.href = url;
        },
        close: function ()
        {
            $(".examlayoutbox_content").html("");
            $("#examlayoutbox").css("display", "none");
            $("#examlayoutbg").css("display", "none");
        }
    
    },
  
    allexamshow: function () {
        var _class = "";
        if (examengine.issingledisplay)
        {
            _class = "singleexam";
        }
        if (examengine.status == "edit")
        {
            _class = "editexam";
        }
        //设置查看模式
        if (examengine.status == "do"&&examengine.studentanswerstatus>0)
        {
            examengine.status = "view";
        }
        if (examengine.status == "piyue" && examengine.studentanswerstatus > 1) {
            examengine.status = "view";
        }
        var html = "<div class='examengine "+_class+"'>";
        var questionlist = "";
        var _headerstyle = "";
        if (examengine.issingledisplay ==true || examengine.isdisplayheader == false) {
            _headerstyle=" style='display:none;'"

        }
        html = html + " <div class='examheader' " + _headerstyle + ">";

            html = html + "<label style='margin-left: 20px; display: block; float: left; margin-top: 26px;'>试卷名称：</label><h1 id='examheader_title' class='examheader_title'>" + examengine.examjson.title + "</h1>";
            html = html + "     <div class='info'>";

            /*html = html + " <p>◇ 作答时间为 <span id='examsheet_time' class='examsheet_time' data-time='" + examengine.examtime + "'>" + examengine.examtime + "分钟</span>; 试卷分数为 <span id='examsheet_score' class='examsheet_score'></span>分<!--<span class='examsheet_settime' style='float: right;'>设置作答时间</span>--><p>";*/
            html = html + " <p>◇ 试卷分数为 <span id='examsheet_score' class='examsheet_score'></span>分<!--<span class='examsheet_settime' style='float: right;'>设置作答时间</span>--><p>";
            if (examengine.examjson.extend != null) {
                if (examengine.examjson.extend.auditor != null)
                    if (examengine.examjson.extend.auditor != "") {
                        html = html + " <p>◇ 出卷人：" + examengine.examjson.extend.author + "&nbsp;&nbsp;&nbsp;&nbsp;出卷人学校：" + examengine.examjson.extend.authorcchool + "<p>";
                        html = html + " <p>◇ 审核人：" + examengine.examjson.extend.auditor + "&nbsp;&nbsp;&nbsp;&nbsp;审核人学校：" + examengine.examjson.extend.auditschool + "<p>";
                    }
            }

            html = html + "     </div>";
            if (examengine.studentanswerstatus >= 2) {
                var scorehtml = "<div class=\"exam_score\">";
                var myscore = examengine.studentscore + "";
                for (var i = myscore.length - 1; i >= 0; i--) {
                    var _temp = myscore.substr(i, 1);
                    if (_temp == ".")//a10
                    {
                        _temp = 10;
                    }
                    scorehtml = scorehtml + "<span class='a" + _temp + "'></span>";
                }
                scorehtml = scorehtml + "</div>";

                html = html + scorehtml;

            }
            html = html + " </div>";
        var bigquestioncount = 0;
        var subquestioncount = 0;
       
        //试卷展示
        $.each(examengine.examjson.examparts, function (p, model) {
            questionlist = questionlist + "<div class='examparts'>";
            $.each(model.examsections, function (se, sectionmodel) {
                questionlist = questionlist + "<div class='examsections'>";
               
                if (sectionmodel.title != "") {
                    questionlist = questionlist + "<div class='examsections_title'>";
                    if (examengine.status == "edit") {
                        var _sectiontile = sectionmodel.title.replace(/[一二三四五六七八九十]{1,2}、/g,"");


                        questionlist = questionlist + "<div><span class='examsections_name'>"  + examengine.numberconvertchinese(se + 1) + "、"+ _sectiontile + "</span></div>";
                        questionlist = questionlist + "<div class=\"questionmenu\" style=\"display: none;\"><a class=\"editscore\">设置分数</a></div>";

                    }
                    else {
                        questionlist = questionlist + "<div><span class='examsections_name'>" + sectionmodel.title + "</span></div>";
                    }
                    questionlist = questionlist + "</div>";
                };
                bigquestioncount = bigquestioncount + sectionmodel.questions.length;
                $.each(sectionmodel.questions, function (p, questionmodel) {
                    questionlist = questionlist + examengine.handdlequestion(questionmodel);
                    //if (questionmodel.subquestions.length > 1)
                    //{
                    //    subquestioncount = subquestioncount+questionmodel.subquestions.length
                    //}
                    subquestioncount = subquestioncount+questionmodel.subquestions.length;
                })

                questionlist = questionlist + "</div>";
            })
            questionlist = questionlist + "</div>";
        });
        var _posthtml = "";
        if (examengine.status == "edit")
        {
            if(examengine.isdisplaypublishsavebtn)
                  _posthtml = "<p><a href='javascript:void(0)' class='btn btn_green'  id='btn-exam-publish-save'>保存到草稿</a></p>";
            _posthtml=_posthtml+"<p><a href='javascript:void(0)' class='btn'  id='btn-exam-publish-post'>" + examengine.publishbtnname + "</a></p>";
        }
        if (examengine.status == "do") {
            _posthtml = "<p><a href='javascript:void(0)' class='btn btn_white' id='btn-exam-save'>保存进度，下次继续</a></p>" +
                "<p><a href='javascript:void(0)' class='btn' id='btn-exam-post'>交卷</a></p>";
        }
        if (examengine.status == "piyue") {
            _posthtml = "<p><a href='javascript:void(0)' class='btn' id='btn-exam-piyue'>批阅</a></p>"
        }
        var _answersheet = "<div class='ascontainer' id='answercard'>";
        if (examengine.status == "do") {
            _answersheet = _answersheet + "<div class='examentimer'>";
            _answersheet = _answersheet + "<span class='timer_left'><i></i>用时<em id='examtime_text' data-value='"+(examengine.examtime*60)+"'></em></span>";
            _answersheet = _answersheet + "<span class='timer_right'><a href='javascript:;'><i></i>暂停</a></span></div>";
            _answersheet = _answersheet + "<div class='astitle'>答题卡<span></span></div>";
        }
        else if (examengine.status == "edit") {
            _answersheet = _answersheet + "<div class='examentimer'><h2>试卷设置</h2>"
            _answersheet = _answersheet + "     <div><a href='javascript:' class='examsheet_showanswer'>显示答案</a>";
            _answersheet = _answersheet + "     <a href='javascript:' class='examsheet_showpoint'>显示知识点</a>";
            _answersheet = _answersheet + "     <a href='javascript:' class='examsheet_settime'>设置时间</a></div>";
            _answersheet = _answersheet + "</div>";
            _answersheet = _answersheet + "<div class='astitle'>试题统计<span></span></div>";
        }
        else {
            _answersheet = _answersheet + "<div class='astitle'>试题统计<span></span></div>";
        }
        _answersheet = _answersheet + "<div class='ascontent' id='answercarditem'>" + examengine.htmlanswersheet + "</div>";
        if (examengine.status == "view" || examengine.status == "piyue")
           _answersheet = _answersheet + "<div class='ascontent_color'><em>错误</em><i class=\"a error\"></i><em>正确</em><i class=\"a right\"></i><em>未做</em><i class=\"a normal\"></i> </div>";
        _answersheet = _answersheet + "<div class='asbtn'>" + _posthtml + "</div>";
        _answersheet = _answersheet + "</div>";
        html = html + " <div class='examcontainer'>";
        html = html + "     <div class='exambody' style='" + (examengine.isdisplayanswersheet == false ? " width:100%" : "") + "'>" + questionlist + "</div>";
        html = html + "     <div class='answersheet' style='" + (examengine.isdisplayanswersheet==true?"":"display:none;") + "'>" + _answersheet + "</div>";
        html = html + " </div>";
        html = html + "</div>";
        $(examengine.htmlcontainerid).html(html);
        $('.info').append('<p>全卷有'+bigquestioncount+'道大题，共'+subquestioncount+'道题</p>');
        $("#btn-exam-publish-save").click(function () { "[object Function]" === {}.toString.call(examengine.savepublish) && examengine.savepublish(); });
        $("#btn-exam-publish-post").click(function () { "[object Function]" === {}.toString.call(examengine.postpublish) && examengine.postpublish(); });
        $("#btn-exam-save").click(function () { "[object Function]" === {}.toString.call(examengine.saveanswer) && examengine.saveanswer(); });
        $("#btn-exam-post").click(function () { "[object Function]" === {}.toString.call(examengine.postanswer) && examengine.postanswer();});
        $("#btn-exam-piyue").click(function () { "[object Function]" === {}.toString.call(examengine.postpiyue) && examengine.postpiyue(); });
       
        if (examengine.status == "do") {
            //设置试卷倒计时
            if (examengine.examtime > 0)
                 examengine.bindevettimer();
        }
        window.onscroll = function () {
            var s_top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            //console.log(s_top)
            if (s_top > 141) {
                $("#answercard").css({
                    'position': 'fixed',
                    'top': 0 + 'px',
                    'width': '265px'
                });
                //$("#answercard").addClass("fixed");
            } else {
                $("#answercard").css({
                    'position': 'absolute',
                    'top': '0px'
                });
                //  $('.paperseting').removeClass("fixed");
            }

        };
        examengine.bindevent();
        //设置滚动条事件
       
    },
    getanswersheet: function () {
       // console.log()
        var html = "";
        var _index=1;
        $(examengine.htmlcontainerid).find(".examsections").each(function () {
            html = html + "<dl>";
            if ($(this).find(".examsections_name").length==1)
                html = html + "<dt>" + $(this).find(".examsections_name").html() + "</dt>";
            var _subhtml = "";
            $(this).find(".subquestion").each(function () {
                $(this).find(".subquestionnum").html(_index + ".");
                var _isanswer = parseInt($(this).attr("data-isanswer"), 10);
                var _isright = parseInt($(this).attr("data-isright"), 10);
                var _isobjective = $(this).attr("data-isobjective");
                //console.log(_isright)
                var _class = "this";
                if (_isanswer == 0)
                { _class = '' }
                else
                {
                    if (_isobjective == "true") {
                        if (_isright == 1) {
                            _class = 'right'
                        }
                        if (_isright == 0) { _class = 'error' }
                    }
                }
                _subhtml = _subhtml + "<a href='javascript:;' data-index='" + _index + "' class='" + _class + "'>" + _index + "</a>";
                _index=_index+1;
            });
            html = html + "<dd>" + _subhtml + "</dd>";
            html = html + "</dl>";

        });
        return html;
    },
    bindevent: function () {

        if (examengine.issingledisplay) {
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            $(".equestion").hide();
            $(".subquestion").hide();
            $(".equestion").eq(examengine.singleindex).show();
            $(".subquestion").eq(examengine.singleindex).show();
            $('.examparts').css({'position': 'relative', 'height': $('body').height()+'px'});
            $('.examsections').css({'position': 'absolute', 'height': $('body').height()+'px'});
            $('.equestion').css({'display':'block', 'height':$('body').height()+'px','width':'36rem', 'position':'absolute'});
            $('.subquestion').css({'display':'block','width':'36rem','position':'absolute'});

            var subwidth = document.documentElement.clientWidth;
            var oDiv;
            var oDivnext;
            var oDivprev;
            var isprevnext = false;

            if(examengine.status == 'view' && examengine.useridentity == 'student'){
                var errornum = $('.subquestion[data-isright="0"]').length;
                if(errornum > 0){
                    var html = '<div class="errorlabel"><label>你做错了'+errornum+'道题，可到电脑端错题本中纠正</label><span onclick="$(this).parent().remove();"></span></div>';
                    $('body').prepend(html);
                };
            };

            var ifobjective = $('.subquestion').eq(examengine.singleindex).attr('data-isobjective');
            if(ifobjective == 'true' && examengine.status == 'piyue' && examengine.useridentity == 'teacher'){
                for(var i=0; i<$('.subquestion').length; i++){
                    if($('.subquestion').eq(i).attr('data-isobjective') == 'false'){
                        examengine.singleindex = i;
                        isprevnext = true;
                        break;
                    };
                };
            };
            listentouch(isprevnext);

            function listentouch(prevnextstate){
                //显示试卷分数
                $('.examheader').show().children().hide();
                $('.exam_score').show().css({'z-index': 1000, '-webkit-transform':'scale(0.5,0.5)', 'transform':'scale(0.4,0.4)', 'position':'absolute', 'top': 0, 'right': '-30px'});

                //是否显示文本、音频点赞框
                var ifradio = '';
                if (examengine.status == 'piyue' && examengine.useridentity == 'teacher') {
                    ifradio = $('.subquestion').eq(examengine.singleindex).attr('data-isobjective');
                    if(examengine.studentanswerjson.ans[examengine.singleindex].isanswer == 0){
                        ifradio = 'true';
                    };
                    showhideradio(ifradio, examengine.singleindex);
                };

                $('body').css({'overflow': 'hidden','position':'fixed','width':'100%','height':'100%'});
                $('html').css({'overflow': 'hidden','position':'fixed','width':'100%'});

                $('.subquestion').eq(examengine.singleindex).css('margin-left','0');
                var subparents = $('.subquestion').eq(examengine.singleindex).parents('.examsections');
                var subparent = $('.subquestion').eq(examengine.singleindex).parent();
                $('.examparts').css('height', (subparent.find('.title').height() + $('.subquestion').eq(examengine.singleindex).height() + 24) + 'px');
                subparent.css('height', (subparent.find('.title').height() + $('.subquestion').eq(examengine.singleindex).height() + 24) + 'px');
                var nextstate = false;
                var prevstate = false;
                $('.examsections').hide();
                $('.equestion').hide();
                $('.subquestion').hide();
                subparent.css({'display': 'block'});
                subparents.css({'display': 'block'});
                $('.subquestion').eq(examengine.singleindex).show();
                oDiv = document.querySelectorAll('.subquestion')[examengine.singleindex].parentNode;
                if(prevnextstate){
                    oDiv.style.marginTop = 0;
                };
                if($('.subquestion').length > 0){
                    var _bigid = $(".subquestion").eq(examengine.singleindex).parent().attr("data-id");
                    var _newbigid = $(".subquestion").eq(examengine.singleindex+1).parent().attr("data-id");
                    if(examengine.singleindex == $('.subquestion').length-1){
                        oDivnext = null;
                    }else{
                        if(_bigid == _newbigid){
                            oDivnext = $('.subquestion').eq(examengine.singleindex + 1);
                        }else{
                            nextstate = true;
                            oDivnext = $('.subquestion').eq(examengine.singleindex + 1).parent();
                            $('.subquestion').eq(examengine.singleindex + 1).parents('.examsections').show();
                            oDivnext.find('.subquestion').eq(0).show();
                        };
                        oDivnext.css({'display': 'block', 'margin-left': subwidth + 'px'});
                    };

                    if(examengine.singleindex > 0){
                        var _bigid = $(".subquestion").eq(examengine.singleindex).parent().attr("data-id");
                        var _newbigid = $(".subquestion").eq(examengine.singleindex-1).parent().attr("data-id");
                        if(_bigid == _newbigid){
                            oDivprev = $('.subquestion').eq(examengine.singleindex - 1);
                        }else{
                            prevstate = true;
                            oDivprev = $('.subquestion').eq(examengine.singleindex - 1).parent();
                            $('.subquestion').eq(examengine.singleindex - 1).parents('.examsections').show();
                            oDivprev.find('.subquestion').eq(oDivprev.find('.subquestion').length -1).show();
                        };
                        oDivprev.css({'display': 'block', 'margin-left': '-'+subwidth+'px'});
                    }else{
                        oDivprev = null;
                    };
                };
                var tX = 0;
                var tY = 0;
                var istouch = false;
                function fnStart(ev){
                    if(!istouch){
                        var disX = ev.targetTouches[0].clientX - tX;
                        var disY = ev.targetTouches[0].clientY - tY;
                        var moveleftright = false;
                        var moveupdown = false;
                        var oldtY = oDiv.offsetTop;
                        istouch = true;
                        function fnMove(ev){
                            tX = ev.targetTouches[0].clientX - disX;
                            tY = ev.targetTouches[0].clientY - disY;
                            if(moveupdown){
                                tX = 0;
                            };
                            if(moveleftright){
                                tY = 0;
                            };
                            $('.btn').val('y:'+Math.abs(tY)+',x:'+Math.abs(tX));
                            if(Math.abs(tY) >2 || Math.abs(tX) > 2){
                                if(Math.abs(tY) <= Math.abs(tX)){
                                    if(moveupdown){
                                        return;
                                    }else{
                                        moveleftright = true;
                                        if(tX < 0) {
                                            if (nextstate) {
                                                oDiv.style.marginLeft = tX + 'px';
                                            } else {
                                                $('.subquestion').eq(examengine.singleindex)[0].style.marginLeft = tX + 'px';
                                            };
                                            if (oDivnext) {
                                                oDivnext[0].style.marginLeft = subwidth + tX + 'px';
                                            };
                                        }else{
                                            if(prevstate){
                                                oDiv.style.marginLeft = tX + 'px';
                                            }else{
                                                $('.subquestion').eq(examengine.singleindex)[0].style.marginLeft = tX + 'px';
                                            };
                                            if(oDivprev){
                                                oDivprev[0].style.marginLeft = '-' + (subwidth - tX) +'px';
                                            };
                                        };
                                    };
                                }else{
                                    if(moveleftright){
                                        return;
                                    }else{
                                        moveupdown = true;
                                        if(tY < -20) {
                                            oDiv.style.marginTop = (oldtY+tY) + 'px';
                                        };
                                        if(tY > 20){
                                            oDiv.style.marginTop = (oldtY+tY) + 'px';
                                        };
                                    };
                                };
                            };

                            if((ev.targetTouches[0].clientX < 2 || ev.targetTouches[0].clientX > ($('body').width()-2) || ev.targetTouches[0].clientY < 2 || ev.targetTouches[0].clientY > ($('body').height()-2)) && isiOS){
                                fnEnd();
                            };
                        };
                        function fnEnd(){
                            if(Math.abs(tX) > 0){
                                if(tX < -100){
                                    var oDivend = oDiv;
                                    if(!nextstate){
                                        oDivend = $('.subquestion').eq(examengine.singleindex)[0];
                                    };
                                    if(oDivnext){
                                        startMove('x', oDivend, tX, '-'+subwidth, true);
                                        startMove('x', oDivnext[0], (subwidth+tX), 0);

                                        examengine.singleindex = examengine.singleindex + 1;
                                        if (examengine.status == 'piyue' && examengine.useridentity == 'teacher') {
                                            ifradio = $('.subquestion').eq(examengine.singleindex).attr('data-isobjective');
                                            if(examengine.studentanswerjson.ans[examengine.singleindex].isanswer == 0){
                                                ifradio = 'true';
                                            };
                                            showhideradio(ifradio, examengine.singleindex);
                                        };
                                        isprevnext = true;
                                    }else{
                                        startMove('x', oDivend, tX, 0, true);
                                        isprevnext = false;
                                    };
                                    oDiv.removeEventListener('touchstart',fnStart,false);
                                }else if(tX < -0){
                                    var oDivend = oDiv;
                                    if(!nextstate){
                                        oDivend = $('.subquestion').eq(examengine.singleindex)[0];
                                    };
                                    if(oDivnext){
                                        startMove('x', oDivend, tX, 0, true);
                                        startMove('x', oDivnext[0], (subwidth+tX), subwidth);
                                    }else{
                                        startMove('x', oDivend, tX, 0, true);
                                    };
                                    isprevnext = false;
                                    oDiv.removeEventListener('touchstart',fnStart,false);
                                }else if(tX > 100){
                                    var oDivendpre = oDiv;
                                    if(!prevstate){
                                        oDivendpre = $('.subquestion').eq(examengine.singleindex)[0];
                                    };
                                    if(oDivprev){
                                        startMove('x', oDivendpre, tX, subwidth, true);
                                        startMove('x', oDivprev[0], (-subwidth+tX), 0);

                                        examengine.singleindex = examengine.singleindex - 1;
                                        if (examengine.status == 'piyue' && examengine.useridentity == 'teacher') {
                                            ifradio = $('.subquestion').eq(examengine.singleindex).attr('data-isobjective');
                                            if(examengine.studentanswerjson.ans[examengine.singleindex].isanswer == 0){
                                                ifradio = 'true';
                                            };
                                            showhideradio(ifradio, examengine.singleindex);
                                        };
                                        isprevnext = true;
                                    }else{
                                        startMove('x', oDivendpre, tX, 0, true);
                                        isprevnext = false;
                                    };
                                    oDiv.removeEventListener('touchstart',fnStart,false);
                                }else if(tX > 0){
                                    var oDivendpre = oDiv;
                                    if(!prevstate){
                                        oDivendpre = $('.subquestion').eq(examengine.singleindex)[0];
                                    };
                                    if(oDivprev){
                                        startMove('x', oDivendpre, tX, 0, true);
                                        startMove('x', oDivprev[0], (-subwidth+tX), -subwidth);
                                    }else{
                                        startMove('x', oDivendpre, tX, 0, true);
                                    };
                                    isprevnext = false;
                                    oDiv.removeEventListener('touchstart',fnStart,false);
                                };

                                oDiv.removeEventListener('touchmove',fnMove,false);
                                oDiv.removeEventListener('touchend',fnEnd,false);
                                tX = 0;
                                tY = 0;
                            }else{
                                isprevnext = false;
                                var documentheight = $('#testpaper').height();
                                var windowheight = $('body').height();
                                if(windowheight >= documentheight){
                                    startMove('y', oDiv, tY, 0);
                                }else{
                                    if(oDiv.offsetTop > 0){
                                        //oDiv.style.marginTop = 0;
                                        startMove('y', oDiv, tY, 0);
                                    }else{
                                        if(oDiv.offsetTop <= (windowheight-documentheight)){
                                            var currentY = oDiv.offsetTop;
                                            //oDiv.style.marginTop = (windowheight-documentheight) + 'px';
                                            startMove('y', oDiv, currentY, (windowheight-documentheight-60));
                                        };
                                    };
                                };

                                oDiv.removeEventListener('touchstart',fnStart,false);
                                oDiv.removeEventListener('touchmove',fnMove,false);
                                oDiv.removeEventListener('touchend',fnEnd,false);
                                tX = 0;
                                tY = 0;
                                istouch = false;
                                listentouch(isprevnext);
                            };
                        }
                        if(event.target.nodeName == 'TEXTAREA' || event.target.nodeName == 'INPUT' || $.trim(event.target.className) == 'voice' || event.target.className == 'voicestop' || event.target.parentNode.className == 'lishow' || event.target.parentNode.parentNode.className == 'addphoto' || $.trim(event.target.className).indexOf('select_i') > -1 || $.trim(event.target.className) == 'del' || $.trim(event.target.className) == 'scontent' || event.target.nodeName == 'A' || event.target.className == 'linebox' || event.target.parentNode.className == 'linebox'){

                        }else{
                            oDiv.addEventListener('touchmove',fnMove,false);
                            oDiv.addEventListener('touchend',fnEnd,false);
                            ev.preventDefault();
                        };
                    }else{
                        $('.btn').val(istouch);
                        function turntouchstate(){
                            istouch = false;
                        };
                        oDiv.addEventListener('touchend',turntouchstate,false);
                    };

                };
                oDiv.addEventListener('touchstart',fnStart,false);

                function startMove(isxy, obj, starttX, iTarget, touchstate){
                    clearTimeout(obj.timer);
                    var count = Math.floor(1000/120);
                    var start = starttX;
                    var dis = iTarget-start;
                    var n = 0;

                    movetime();

                    function movetime(){
                        n++;
                        var a = 1-n/count;
                        starttX = start+dis*(1-Math.pow(a,3));

                        if(isxy == 'x'){
                            if(starttX < 0){
                                obj.style.marginLeft = starttX + 'px';
                            }else{
                                obj.style.marginLeft = starttX + 'px';
                            };
                            obj.timer = setTimeout(movetime, 30);
                            if(n == count){
                                clearTimeout(obj.timer);
                                if(touchstate){
                                    listentouch(isprevnext);
                                };
                            };
                        }else{
                            if(starttX < 0){
                                obj.style.marginTop = starttX + 'px';
                            }else{
                                obj.style.marginTop = starttX + 'px';
                            };
                            obj.timer = setTimeout(movetime, 30);
                            if(n == count){
                                clearTimeout(obj.timer);
                                if(touchstate){
                                    listentouch(isprevnext);
                                };
                            };
                        };
                    };
                };

                //监听subquestion高度
                $('.subquestion').resize(function(){
                    $('.examparts').css('height', (subparent.find('.title').height() + $('.subquestion').eq(examengine.singleindex).height() + 24) + 'px');
                    subparent.css('height', (subparent.find('.title').height() + $('.subquestion').eq(examengine.singleindex).height() + 24) + 'px');
                });
            };
        }
        var _totalscore = 0;
        ///重新排序,同时获取分数
        $(examengine.htmlcontainerid).find(".subquestionnum").each(function (i) {
            $(this).html((i + 1) + ".");
            $(this).parent().parent().attr("data-index", (i + 1));
            _totalscore = _totalscore + parseInt($(this).parent().parent().attr("data-score"), 10);
        });
        $("#examsheet_score").html(_totalscore);
        ///重新生成答题卡
        examengine.htmlanswersheet = examengine.getanswersheet();
       // $("#answercarditem").html(examengine.htmlanswersheet);
        //examengine.htmlanswersheet = examengine.getanswersheet();
        $("#answercarditem").html(examengine.htmlanswersheet);
        $("#answercarditem").css("max-height", $(window).outerHeight() / 2 - 100);
        //设置答题卡题号按钮
        $("#answercarditem").find("a").on("click", function () {
            $('body,html').stop().animate({
                scrollTop: $(".subquestion[data-index='" + $(this).html() + "']").offset().top - 20
            });
        });
        //答题设置
        $(examengine.htmlcontainerid).find(".selectitem").find(".select_i").click(function () {
            var _obj = $(this).parent().parent();
            var _subquestionindex = _obj.parent().attr("data-index");
            var _answerobj=_obj.parent().find(".replycontainer");
            if ($(this).hasClass("checkbox"))
            {
                if ($(this).hasClass("checked")) {
                    $(this).removeClass("checked")
                }
                else {
                    $(this).addClass("checked")
                }

            }
            else
            {
                _obj.find(".select_i").removeClass("checked");
                $(this).addClass("checked");

            }
            var _val = "";
            $(this).parent().parent().find(".select_i").each(function () {
                if ($(this).hasClass("checked"))
                    _val = _val + $(this).parent().attr("data-value")
            });
            _answerobj.find("input").val(_val);

            $("#answercarditem").find("[data-index='" + _subquestionindex + "']").addClass("this");
            $("#answercarditem").find("[data-index='" + (parseInt( _subquestionindex,10)+1) + "']").click()
        });
        $(examengine.htmlcontainerid).find(".selectitem").find(".scontent").click(function () {
            var _obj = $(this).parent().parent();
            var _subquestionindex = _obj.parent().attr("data-index");
            var _answerobj=_obj.parent().find(".replycontainer");
            var selecti = $(this).parent().find('.select_i');
            if (selecti.hasClass("checkbox"))
            {
                if (selecti.hasClass("checked")) {
                    selecti.removeClass("checked")
                }
                else {
                    selecti.addClass("checked")
                }

            }
            else
            {
                _obj.find(".select_i").removeClass("checked");
                selecti.addClass("checked");

            }
            var _val = "";
            $(this).parent().parent().find(".select_i").each(function () {
                if ($(this).hasClass("checked"))
                    _val = _val + $(this).parent().attr("data-value")
            });
            _answerobj.find("input").val(_val);

            $("#answercarditem").find("[data-index='" + _subquestionindex + "']").addClass("this");
            $("#answercarditem").find("[data-index='" + (parseInt( _subquestionindex,10)+1) + "']").click()
        });
       
        
        if (examengine.status != "edit"&&examengine.status != "insert") {
            return false;
        }
        $(examengine.htmlcontainerid).find(".examsheet_settime").unbind();
        $(examengine.htmlcontainerid).find(".examsheet_showanswer").unbind();
        $(examengine.htmlcontainerid).find(".examsheet_showpoint").unbind();
        $(examengine.htmlcontainerid).find("#examheader_title").unbind();
        $(examengine.htmlcontainerid).find(".equestion").unbind();
        $(examengine.htmlcontainerid).find(".examsections_title").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_moveup").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_movedown").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_del").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_edit").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_moveup").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_manualchange").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_autochange").unbind();
        $(examengine.htmlcontainerid).find(".editscore").unbind();
        $(examengine.htmlcontainerid).find(".questionmenu_score").unbind();
        
        $(examengine.htmlcontainerid).find("#examheader_title").click(function () {
            var _html = $(this).html();
            if ($(this).find("input").length == 0) {
                $(this).html("<input type='text'/>");
                $(this).find("input").val(_html);
                $(this).find("input").focus();
                $(this).find("input").blur(function () {
                    $(this).parent().html($(this).val());
                });
                $(this).find("input").on('input',function(){
                    var maxlength = 15;
                    var txtval = $(this).val();
                    var txtlength = txtval.length;
                    if(txtlength > maxlength){
                        $(this).val(txtval.substring(0, maxlength));
                    }
                });
            }
        })
        $(examengine.htmlcontainerid).find(".examsheet_showanswer").click(function () {
            if ($(this).html() == "显示答案") {
                $(this).html("隐藏答案")
                $(".ans_answer").show();
                $(".ans_diff").show();
                $(".ans_analysis").show();
                $(".analyse").show();
                
            }
            else {
                $(this).html("显示答案");
                $(".ans_answer").hide();
                $(".ans_diff").hide();
                $(".ans_analysis").hide();
                if ($(".ans_knowledges").css("display") != "block")
                {
                    $(".analyse").hide();
                }
            }
        });
        $(examengine.htmlcontainerid).find(".examsheet_showpoint").click(function () {
            if ($(this).html() == "显示知识点") {
                $(this).html("隐藏知识点")
                $(".knowledges").show();
                $(".chapters").show();
                $(".analyse").show();
            }
            else {
                $(this).html("显示知识点");
                $(".knowledges").hide();
                $(".chapters").hide();
                if ($(".answer").css("display") != "block") {
                    $(".analyse").hide();
                }
            }
        });
        $(examengine.htmlcontainerid).find(".examsheet_settime").click(function () {
            examengine.layout.init({
                title: "设置作答时间", content: "<div>作答时间：<input type='text' class='input' style='width:40px'/>(分)<span style='color:#f00;font-size:12px;' id='examlayout_error'></span></div>", isshowbtn: true, callback: function () {
                    var _val =$.trim( $(".examlayoutbox_content").find("input").val()).trim();
                    if(_val=="")
                    {
                        _val="0";
                    }
                    if (_val != "0") {
                        if (/[1-9]\d{1,2}/.test(_val)) {
                            $("#examsheet_time").attr("data-time", _val);
                            $("#examsheet_time").html(_val + "分钟");
                        }
                        else {$("#examlayout_error").html("作答时间输入错误！");
                            return false;
                        }
                    }
                    else {
                        _val = "0";
                        $("#examsheet_time").attr("data-time", _val);
                        $("#examsheet_time").html("不限制");
                    }
                    examengine.examtime = parseInt(_val, 10);
                    examengine.layout.close();
                    $("#examlayoutbtn_sure").unbind();
                }

            });
        })
        $(examengine.htmlcontainerid).find(".equestion").bind("click", function () {
            //移动端区别
            $(examengine.htmlcontainerid).find(".equestion").css("border", "1px solid #fff").find(".questionmenu").hide();

            if ($(".editquestion").length == 1)
                return false;
            $(this).find(".questionmenu").show();
            $(this).css("border", "1px solid #1887e3");
            if (examengine.status == "insert")
            {
                $("#exam_word_source").css("margin-top", "0px");
                $("#exam_word_source").find("div").removeClass("active");
                $(".buttonright").css("display", "none");
                var num = $.trim($(this).attr("data-id"));

                $("#exam_word_source").find("[data-guid='" + num + "']").addClass("active");
                var y = examengine.insert.getY(this);

                var leftobjtop = 0;
                if ($("#exam_word_source").find("[data-guid='" + num + "']").length == 1) {
                    leftobjtop = $("#exam_word_source").find("[data-guid='" + num + "']").offset().top;


                    $("#exam_word_source").css("margin-top", (y - leftobjtop) + "px");

                }
            }
        })/*.bind("mouseout", function () {
            $(this).find(".questionmenu").hide();
            $(this).css("border", "1px solid #fff");
            if (examengine.status == "insert")
            {
                $("#exam_word_source").find("div").removeClass("active");
                $("#exam_word_source").css("margin-top", "0px");
            }
        })*/;//移动端去掉
        $(examengine.htmlcontainerid).find(".examsections_title").bind("mouseover", function () {
            //移动端去掉设置分数
            return false;
            $(this).find(".questionmenu").show();
            $(this).css("border", "1px solid #1887e3");
        }).bind("mouseout", function () {
            $(this).find(".questionmenu").hide();
            $(this).css("border", "1px solid #fff");
        });
        $(examengine.htmlcontainerid).find(".questionmenu_moveup").bind("click", function () {
            var obj = $(this).parent().parent();

            if (!obj.prev().hasClass("examsections_title")) {
                obj.prev().before(obj.clone());
                obj.remove();
                examengine.bindevent();
                // TestPaper.getsocre();
            }
            else {
                examengine.layout.alert("试卷提示", "无法上移");
            };
        });
        $(examengine.htmlcontainerid).find(".questionmenu_movedown").bind("click", function () {
            var obj = $(this).parent().parent();

            if (obj.next().length == 1) {
                obj.next().after(obj.clone());
                obj.remove();
                examengine.bindevent();
                //TestPaper.getsocre();
            }
            else {
                examengine.layout.alert("试卷提示", "无法下移");
            };
        });
        $(examengine.htmlcontainerid).find(".questionmenu_del").bind("click", function () {
            var _obj = $(this).parent().parent();
            examengine.layout.confirm("提示", "确定要删除吗？",  function () {
                    //console.log(_obj.html())
                    if (_obj.parent().find(".equestion").length == 1) {
                        examengine.layout.alert("提示", "无法删除，必须存在一道题")
                    }
                    else {
                        _obj.remove();
                        examengine.bindevent();
                        examengine.layout.close();
                    }
                })
           
        });
        $(examengine.htmlcontainerid).find(".questionmenu_manualchange").bind("click", function () {
            var obj = $(this).parent();
            var teachingmaterial = ""


            var questiontypeid = obj.parent().attr("data-typeid");
            var questionids = "";

            var currentid = obj.parent().attr("data-id");
            var bodyobj = obj.parent();
            bodyobj.append("<div class='changequestionloading'>正在智能替换试题，请勿重复操作！</div>")
            bodyobj.find(".chapters").find("a").each(function () {
                if (teachingmaterial != "")
                    teachingmaterial = teachingmaterial + ","
                teachingmaterial = teachingmaterial + $(this).attr("data-id")
            })
            //console.log(bodyobj.find(".paperbody_bq").html());
            bodyobj.parent().find(".equestion").each(function () {
                if (questionids != "")
                { questionids = questionids + ","; }
                questionids = questionids + $(this).attr("data-id");

            });
            examengine.changequestion(1, currentid, teachingmaterial, questiontypeid, questionids, 0);

        }),
        $(examengine.htmlcontainerid).find(".questionmenu_autochange").bind("click", function () {

            var obj = $(this).parent();
            var teachingmaterial = ""
           
           
            var questiontypeid = obj.parent().attr("data-typeid");
            var questionids = "";
            
            var currentid = obj.parent().attr("data-id");
            var bodyobj = obj.parent();
            bodyobj.append("<div class='changequestionloading'>正在智能替换试题，请勿重复操作！</div>")
            bodyobj.find(".ans_chapters").find("a").each(function () {
                if (teachingmaterial != "")
                    teachingmaterial = teachingmaterial + ",";
                teachingmaterial = teachingmaterial + $(this).attr("data-id")
            })
            //console.log(bodyobj.find(".paperbody_bq").html());
            bodyobj.parent().find(".equestion").each(function () {
                if (questionids != "")
                { questionids = questionids + ","; }
                questionids = questionids + $(this).attr("data-id");

            });
            examengine.changequestion(2, currentid, teachingmaterial, questiontypeid, questionids, 0);
        });
        $(examengine.htmlcontainerid).find(".editscore").bind("click", function () {
            var html = "<div style='line-height:33px;'>" + $(this).parent().parent().find(".examsections_name").html() +
                " 共" + $(this).parent().parent().parent().find(".subquestion").length + "题 共$score$分</div>";
            html = html + "<div style='padding-top:20px;margin-bottom:20px; border-bottom:1px solid #ddd; overflow:hidden;'>"
            html = html + "<a href='javascript:void(0)' class='examlayoutsetting_score_a' style='display:block;float:left;background:#efefef; margin-right:10px; padding:5px 10px; border:1px solid #ddd; border-bottom:0'>单题设置</a>"
            html = html + "<a href='javascript:void(0)' class='examlayoutsetting_score_a'  style='display:block; float:left;padding:5px 10px; border:1px solid #ddd; border-bottom:0'>统一设置</a></div>";
            html = html +"<div class='examlayoutsetting_score'>"
            var totalscore = 0;
            var _temphtml = "";
            $(this).parent().parent().parent().find(".subquestion").each(function () {
                var score = $(this).attr("data-score");
                var index = $(this).attr("data-index");
                _temphtml = _temphtml + "<div style='line-height:33px; float:left;width:50%'>第" + index + "题：<input type='text' data-index='" + index + "' class='input' style='width:40px;' value='" + score + "'/>分</div>"
                totalscore = totalscore + parseInt(score, 10);
            });
            html = html.replace("$score$", totalscore);
            html = html + _temphtml;
            html = html + "</div>";
            html = html + "<div class='examlayoutsetting_score' style='display:none'>分数：<input type='text' data-index='0' class='input' style='width:50px'></div>"
            examengine.layout.init({
                title: "编辑分数", content: html,
                isshowbtn: true,
                ishidencancel: true,
                width: 450,
                surename: "设置",
                callback: function () {
                    // $("#exampapertitle").html($("#editexampapertitletext").val());

                    var reg = /[1-9](\d{1,2})?/;
                    $(".examlayoutsetting_score").each(function (i) {
                        if ($(this).css("display") != "none")
                        {
                            var _obj = $(".examlayoutsetting_score").eq(i)
                            if (i == 1)
                            {
                                _obj.find("span").remove();
                                var _val=_obj.find("input[type='text']").val()
                                if (!reg.test(_val)) {
                                    _obj.append("<span style='color:#f00;font-size:12px;'>设置分数无效</span>")
                                }
                                else {
                                    $(".examlayoutsetting_score").eq(0).find("input[type='text']").each(function () {
                                        $(this).val(_val);
                                    })
                                }
                            }
                            $(".examlayoutsetting_score").eq(0).find("input[type='text']").each(function () {
                                if (reg.test($(this).val()))
                                    $(".subquestion[data-index='" + $(this).attr("data-index") + "']").attr("data-score", $(this).val());
                            });
                        }

                    })
                    
                    examengine.getexamscore();
                    examengine.layout.close();
                }
            });
            $(".examlayoutsetting_score_a").click(function () {
                $(".examlayoutsetting_score_a").css("background", "none");
                $(this).css("background", "#efefef");
                $(".examlayoutsetting_score").hide();
                $(".examlayoutsetting_score").eq($(this).index()).show();
                
            })
        });
        $(examengine.htmlcontainerid).find(".questionmenu_score").bind("click", function () {
            var _obj = $(this).parent().parent();

            examengine.layout.init({
                title: "设置分值", content: "<div>分值：<input type='text' class='input' style='width:50px;'/><span style='color:#red' id='layouterror'></span></div>", isshowbtn: true, surename: "修改", callback: function () {
                    //
                    var _val = $(".examlayoutbox_content").find("input").val();
                    if (/[1-9]\d+/.test(_val))
                    {
                        _obj.find(".subquestion").attr("data-score", _val);
                        _obj.find(".analysebox .score").find("div").html(_val);
                        examengine.layout.close();
                    }
                    else
                    {
                        $("#layouterror").html("请输入数字")
                    }
                   
                }
            })

        });
        $(examengine.htmlcontainerid).find(".questionmenu_edit").bind("click", function () {
            var _obj = $(this).parent().parent();


            var _temphtml = "";
            if ($(this).find(".title").length == 1) {
                _temphtml = _temphtml + "<p>" + $(this).find(".title").html() + "</p>";
            }
            _obj.find(".subquestion").each(function (i) {
                
                var _subobj = $(this).find(".subtitle").clone();
                _subobj.find("em").remove();
                _temphtml = _temphtml + "<p>" + (i + 1) + ". " + _subobj.html() + "</p>";
                $(this).find(".selectitem>li").each(function () {
                    _temphtml = _temphtml + "<p>" + $(this).find(".item").html() + " " + $(this).find(".scontent").html() + "</p>";
                });
                //
                _temphtml = _temphtml + "<p>【答案】" + $(this).find(".ans_answer").find("div").html() + "</p>";
                _temphtml = _temphtml + "<p>【分值】" + $(this).attr("data-score") + "</p>";
                _temphtml = _temphtml + "<p>【难度】" + $(this).find(".ans_diff").attr("data-diff") + "</p>";
                _temphtml = _temphtml + "<p>【答案说明】" + $(this).find(".ans_analysis").find("div").html() + "</p>";
                var _pobj = $(this).find(".ans_knowledges").find("div");
                var _phtml = "";
                _pobj.find("a").each(function () {
                    if (_phtml != "")
                        _phtml = _phtml + "；";
                    _phtml = _phtml + $(this).html();
                })
                _temphtml = _temphtml + "<p>【知识点】" + _phtml + "</p>";
            });
            var _html = "<div class='editquestion' data-id='" + _obj.attr("data-id") + "'>";
            _html = _html + " <div  contentEditable='true' class='editquestion_content'>" + _temphtml + "</div>";
            _html = _html + " <div  style=' padding-top:20px; text-align:right'>";
            _html = _html + " <a href='javascript:;' class='btn btn_white editquestion_can'>取消</a>";
            _html = _html + " <a href='javascript:;' class='btn editquestion_save'>保存</a></div>";
            _html = _html + " </div>";
            //ajax_exam_contents
            _obj.after(_html);
            $(".editquestion_save").click(function () {
                // console.log(encodeURIComponent($(this).parent().parent().find(".editquestion_content").html()))
                var _id=$(this).parent().parent().attr("data-id");
                $.ajax({
                    url: "/Bookroom/homework/ajax_exam_contents", type: "post", dataType: "json",
                    data: { htmlcontent: encodeURIComponent( $(this).parent().parent().find(".editquestion_content").html()) }, success: function (json) {
                        var _contenthtml = examengine.handdlequestion(json.Data);
                        $(".equestion[data-id='" + _id + "']").after(_contenthtml);
                        $(".equestion[data-id='" + _id + "']").remove();
                        $(".editquestion").remove();
                        examengine.bindevent();
                    }
                });

            })
            $(".editquestion_can").click(function () {

                $(this).parent().parent().remove();
            })
            _obj.hide();
        });
    },
    numberconvertchinese: function (num) {
        var str = "";
        num = num + "";
        var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var _genum = "";
        var _shinum = "";
       if(num.length==1)
       {
           _genum = num;
           
       }
       if (num.length == 2) {
           _genum = num.substr(1);
           _shinum=num.substr(0,1)
       }
       if (_shinum != "") {
           if (_shinum != "0") {
               str = arr[parseInt(_shinum, 10) - 1]+"十";
           }
       }
       if (_genum != "") {
           if (_genum != "0") {
               str = str+arr[parseInt(_genum, 10) - 1];
           }
       }
       return str;
    },
    bindevettimer: function ()
    {
        var _secord =parseInt( $("#examtime_text").attr("data-value"),10)
        if (!examengine.ispause)
            _secord = _secord - 1;
        if (_secord == 0)
        {
            $("#examtime_text").html("00:00:00");
            //$(".btn-exam-post").attr("data-isautopost", "true");
           // $(".btn-exam-post").click();
        }
        else
        {
           
            var hours = Math.floor((_secord) / 3600);
            var minutes = Math.floor((_secord - hours * 3600) / 60);
            var seconds = (_secord - hours * 3600 - minutes * 60);
            if (hours < 10)
                hours = "0" + hours;
            if (minutes < 10)
                minutes = "0" + minutes;
            if (seconds < 10)
                seconds = "0" + seconds;
          //  $("#examtime_icon").css("transform", "rotate(" + ischool.ExamPaper.examtimeicondeg + "deg)");
            $("#examtime_text").html(hours + ":" + minutes + ":" + seconds)
            $("#examtime_text").attr("data-value", _secord);
            setTimeout("examengine.bindevettimer()", 1000);
        }
    },
    handdlequestion: function (question) {
        var content = question.content;
        var isbigquesion = false;
        /*if (question.content != "") {
            content = question.content;
            var index = question.subquestions[0].index;
            content = content.replace("#begin#", "(<u class='bigbeginnum'>" + question.subquestions[0].index + "</u>)");
            content = content.replace("#end#", "(<u class='bigendnum'>" + (question.subquestions[question.subquestions.length - 1].index) + "</u>)");
            isbigquesion = true;
            var tempcontent = "";
            var tempindex = index;
            $.each(content.split(/#num#/g), function (i, c) {
                if (i != 0) {
                    tempcontent = tempcontent + "<u class='bignum'>" + tempindex + "</u>"
                }
                tempcontent = tempcontent + c;
                tempindex = tempindex + 1;

            });
            content = tempcontent;
        }*/
        var html = "";
        html = html + "<div class='equestion' data-id='" + question.id + "'  data-innerid='' ";
        html = html + " data-typeid='" + question.typeid + "'  data-typename='" + question.typename + "' ";
        html = html + " id='big_" + question.id + "' data-index='" + question.index + "'>"
        if (content != "") {
            html = html + "<div class='title'>" + examengine.replaceshowcontent(content) + "</div>";
        }
        $.each(question.subquestions, function (q, model) {
            html = html + examengine.handdlesubquestion(model);
        });
        ///用户编辑的时候显示
        if (examengine.status == "edit" || examengine.status == "insert") {
            var movemenuhtml = "<div class=\"questionmenu\" style=\"display: none;\">";
            if(examengine.ischangequestion)
                movemenuhtml = movemenuhtml + "       <a href='javascript:;' class=\"questionmenu_autochange\">智能换题</a>";
            if (examengine.status == "insert")
            {
                movemenuhtml = movemenuhtml + " <a href='javascript:;' class=\"questionmenu_edit\">修改</a>";
            }
            movemenuhtml = movemenuhtml + "<a href='javascript:;' class=\"questionmenu_del\">删除</a><a href='javascript:;' class=\"questionmenu_moveup\">上移</a><a href='javascript:;' class=\"questionmenu_movedown\">下移</a>";
            movemenuhtml = movemenuhtml + "     </div>";
            html = html + movemenuhtml;

        }
        html = html + "</div>";
        return html;
    },
    handdlesubquestion: function (model) {
        //添加评论
        var comments = examengine.getcomments(model.id);
        var html = "";
        var _myanswerjson = examengine.getmycurrentanswer(model.id);
        //var _class = "viewquestion";
        //if (examengine.status == "do") {
        //    _class = "";
        //}

        //我的答案错误显示红色
        var anserrorclass = '';
        if(_myanswerjson.isright == 0){
            anserrorclass = " class='error'";
        }else{
            anserrorclass = "";
        };

        html = html + "<div class='subquestion' data-index='" + model.index + "' data-stuqueid='" + _myanswerjson.stuqueid + "' ";
        html = html + " data-score='" + model.score + "' data-innerid='' ";
        html = html + " data-id='" + model.id + "' id='sub_" + model.id + "' ";
        html = html + " data-isanswer='" + _myanswerjson.isanswer+ "'";
        if (examengine.status == "view" || examengine.status == "piyue")
            html = html + " data-isright='" + _myanswerjson.isright + "'";
        html = html + " data-isobjective='" + model.isobjective + "'>";

        html = html + "<div class='subtitle'><em class='subquestionnum'>" + model.index + ".</em>" +examengine.replaceshowcontent( model.content) + "</div>";
        var _isselectquestion = false;
        if ("[object Array]" === {}.toString.call(model.selectitems)) {
            var itemhtml = "";
            var isitempic = false;//是否有图片
            var maxlength = 0;//最大字符
            if (model.selectitems.length == 2)
            {
                _isselectquestion = true;
                var _linehtml1 = "";
                var _linehtml2 = "";
                for (var i = 0; i < model.selectitems[0].length; i++)
                {

                    _linehtml1 = _linehtml1 + "<div class='linebox' onclick=' examengine.line.clickevent(this)'><span class='linebox_item'>" + String.fromCharCode(65 + i) + "1</span><div class='linebox_content'>" + examengine.replaceshowcontent(model.selectitems[0][i].content) + "</div></div>";

                }
                for (var i = 0; i < model.selectitems[1].length; i++) {
                    _linehtml2 = _linehtml2 + "<div class='linebox' onclick=' examengine.line.clickevent(this)'><span class='linebox_item'>" + String.fromCharCode(65 + i) + "2</span><div class='linebox_content'>" + examengine.replaceshowcontent(model.selectitems[1][i].content) + "</div></div>";
                }
                itemhtml = "<div class='linecontainer'><div class='linecontainer_left'>" + _linehtml1 + "</div><div  class='linecontainer_right'>" + _linehtml2 + "</div></div>"
            }
            else
            {
                if (model.selectitems.length == 0)
                { _isselectquestion = false; }
                else
                {
                    if (model.selectitems[0].length > 0) {
                        _isselectquestion = true;

                        _checkboxclass = "";
                        if (model.answer.length > 1)
                        { _checkboxclass = "checkbox"; }
                        itemhtml = " <ul class='selectitem'>";
                        $.each(model.selectitems[0], function (si, item) {
                            itemhtml = itemhtml + " <li style='#$$#' data-value='" + item.itemname + "'>";
                            var _selectedclass = "";
                            for (var i = 0; i < _myanswerjson.result.length; i++)
                            {
                                if (_myanswerjson.result.substr(i, 1) == item.itemname)
                                {
                                    _selectedclass=" checked"
                                }
                            }
                            if (examengine.status == "do") {
                                itemhtml = itemhtml + "<i class='select_i " + _checkboxclass + _selectedclass+"'></i>";
                            }
                            itemhtml = itemhtml + "<span class='item'>" + item.itemname + ".</span>";
                            itemhtml = itemhtml + "<span class='scontent'>" + examengine.replaceshowcontent(item.content) + "</span></li>";
                            if (item.content.indexOf("<img") >= 0) {
                                isitempic = true;
                                maxlength = 0;
                            }
                            if (isitempic == false) {
                                if (maxlength < item.content.length)
                                    maxlength = item.content.length;
                            }

                        });
                        itemhtml = itemhtml + " </ul>";
                    }
                }
            }

            if (isitempic) {
                itemhtml = itemhtml.replace(/\#\$\$\#/g, "width:100%");
            }
            else {
                // console.log(maxlength)
                if (maxlength < 7) {
                    itemhtml = itemhtml.replace(/\#\$\$\#/g, "width:24%");
                }
                else if (maxlength < 18 && maxlength > 7) {
                    itemhtml = itemhtml.replace(/\#\$\$\#/g, "width:49%");
                }
                else { itemhtml = itemhtml.replace(/\#\$\$\#/g, "width:100%"); }

            }
            html = html + itemhtml;


        }
        //console.log(examengine.status)
        // console.log(examengine.status)
        ///正在做题无续出题
        if (examengine.status == "view" || examengine.status == "edit"||examengine.status=="insert") {
            var diffhtml = "";
            for (var i = 1; i <= model.diff; i++) {
                diffhtml = diffhtml + "<u class='active'></u>";
            }
            for (var i = model.diff + 1; i <= 5; i++) {
                diffhtml = diffhtml + "<u></u>";
            }
            var _style = " style='display:none'";
            if (examengine.status == "view")
            {
                if (examengine.studentanswerstatus >= 1)
                    _style = "";

            }
            if (examengine.status == "insert")
            {
                _style = "";
            }
            if (examengine.isdisplayanswersheet == false && examengine.status == "edit")
            {
                _style = "";
            }
            //  html = html + "<div class='answerline'></div>"
            html = html + "<div class='analyse' " + _style + ">"
            if (examengine.status == "view" && (examengine.studentid!="")) {
                var _myscore = _myanswerjson.score;
                var _myanswer = _myanswerjson.result
                if (examengine.studentanswerstatus < 2) {
                    if (model.isobjective == false) {
                        if (_myanswerjson.isanswer == 0)
                        { _myscore = "<u style='color:#ee491f;text-decoration:none;'>未作答</u>";}
                        else {
                            _myscore = "<u style='color:#ee491f;text-decoration:none;'>未批阅</u>";
                        }

                    }
                    //_myscore
                };

                if(examengine.useridentity == 'teacher'){
                    html = html + "<div class='analysebox myanswer  ans_answer'><span><i></i>学生答案：</span><div"+anserrorclass+">" + _myanswer + "</div></div>";
                    html = html + "<div class='analysebox myanswer ans_score'><span><i></i>学生得分：</span><div>" + _myscore + "</div></div>";
                }else{
                    html = html + "<div class='analysebox myanswer  ans_answer'><span><i></i>我的答案：</span><div"+anserrorclass+">" + _myanswer + "</div></div>";
                    html = html + "<div class='analysebox myanswer ans_score'><span><i></i>我的得分：</span><div>" + _myscore + "</div></div>";
                };
            }
            html = html + "<div class='analysebox ans_answer' " + _style + "> <span><i></i>参考答案：</span><div>" +(model.answer!=""? examengine.replaceshowcontent(model.answer.replace(/#\|#/g, " ； ").replace(/略/g, "")):"") + "</div></div>";
            html = html + "<div class='analysebox ans_score'  " + _style + "><span><i></i>试题分值：</span><div>" + model.score + "</div></div>";

            html = html + "<div class='analysebox ans_diff'  " + _style + " data-diff='" + model.diff + "'><span><i></i>试题难度：</span><div class='diffcontainer'>" + diffhtml + "</div></div>";
            html = html + "<div class='analysebox ans_analysis'  " + _style + "><span><i></i>参考解析：</span><div>" + examengine.replaceshowcontent(model.analysis) + "</div></div>";
            if ("[object Object]" === {}.toString.call(model.extend)) {
                if ("[object Array]" === {}.toString.call(model.extend.knowledges)) {
                    var _pointhtml = "";
                    $.each(model.extend.knowledges, function (s, pointmodel) {
                        _pointhtml = _pointhtml + "<a href='javascript:' data-id='" + pointmodel.id + "'>" + pointmodel.name + "</a>"
                    })
                    html = html + "<div class='analysebox ans_knowledges' " + _style + "><span><i></i>知&nbsp;&nbsp;识&nbsp;&nbsp;点：</span><div>" + _pointhtml + "</div></div>";
                }
                if ("[object Array]" === {}.toString.call(model.extend.chapters)) {
                    var _pointhtml = "";
                    $.each(model.extend.chapters, function (s, pointmodel) {
                        _pointhtml = _pointhtml + "<a href='javascript:' data-id='" + pointmodel.id + "'>" + pointmodel.name + "</a>"
                    })
                    html = html + "<div class='analysebox ans_chapters'  " + _style + "><span><i></i>章&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;节：</span><div>" + _pointhtml + "</div></div>";
                }
            };
            html = html + "</div>";
            if (examengine.issingledisplay)
            {
                html = html + "<div class='radiophoto'>" + comments + "</div>";
            }
            html = html + "<div class='replycontainer_comment' id='exam_q_comment" + model.id + "'></div>";

        }
        else if (examengine.status == "piyue")
        {
            ///_myanswer.status == 1 &&

            html = html + "<div class='analyse'>";
            if(examengine.useridentity == 'teacher'){
                html = html + "<div class='analysebox myanswer'><span>学生答案：</span><div"+anserrorclass+">" + _myanswerjson.result + "</div></div>";
            }else{
                html = html + "<div class='analysebox myanswer'><span>我的答案：</span><div"+anserrorclass+">" + _myanswerjson.result + "</div></div>";
            };

            html = html + "<div class='analysebox answer'><span><i></i>参考答案：</span><div>" + examengine.replaceshowcontent(model.answer.replace(/#\|#/g, " ； ").replace(/略/g, "")) + "</div></div>";
            html = html + "</div>";
            if (model.isobjective == false) {
                var _piyuestyle = "";
                var _piyuescore = "";
                //如果是移动app，则从新加载分数
                //if (examengine.ismobile == true)
                    _piyuescore = examengine.getpiyuescore(model.id);
                if (_myanswerjson.isanswer == 0) {
                    _piyuestyle = " display:none;";
                    _piyuescore = "0";
                }
                html = html + "<div class='replycontainer' style='background:#FFF9F2;" + _piyuestyle + "'>";
                html = html + "     <div class='replycontainer_content'>";
                html = html + "         <div style='padding-bottom:8px;overflow:hidden; '>";
                html = html + "             <div style='float:left;'>得分：<input type='text' class='input pingscore' style='width:18px;' value='" + _piyuescore + "'>（本题分数：" + model.score + "）</div>";
                //是否支持评论和点赞
                if (examengine.isdisplaycomment) {
                    html = html + "             <div style='float:right;'><span class='exam_praise' data-value='0'></span>点赞：</div>";
                }
                html = html + "         </div>";

                //是否支持评论和点赞
                if (examengine.isdisplaycomment) {

                    html = html + "         <textarea placeholder=\"请在此输入您评语,按回车提交\" class='replay_pingyucontent'></textarea>";
                }
                html = html + "     </div>"
                if (examengine.issingledisplay)
                {
                    html = html + "<div class='radiophoto'>" + comments + "</div>";
                }
                html = html + "</div>";
            }
            html = html + "<div class='replycontainer_comment' id='exam_q_comment" + model.id + "'></div>";

        }
        else if (examengine.status == "do") {
            html = html + "<div class='replycontainer'>";
            if (!_isselectquestion) {
                if (model.isobjective)
                {
                    $.each(model.answer.split("#|#"), function (i) {
                        if (examengine.issingledisplay){
                            var blankvalue = '';
                            if(_myanswerjson.result){
                                var arr = _myanswerjson.result.split(' ; ');
                                blankvalue = 'value="'+arr[i]+'"';
                                html = html + "<p><input type='text' class='input' "+blankvalue+" /></p>";
                            }else{
                                html = html + "<p><input type='text' class='input'/></p>";
                            };
                        }else{
                            html = html + "<p><input type='text' class='input'/></p>";
                        };
                    });
                }
                else
                {
                    if (examengine.issingledisplay) {
                        //反显上传的图片
                        var _myanswercontent = _myanswerjson.result;
                        var _myanswerimage = '';
                        if (_myanswercontent.indexOf('<img') > -1) {
                            var answerarr = _myanswercontent.split('<img');
                            _myanswercontent = answerarr[0];
                            for (var k = 1; k < answerarr.length; k++) {
                                _myanswerimage += '<li class="lishow"><span onclick="$(this).parent().remove();"></span><img class="show" ' + answerarr[k] + '</li>';
                            };
                        };
                        html = html + "<div class='replycontainer_content'><textarea placeholder=\"请在此输入您的答案\">" + _myanswercontent + "</textarea>";
                        var htmlphoto = '<p style="color: #999;">注：请把答案拍照后上传</p>';
                        htmlphoto += '<div class="addphoto"><ul>' + _myanswerimage + '<li onclick="capturePhoto($(this));"></li></ul></div>';

                        //<a href='javascript:void(0)' class='btn'>确定</a>
                        html = html + "<div class='replyinfo'>" + htmlphoto + "</div>"

                    } else {
                        html = html + "<div class='replycontainer_content'><textarea placeholder=\"请在此输入您的答案\">" + _myanswerjson.result + "</textarea>";
                        var _htmlformpost = "<input type=\"file\" name=\"image\" accept='.jpg,png,jpeg,gif'  onchange=\"examengine.upload('" + model.id + "')\">";
                        var htmlform = "<form id=\"insertPicForm" + model.id + "\" action=\"/Bookroom/Homeworkhome/ajax_questions_pic\" enctype=\"multipart/form-data\">";
                        htmlform = htmlform + "<div class='examuploadfile'>";
                        htmlform = htmlform + _htmlformpost
                        htmlform = htmlform + "</div>";
                        htmlform = htmlform + "</form>";
                        //<a href='javascript:void(0)' class='btn'>确定</a>
                        //html = html + "<div class='replyinfo'><div style='float:right;width:20%'></div><div style='float:left;width:80%'>" + htmlform + "</div></div>"
                        html = html + " <p style=\"color: #999;\">注：请把答案拍照后上传</p>";
                        html = html + "<div class='replyinfo'>" + htmlform + "</div>";

                    }
                    html = html + "</div>";
                }
            }
            else {
                html = html + "<input type='hidden' value='" + _myanswerjson.result + "'/>"
            }
            html = html + "     <div style='display:none' class='questionanswer'>" + examengine.stringtounicode(model.answer) + "</div>";
            html = html + "</div>";
        }
        html = html + "</div>";
        return html;
    },
    changequestion: function (type, currentquestionid, teachingMaterialID, questiontypeid, questionids, difficulty) {

        var postjson = { questionids: questionids, chapterids: teachingMaterialID, questiontype: questiontypeid, changetype: type, pagesize: 10, currpage: 1, diff: 0 };
        $.ajax({
            url: testurl + "/Home/Interface/ajax_getchangequestionlist", type: "post", data: jQuery.param(postjson),
            dataType: "json",
            success: function (json) {
                //console.log(currentquestionid)
                if (json.Success) {
                    var html = "";
                    if (type == 2) {
                        if (json.Data.length == 0) {
                            examengine.layout.alert("消息提示", "当前没有可以智能替换题");
                        }
                        else {
                            var question = json.Data[0];

                            html = examengine.handdlequestion(question);
                            $("#big_" + currentquestionid).after(html);
                            $("#big_" + currentquestionid).remove();
                            examengine.bindevent();
                        }
                        $("#big_" + currentquestionid).find(".changequestionloading").remove();
                    }
                    else {
                        var _numberhtml = "";
                        var _contenthtml = "";
                        html = html + "<div  class='examlayout_questionlist'>";

                        $.each(json.Data, function (q, question) {

                            var _class = "";
                            var _style = " style='display:none'";
                            if (q == 0) {
                                _style = "";
                                _class = "active"
                            }
                            _numberhtml = _numberhtml + "<a href='javascript:void(0)' class='" + _class + "'>" + (q + 1) + "</a>"
                            _contenthtml = _contenthtml + "<div class='examlayout_questionlist_content' " + _style + ">"
                            _contenthtml = _contenthtml + examengine.handdlequestion(question);
                            _contenthtml = _contenthtml + "</div>";

                        });
                        html = html + "<div class='examlayout_questionlist_number'>" + _numberhtml + "</div>";
                        html = html + _contenthtml
                        html = html + "</div>";
                        examengine.layout.init({
                            title: "手动选题", width: 700, content: html,
                            isshowbtn: true,
                            btnalign: "center",
                            ishidencancel: true,
                            surename: "确认替换",
                            callback: function () {
                                var _selectindex = parseInt($(".examlayout_questionlist_number").find("a.active").html(), 10) - 1;
                                //console.log(currentquestionid+"======")
                                $("#big_" + currentquestionid).after($(".examlayout_questionlist_content").eq(_selectindex).html());
                                $("#big_" + currentquestionid).remove();
                                examengine.layout.close();
                                examengine.bindevent();
                            }

                        });
                        //$(".examlayout_questionlist_content").find(".questionmenu").remove();
                        $(".examlayout_questionlist_number").find("a").click(function () {
                            $(".examlayout_questionlist_number").find("a").removeClass("active");
                            $(".examlayout_questionlist_content").hide();
                            $(this).addClass("active");

                            $(".examlayout_questionlist_content").eq($(this).index()).show();
                        });

                    }
                }
                else {
                    examengine.layout.error('接口：'+json.Message);
                    $("#big_" + currentquestionid).find(".changequestionloading").remove();
                }

            }
        })
    },
    //获取学生作答答案
    getmycurrentanswer: function (id) {
        var _myanswer = { result: "",stuqueid:"", status: 0, isanswer: 0,isright:0,score:0 };
        if (typeof examengine.studentanswerjson.questionList != "undefined")
        {
            $.each(examengine.studentanswerjson.questionList, function (q, model) {
                $.each(model.itemlist, function (s, submodel) {
                    if (submodel.queid == id)
                    {
                        _myanswer.result =examengine.replaceshowcontent(submodel.result);
                        _myanswer.stuqueid = submodel.stuqueid;
                        _myanswer.status = parseInt(submodel.status,10);
                        _myanswer.isright = parseInt(submodel.etags, 10);
                        _myanswer.isanswer = parseInt(submodel.isanswer,10);
                        _myanswer.score = parseInt(submodel.score, 10);
                    }
                });
            })
        }

        function addchoice(){
            var index = $('#aa').find('').length;
            var option = getoption(index+1);
            var html = '<script id="ss"+option></script>';
            $('#aaa').append(html);
            $('#ss'+option).ueditor();
        };

        function getoption(num){
            var option = 'E';
            switch (num){
                case 1:
                    option =  'A';
                    break;
                case 2:
                    option = 'B';
                    break;
                case 3:
                    option = 'C';
                    break;
                case 4:
                    option = 'D';
                    break;
                case 5:
                    option = 'E';
                    break;
                case 6:
                    option = 'F';
                    break;
                case 7:
                    option = 'G';
                    break;
                default :
                    option = 'X';
                    break;
            };
            return option;
        };

        //兼容书房
        if ("[object Array]" === {}.toString.call(examengine.studentanswerjson.ans))
        {
           
            if (typeof examengine.studentanswerjson.ans[0].anmainitem != "undefined") {
                $.each(examengine.studentanswerjson.ans, function (q, model) {
                    $.each(model.anmainitem, function (q, model1) {
                        $.each(model1.anpaqamainitem, function (q, model2) {
                            if (model2.anpaqacloudnum == id) {
                                //console.log(model2.anpaqacloudnum)
                                _myanswer.result = model2.ancont;
                                _myanswer.stuqueid = model2.stuqueid;
                                _myanswer.status = 1;
                                _myanswer.isright = parseInt(model2.anisright, 10);
                                if (_myanswer.isright == 2) {
                                    _myanswer.isanswer = 0;
                                    _myanswer.isright = 0;
                                }
                                else
                                    _myanswer.isanswer = 1;
                            }
                        });
                    });
                });
            }
            else {
                $.each(examengine.studentanswerjson.ans, function (q, submodel) {


                    if (submodel.queid == id) {
                        _myanswer.result = examengine.replaceshowcontent(submodel.result);
                        _myanswer.stuqueid = submodel.stuqueid;
                        _myanswer.status = parseInt(submodel.status, 10);
                        _myanswer.isright = parseInt(submodel.etags, 10);
                        _myanswer.isanswer = parseInt(submodel.isanswer, 10);
                        _myanswer.score = parseInt(submodel.score, 10);
                    }

                })
            }
           
        }
        //console.log(JSON.stringify(_myanswer));
        return _myanswer
    },
    //获取用户作答json
    getmyanswerjson: function () {
        return eval("(" + examengine.getbookroommyanswerjson() + ")");
    },
    //书房用户作答使用
    getbookroommyanswerjson: function () {

        var _sectionjson = "";
        var _myexamscore = 0;
        var _subanswer = "";
        var _examscore = examengine.examjson.score;
        $(".examsections").each(function (esindex) {
            var _questionanswerjson = "";
            var _mytotalscore = 0;
            $(this).find(".equestion").each(function () {

                var _totalscore = 0;

                var _errorcount = 0;
                var _isquestionsure = 2;
                var _bigid = $(this).attr("data-id")
                $(this).find(".subquestion").each(function (i) {

                    var _hiddenvalue = "";
                    var _textarea = "";
                    var _textvalue = "";
                    var _value = "";
                    var _quetype = 1;//主观1，客观0；
                    //修正再没有答题的情况下，自动设置状态
                    if ($(this).attr("data-isobjective") == "true") {
                        _quetype = 0;
                    };
                    if ($(this).find("input:hidden").length > 0 && !$(this).find("input:hidden").attr('class')) {
                        _hiddenvalue = $(this).find("input:hidden").val();
                    }
                    $(this).find("input:text").each(function () {
                        if (_textvalue != "")
                            _textvalue = _textvalue + "#|#";
                        var val;
                        if($(this).val() == ''){
                            val = '<##>';
                        }else{
                            val = $(this).val();
                        };
                        _textvalue = _textvalue + val;
                    });
                    if ($(this).find("textarea").length > 0) {
                        _textarea = $(this).find("textarea").val();
                        $(this).find(".examuploadfilecontainer").each(function () {
                            _textarea = _textarea + "[img]" + $(this).find("img").attr("src") + "[/img]";
                        });
                        //移动端使用
                        if ($(this).find('.addphoto').eq(0).find('li').length > 0) {
                            for (var j = 0; j < $(this).find('.addphoto').eq(0).find('li.lishow').length; j++) {
                                var imgurl = $(this).find('.addphoto').eq(0).find('li.lishow').eq(j).find('img').attr('src');
                                _textarea = _textarea + '[img]' + imgurl + '[/img]';
                            };
                        };
                    }
                    var _sureanser = examengine.unicodetostring($(this).find(".questionanswer").html());
                    var _score = parseInt($(this).attr("data-score"), 10);
                    var _myscore = 0;
                    var _issure = 0;//是否正确
                    var _isanswer = 1;//是否作答
                    var _isstatus = 0;
                    _value = examengine.replaceinsertcontent(_hiddenvalue + _textarea + _textvalue);
                   
                    if ($.trim(_value) == "") {
                        _issure = 0;
                        _isanswer = 0;
                    }
                    else {
                        _issure = 0;
                        if ($(this).attr("data-isobjective") == "true") {
                            _quetype = 0;
                            _isstatus = 1;
                            _sureanser = _sureanser.replace(/；/g, ";").replace(/;/g, "#|#");
                            if (_sureanser.indexOf("A1") >= 0 && _sureanser.indexOf("A2") >= 0) {//连线题
                               // console.log(_sureanser);
                                var _isliansure = true;;
                                $.each(_hiddenvalue.split(","), function (i, my) {
                                    // console.log(my + "====");
                                    var _signline = false;
                                    $.each(_sureanser.split("#|#"), function (i, surean) {
                                        if ($.trim(my) == $.trim(surean)) {
                                            // console.log(surean + "-----++++");
                                            _signline = true;
                                        }

                                    });
                                    if (_signline == false)
                                        _isliansure = false;

                                });
                                if (_isliansure) {
                                    _issure = 1;
                                    _myscore = _score;
                                }
                            }
                            else if (_textvalue.indexOf("#|#") >= 0) {
                                $.each(_textvalue.split("#|#"), function (i, my) {
                                    $.each(_sureanser.split("#|#"), function (i, surean) {
                                        if ($.trim(my) == $.trim(surean)) {
                                            _myscore = _myscore + _score / _textvalue.split("#|#").length;
                                        }

                                    });

                                });
                                if (_myscore >= _score)
                                    _issure = 1;

                            }
                            else {
                                if (_sureanser == _value) {
                                    _issure = 1;
                                    _myscore = _score;
                                }

                            }

                        }
                        else {
                            //修正选择类型的题是主观题的问题
                            if (_hiddenvalue == _value) {
                                _issure = 1;
                                _isstatus = 1;
                                _quetype = 0;
                                _myscore = _score;
                            }
                        }
                    }
                    _mytotalscore = _mytotalscore + _myscore;
                    _totalscore = _totalscore + _score;
                    if (_issure == 0)
                        _errorcount = _errorcount + 1;

                    if (_subanswer != "") {
                        _subanswer = _subanswer + ",";
                    }

                    var processanswer = "";
                    _subanswer = _subanswer + "{\"stuqueid\":\"" + _bigid + "\",\"queid\":\"" + $(this).attr("data-id") + "\",\"pascore\":" + _score + ",\"score\":" + _myscore + ",\"etags\":" + _issure + ",\"quetype\":\"" + _quetype + "\",\"isanswer\":" + _isanswer +
                    ",\"whenlong\":0,\"result\":\"" + _value + "\",\"status\":" + _isstatus + "}";
                });

            });
            _myexamscore = _myexamscore+_mytotalscore
        });

        var postjson = "{\"anuuid\":\"" + examengine.paperid + "\",\"anstuid\":\"$studentid$\",\"aname\":\"$studentname$\",\"anstartime\":" + Math.round((examengine.useranswerbegintime.getTime()) / 1000) +
            ",\"anendtime\":" + Math.round($.now() / 1000) + ",\"score\":" + Math.round(_myexamscore * 1.0 / _examscore * 100).toFixed(2) + ",\"actualscore\":" + _myexamscore + ",\"ans\":[" + _subanswer + "]}";
        return postjson;
    },
    getbookroomtypeid: function (typename) {
        if (typename == "")
            return 90;
        if (typename.indexOf("选择题") >= 0 || typename.indexOf("单选题") >= 0) {
            return 10;
        }
        if (typename.indexOf("多选题") >= 0 || typename.indexOf("多项选择题") >= 0 || typename.indexOf("不定项选择题") >= 0) {
            return 20;
        }
        if (typename.indexOf("判断题") >= 0) {
            return 30;
        }
        
        if (typename.indexOf("连线题") >= 0) {
            return 60;
        }
        return 90;
    },
    getexamscore: function () {
        var _totalscore = 0;
        $(".subquestion").each(function () {
            _totalscore = _totalscore + parseInt($(this).attr("data-score"), 10);
        });
        $("#examsheet_score").html(_totalscore);
    },
    //时间比较
    dateDiff: function (interval, objDate1, objDate2) {
        var d = objDate1, i = {}, t = d.getTime(), t2 = objDate2.getTime();
        i['y'] = objDate2.getFullYear() - d.getFullYear();
        i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
        i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
        i['ms'] = objDate2.getTime() - d.getTime();
        i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
        i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
        i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
        i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
        i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
        return i[interval];
    },
    //string转unicode
    stringtounicode: function (str) {
        var res=[];
        for(var i=0;i < str.length;i++)
            res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
        return "\\u"+res.join("\\u");
    },
    //unicode 转string
    unicodetostring: function (str) {
        str = str.replace(/\\/g, "%");
        return unescape(str);
    },
    //入库替换字符
    replaceinsertcontent: function (content)
    {
        if (typeof (content) == "string")
        {
            if (content != "") {
                content = content.replace(/\r/g, "");
                content = content.replace(/\n/g, "<br/>");
                content = content.replace(/\"/g, "\\\"");
                content = content.replace(/&nbsp;/g, " ");
            }
        }
        else
            content="";
        return content;
        
    },
    //展示替换
    replaceshowcontent: function (content) {
        if (content == null)
            return "";
        if (content == "")
            return "";
        content = content.replace("：", ":");
        content = content.replace(/&amp;/g, "&");
        content = content.replace(/&lt;/g, "<");
        content = content.replace(/&gt;/g, ">");
        content = content.replace(/&nbsp;/g, " ");
        content = content.replace(/&quot;/g, "\"");
        content = content.replace(/<\\/g, "<");
        //content = content.replace(/\&nbsp;/g, "");
        content = content.replace("\n", "<br />");
        content = content.replace("<br>", "<br />");
        content = content.replace(/<br\/>/g, "\n");
        if (content.indexOf("img src='data:image")>0)
        { }
        else if (content.indexOf("data:image") == 0) {

            content = "<img src=\"" + content + "\"/>"
        }
        //content = content.replace(/'/g, "");
        content = content.replace(/\[img\]/g, "<img src=\"");
        content = content.replace(/\[\/img\]/g, "\" />");
        content = content.replace(/\[Audio\]/g, "<audio src=\"");
        content = content.replace(/\[\/Audio\]/g, "\" />");
        content = content.replace(/<img/g, "<img style=\"vertical-align:middle\"");
        content = content.replace(/\#\|\#/g, " ; ");//替换分隔符
        content = content.replace(/<##>/g, "");//移动端存储填空题，有没答填空需要
        return content;

    },
    //获取试卷结构
    getexamjson: function () {
        var partsjson = "";
        var _totalscore = 0;
        $(examengine.htmlcontainerid).find(".examparts").each(function () {
            var sectionjson = "";
            $(this).find(".examsections").each(function () {
                var questionjson = "";
                $(this).find(".equestion").each(function () {
                    var subquestionjson = "";
                    var _qcontent = "";
                    var _qscore = 0;
                    if ($(this).find(".title").length == 1) {
                        _qcontent = examengine.replaceinsertcontent($(this).find(".title").html());
                    }
                    var _typeid = $(this).attr("data-typeid");
                    $(this).find(".subquestion").each(function () {
                        var _content = $(this).find(".subtitle").html().replace("<em class=\"subquestionnum\">"+$(this).attr("data-index")+".</em>","");
                        var _isobjective = $(this).attr("data-isobjective");
                        var _score = parseInt($(this).attr("data-score"), 10);
                        _qscore = _qscore + _score;
                        if (subquestionjson != "")
                            subquestionjson = subquestionjson + ","
                        var _selectitems = "";
                       
                        if ($(this).parent().attr("data-typename") == "连线题")
                        {
                            var _selectitems1 = "";
                            var _selectitems2 = "";
                            var setpi = 0;
                            $(this).find(".linecontainer_left").find(".linebox").each(function (i) {
                                    if (_selectitems1 != "")
                                    { _selectitems1 = _selectitems1 + ","; }
                                    _selectitems1 = _selectitems1 + "{\"itemname\":\"" + String.fromCharCode(setpi + 65) + "\",\"content\":\"" + examengine.replaceinsertcontent($(this).find(".linebox_content").html()) + "\",\"issure\":false}";
                                    setpi = setpi + 1;
                                
                            });
                             setpi = 0;
                            $(this).find(".linecontainer_right").find(".linebox").each(function (i) {
                                    if (_selectitems2 != "")
                                    {  _selectitems2 = _selectitems2 + ","; }
                                   
                                    _selectitems2 = _selectitems2 + "{\"itemname\":\"" + String.fromCharCode(setpi + 65) + "\",\"content\":\"" + examengine.replaceinsertcontent($(this).find(".linebox_content").html()) + "\",\"issure\":false}";
                                    setpi = setpi + 1;
                                
                            });
                            _selectitems = "[" + _selectitems1 + "],[" + _selectitems2 + "]";
                        }
                        else
                        {
                            if ($(this).find(".selectitem").find("li").length > 0) {
                                $(this).find(".selectitem").find("li").each(function () {
                                    if (_selectitems != "")
                                        _selectitems = _selectitems + ",";
                                    _selectitems = _selectitems + "{\"itemname\":\"" + $(this).attr("data-value") + "\",\"content\":\"" + examengine.replaceinsertcontent($(this).find(".scontent").html()) + "\",\"issure\":false}"
                                });
                                _selectitems = "[" + _selectitems + "]";
                            }
                        }
                        var _knowledgesjson = "";
                        $(this).find(".ans_knowledges").find("a").each(function () {
                            if (_knowledgesjson != "")
                                _knowledgesjson = _knowledgesjson + ",";
                            _knowledgesjson = _knowledgesjson + "{\"id\":\"" + $(this).attr("data-id") + "\",\"name\":\"" + examengine.replaceinsertcontent($(this).html()) + "\"}"

                        });
                        var _chaptersjson = "";
                        $(this).find(".ans_chapters").find("a").each(function () {
                            if (_chaptersjson != "")
                                _chaptersjson = _chaptersjson + ",";
                            _chaptersjson = _chaptersjson + "{\"id\":\"" + $(this).attr("data-id") + "\",\"name\":\"" + examengine.replaceinsertcontent($(this).html()) + "\"}"

                        });
                        //修正题库或word无法正确设置客观题问题
                        if (_selectitems != "")
                            _isobjective = true;
                        subquestionjson = subquestionjson + "{\"id\": \"" + $(this).attr("data-id") + "\"," +
                        "\"innerid\": \"" + $(this).attr("data-innerid") + "\"," +
                        "\"index\":" + $(this).attr("data-index") + "," +
                        "\"typeid\": \"" + _typeid + "\"," +
                        "\"typename\": \"\"," +
                         "\"isobjective\": " +  _isobjective+ "," +
                        "\"content\": \"" + examengine.replaceinsertcontent(_content) + "\"," +
                        "\"score\": \"" + _score + "\"," +
                        "\"selectitems\": [" + _selectitems + "]," +
                        "\"answer\": \"" + examengine.replaceinsertcontent($(this).find(".ans_answer").find("div").html().replace(/；/g, "#|#")) + "\"," +
                        "\"diff\": \"" + examengine.replaceinsertcontent($(this).find(".ans_diff").attr("data-diff")) + "\"," +
                        "\"analysis\": \"" + examengine.replaceinsertcontent($(this).find(".ans_analysis").find("div").html()) + "\"," +
                        "\"extend\": {\"knowledges\":[" + _knowledgesjson + "]," +
                        "\"testingpoints\":[]," +
                        "\"chapters\":[" + _chaptersjson + "]," +
                        "\"abilitytest\":[]," +
                        "\"dispower\":0," +
                        "\"totaltime \":0" +
                        "}" +
                        "}"
                    });
                    if (questionjson != "")
                        questionjson = questionjson + ","
                    questionjson = questionjson + "{\"id\": \"" + $(this).attr("data-id") + "\"," +
                    "\"innerid\": \"" + $(this).attr("data-innerid") + "\"," +
                    "\"index\": " + $(this).attr("data-index") + "," +
                    "\"typeid\": \"" + _typeid + "\"," +
                    "\"typename\": \"" + $(this).attr("data-typename") + "\"," +
                    "\"content\": \"" + _qcontent + "\"," +
                    "\"subquestions\":[" + subquestionjson + "]," +
                    "\"score\": " + _qscore + "," +
                    "\"answer\": \"\"," +
                    "\"diff\": 0," +
                    "\"analysis\": \"\"," +
                    "\"extend\":{}" +
                    "}";
                    _totalscore = _totalscore + _qscore;
                });
                if (sectionjson != "")
                    sectionjson = sectionjson + ",";
                var _sectiontitle = "";
                if ($(this).find(".examsections_name").length == 1)
                {
                    _sectiontitle = $(this).find(".examsections_name").html();
                }
                sectionjson = sectionjson + "{\"title\": \"" + _sectiontitle + "\"," +
                "\"index\": 0," +
                "\"questions\":[" + questionjson + "]}";
            });
            if (partsjson != "")
                partsjson = partsjson + ",";
            partsjson = partsjson + "{\"title\":\"\",\"examsections\":[" + sectionjson + "]}";
        })
        var json="{\"id\":\""+examengine.paperid+"\","+
        "\"title\": \"" + $(examengine.htmlcontainerid).find(".examheader_title").html() + "\"," +
        "\"desc\": \"\","+
        "\"type\": \"\","+
        "\"examparts\":["+partsjson+"],"+
        "\"answertime\": " + $(examengine.htmlcontainerid).find(".examsheet_time").attr("data-time") + "," +
        "\"score\": " + _totalscore + "," +
        "\"kpcoverage\": 0,"+
        "\"diffdegree\": 0,"+
        "\"reliability\": 0,"+
        "\"validity\": 0,"+
        "\"extend\": {" +
            "\"courseid\":\"" + examengine.courseid + "\"," +
            "\"coursename\":\"" + examengine.coursename + "\"," +
            "\"grade\":\"" + examengine.gradeid + "\"," +
            "\"year\":0," +
            "\"month\":0," +
            "\"province\":\"\"," +
            "\"city\":\"\"," +
            "\"area\":\"\"," +
            "\"auditor\":\"\"," +
            "\"auditschool\":\"\"," +
            "\"author\":\"\"," +
            "\"authorcchool\":\"\"" +
        "}}";
        //console.log(json);
        return eval("("+json+")");
    },
    //试卷内部调用保存
    examsave: function (type)
    {
        var classid = [];
        if ($("input[name='examclassid']").length > 0) {
            $("input[name='examclassid']").each(function () {
                if ($(this).is(':checked')) {
                    classid.push($(this).val())
                }
            });
        }
        var stulist = [];
        if ($("input[name='chkexamstulist']").length > 0) {
            $("input[name='chkexamstulist']").each(function () {
                if ($(this).is(':checked')) {
                    stulist.push($(this).val())
                }
            });
        }

        var publishdate = $("#exampublishdate").val() || "";
        var _examjson=examengine.getexamjson();
        var json = {
            paperid: examengine.paperid,
            scoresum: _examjson.score,
            paperType: examengine.type,
            taskType: 1,
            title: $("#examheader_title").html(),
            remark: "",
            state: type,
            subjectId: examengine.courseid,
            versionId: examengine.versionid,
            gradeid: examengine.gradeid,
            starttime: "",
            endtime: publishdate,
            paperSource: examengine.sourcetype,
            limittime: 120,
            paperbean: _examjson,
            classidlist: classid,
            useridlist: stulist,
            usertype: examengine.useridentity
        }
       // console.log(json);
       //return false;
        examengine.layout.loadding("正在保存试卷中，请稍候。。。。");
        $.ajax({
            url: "/Volume/Setvolume/ajax_saveexam", data: json, type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    if (type != 1) {
                        examengine.layout.alert("发布成功");
                    } else {
                        examengine.layout.alert("保存成功");
                    }
                    if (examengine.useridentity == "teacher") {
                        location.href = "/Volume/Setvolume/teavolume";
                    }
                    if (examengine.useridentity == "parent") {
                        location.href = "/Volume/Setvolume/parvolume";
                    }
                    if (examengine.useridentity == "student") {
                        location.href = "/Volume/Setvolume/stuvolume";
                    }
                }
                else { examengine.layout.alert(json.message); }
            }
        });
    },
    upload: function (frmid) {
        var hideForm = $('#' + frmid)
        var options = {
            dataType: "json",
            type: 'POST',
            beforeSubmit: examengine.layout.loadding('正在上传....'),
            success: function (result) {
                examengine.layout.close();
                if (result.status) {
                    //$('#' + frmid).find(".uploadcontainer").hide();before
                    /*var temphtml = "<div class=\"processanswer myprocessanswer\" title=\"点击查看答题过程\" style='display:block'>" +
                        "<a href=\"" + result.path + "\" target=\"_blank\">" +
                         "<img src=\"" + result.path + "\"></a>" +
                         "<span onclick=\"$(this).parent().remove();\"></span></div>";
                    $('#' + frmid).find(".uploadcontainer").before(temphtml);*/
                    var _obj= $('#' + frmid).parent().parent().parent();
                    _obj.find("textarea").val(_obj.find("textarea").val() + "[img]" + result.path + "[/img]")
                    //$('#' + frmid).find("div").show();
                    // $('#' + frmid).find("img").attr("src", result.path);
                    // $('#' + frmid).find(".processanswer>a").attr("href", result.path);
                    // $file.remove();
                }
                else {
                    alert(result.msg);
                }
            },
            error: function (result) {
                examengine.layout.close();
                var data = jQuery.parseJSON(result.result);
                var message = data.message;
                //$file.remove();
                alert(message);
            }
        };
        hideForm.ajaxSubmit(options);
        return false;
    },
    line: {
        x: [],
        y: [],
        _this: null,
        tempindex: "",
        width:120,
        create: function (x1, y1, x2, y2) {
            var tmp, x, y;
            if (x1 >= x2) {
                tmp = x1;
                x1 = x2;
                x2 = tmp;
                tmp = y1;
                y1 = y2;
                y2 = tmp;
            }
            x1 = x1 + examengine.line.width;
            x2 = x2 - 2;
            for (var i = x1; i < x2; i++) {
                x = i;
                y = (y2 - y1) / (x2 - x1) * (x - x1) + y1;
                var div = document.createElement('div');
                div.style.left = x + 'px';
                div.style.top = y + 'px';
                div.className = "linepoint " + examengine.line.tempindex.replace("-", "");
                examengine.line._this.parent().parent().append(div);
            }
        },
        clickevent: function (obj) {
            examengine.line._this = $(obj);
            examengine.line.width = $(obj).width()+40;
            var _height = $(obj).height()+10;
            var _tempindex = $(obj).find(".linebox_item").html();;
            var top = 0
            var left = 0
            var parObj = obj;
            left = obj.offsetLeft;
            // if (_tempindex.indexOf("1") > 0)
            // { left = obj.offsetRight; }

            // parObj = parObj.offsetParent
            //while (parObj = parObj.offsetParent) {
            //    left += parObj.offsetLeft;
            //}

            top = obj.offsetTop;

            //while (parObj = parObj.offsetParent) {
            //    top += parObj.offsetTop;
            //}
            // console.log($(obj).width())
            examengine.line.x.push(left);
            examengine.line.y.push(top + _height/2);
            // console.log("length:"+examengine.line.x.length)
            // console.log(examengine.line.x[0])
            //console.log(examengine.line.x[1])
            // examengine.line._this = $(obj);
            if (examengine.line.x.length == 1) {
                examengine.line.tempindex = _tempindex;
            }

            if (examengine.line.x.length == 2 && examengine.line.y.length == 2) {

                if (Math.abs(examengine.line.x[0] - examengine.line.x[1]) > 100) {

                    if (examengine.line.tempindex.indexOf("2") > 0) {
                        examengine.line.tempindex = _tempindex + "-" + examengine.line.tempindex;
                    }
                    else {
                        examengine.line.tempindex = examengine.line.tempindex + "-" + _tempindex
                    }
                    var isline = examengine.line.checkpointanswer(examengine.line.tempindex);
                    if (isline == false)
                        examengine.line.create(examengine.line.x[0], examengine.line.y[0], examengine.line.x[1], examengine.line.y[1]);
                }
                examengine.line.x.length = 0;
                examengine.line.y.length = 0;
                examengine.line.tempindex = "";
            }
        },
        checkpointanswer: function (tempindex) {
            var array = examengine.line._this.parent().parent().next().find("input").val().split(",");
            var selectindex = "";
            for (var key in array) {
                if (array[key] == tempindex) {
                    return true;
                }
                if (array[key].split("-")[0] == tempindex.split("-")[0] || array[key].split("-")[1] == tempindex.split("-")[1]) {
                    $("." + array[key].replace("-", "")).remove()
                }
                else {
                    if (selectindex != "")
                        selectindex = selectindex + ","
                    selectindex = selectindex + array[key];
                }
            }
            if (selectindex != "") {
                array = selectindex.split(",");
            }
            array.push(tempindex);
            examengine.line._this.parent().parent().next().find("input").val(array.join(","));
            /*console.log("------------------------------");
             for (var key in array)
             {
             console.log(array[key]);
             }*/
            return false;
        }

    },
    insert:
    {
        save: function () {

            examengine.htmlcontainerid = "#exam_word_paper";
            var _json = examengine.getexamjson();
            $('#insertexamlayoutbox').remove();
            examengine.htmlcontainerid = "#currentexampaper_content"
            examengine.status = 'edit';
            examengine.isdisplayanswersheet = false;
            examengine.isdisplayheader = false;
            examengine.init(_json)
            $("#exampaperscore").html(_json.score);
            $("#exampapertime").val(_json.answertime);
            $("#span_worktitle").val(_json.title);
        },
        init: function (json) {
          
           
            var _html="<div style='overflow:hidden; padding:20px;'>"+
                "   <div style='text-align:right; padding-bottom:20px;'><a href='javascript:void(0)' class='btn' style=' width:50px; margin-right:10px;' onclick=\"$('#insertexamlayoutbox').hide();\">取消</a><a href='javascript:void(0)' class='btn btn_green insertexamsavebtn' style=' width:50px'>保存</a></div>" +
                "   <div id='exam_word_source' style='float:left;width:49%; border-right:1px solid #ccc;'></div>"+
                "   <div id='exam_word_paper' style='float:right;width:50%'></div>" +
                "   <div style='text-align:right;clear:both; padding-top:20px;'><a href='javascript:void(0)' class='btn' style=' width:50px;margin-right:10px;' onclick=\"$('#insertexamlayoutbox').hide();\">取消</a><a href='javascript:void(0)' class='btn btn_green insertexamsavebtn' style=' width:50px'>保存</a></div>" +
                "</div>";

            var winhtml = "<div id='insertexamlayoutbox' class='examlayoutbox' style='width:94%;z-index:99; position: absolute; display:block'>";
            winhtml = winhtml + "<div class='examengine' style='background:#fff;'>" + _html + "</div>";
            winhtml = winhtml + "</div>";
            if (!document.getElementById("insertexamlayoutbox")) {
                $("body").append(winhtml);
            }
            $("#insertexamlayoutbox").css("left", ($("body").width() - $("#insertexamlayoutbox").width()) / 2);
            examengine.layout.close();
            //examengine.layout.init({
            //    title: "word试卷解析",
            //    width: "96%",
            //    ispositionfixed: false,
            //    content: _html, isshowbtn: false
            //});

            examengine.htmlcontainerid = "#exam_word_paper";
            examengine.isdisplayanswersheet = false;
            examengine.status = "insert";
            examengine.insert.getsourceshtml(json.HtmlPath)
            examengine.init(json.Exam);
            $(".insertexamsavebtn").click(function () {

                examengine.insert.save();

            });
        }, basic64img: function (content) {
            if ($.trim(content) == "") {
                return "";
            }
            content = content.replace(/\[img\]/g, "<img src=\"");
            content = content.replace(/\[\/img\]/g, "\" data-value=\"img\">");
            return content;
        },getY: function (obj) {
            var parObj = obj;
            var top = obj.offsetTop;

            while (parObj = parObj.offsetParent) {
                top += parObj.offsetTop;
            }
            return top;
        },
        getsourceshtml: function (path) {
            $.ajax({
                url: "/Bookroom/homework/ajax_file_contents", type: "GET", dataType: "json", data: "path=" + encodeURI(path), success: function (json) {
                    $("#exam_word_source").html(examengine.insert.basic64img(json.Data));
                    //examengine.layout.close();
                }
            });
        }

    },

    //获取评论点赞
    commentscontent: '',
    getcomments: function(id){
        if(examengine.commentscontent != ''){
            var commentsarr = examengine.commentscontent.comments;
            var html = '';
            var delhtml = '';
            if(examengine.status == 'piyue'){
                delhtml = '<i class="del" onclick="$(this).parent().parent().remove();"></i>';
            };
            for(var i=0; i<commentsarr.length; i++){
                if(commentsarr[i].ownerid == id){
                    if(commentsarr[i].type == '1'){
                        html = html + '<div class="gooddiv"><span class="good"></span></div>';
                    }else if(commentsarr[i].commenttype == '2'){
                        html = html + '<div><p class="voice"><span class="voicestop"><span></span><i class="voicetime"></i><i class="voicetime"><label>'+commentsarr[i].voicetime+'</label>”</i></span>'+delhtml+'</p><audio src="'+commentsarr[i].comment+'"></audio></div>';
                    }else if(commentsarr[i].commenttype == '1'){
                        html = html + '<div><p><label>'+commentsarr[i].comment+'</label>'+delhtml+'</p></div>';
                    };
                };
            };
            return html;
        }else{
            return '';
        };
    },

    //获取老师批阅但没提交的分数
    piyuescorejson: '',
    getpiyuescore: function(id){
        var piyuescore = '';
        if(examengine.piyuescorejson != ''){
            var piyuescorearr = examengine.piyuescorejson.answerbean.ans;
            for(var i=0; i<piyuescorearr.length; i++){
                if(piyuescorearr[i].queid == id){
                    piyuescore = piyuescorearr[i].score;
                };
            };
        };
        return piyuescore;
    }
};