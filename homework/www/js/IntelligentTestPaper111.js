var TestPaper = {
    totalscore: 0,
    time: 120,
    paperType: 1,
    taskType: 1,
    desc: "",
    usertype: "",
    status: "",
    paperid: "",
    gradeid: 0,
    subjectid: "",
    versionid:"",
    paperSource: 1,
    ismobile:false,
    movemenuhtml: "<div class='testtools' style='background: #00b6ff; opacity: 0.3; position: absolute; width: 100%; height: 100%; display: none; left:0; top:0; z-index: 1;'></div>" +
                    "<div class=\"operation\">" +
                    "<span class=\"autochange\">智能换题</span><span class=\"del\">删除</span>" +
                    "<span class=\"moveup\">上移</span><span class=\"movedown\">下移</span>" +
                    "</div>",
    manualmenuhtml: "<div class=\"questionmenu\" style=\"display: none;\"><a class=\"manualshowanswer\">显示答案</a></div>",
    layout: "<div class=\"paperlayout\" id=\"examperlayout\"></div>" +
    "<div class=\"paperlayoutcontainer\" id=\"examperlayoutContainer\">" +
    "<div class='paperlayoutcontainertitle' id='examperlayoutContainertitle'>" +
    "<span onclick=\"$('#examperlayout').hide();$('#examperlayoutContainer').hide();\"></span><h3>手动选题</h3></div>" +
    "<div id='examperlayoutContainerbody' style='padding:30px 15px 15px 15px; height:500px; overflow-y:auto;'></div></div>",
    exampermodel: {},
    guid: "",
    courseid: "",
    intelligent: function (exammodeljson) {
        TestPaper.init();
        $(".paperseting_change").show();
        TestPaper.exampermodel = exammodeljson;
        currentAjax = $.ajax({
            type: "POST",
            url: testurl+"/Home/Interface/ajax_testpaper",
            data: exammodeljson,
            dataType: "json",
            success: function (json) {
                alert(JSON.stringify(json));
                if (json == null)
                {
                    alert("服务器异常")
                    $("#PaperLoadLayout").hide();
                    $("#PaperLoadLayoutContainer").hide();
                }
                else
                {
                    if (json.Success) {
                        TestPaper.showExamper(json.Data);
                    }
                    else {
                        alert("服务器异常")
                        $("#PaperLoadLayout").hide();
                        $("#PaperLoadLayoutContainer").hide();
                    }
                }
            }, error: function () {
                $("#PaperLoadLayout").hide();
                $("#PaperLoadLayoutContainer").hide();
            }
        });
    },
    manual: function (json) {
        TestPaper.init();
        $(".paperseting_change").hide();

        TestPaper.showExamper(json);
    },
    edit: function (json) {
        
        var jsonpart = "";
        TestPaper.time = json.paperbean.paminu;
        $.each(json.paperbean.palevel, function (l, level) {
            var jsonline = "";
          
            $.each(level.pacont, function (p, line) {
                var jsonquestion = "";
               
             
                $.each(line.paqacont, function (q, question) {
                    var jsonsubject = "";
                   
                    if (question.paqamaincont != null) {
                        $.each(question.paqamaincont, function (s, subject) {
                            if (jsonsubject != "") {
                                jsonsubject = jsonsubject + ",";
                            }
                            var itemjson = "";

                            if (subject.paqaitem.qaitemlist != null) {
                                $.each(subject.paqaitem.qaitemlist, function (i, item) {
                                    if (itemjson != "") {
                                        itemjson = itemjson + ",";
                                    }
                                    itemjson = itemjson + "{\"Answer\":\"" + item.qachoose + "\",\"AnswerContent\":\"" + TestPaper.editreplace(item.qaitem[0].qaitemcont) + "\"}";

                                })
                            }

                            jsonsubject = jsonsubject + "{" +
                            "\"Title\":\"" + TestPaper.editreplace(subject.paqaitem.qatitile) + "\"," +
                             "\"GUID\":\"" + subject.paqacloudnum + "\"," +
                             "\"Difficulty\":\"\"," +
                             "\"ID\":\"0\"," +
                             "\"Score\":\"" + subject.paqaitem.qascore + "\"," +
                             "\"Type\":\"" + line.pamaintype + "\"," +
                             "\"SelectItems\":[" + itemjson + "]," +
                            "\"Explain\":\"" + TestPaper.editreplace(subject.paqaitem.qadetail[0].qaitemcont) + "\"," +
                             "\"Answer\":\"" + TestPaper.editreplace(subject.paqaitem.qans[0].qaitemcont) + "\"," +
                             "\"Diff\":\"" + (subject.paqaitem.qadif || 0) + "\"," +
                             "\"IsUploadAnswerProcess\": false," +
                             "\"Points\":[]," +
                             "\"TestAbilitys\":[]}";

                        });

                        if (jsonquestion != "") {
                            jsonquestion = jsonquestion + ",";
                        }
                        jsonquestion = jsonquestion + "{\"ID\": 0," +
                        "\"GUID\":\"" + question.paqamaincloudnum + "\"," +
                        "\"Desc\":\"\"," +
                        "\"Content\":\"" + TestPaper.editreplace(question.paqamaintitle) + "\"," +
                        "\"Difficulty\":0," +
                        "\"Score\":0,";
                        if (question.teachingMaterials != null) {
                            jsonquestion = jsonquestion + "\"TeachingMaterials\":[{\"ID\":\"" + question.teachingMaterials + "\",\"Name\":\"\"}],";
                        }
                        else { jsonquestion = jsonquestion + "\"TeachingMaterials\":[],";}
                        jsonquestion = jsonquestion + "\"Type\":\"" + line.pamaintype + "\"," +
                        "\"TypeName\":\"\"," +
                        "\"TypeDesc\":\"\"," +
                        "\"AggregateScore\": 0," +
                         "\"Explain\":\"\"," +
                         "\"Subjects\":[" + jsonsubject + "]," +
                         "\"Explain\":\"\",";
                        if (question.points != null) {
                            var _pointsjson = "";
                            $.each(question.points.split(","), function (vi, s) {

                                if (_pointsjson != "")
                                    _pointsjson = _pointsjson + ",";
                                _pointsjson = _pointsjson + "{\"ID\":\"" + s.split("|")[1] + "\",\"Name\":\"" + s.split("|")[1] + "\"}"
                            });
                            jsonquestion = jsonquestion + "\"Points\":[" + _pointsjson + "],";
                        }
                        else {
                            jsonquestion = jsonquestion + "\"Points\":[],";
                        }
                        jsonquestion = jsonquestion + "\"TestAbilitys\":[]}";
                    }
                  
                });
                if (jsonline != "") {
                    jsonline = jsonline + ",";
                }
                //console.log();

                var lineobj = $("<div>" + TestPaper.editreplace(line.pamaincont).replace(/\\\"/g, "\"") + "</div>");
                var linetitle = "";
                
                if (lineobj.find(".paperbody_bq_titlespan").length == 1)
                    linetitle = lineobj.find(".paperbody_bq_titlespan").html();
                else
                { linetitle = lineobj.html().replace("<span>" + lineobj.find("span").html() + "</span>", ""); };
                //console.log(linetitle);
                jsonline = jsonline + "{\"Title\":\"" + linetitle.split("、")[1] + "\"," +
                    "\"Type\":\"" + line.pamaintype + "\"," +
                   "\"TypeName\":\"\"," +
              "\"Score\":\"\"," +
              "\"Examinationquestions\":[" + jsonquestion + "]}";
            });
            if (jsonpart != "") {
                jsonpart = jsonpart + ",";
            }
            jsonpart = jsonpart + "{\"Name\":\"\"," +
              "\"Score\":\"\"," +
              "\"ExaminationHeadLines\":[" + jsonline + "]}";
        });

        var editjson = "{\"Title\":\"" + json.paperbean.paname+ "\"," +
            "\"Grade\":\"" + json.paperbean.pagradecode + "\"," +
            "\"ExaminationParts\":[" + jsonpart + "]," +
            "\"GUID\":\"\"," +
            "\"AdaptationDegree\":\"\"," +
            "\"AggregateScore\":\"\"," +
            "\"Course\":\"\"," +
            "\"CourseID\":\"" + json.paperbean.pacoursecode + "\"," +
            "\"Difficulty\":\"\"," +
            "\"Source\":\"\"," +
            "\"TotalTime\":\"\"," +
            "\"Year\":\"\","+
             "\"Desc\":\"" + TestPaper.editreplace(json.remark) + "\"}";
        // console.log(editjson);
        TestPaper.gradeid = json.paperbean.pagradecode;
        TestPaper.subjectid = json.paperbean.pacoursecode;
        TestPaper.versionid = json.versionId;
        var exam = eval("(" + editjson + ")");
        TestPaper.init();

        TestPaper.showExamper(exam);
    },
    editreplace: function (content) {
		if(content==null)
			return "";
        content = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\\\"")
        content = content.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/。/g, "").replace(/；/g, ";")
        content = content.replace(/\[img\]/g, "<img src=\\\"").replace(/\[\/img\]/g, "\\\" \/>");
        return content;
    },
    init: function (exammodeljson) {
        var layouthtml = "<div class=\"PaperLoadLayout\" id=\"PaperLoadLayout\"></div>" +
                        "<div class=\"PaperLoadLayoutContainer\" id=\"PaperLoadLayoutContainer\">" +
                        " <img src=\"images/balls.gif\" style=\" float:left\" />" +
                        " <div style=\"margin-top:50px;\" id=\"PaperLoadLayoutContainer_title\">正在智能分析扫描题库中。。。</div>" +
                        "</div>";
        var basichtml = "" +
            "<div class=\"paperwrap\" style=\"display:none\" id='papercontainer'>" +
            "   <div class=\"papercontainer\">" +
            "       <div class=\"paperseting\">" +
            "           <span class=\"paperseting_answer\">显示解答</span>" +
            "           <span class=\"paperseting_point\">显示知识点</span>";
        if(TestPaper.status=="")
               basichtml = basichtml + "           <span class=\"paperseting_change\">重新匹配</span>";
           // "           <span class=\"paperseting_down\" onclick=\"TestPaper.download()\">下载</span>" 
           basichtml = basichtml+"           <span class=\"paperseting_print\" onclick=\"TestPaper.print()\">打印</span>" +
            "       </div>" +
           "        <div class=\"papercontent\">" +
           "            <div class=\"paperheader\"><div class=\"questionmenu\" style=\"display: none;\"><a class=\"edittitle\">编辑名称</a></div><h1 id='exampapertitle'>2016智能组卷系统</h1></div>" +
            "            <div class=\"paperexamseting\"><div class=\"questionmenu\" style=\"display: none;\"><a class=\"editpaper\">编辑卷头</a></div>" +
            "                  <div><div>试卷总分：<span id='examperscore'style='margin-right:50px;'></span>答题时间：<span id='exampertime' style='margin-right:50px;'></span></div><div style='padding-top:10px;'>试卷说明：<span id='examperdesc'></span></div></div></div>" +
        "               <div class=\"paperbody\"></div>" +
        "           </div>" +
        "       </div>" +
        "       <div class=\"paperright\">" +
        "           <div class=\"paperright_header\"></div>" +
        "           <div class=\"paperright_body\"></div>" +
        "       </div>" +
        " </div> <script src=\"/Public/static/volume/js/jQuery.print.js\" type=\"text/javascript\"></script>";
        if (!document.getElementById("PaperLoadLayout")) {
            $("body").append(layouthtml);
            $("#testpaper").append(basichtml);
            $("#testpaper").show();
        }
        if (TestPaper.ismobile)
        {
            $(".paperright").hide();
            $(".paperseting").hide();
            $(".papercontainer").css("width", "100%");
        }
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


    },
    showExamper: function (json) {
        var paper = json;
        var html = "";
        var qnhtml = "";
        var qindex = 1;
        TestPaper.guid = json.GUID;
        TestPaper.courseid = json.CourseID;
        //$("#examperdesc").html(json.Desc);
        //$(".paperheader").find("h1").html(json.Title);
        $.each(paper.ExaminationParts, function (i, Parts) {

            $.each(Parts.ExaminationHeadLines, function (p, HeadLines) {

                var _linehtml = TestPaper.GetChineseNumber(p + 1) + "、" + HeadLines.Title;

                html = html + " <div class=\"paperbody_bigquestion\" data-index='" + p + "'>";
                html = html + " <div class=\"paperbody_bq_title\" data-type='" + HeadLines.Type + "' data-typename='" + HeadLines.TypeName + "'>"+
                    "<div class=\"questionmenu\" style=\"display: none;\"><a class=\"editscore\">设置分数</a></div>"+
                    "<div><span class='paperbody_bq_titlespan'>" + _linehtml + "</span></div></div>";
                qnhtml = qnhtml + " <div class=\"paperright_body_title\">" + _linehtml + "</div>";
                qnhtml = qnhtml + "<div class='paperright_body_numcontainer' data-index='" + p + "'>";
                $.each(HeadLines.Examinationquestions, function (q, question) {

                    html = html + TestPaper.handdleQuestion(question, false, qindex);
                    //console.log(qindex + "===============");
                    qindex = qindex + question.Subjects.length;
                });
                html = html + "</div>"
                qnhtml = qnhtml + "</div>";
            });
        });
        //if (TestPaper.status == "") {
        //    if (TestPaper.usertype == "student") {
        //    html = html + "<div style='text-align:center'><input type='button' class='btn btn-default' id='exampublish' value='发布测验'></div>";
        //    }else{
        //    html = html + "<div style='text-align:center'><input type='button' class='btn btn-default' id='templatesave' value='保存到草稿'>&nbsp;&nbsp;<input type='button' class='btn btn-default' id='exampublish' value='发布测验'></div>";
        //    }
        //}
        if (TestPaper.status == "") {
            if (TestPaper.usertype == "student") {
                html = html + "<div style='text-align:center;'></div>";
            }else{
                html = html + "<div style='text-align:center; height: 3rem;'></div>";
            }
        }

        if (TestPaper.status == "edit")
        {

            html = html + "<div style='text-align:center'><input type='button' class='btn btn-default' id='templatesave' value='编辑保存'></div>";
        }
        if (TestPaper.status == "add") {
            TestPaper.paperid = "";
            html = html + "<div style='text-align:center'><input type='button' class='btn btn-default' id='exampublish' value='发布测验'></div>";
        }

        $(".paperbody").html(html);

        //$(".paperright_body").html(qnhtml);
        TestPaper.bind();
        TestPaper.event();
        $("#examperscore").html(TestPaper.totalscore);
        $("#exampertime").html(TestPaper.time);
        $("#papercontainer").show();
        $("#Wrap").hide();
        $("#PaperLoadLayout").hide();
        $("#PaperLoadLayoutContainer").hide();
        $("#templatesave").click(function () {
            TestPaper.Save(1);
        });
        $("#exampublish").click(function () {
            ischool.layout.loadding("加载数据中");
            if (TestPaper.usertype == "teacher") {
                $.ajax({
                    url: "/Volume/Setvolume/ajax_teacherclass", dataType: "json", success: function (json) {
                        var classlist = "";

                        $.each(json.data, function (k, obj) {


                            classlist = classlist + "<input type='checkbox' name='examclassid' value='" + obj.classid + "'/>" + obj.classname + "&nbsp;&nbsp;&nbsp;&nbsp;"
                        });
                        var temphtml = "<div style='margin-bottom:10px'><span style='color:red'>*</span>选择班级：" + classlist + "<span style='color:red' class='errchk'></span></div>";
                        temphtml = temphtml + "<div><span style='color:red'>*</span>截止时间：<input type='text' id='exampublishdate' class='input date' onClick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-{%d+1}'})\"/><span style='color:red' class='errdate'></span></div>"
                        ischool.layout.init({
                            title: "发布测验", content: temphtml, callback: function () {
                                var ischeck = false;
                                $("input[name='examclassid']").each(function () {
                                    if ($(this).is(':checked')) {
                                        ischeck = true;
                                    }
                                });
                                if (!ischeck) {
                                    $(".errchk").html("选择班级");
                                    return;
                                }else{
                                    $(".errchk").html("");
                                }
                                if ($("#exampublishdate").val() == "") {
                                    $(".errdate").html("请选择截止时间");
                                    return;
                                }else{
                                    $(".errdate").html("");
                                }
                                TestPaper.Save(2);
                            }
                        })
                    }
                });
            }
            if (TestPaper.usertype == "parent") {
                $.ajax({
                    url: "/Volume/Setvolume/ajax_childrens", dataType: "json", success: function (json) {
                        var classlist = "";

                        $.each(json.data, function (k, obj) {


                            classlist = classlist + "<input type='checkbox' name='chkexamstulist' value='" + obj.userId + "'/>" + obj.realName + "&nbsp;&nbsp;&nbsp;&nbsp;"
                        });
                        var temphtml = "<div style='margin-bottom:10px'><span style='color:red'>*</span>选择孩子：" + classlist + "<span style='color:red' class='errchk'></span></div>";
                        temphtml = temphtml + "<div><span style='color:red'>*</span>截止时间：<input type='text' id='exampublishdate' class='input date' onClick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-{%d+1}'})\"/><span style='color:red' class='errdate'></span></div>"
                        ischool.layout.init({
                            title: "发布测验", content: temphtml, callback: function () {
                                var ischeck = false;
                                $("input[name='chkexamstulist']").each(function () {
                                    if ($(this).is(':checked')) {
                                        ischeck = true;
                                    }
                                });
                                if (!ischeck) {
                                    $(".errchk").html("选择孩子");
                                    return;
                                }else{
                                    $(".errchk").html("");
                                }
                                if ($("#exampublishdate").val()=="")
                                {
                                    $(".errdate").html("请选择截止时间");
                                    return ;
                                }else{
                                    $(".errdate").html(""); 
                                }
                                TestPaper.Save(2);
                            }
                        })
                    }
                });
            }
           
            if (TestPaper.usertype == "student") {
                
                var temphtml = "";
                temphtml = temphtml + "<div><span style='color:red'>*</span>截止时间：<input type='text' id='exampublishdate' class='input date' onClick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-{%d+1}'})\"/><span style='color:red' class='errdate'></span></div>"
                ischool.layout.init({
                    title: "发布测验", content: temphtml, callback: function () {
                        if ($("#exampublishdate").val() == "") {
                            $(".errdate").html("请选择截止时间");
                            return;
                        }else{
                           $(".errdate").html(""); 
                        }
                        TestPaper.Save(2);
                    }
                })
            }

        })
        $("#exameditsave").click(function () {
            TestPaper.Save(2);
        });

        var typenum = $('#questiontype ul').find('li').length;
        var testnum = 0;
        for(var i=0; i<$('#questiontype').find('font').length; i++){
            testnum += parseInt($('#questiontype').find('font').eq(i).html());
        };
        $('#selecttestid').html('已选'+typenum+'种题型  '+testnum+'道题');
        //window.location.href = window.history.go(-1);
        window.location.href = '#&pageHome';
        
    },
    handdleQuestion: function (question, ismanual, index) {
        var content = "";
        var isbigquesion = false;
        if (question.Content != "") {
            content = question.Content;

            content = content.replace("#begin#", "(<u class='bigbeginnum'>" + index + "</u>)");
            content = content.replace("#end#", "(<u class='bigendnum'>" + (index + question.Subjects.length - 1) + "</u>)");
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
        }
        var html = "";
        var menhtml = TestPaper.movemenuhtml;
        if (ismanual)
            menhtml = TestPaper.manualmenuhtml;
        var tids = "";
        $.each(question.TeachingMaterials, function (k, q) {
            if (tids != "")
                tids = tids + ",";
            tids = tids + q.ID;
        })
        html = html + " <div class=\"paperbody_bq " + (isbigquesion == true ? "bigcontent" : "") +
            "\" data-isbig='" + (isbigquesion == true ? "1" : "0") + "' data-id='" + question.GUID + "' id='big" + question.GUID + "'" +
            " data-questiontype='" + question.Type + "' data-questiontypename='" + question.TypeName + "' " +
            " data-teachingmaterial=" + tids + ">";
        if (isbigquesion) {
            html = html + " <div class=\"paperbody_bq_content\">" + content + "</div>";
            html = html + menhtml;
        }
        // console.log("q" + index);
        $.each(question.Subjects, function (s, subject) {
            // qnhtml = qnhtml + "<a href='javascript:void(0)'>" + index + "</a>";
            html = html + TestPaper.handdleExamSubject(question, subject, isbigquesion, ismanual, index);
            index = index + 1
        });
        if (isbigquesion) {
            html = html + " <div class=\"paperbody_question_anis\">";

            html = html + "      <div class=\"aniscontainer aniscontainerpoint\"><div class=\"label\">知识点：</div>";
            html = html + "      <div class=\"aniscontent\">";
            $.each(question.Points, function (ps, Point) {
                html = html + "<a href='javascript:void(0)' data-id='" + Point.ID + "'>" + Point.Name + "</a>";
            })
            html = html + "</div></div>";
            html = html + "      <div class=\"aniscontainer aniscontainerexplain\"><div class=\"label\">解&nbsp;&nbsp;&nbsp;&nbsp;析：</div>";
            html = html + "      <div class=\"aniscontent\">" + question.Explain + "</div></div>";
            html = html + "  </div>";
        }
        html = html + "</div>";
        return html;
    },
    handdleExamSubject: function (question, subject, isbigquesion, ismanual, index) {
        var html = "";
        var menhtml = TestPaper.movemenuhtml;
        if (ismanual)
            menhtml = TestPaper.manualmenuhtml;
        html = html + " <div class=\"paperbody_question\" data-id='" + subject.GUID + "' data-index='" + index + "' data-issubject='" + (isbigquesion == true ? "0" : "1") + "' data-score='" + subject.Score + "'>";
        TestPaper.totalscore = TestPaper.totalscore + parseInt(subject.Score, 10);
        if (!isbigquesion) {
            html = html + menhtml;
        }
        var numberhtml = "<span class='questionnum'>" + index + ". </span>";
        // console.log("subject" + index);
        if (ismanual) {
            if (isbigquesion == false) {
                numberhtml = "";
            }
        }
        html = html + " <div class=\"paperbody_question_title\">" + numberhtml + "<div class='paperbody_question_title_content'>" + subject.Title + "</div></div>";
        html = html + " <ul>";
        var itemhtml = "";
        var isitempic = false;
        var maxlength = 0;
        $.each(subject.SelectItems, function (si, item) {
            itemhtml = itemhtml + " <li style='#$$#'><span class='item'>" + item.Answer + ".</span>" + item.AnswerContent + "</li>";
            if (item.AnswerContent.indexOf("<img") >= 0) {
                isitempic = true;
                maxlength = 0;
            }
            if (isitempic == false) {
                if (maxlength < item.AnswerContent.length)
                    maxlength = item.AnswerContent.length;
            }

        });
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
        html = html + " </ul>";
        html = html + " <div class=\"paperbody_question_anis\">";
        
            html = html + "      <div class=\"aniscontainer aniscontainerdiffculty\" data-value='" + subject.Difficulty + "'><div class=\"label\">难&nbsp;&nbsp;&nbsp;&nbsp;度：</div>";
            var diffhtml = "";
            for (var i = 1; i <= subject.Difficulty; i++) {
                diffhtml = diffhtml + "<span class='active'></span>";
            }
            for (var i = subject.Difficulty + 1; i <= 5; i++) {
                diffhtml = diffhtml + "<span></span>";
            }
            html = html + "      <div class=\"aniscontent\"> <div class=\"starcontainer\">" + diffhtml + "</div></div></div>";
        //-----------------------------------------------------------
         if (!isbigquesion) {
            html = html + "      <div class=\"aniscontainer aniscontainerpoint\"><div class=\"label\">知识点：</div>";
            html = html + "      <div class=\"aniscontent\">";
          
            $.each(question.Points, function (ps, Point) {
                html = html + "<a href='javascript:void(0)' data-id='" + Point.ID + "'>" + Point.Name + "</a>";
            })
            html = html + "</div></div>";
        }
        //----------------------------------------------------------
        html = html + "      <div class=\"aniscontainer aniscontaineranswer\"><div class=\"label\">答&nbsp;&nbsp;&nbsp;&nbsp;案：</div>";
        html = html + "      <div class=\"aniscontent\">" + subject.Answer + "</div></div>";
        //---------------------------------------------------------
        if (!isbigquesion) {
            html = html + "      <div class=\"aniscontainer aniscontainerexplain\"><div class=\"label\">解&nbsp;&nbsp;&nbsp;&nbsp;析：</div>";
            html = html + "      <div class=\"aniscontent\">" + subject.Explain + "</div></div>";
        }
        html = html + "</div>";
        html = html + "</div>";

        return html;
    },
    GetChineseNumber: function (id) {
        switch (id) {
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
            case 7:
                return "七";
            case 8:
                return "八";
            case 9:
                return "九";
            case 10:
                return "十";
        }
    },
    ChangeQuestion: function (type, currentquestionid, teachingMaterialID, questiontypeid, questionids, difficulty) {

        var postjson = { questionids: questionids, chapterids: teachingMaterialID, questiontype: questiontypeid, changetype: type, pagesize: 10, currpage: 1, diff: 0 };
        $.ajax({
            url: testurl+"/Home/Interface/ajax_getchangequestionlist", type: "post", data: postjson,
            dataType: "json",
            success: function (json) {
                if (json.Success) {
                    var html = "";
                    if (type == 2) {
                        if (json.Data.length == 0)
                        {
                            ischool.layout.alert("消息提示", "当前没有可以智能替换题");
                        }
                        else
                        {
                            var question = json.Data[0];
                           
                            html = TestPaper.handdleQuestion(question, false, 0);
                            $("#big" + currentquestionid).after(html);
                            $("#big" + currentquestionid).remove();
                           
                        }
                        $("#big" + currentquestionid).find(".questionloading").remove();
                    }
                    else {
                        $.each(json.Data, function (q, question) {
                            html = html + "<div  class='paperquestionmanual'>";
                            html = html + "<span class='paperquestionmanualnum'>" + q + "</span>"
                            html = html + TestPaper.handdleQuestion(question, true, 0);
                            html = html + "<div  class='paperquestionmanualfooter'><a href='javascript:void(0)' class='viewdetail'>查看详情</a><a class='addbasket'>应用此题</a></div>";
                            html = html + "</div>";
                            //index = index + 1;
                            // html = html + TestPaper.handdleQuestion(question, true,index);
                            // index =index+ question.Subjects.length;
                        });
                        $("#examperlayoutContainerbody").html(html);

                        $(".viewdetail").bind("click", function () {
                            if ($(this).html() == "查看详情") {
                                $(this).html("隐藏详情")
                                $(this).parent().parent().find(".paperbody_question_anis").show();
                                $(this).parent().parent().find(".aniscontainerdiffculty").show();
                                $(this).parent().parent().find(".aniscontainerpoint").show();
                                $(this).parent().parent().find(".aniscontaineranswer").show();
                                $(this).parent().parent().find(".aniscontainerexplain").show();
                            }
                            else {
                                $(this).html("查看详情")
                                $(this).parent().parent().find(".paperbody_question_anis").hide();
                                $(this).parent().parent().find(".aniscontainerdiffculty").hide();
                                $(this).parent().parent().find(".aniscontainerpoint").hide();
                                $(this).parent().parent().find(".aniscontaineranswer").hide();
                                $(this).parent().parent().find(".aniscontainerexplain").hide();
                            }
                        });
                        $(".addbasket").bind("click", function () {
                            var obj1 = $(this).parent().parent().find(".paperbody_bq");

                            var currentid1 = obj1.attr("data-id");
                            $("#examperlayoutContainerbody").html("");
                            $.each(json.Data, function (q, question) {
                                if (question.GUID == currentid1) {
                                    var html1 = TestPaper.handdleQuestion(question, false, 0);
                                    $("#big" + currentquestionid).after(html1);
                                    $("#big" + currentquestionid).remove();
                                    TestPaper.bind();
                                    $("#examperlayoutContainer").hide();
                                    $("#examperlayout").hide();
                                }
                            });
                        });
                    }
                   
                    TestPaper.bind();
                    TestPaper.getsocre();
                }
                else {
                    ischool.layout.error(json.Message);
                    $("#big" + currentquestionid).find(".questionloading").remove();
                }

            }
        })
    },
    setbigtitle: function () {
        TestPaper.totalscore = 0;
        $(".paperbody_bigquestion").each(function () {
            var titleobj = $(this).find(".paperbody_bq_titlespan");
            var title = "<span class='paperbody_bq_titlespan'>"+titleobj.html()+"</span>";
            var defaultscore = 0;
            var fist = 0;
            var totalscore = 0;
            var html = "";
            var index = 0;
            var lastindex = 0;
            $(this).find(".paperbody_question").each(function (i) {
                var score = parseInt($(this).attr("data-score"), 10);
                index = $(this).attr("data-index");
                totalscore = totalscore + score;
                if (score != defaultscore) {
                    if (fist != "") {
                        html = html + "第" + fist;
                        if ((index - 1) - fist > 0) {
                            html = html + "-" + (index - 1);
                        }
                        html = html + "题" + defaultscore + "分";
                    }
                    fist = index;
                    defaultscore = score;
                }

            });
            html = html + "第" + fist;
            if ((index) - fist > 0) {
                html = html + "-" + index;
            }
            html = html + "题" + defaultscore + "分";
            title = title + "<span>(" + html + ",共" + totalscore + "分)</spn>";
            titleobj.parent().html(title);
            TestPaper.totalscore = TestPaper.totalscore + totalscore;
        });
        $(".examperscore").html(TestPaper.totalscore);

    },
    getsocre:function()
    {
        TestPaper.totalscore = 0;

        $(".paperbody_question").each(function () {
            TestPaper.totalscore = TestPaper.totalscore + parseInt($(this).attr("data-score"), 10);

        })
        $("#examperscore").html(TestPaper.totalscore);
    },
    bind: function () {
        $(".paperright_body_numcontainer").html("");
        $(".paperbody").find(".questionnum").each(function (i) {
            $(this).html((i + 1) + ".");
            var obj = $(this).parent().parent().parent();
            var index = obj.parent().attr("data-index");
            $(this).parent().parent().attr("data-index", (i + 1));

            var bgcontent = obj.find(".paperbody_bq_content");
            if (bgcontent.length == 1) {
                var tempcontent = bgcontent.html();
                //console.log(tempcontent);
                tempcontent = tempcontent.replace("#begin#", (i + 1));
                tempcontent = tempcontent.replace("#end#", obj.find(".paperbody_question").length + i);
                bgcontent.html(tempcontent);
            }
            $(".paperright_body_numcontainer").eq(index).append("<a href='javascript:void(0)' data-index='" + (i + 1) + "'>" + (i + 1) + "</a>");
        });
        $(".paperright_body_numcontainer").find("a").unbind();
        $(".paperright_body_numcontainer").find("a").bind("click", function () {
            var item_index = parseInt($(this).attr('data-index'));
            var $item = $(".paperbody_question[data-index='" + item_index + "']");
            $item.trigger('click');
            var top = $item.offset().top - 20;
            $(window).scrollTop(top)
        });
        TestPaper.setbigtitle();
        $(".autochange").unbind();
        $(".manualchange").unbind();
        $(".moveup").unbind();
        $(".movedown").unbind();
        $("[data-issubject='1']").unbind();
        $("[data-isbig='1']").unbind();
        $(".edittitle").unbind();
        $(".editpaper").unbind();
        $(".editscore").unbind();
        $(".del").unbind();
        $(".paperheader").unbind();
        $(".paperexamseting").unbind();
        $(".paperbody_bq_title").unbind();
        if (TestPaper.status == "print") {
            TestPaper.print();
        }
        if (TestPaper.status != "look") {
           
           
            $(".autochange").bind("click", function () {

                var obj = $(this).parent().parent();
                obj.append("<div class='questionloading'><label style='margin-top: 2rem;'><br>正在智能替换试题，请勿重复操作！</label></div>")
                var questiontypeid = obj.parent().attr("data-questiontype");
                var questionids = "";
                var isbig = obj.parent().attr("data-isbig");
                var teachingmaterial = obj.parent().attr("data-teachingmaterial");
                var currentid = obj.parent().attr("data-id");
                var bodyobj = obj.parent().parent();
                if (typeof obj.parent().attr("data-isbig") == "undefined") {
                    teachingmaterial = obj.attr("data-teachingmaterial");
                    questiontypeid = obj.attr("data-questiontype");
                    currentid = obj.attr("data-id");
                    isbig = obj.attr("data-isbig");
                    bodyobj = obj.parent();
                }
                //console.log(bodyobj.find(".paperbody_bq").html());
                bodyobj.find(".paperbody_bq").each(function () {
                    if (questionids != "")
                    { questionids = questionids + ","; }
                    questionids = questionids + $(this).attr("data-id");

                });
                TestPaper.ChangeQuestion(2, currentid, teachingmaterial, questiontypeid, questionids, 0);
            });
            $(".manualchange").bind("click", function () {
                var obj = $(this).parent().parent();
                var questiontypeid = obj.parent().attr("data-questiontype");
                var questionids = "";
                var isbig = obj.parent().attr("data-isbig");;
                var teachingmaterial = obj.parent().attr("data-teachingmaterial");
                var currentid = obj.parent().attr("data-id");
                var bodyobj = obj.parent().parent();
                if (typeof obj.parent().attr("data-isbig") == "undefined") {
                    teachingmaterial = obj.attr("data-teachingmaterial");
                    questiontypeid = obj.attr("data-questiontype");
                    currentid = obj.attr("data-id");
                    isbig = obj.attr("data-isbig");;
                    bodyobj = obj.parent();
                }
                //console.log(bodyobj.find(".paperbody_bq").html());
                bodyobj.find(".paperbody_bq").each(function () {
                    if (questionids != "")
                    { questionids = questionids + ","; }
                    questionids = questionids + $(this).attr("data-id");

                });
                if (!document.getElementById("examperlayout")) {
                    $("body").append(TestPaper.layout);

                }
                $("#examperlayoutContainer").show();
                $("#examperlayout").show();
                $("#examperlayout").height($(document).height());
                var top = ((
                    $(window).height() - $("#examperlayoutContainer").height()) / 2 + $(document).scrollTop());
                if (top < 0)
                    top = 10;
                $("#examperlayoutContainer").css("top", top + "px");

                $("#examperlayoutContainer").css("left", ($(document).width() / 2 - $("#examperlayoutContainer").width() / 2) + "px");
                //  var postjson = { isManual: true, CourseID: TestPaper.courseid, teachingMaterialID: teachingmaterial, points: "", questiontypeid: questiontypeid, notquestionids: questionids, difficulty: 0 };

                TestPaper.ChangeQuestion(1, currentid, teachingmaterial, questiontypeid, questionids, 0);


            });//

            $(".moveup").bind("click", function () {
                var obj = $(this).parent().parent();
                if (obj.attr("data-isbig") != "undefined") {
                    obj = obj.parent();
                }
                if (!obj.prev().hasClass("paperbody_bq_title")) {
                    obj.prev().before(obj.clone());
                    obj.remove();
                    TestPaper.bind();
                    TestPaper.getsocre();
                }
                else {
                    ischool.layout.alert("试卷提示", "无法上移");
                }
            });
            $(".movedown").bind("click", function () {
                var obj = $(this).parent().parent();
                if (obj.attr("data-isbig") != "undefined") {
                    obj = obj.parent();
                }
                if (obj.next().length == 1) {
                    obj.next().after(obj.clone());
                    obj.remove();
                    TestPaper.bind();
                    TestPaper.getsocre();
                }
                else {
                    ischool.layout.alert("试卷提示", "无法下移");
                }
            });
            $(".edittitle").bind("click", function () {
                ischool.layout.init({
                    title: "编辑名称", content: "<input type='text' id='editexampapertitletext' class='input' maxlength='30' value='" + $("#exampapertitle").html() + "'/>", callback: function () {
                        $("#exampapertitle").html($("#editexampapertitletext").val());
                        ischool.layout.hide();
                    }
                })
            });
            $(".editpaper").bind("click", function () {
                var html = "";
                html = "<p style='margin-bottom:10px;'>作答时间：<input type='text' id='editexampapertime' value='" + TestPaper.time + "' class='input'></p>"
                html = html + "<p>试卷说明：<input type='text' id='editexampaperdesc' value='" + TestPaper.desc + "' class='input'></p>"
                ischool.layout.init({
                    title: "编辑卷头", content: html, callback: function () {
                        // $("#exampapertitle").html($("#editexampapertitletext").val());
                        var time = $("#editexampapertime").val();
                        if (time == "")
                            time = "0";
                        var reg = /\d{1,3}/;
                        if (!reg.test(time)) {
                            ischool.layout.error("设置作答时间错误");
                        }
                        TestPaper.time = time;
                        TestPaper.desc = $("#editexampaperdesc").val();
                        $("#exampertime").html(time);
                        $("#examperdesc").html(TestPaper.desc)
                        ischool.layout.hide();
                    }
                })
            });
            $(".editscore").bind("click", function () {
                var html = "<div style='line-height:33px;'>" + $(this).parent().parent().find(".paperbody_bq_titlespan").html() + " 共" + $(this).parent().parent().parent().find(".paperbody_question").length + "题 共$score$分</div>";
                var totalscore = 0;
                $(this).parent().parent().parent().find(".paperbody_question").each(function () {
                    var score = $(this).attr("data-score");
                    var index = $(this).attr("data-index");
                    html = html + "<div style='line-height:33px;'>第" + index + "题：<input type='text' data-index='" + index + "' class='input' style='width:40px;' value='" + score + "'/>分</div>"
                    totalscore = totalscore + parseInt(score, 10);
                });
                html = html.replace("$score$", totalscore);
                ischool.layout.init({
                    title: "编辑卷头", content: html, callback: function () {
                        // $("#exampapertitle").html($("#editexampapertitletext").val());

                        var reg = /\d{1,3}/;
                        $("#globallayout_infocontent_content").find("input[type='text']").each(function () {
                            $(".paperbody_question[data-index='" + $(this).attr("data-index") + "']").attr("data-score", $(this).val());
                        });
                        TestPaper.setbigtitle();
                        TestPaper.getsocre();
                        ischool.layout.hide();
                    }
                })
            });
            $(".del").bind("click", function () {
                if ($(this).parent().parent().parent().parent().find(".paperbody_bq").length == 1)
                {
                    ischool.layout.alert("提示","无法删除，必须存在一道题")
                }
                else
                {
                    $(this).parent().parent().parent().remove();

                    TestPaper.bind();
                }
            });
            $("[data-issubject='1']").bind("click", function () {
                $(this).parents('.paperbody').find(".testtools").hide();
                $(this).parents('.paperbody').find(".operation").hide();
                $(this).find(".testtools").show();
                $(this).find(".operation").show();
            });

            $("[data-isbig='1']").bind("click", function () {
                $(this).parents('.paperbody').find(".testtools").hide();
                $(this).parents('.paperbody').find(".operation").hide();
                $(this).find(".testtools").show();
                $(this).find(".operation").show();
            });
            $(".paperheader").bind("mouseout", function () {
                //$(this).find(".questionmenu").hide();
                //$(this).css("border", "1px solid #fff");

            }).bind("mouseover", function () {
                //$(this).find(".questionmenu").show();
                //$(this).css("border", "1px solid #1887e3");
            });
            $(".paperexamseting").bind("mouseout", function () {
                //$(this).find(".questionmenu").hide();
                //$(this).css("border", "1px solid #fff");

            }).bind("mouseover", function () {
                //$(this).find(".questionmenu").show();
                //$(this).css("border", "1px solid #1887e3");
            });
            $(".paperbody_bq_title").bind("mouseout", function () {
                //$(this).find(".questionmenu").hide();
                //$(this).css("border", "1px solid #fff");

            }).bind("mouseover", function () {
                //$(this).find(".questionmenu").show();
                //$(this).css("border", "1px solid #1887e3");
            });
        }
      
   
    },
    event: function () {
        $(".paperseting_point").unbind();
        $(".paperseting_answer").unbind();
        $(".paperseting_change").unbind();
        $(".paperseting_point").bind("click", function () {

            if ($(this).html() == "显示知识点") {
                $(".paperbody_question_anis").show();
                $(this).html("隐藏知识点");
                $(".aniscontainerdiffculty").show();
                $(".aniscontainerpoint").show();
            }
            else {
                if ($(".paperseting_answer").html() == "显示解答") {
                    $(".paperbody_question_anis").hide();
                }
                $(this).html("显示知识点");
                $(".aniscontainerdiffculty").hide();
                $(".aniscontainerpoint").hide();
            }
        });
        $(".paperseting_answer").bind("click", function () {
            if ($(this).html() == "显示解答") {
                $(".paperbody_question_anis").show();
                $(this).html("隐藏解答");
                $(".aniscontaineranswer").show();
                $(".aniscontainerexplain").show();
            }
            else {
                if ($(".paperseting_point").html() == "显示知识点") {
                    $(".paperbody_question_anis").hide();
                }
                $(this).html("显示解答");
                $(".aniscontaineranswer").hide();
                $(".aniscontainerexplain").hide();
            }
        });
        $(".paperseting_change").bind("click", function () {
            TestPaper.intelligent(TestPaper.exampermodel);
        });
        $(window).scroll(function () {
            var s_top = $(this).scrollTop();
            if (s_top > 151) {
                $('.paperright').css({
                    'position': 'fixed',
                    'top': 0 + 'px'
                });
                $('.paperseting').addClass("fixed");
            } else {
                $('.paperright').css({
                    'position': 'absolute',
                    'top': 151 + 'px'
                });
                $('.paperseting').removeClass("fixed");
            }

        });
    },
    download: function () {
        jQuery('<form action="/api/testpaper/download" method="get""><input type="text" name="id" value="' + TestPaper.guid + '"></form>')
        .appendTo('body').submit().remove();
    },
    print: function () {
        jQuery.print('.papercontent');
    },
    getfivejson: function () {
        var jsonexamline = "";
        var examlinesetp = 0;
        $(".paperbody_bigquestion").each(function () {
            var _bigtype = TestPaper.getquestion($(this).find(".paperbody_bq_title").attr("data-typename"));
            var _stype = TestPaper.getSubjectiveandobjective($(this).find(".paperbody_bq_title").attr("data-typename"))
            var totalscore = 0;
            var listjson = "";
            $(this).find(".paperbody_bq").each(function () {
                var templistjson = "";
                var bigid = $(this).attr("data-id");
                var content = $(this).find(".paperbody_bq_content").html() || "";
                var questiontotal = 0;
                var questionid = 0;
                $(this).find(".paperbody_question").each(function () {
                    if (templistjson != "") {
                        templistjson = templistjson + ",";
                    }
                    var itemjson = "";
                    var linetemjson = "";
                    $(this).find("ul").find("li").each(function () {
                        if (itemjson != "") {
                            itemjson = itemjson + ",";
                        }
                        var _item = $(this).find(".item").html().replace("\.", "");
                        var _itemtitle = $(this).html().replace($(this).find(".item").html(), "");

                        itemjson = itemjson + "{\"qachoose\": \"" + _item + "\",\"qaitem\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + TestPaper.replacechar(_itemtitle) + "\"}]}";
                    });
                    var _answer=$(this).find(".aniscontaineranswer").find(".aniscontent").html().replace("略", "");
                    if (itemjson!=""&&content!="")
                    {
                        _bigtype = 10;
                        if (_answer.length > 1)
                            _bigtype = 20;

                    }
                    var title = TestPaper.replacechar($(this).find(".paperbody_question_title_content").html());
                    templistjson = templistjson + "{\"paqanum\": " + $(this).find(".questionnum").html().replace("\.", "") + ",\"paqacloudnum\": \"" + $(this).attr("data-id") + "\",\"paqaitem\": {" +
                        "\"qacoursecode\":\"0\"," +
                        "\"qagradecode\": \"0\"," +
                        "\"qavercode\": 2," +
                        "\"qaterm\": 10," +
                        "\"qatype\": " + _bigtype + "," +
                        "\"questiontype\":" + _stype + "," +
                        "\"qapointname\": \"\"," +
                        "\"qapointid\": \"\"," +
                        "\"qatitile\": \"" + title + "\"," +
                        "\"qacomment\": \"qacomment" + $(this).find(".questionnum").html().replace("\.", "") + "\"," +
                        "\"qanalysis\": \"qanalysis\"," +
                        "\"qadetail\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + TestPaper.replacechar($(this).find(".aniscontainerexplain").find(".aniscontent").html()) + "\"}]," +
                        "\"qateachreq\": \"\"," +
                        "\"qafrom\": \"1\"," +
                        "\"qadesc\": \"\"," +
                        "\"qans\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + TestPaper.replacechar(_answer) + "\"}]," +
                        "\"qamain\": [{\"qamainseq\": 1,\"qaflag\": 1,\"qamaincont\": \"" + title + "\"}]," +
                        "\"qaitemlist\": [" + itemjson + "]," +
                        "\"qaitemlistline\": [" + linetemjson + "]," +
                        "\"qachoose\": \"\"," +
                        "\"qaitemseq\": 0," +
                        "\"qaitemcont\": \"\"," +
                        "\"qadif\": \"" + $(this).find(".aniscontainerdiffculty").attr("data-value") + "\"," +//难度
                        "\"qadis\": \"\"," +
                        "\"qalert\": \"\"," +
                        "\"qausefeq\": \"\"," +
                        "\"qacent\": \"\"," +
                        "\"qatime\": \"\"," +
                        "\"qadir\": \"\"," +
                        "\"qabk1\": \"2.0\"," +
                        "\"qabk2\": \"\"," +
                        "\"qabk3\": \"\"," +
                        "\"qabk4\": \"\"," +
                        "\"qabk5\": \"\"," +
                        "\"qattach\": \"\"," +
                        "\"qascore\": \"" + $(this).attr("data-score") + "\"," +//$(this).find(".score").find("input").val()
                        "\"postdetailflag\":0}}";
                });
                if (listjson != "") {
                    listjson = listjson + ",";
                }
                var points = "";
                $(this).find(".aniscontainerpoint").find("a").each(function () {
                    if (points != "")
                        points = points + ",";
                    points = points + $(this).attr("data-id") + "|" + $(this).html();
                });
                listjson = listjson + "{" +
                    "\"paqamainnum\": " + questionid + "," +
                    "\"paqamaincloudnum\": \"" + bigid + "\"," +
                    "\"paqamaintitle\": \"" + ($(this).find(".paperbody_bq_content").length == 1 ? TestPaper.replacechar($(this).find(".paperbody_bq_content").html()) : "") + "\"," +
                    "\"paqamaincocount\": \"" + $(this).find(".paperbody_question").length + "\"," +
                    "\"paqamainallscore\": \"" + questiontotal + "\"," +
                    "\"teachingMaterials\":\"" + $(this).attr("data-teachingmaterial") + "\"," +
                    "\"points\":\"" + points + "\"," +
                    "\"paqamaintype\": " + _bigtype + "," +
                    "\"paqamaincont\": [" + templistjson + "]}";
                questionid = questionid + 1;
            })

            if (jsonexamline != "") {
                jsonexamline = jsonexamline + ",";
            }

            jsonexamline = jsonexamline + "{\"pamaincode\":\"" + examlinesetp + "\","+
                "\"pamaincont\":\"" + TestPaper.replacechar($(this).find(".paperbody_bq_titlespan").parent().html())+ "\"," +
            "\"pamaincocount\":" + $(this).find(".bigcontent").length + ",\"pamainallscore\":" + totalscore +
            ",\"pamaintype\":\"" + $(this).find(".paperbody_bq_title").attr("data-type") + "\",\"paqacont\":[" + listjson + "]}";
            examlinesetp = examlinesetp + 1;
        });
        var jsonpart = "{\"paleveltitle\":\"\",\"pacont\":[" + jsonexamline + "]}";
        var tempjson = "{\"pauuid\": \"\"," +
        "\"padesc\": \"\"," +
        "\"paname\": \"" + $(".paperheader").find("h1").html() + "\"," +
        "\"pasecondname\":\"\"," +
        "\"paauthorname\":\"\"," +
        "\"paauthorschool\":\"\"," +
        "\"paauditname\":\"\"," +
        "\"paauditschool\":\"\"," +
        "\"pacoursecode\": \"" + TestPaper.subjectid + "\"," +
        "\"pagradecode\": \"" + TestPaper.gradeid + "\"," +
        "\"pavercode\": 2," +
        "\"paterm\": 10," +
        "\"papro\": \"100\"," +
        "\"padiff\": 0," +
        "\"pascore\": \"" + TestPaper.totalscore + "\"," +
        "\"pashare\": 10," +
        "\"paminu\": " + TestPaper.time + "," +
        "\"pausedversion\":\"mooc_2.0\"," +
        "\"pafromflag\":\"mooc\"," +
        "\"palevel\": [" + jsonpart + "]}";
        return tempjson;
    },
    getquestion: function (typename) {
        if (typename.indexOf("选择题") >= 0 || typename.indexOf("单选题") >= 0) {
            return 10;
        }
        if (typename.indexOf("多选题") >= 0 || typename.indexOf("多项选择题") >= 0 || typename.indexOf("不定项选择题") >= 0) {
            return 20;
        }
        return 90;
    },
    getSubjectiveandobjective: function (typename) {
        if (typename.indexOf("选择题") >= 0 || typename.indexOf("单选题") >= 0) {
            return 1;
        }
        if (typename.indexOf("多选题") >= 0 || typename.indexOf("多项选择题") >= 0 || typename.indexOf("不定项选择题") >= 0) {
            return 1;
        }
        return 0;
    },
    replacechar: function (content) {
        if (typeof content == "undefined")
            return "";
        if (content == null)
            return "";
        content = content.replace(/<img style=\"vertical-align:middle\" src=\"/g, "[img]");
        content = content.replace(/<img style=\"vertical-align:middle\" src=\"/g, "[img]");
        content = content.replace(/<img src=\"/g, "[img]");
        content = content.replace(/<IMG style=\"WIDTH:100px\" src=\"/g, "[img]");
        content = content.replace(/<IMG src=\"/g, "[img]");
        content = content.replace(/<IMG SRC=\"/g, "[img]");
        content = content.replace(/\" data-value=\"img\">/g, "[/img]");//;//.replace(/\\/g, "\\\\")
        console.log(content);
        return content.replace(/\"/g, "\\\"");
    },
    Save: function (type) {
        //console.log(eval("(" + TestPaper.getfivejson() + ")"));
        //return false;
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
        var json = {
            paperid:TestPaper.paperid,
            scoresum: TestPaper.totalscore,
            paperType: TestPaper.paperType,
            taskType: TestPaper.taskType,
            title: $(".paperheader").find("h1").html(), 
            remark:TestPaper.desc,
            state: type,
            subjectId: TestPaper.subjectid,
            versionId: TestPaper.versionid,
            gradeid: TestPaper.gradeid,
            starttime: "",
            endtime: publishdate,
            paperSource: TestPaper.paperSource,
            limittime: TestPaper.time,
            paperbean: eval("(" + TestPaper.getfivejson() + ")"),
            classidlist: classid,
            useridlist: stulist,
            usertype: TestPaper.usertype
        }
        //console.log(json);
        ischool.layout.loadding("正在保存试卷中，请稍候。。。。");
        alert(JSON.stringify(json));
        //$.ajax({
        //    url: "/Volume/Setvolume/ajax_saveexam", data: json, type: "post", dataType: "json", success: function (json) {
        //        if (json.data) {
        //            if(type!=1){
        //            ischool.layout.success("发布成功");
        //            }else{
        //            ischool.layout.success("保存成功");
        //            }
        //            if (TestPaper.usertype == "teacher")
        //            {
        //                location.href = "/Volume/Setvolume/teavolume";
        //            }
        //            if (TestPaper.usertype == "parent") {
        //                location.href = "/Volume/Setvolume/parvolume";
        //            }
        //            if (TestPaper.usertype == "student") {
        //                location.href = "/Volume/Setvolume/stuvolume";
        //            }
        //        }
        //        else { ischool.layout.error(json.message); }
        //    }
        //});
    },
    newconvertfivejson: function (json,title)
    {
      
        var index = 1;
        var examlinesetp = 1;
        var questionid = 0;
        var jsonpart = "";
        $.each(json.ExaminationParts, function (i, Parts) {
            var jsonexamline = "";
            $.each(Parts.ExaminationHeadLines, function (p, HeadLines) {
                var listjson = "";
                $.each(HeadLines.Examinationquestions, function (q, question) {
                    var templistjson = "";
                    $.each(question.Subjects, function (q, subject) {
                        if (templistjson != "") {
                            templistjson = templistjson + ",";
                        }
                        var title = TestPaper.replacechar(subject.Title);
                        var itemjson = "";
                        $.each(subject.SelectItems, function (si, item) {
                            if (itemjson!="")
                                 itemjson = itemjson + ","
                            itemjson = itemjson + "{\"qachoose\": \"" + item.Answer + "\",\"qaitem\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + TestPaper.replacechar(item.AnswerContent) + "\"}]}";
                        });
                        templistjson = templistjson + "{\"paqanum\": " + index + ",\"paqacloudnum\": \"" + subject.GUID + "\",\"paqaitem\": {" +
                        "\"qacoursecode\":\"0\"," +
                        "\"qagradecode\": \"0\"," +
                        "\"qavercode\": 2," +
                        "\"qaterm\": 10," +
                        "\"qatype\": " + TestPaper.getquestion(question.TypeName) + "," +
                        "\"questiontype\":" + TestPaper.getquestion(question.TypeName) + "," +
                        "\"qapointname\": \"\"," +
                        "\"qapointid\": \"\"," +
                        "\"qatitile\": \"" + title + "\"," +
                        "\"qacomment\": \"qacomment\"," +
                        "\"qanalysis\": \"qanalysis\"," +
                        "\"qadetail\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + TestPaper.replacechar(subject.Explain) + "\"}]," +
                        "\"qateachreq\": \"\"," +
                        "\"qafrom\": \"1\"," +
                        "\"qadesc\": \"\"," +
                        "\"qans\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + TestPaper.replacechar(subject.Answer) + "\"}]," +
                        "\"qamain\": [{\"qamainseq\": 1,\"qaflag\": 1,\"qamaincont\": \"" + title + "\"}]," +
                        "\"qaitemlist\": [" + itemjson + "]," +
                        "\"qaitemlistline\": []," +
                        "\"qachoose\": \"\"," +
                        "\"qaitemseq\": 0," +
                        "\"qaitemcont\": \"\"," +
                        "\"qadif\": \"" + question.Difficulty + "\"," +//难度
                        "\"qadis\": \"\"," +
                        "\"qalert\": \"\"," +
                        "\"qausefeq\": \"\"," +
                        "\"qacent\": \"\"," +
                        "\"qatime\": \"\"," +
                        "\"qadir\": \"\"," +
                        "\"qabk1\": \"2.0\"," +
                        "\"qabk2\": \"\"," +
                        "\"qabk3\": \"\"," +
                        "\"qabk4\": \"\"," +
                        "\"qabk5\": \"\"," +
                        "\"qattach\": \"\"," +
                        "\"qascore\": \"1\"," +
                        "\"postdetailflag\":0}}";
                        index = index + 1;
                        //console.log(templistjson)
                    });
                    if (listjson != "") {
                        listjson = listjson + ",";
                    }
                    var points = "";
                    $.each(question.Points, function (ps, Point) {
                        if (points != "")
                            points = points + ",";
                        points = points + Point.ID + "|" + Point.Name;
                    });
                 
                    
                    listjson = listjson + "{" +
                   "\"paqamainnum\": " + questionid + "," +
                   "\"paqamaincloudnum\": \"" + question.GUID + "\"," +
                   "\"paqamaintitle\": \"" +  TestPaper.replacechar(question.Content) + "\"," +
                   "\"paqamaincocount\": \"" + question.Subjects.length + "\"," +
                   "\"paqamainallscore\": \""+question.Subjects.length+"\"," +
                   "\"teachingMaterials\":\"\"," +
                   "\"points\":\"" + points + "\"," +
                   "\"paqamaintype\": " +TestPaper.getquestion( question.TypeName) + "," +
                   "\"paqamaincont\": [" + templistjson + "]}";
                    questionid = questionid + 1;
                    //console.log(listjson)
                });
                if (jsonexamline != "") {
                    jsonexamline = jsonexamline + ",";
                }
                jsonexamline = jsonexamline + "{\"pamaincode\":\"" + examlinesetp + "\"," +
               "\"pamaincont\":\"" + TestPaper.replacechar(HeadLines.Title) + "\"," +
           "\"pamaincocount\":" + HeadLines.Examinationquestions.length + ",\"pamainallscore\":0"  +
           ",\"pamaintype\":\"\",\"paqacont\":[" + listjson + "]}";
                examlinesetp = examlinesetp + 1;
            });
            if (jsonpart != "") {
                jsonpart = jsonpart + ",";
            }
            jsonpart = jsonpart+"{\"paleveltitle\":\"\",\"pacont\":[" + jsonexamline + "]}";
        });
       
        var tempjson = "{\"pauuid\": \"\"," +
        "\"padesc\": \"\"," +
        "\"paname\": \"" + title + "\"," +
        "\"pasecondname\":\"\"," +
        "\"paauthorname\":\"\"," +
        "\"paauthorschool\":\"\"," +
        "\"paauditname\":\"\"," +
        "\"paauditschool\":\"\"," +
        "\"pacoursecode\": \"" + TestPaper.subjectid + "\"," +
        "\"pagradecode\": \"" + TestPaper.gradeid + "\"," +
        "\"pavercode\": 2," +
        "\"paterm\": 10," +
        "\"papro\": \"100\"," +
        "\"padiff\": 0," +
        "\"pascore\": \""+(index-1)+"\"," +
        "\"pashare\": 10," +
        "\"paminu\": 0," +
        "\"pausedversion\":\"mooc_2.0\"," +
        "\"pafromflag\":\"mooc\"," +
        "\"palevel\": [" + jsonpart + "]}";
        //console.log(tempjson)
        return tempjson;
    }


}
function StringBuilder() {
    this.__strings__ = new Array;
};

StringBuilder.prototype.append = function (str) {
    this.__strings__.push(str);
};

StringBuilder.prototype.toString = function () {
    return this.__strings__.join("");
};