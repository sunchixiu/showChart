// JavaScript source code

ischool.ExamPaper = {
    viewtype: "student",
    usertype: "student",
    isstudentshowsubmit: true,
    jsonanswer: null,
    begindate: new Date(),
    epid: "",
    isread: false,
    api:"/Home/Learnsquare/ajax_exampaper",
    apidata:"",
    postanswerapi: "/Home/Learnsquare/ajax_newexamanswer",
    saveanswerapi: "/Home/Homework/ajax_savehomework",
    postcallback:null,
    depid:"",
    containerid:".Wrap",
    type:"",
    iscomplate:false,
    isrepeatexam: false,//重新做题，只做错题
    saveexamtime: 0,//用户保存进度时间
    examtime: 0,//时间是秒
    overplusexamtime: 0,//剩余时间是秒
    examtimeicondeg: 0,
    teachercomment: "",
    isrework: false,//重新做卷
    isfirstmark:false,
    answercount:0,
    savecount: 0,
    subjectid:"",
    init: function (title,roomworkid) {
        $('.Wrap').html('<span class="loadingpic" id="loadingHW" style="margin-top: 60%; position: absolute;"></span>');
        var _htmltemplate = "<div id=\"exam_container\" class=\"hw_k\"></div>";
        var _isfist=true;
        var _iscomplate=false;

        $('#hwTitle').html(title);

        $.ajax({
            url:websiteurl + '/TSB_ISCHOOL_LCS_SERVER/newroomwork/getworkdetail',
            type:'post',
            dataType:'json',
            data:JSON.stringify({"stuid":studentid,"roomworkid":roomworkid ,"isneedpaperbean":"1"}),
            contentType: "application/json; charset=utf-8",
            success:function(data){
                var json = {};
                json.data = data.data.workinfobean;
                json.data.paperbean = data.data.workinfobean.paperbean;
                var paperid = json.data.paperid;

                $.ajax({
                    url:websiteurl + '/TSB_ISCHOOL_LCS_SERVER/tchmyroom/getworkinfo',
                    type:'post',
                    dataType:'json',
                    data:JSON.stringify({"studentid":studentid,"workid":paperid}),
                    contentType: "application/json; charset=utf-8",
                    success:function(answerdata){
                        var valScore = '0';
                        var classScore = 'getScoreNo';
                        if(!answerdata.data.answerBean){

                        }else{
                            json.data.answerBean = answerdata.data.answerBean;
                            valScore = json.data.answerBean.angetscore;
                            classScore = 'getScore';
                        };

                        if (1) {
                            ischool.ExamPaper.isstudentshowsubmit = false;
                            //if (typeof json.data.answerBean == "undefined") {
                            //    ischool.ExamPaper.isstudentshowsubmit = true;
                            //}
                            if (typeof json.data.answercount != "undefined") {
                                if (json.data.answercount!=null)
                                    ischool.ExamPaper.answercount=json.data.answercount;
                            }
                            if (typeof json.data.savecount != "undefined") {
                                if (json.data.savecount != null)
                                    ischool.ExamPaper.savecount=json.data.savecount;
                            }

                            //if (json.data.answerBean == null) {
                            //    ischool.ExamPaper.isstudentshowsubmit = true;
                            //}
                            else {
                                //是否重新做卷
                                if (ischool.ExamPaper.isrework)
                                { ischool.ExamPaper.isstudentshowsubmit = true; }
                                else
                                {
                                    ischool.ExamPaper.jsonanswer = json.data.answerBean;
                                    if (typeof json.data.isfirstmark!="undefined")
                                        ischool.ExamPaper.isfirstmark = json.data.isfirstmark;
                                    _isfist = false;
                                    ischool.ExamPaper.iscomplate = true;
                                    //判断是否作业并且当前是学生
                                    if ((ischool.ExamPaper.type == "homework"||ischool.ExamPaper.type == "sumhomework") && ischool.ExamPaper.usertype == "student") {

                                        if (ischool.ExamPaper.jsonanswer.andesignscore != ischool.ExamPaper.jsonanswer.angetscore) {
                                            ischool.ExamPaper.isstudentshowsubmit = true;
                                            ischool.ExamPaper.iscomplate = false;
                                            ischool.ExamPaper.isrepeatexam = true;
                                        }
                                        //满分自动展示卷子
                                        if (parseInt(ischool.ExamPaper.jsonanswer.andesignscore, 10) <= parseInt(ischool.ExamPaper.jsonanswer.angetscore, 10)) {
                                            ischool.ExamPaper.iscomplate = true;
                                            ischool.ExamPaper.isstudentshowsubmit = false;
                                            ischool.ExamPaper.isrepeatexam = false;
                                        }
                                        if (ischool.ExamPaper.type == "sumhomework") {
                                            if (ischool.ExamPaper.answercount >= 2) {
                                                ischool.ExamPaper.iscomplate = true;
                                                ischool.ExamPaper.isstudentshowsubmit = false;
                                            }
                                            else {
                                                ischool.ExamPaper.isrepeatexam = true;
                                                ischool.ExamPaper.isstudentshowsubmit == true

                                                if (ischool.ExamPaper.answercount == 0) {

                                                    if (ischool.ExamPaper.jsonanswer != null) {

                                                        var anendtime = ischool.ExamPaper.jsonanswer.antotalusetime
                                                        if (typeof anendtime == "undefined") {
                                                            anendtime = 0;
                                                        }
                                                        if (anendtime == null)
                                                            anendtime = 0;
                                                        anendtime = parseInt(anendtime, 10);

                                                        ischool.ExamPaper.saveexamtime = anendtime;
                                                    }
                                                }
                                            }
                                        }

                                    }

                                }
                            }

                            if(typeof json.data.depid!="undefined")
                            {
                                ischool.ExamPaper.depid=json.data.depid;
                            }
                            if (typeof json.data.paperbean.pacoursecode != "undefined") {
                                ischool.ExamPaper.subjectid = json.data.paperbean.pacoursecode;
                            }
                            if (ischool.ExamPaper.usertype == "teacher") {
                                if (ischool.ExamPaper.studentid == "")
                                {
                                    ischool.ExamPaper.isread = true;

                                }
                            }
                            ischool.ExamPaper.begindate = new Date();
                            //ischool.ExamPaper.epid = paperid;
                            $(ischool.ExamPaper.containerid).html(_htmltemplate);
                            var vcode = "<img src=\"/Home/Index/paperpic/epid/" + ischool.ExamPaper.epid + "\" class='vcode'>";
                            var excontent = new StringBuilder();
                            if (ischool.ExamPaper.isread==false ) {
                                //$('#hwTitle').html(json.data.paperbean.paname);
                                excontent.append( "<div class='work_title'>◇ 试卷总分数 " + json.data.paperbean.pascore + ",作答时间为 " + json.data.paperbean.paminu + "分钟</div><div class='"+classScore+"'>"+tonumber(valScore)+"</div>");
                                //excontent.append( "<div class='work_title'>◇ 试卷总分数 " + json.data.paperbean.pascore + ",作答时间为 " + json.data.paperbean.paminu + "分钟</div>");
                                excontent.append( "<input type='hidden' id='hidpascore' value='" + json.data.paperbean.pascore + "'>");

                            }
                            if (ischool.ExamPaper.teachercomment != "") {
                                excontent.append(" <div class='work_title'>");
                                excontent.append("教师评语：");
                                excontent.append(ischool.ExamPaper.teachercomment);
                                excontent.append("</div>");
                            }
                            var _clickpostanswer = "";
                            var _clickpostscore = "";
                            if (typeof json.data.paperbean.palevel == "undefined") {
                                excontent.append(ischool.ExamPaper.createquestion(json.data.paperbean.pacont));
                                _clickpostanswer = "ischool.ExamPaper.postanswer()";
                                _clickpostscore = "ischool.ExamPaper.postscore()";
                            }
                            else
                            {
                                excontent.append(ischool.newExamPaper.init(json.data.paperbean.palevel));
                                _clickpostanswer = "ischool.newExamPaper.postanswer()";
                                _clickpostscore = "ischool.newExamPaper.postscore()";
                            }
                            var isselfscore = true;




                            $("#exam_container").html(excontent.toString());
                            //隐藏答题卡


                            if (ischool.ExamPaper.isread == true || ischool.ExamPaper.isstudentshowsubmit == false|| ischool.ExamPaper.type=="") {
                                $("#examanswer_container").css("display", "none");
                                //$("#exam_container").css("width", "100%");
                                if (ischool.ExamPaper.type == "sumhomework")
                                    ischool.ExamPaper.collectlist();
                            }
                            else {

                                var _fixedstatus = 0;
                                window.onscroll =function () {
                                    var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
                                    //console.log(scrollTop)
                                    if (scrollTop > 150) {
                                        //if (_fixedstatus == 0) {
                                        $("#examanswer_container").css("top", (scrollTop - $("#examanswer_container").height()/2+50) + "px");
                                        _fixedstatus = 1;
                                        //}

                                    }
                                    else {
                                        if (_fixedstatus == 1) {
                                            $("#examanswer_container").css("top","0");
                                            _fixedstatus = 0;
                                        }
                                    }

                                };
                            }

                            if (ischool.ExamPaper.isread == false)
                            {
                                if (ischool.ExamPaper.type == "homework" || ischool.ExamPaper.type == "jingsai" || ischool.ExamPaper.type == "sumhomework") {
                                    ischool.ExamPaper.bindevetTimer();

                                }
                            }
                            $(".viewanalyzebtn").bind("mousedown", function () {
                                var obj = $(this).parent().parent().find(".viewanalyze");
                                if (obj.css("display") == "none") {
                                    obj.show('fast');
                                    $(this).html("收起解析");
                                    $(this).removeClass("down");
                                }
                                else { obj.hide('fast'); $(this).html("展开解析"); $(this).addClass("down"); }
                            });
                            $(".audioplay").bind("click", function () {
                                $("#jplayMP3").jPlayer("clearMedia");
                                $("#jplayMP3").jPlayer("stop");
                                $("#jplayMP3").unbind($.jPlayer.event.ended);
                                $("#jplayMP3").unbind($.jPlayer.event.progress);
                                $(this).addClass("playing");
                                var _this = $(this)
                                $("#jplayMP3").bind($.jPlayer.event.ended, function (event) {
                                    $("#jplayMP3").jPlayer("clearMedia");
                                    $("#jplayMP3").jPlayer("stop");
                                    _this.removeClass("playing");
                                });
                                $("#jplayMP3").jPlayer("setMedia", { mp3: $(this).attr("data-url") }).jPlayer("play");

                            })
                            if (isselfscore==false)
                            {
                                $("[data-type='myscorevalue']").each(function () {
                                    $(this).parent().parent().hide();
                                })
                            }
                            $("[data-type='myscorevalue']").each(function () {
                                $(this).bind("blur", function () {

                                    var score = $.trim($(this).val());

                                    var answer = $.trim($(this).parent().parent().next().find(".myanswer").html());
                                    var currentscore = $(this).attr("data-value");

                                    if (/0|([1-9](\d)?)/.test(score)) {
                                        if (parseInt(score, 10) > parseInt(currentscore, 10)) {
                                            alert("您无法输入大于本题的分数");
                                            $(this).val("");
                                            return false;
                                        }
                                        if (answer == "") {
                                            alert("您没有作答本题");
                                            $(this).val("0");
                                            return false;
                                        }

                                    }
                                    else {
                                        alert("请输入整数");
                                        $(this).val("");
                                        return false;
                                    }
                                    // $(this).parent().hide();
                                    //$(this).parent().prev().html("评分：" + score);
                                });
                            });

                            loaded('homework');
                        }
                        else
                        {
                            $(ischool.ExamPaper.containerid).html("暂无试题");
                        }
                    },
                    error:function(data){
                        alert('获取答案失败')
                    }
                });
            },
            error:function(data){
                alert('获取详细作业失败');
            }
        });

    },

    createquestion: function (questionjson) {
        var html = new StringBuilder();
        var count = 1;
        for (var q = 0; q < questionjson.length; q++) {
            html.append( "<div class='examContainer' data-id='" + questionjson[q].pamaincode + "'>");
            html.append( " <div class='examebigtitle'>" + getNumberChinese(q + 1) + "、" + this.questiontypename(questionjson[q].pamaintype) + "(共" + questionjson[q].pamaincocount + "题，每题" + questionjson[q].pamainevyscore + "分)  </div>");
            var bignum = questionjson[q].pamaincode;
            for (var s = 0; s < questionjson[q].paqacont.length; s++) {
                var smallnum = questionjson[q].paqacont[s].paqanum;
                var subjectjson = questionjson[q].paqacont[s].paqaitem;
                var answerattname = "answer" + bignum + "" + smallnum;
                var strhandleranswer = this.handleranswerList(bignum, smallnum, questionjson[q].pamaintype, questionjson[q].paqacont[s].paqaitem.qans[0].qaitemcont);
                var strclass = "";

                if (strhandleranswer.split("|")[0] == "0") {
                    strclass = "  class='wrong'"
                }
                html.append( "<div class='exam ' name=\"" + answerattname + "\"  data-id='" + smallnum + "' data-culdid='" + questionjson[q].paqacont[s].paqacloudnum + "' data-type='" + questionjson[q].paqacont[s].paqaitem.qatype + "' data-score='"+questionjson[q].pamainevyscore+"'>");
              
                html.append(" <div class=\"examquestion\">");//<span class='number'>" + count + "</span> ";
                for (var i = 0; i < subjectjson.qamain.length; i++) {
                    html.append( this.replacequestioncontent(subjectjson.qamain[i].qamaincont));
                }
                html.append( "</div>");
                html.append(" <div class=\"examquestioncontent\">");
                if (questionjson[q].pamaintype == 60) {
                    html.append( ischool.ExamPaper.linequestion.createOptions(subjectjson.qaitemlistline, answerattname));
                }
                else {
                    html.append( "<ul>" + this.handdleroptions(answerattname, questionjson[q].pamaintype, subjectjson.qaitemlist, strhandleranswer,questionjson[q].paqacont[s].paqaitem.qans[0].qaitemcont) + "</ul>");
                }
                //html = html + subjectjson.qaitemcont
                html.append( "</div>");

                html.append( "<input type='hidden' class='answer' value=\"" + questionjson[q].paqacont[s].paqaitem.qans[0].qaitemcont + "\">");

                var answerhtml = new StringBuilder();
                //console.log(strhandleranswer)
                if (ischool.ExamPaper.isread)
                {
                    answerhtml.append( "<div class='answercontainer'><a href='javascript:void(0)' onclick='if($(this).html()==\"显示答案\"){$(this).html(\"隐藏答案\");$(this).parent().next().show();}else{$(this).html(\"显示答案\");$(this).parent().next().hide();}' class='btn btn-success'>显示答案</a></div>");
                    answerhtml.append("<div class='answercontainer_detail' style='display:none'>");
                    answerhtml.append( "<div class='analyze'><label>正确答案：</label><div>" + this.showanswer(questionjson[q].pamaintype, questionjson[q].paqacont[s].paqaitem.qans[0].qaitemcont).replace("答案：", "") + "</div></div>");
                    if (questionjson[q].paqacont[s].paqaitem.qadetail != null) {
                        answerhtml.append("<div class='analyze'><label>解析：</label><div>" + this.replacequestioncontent(questionjson[q].paqacont[s].paqaitem.qadetail[0].qaitemcont) + "</div></div>");
                    }
                    answerhtml.append( "</div>");
                }
                else
                {
                    if (ischool.ExamPaper.isstudentshowsubmit == false) {
                        if (questionjson[q].pamaintype != 90) {
                            answerhtml.append( "<div class='answercontainer'><span>正确答案：" + this.showanswer(questionjson[q].pamaintype, questionjson[q].paqacont[s].paqaitem.qans[0].qaitemcont) + "</span> <span " + strclass + ">我的答案：" + this.showanswer(questionjson[q].pamaintype, strhandleranswer.split("|")[1].replace(/#@#/g, "")) + "</span></div>");
                            answerhtml.append( "<div class='answercontainer_detail'>");
                            if (questionjson[q].paqacont[s].paqaitem.qadetail!=null) {
                                answerhtml.append("<div class='analyze'><label>解析：</label><div class='analyzecontent'>" + this.replacequestioncontent(questionjson[q].paqacont[s].paqaitem.qadetail[0].qaitemcont) + "</div></div>");
                            }
                            answerhtml.append( "</div>");
                        }
                        else {
                            answerhtml.append("<div class='answercontainer'>手动评分:本题" + questionjson[q].pamainevyscore + "分,您的得分<u></u> <u><input type='text' class='input' style='width:50px;' data-value='" + questionjson[q].pamainevyscore + "' data-type='myscorevalue'><a href='javascript:void(0)' class='btn btn-success btnselfscore' data-type='myscore' style='display:none'>评分</a></u></div>");
                            answerhtml.append("<div class='answercontainer_detail'>");
                            answerhtml.append("<div class='analyze'><label>我的答案：</label><span class='myanswer analyzecontent'>" + this.showanswer(questionjson[q].pamaintype, strhandleranswer.split("|")[1].replace(/#@#/g, "")).replace("答案：", "") + "</span></div>");
                            answerhtml.append("<div class='analyze'><label>正确答案：</label><span class='analyzecontent'>" + this.showanswer(questionjson[q].pamaintype, questionjson[q].paqacont[s].paqaitem.qans[0].qaitemcont).replace("答案：", "") + "</span></div>");
                            if (questionjson[q].paqacont[s].paqaitem.qadetail!= null)
                            {
                                answerhtml.append("<div class='analyze'><label>解析：</label><div class='analyzecontent'>" + questionjson[q].paqacont[s].paqaitem.qadetail[0].qaitemcont + "</div></div>");
                            }
                            answerhtml.append("</div>");
                        }

                    }
                    if (this.usertype == "student" && ischool.ExamPaper.isstudentshowsubmit == true) {
                        answerhtml = null;
                        answerhtml = new StringBuilder();
                        
                    }
                }
               
                html.append( answerhtml.toString());
                html.append("</div>");
                count = count + 1;
            }
            html.append("</div>");
        }
        if (this.usertype == "student" && ischool.ExamPaper.isstudentshowsubmit == true) {
            return html.toString().replace(/\$click\$/g, "onclick='ischool.ExamPaper.linequestion.clickEvent(this)'")
        }
        else {
            return html.toString().replace(/\$click\$/g, "");
        }
       
    },
    showanswer: function (type, answer) {
   
        var temp = "";
        if (type == 40) {
            if (answer.split("#GAP#").length > 1) {
                for (var i = 0; i < answer.split("#GAP#").length; i++) {
                    temp = temp + "(" + (i + 1) + ") " + answer.split("#GAP#")[i] + "<br />";
                }
            }
            else { temp = temp +  answer}
        }
        else if (type == 30) {
            var reg=/\d/
            if (reg.test(temp)) {
                temp = "错"
                if (answer == "1")
                    temp = "对"
            }
            else
            { temp = answer; }
        }
        else { temp = answer; }
        var regarr = temp.match(/\[img\](\w|:|\/|\.)+\[\/img\]/g);//new RegExp("\[img\](\w|:|\/|\.)+\[\/img\]", "gi"));
        var _tempimg = "";
        if ($.isArray(regarr)) {
            for (var i = 0; i < regarr.length; i++) {
                var _img = regarr[i].replace("[img]", "").replace("[/img]", "");
                _img = "<a href='" + _img + "' target='_blank' title='点击查看答案'><img src=\"" + _img + "\"/></a>"
                temp = temp.replace(regarr[i], "");
                _tempimg = _tempimg + "<div class=\"processanswer myimganswer\" title=\"点击查看答题答案\" style='display:block'>" + _img + "</div>";
            }
        }
        if (_tempimg!="")
             temp = temp + "<div class='answerimgcontainer'>" + _tempimg + "</div>";

        return this.replacequestioncontent(temp);
    },
    handdleroptions: function (attrname, type, subjectjson, handleranswer,answer) {
        var html = "";
        var htmloptions="";
        answer = answer.replace("&lt;", "<").replace("&gt;", ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/。/g, "").replace(/；/g, ";");
        //console.log(answer);
        var _isshowoptions = true;
        var _isright=handleranswer.split("|")[0]
        if(_isright=="")
            _isright=0;
        if(ischool.ExamPaper.isstudentshowsubmit==false)
        {_isshowoptions=false;}
        var myarrayanswer = handleranswer.split("|")[1].split("#@#");
        var arrayanswer =answer.split("#@#");
        if(answer.indexOf("<img")<0)
        {
            arrayanswer=answer.replace(/;/g, "#@#").replace(/#GAP#/g, "#@#").split("#@#");
        }
       
        var guid = new GUID().newGUID();
        if (type == 40) {
            //htmloptions=//"<div class='examquestioncontentcheckedbox'></div>";

            for (var i = 0; i < arrayanswer.length; i++) {

                if (arrayanswer[i] != "") {
                    var htmlinput = "<textarea  name=\"" + attrname + "\" id='" + attrname + "' #d# data-type='" + type + "'>##</textarea>";
                  
                    if (ischool.ExamPaper.isrepeatexam) {
                        if (_isright == 0) {
                            if (myarrayanswer.length - 1 >= i)
                                htmlinput = htmlinput.replace("##", myarrayanswer[i])
                        }
                        else {
                            htmlinput = htmlinput.replace("#d#", " disabled='disabled' ")
                            htmlinput = htmlinput.replace("##", arrayanswer[i])
                        }

                    }
                    htmlinput = htmlinput.replace("##", "");
                    htmlinput = htmlinput.replace("#d#", "");
                    htmloptions = htmloptions + htmlinput;
                }
            }

        }
        else if (type == 90||type==110)
        {
            var htmlinput = "<textarea  name=\"" + attrname + "\" id='" + attrname + "' #d# data-type='" + type + "'>##</textarea>";
            htmlinput=htmlinput+"<div class='answerimgcontainer'></div>"
            var htmlform = "<form id=\"insertPicForm"+guid+"\" action=\"/Home/Learnsquare/ajax_questions_pic\" enctype=\"multipart/form-data\">";
   htmlform = htmlform + "<div class='examuploadfile' style='clear:both;'><a class='uploadcontainer'><input type=\"file\" name=\"image\" onchange=\"ischool.ExamPaper.uploadImges('insertPicForm" + guid + "')\" accept='.jpg,png,jpeg,gif' ></a></div>";
   htmlform = htmlform + "</form>";
            if(ischool.ExamPaper.isrepeatexam)
            {
                if(myarrayanswer!="") {
                    if (ischool.ExamPaper.answercount < 2 && ischool.ExamPaper.type == "homework") {
                        htmlinput = htmlinput.replace("#d#", "")
                        
                    }
                    else {
                        htmlinput = htmlinput.replace("#d#", " disabled='disabled' ")
                        
                    }
                    htmlinput = htmlinput.replace("##", myarrayanswer.join(""))
                    htmlform = "";
                }


            }
            htmlinput = htmlinput.replace("##","");
            htmlinput = htmlinput.replace("#d#","");
            htmloptions =  htmlinput+htmlform;
        }
        else
        {
            if (null == subjectjson)
            { }
            else {
                var _inputtype = "radio";
                if (type == 20)
                    _inputtype = "checkbox";
                for (var i = 0; i < subjectjson.length; i++) {
                    var _options = "<li class='#check#' #d# data-value='" + subjectjson[i].qachoose + "'><span><em></em></span><label>"+subjectjson[i].qachoose+"</label></li>";
                    html = html + "<li data-value='" + subjectjson[i].qachoose + "'>";
                    for (var item = 0; item < subjectjson[i].qaitem.length; item++) {
                        var qcontent = subjectjson[i].qaitem[item].qaitemcont.replace("：", ":");
                        if (qcontent == ":")
                            qcontent = ".";
                        html = html + this.replacequestioncontent(qcontent);
                    }
                    for (var a = 0; a < myarrayanswer.length; a++) {

                        if (myarrayanswer[a] == subjectjson[i].qachoose) {
                            _options = _options.replace("#check#", "checked");
                           // console.log(myarrayanswer[a] + "++" + subjectjson[i].qachoose + "==")
                            // break;
                        }
                        if (ischool.ExamPaper.isrepeatexam) {
                            if (parseInt(_isright, 10) == 1) {
                                _options = _options.replace("#d#", " disabled='disabled' ")
                            }

                        }
                        _options = _options.replace("#d#", "")
                        _options = _options.replace("#check#", "");
                    }

                    //htmloptions = htmloptions + _options; //家长端不做题
                    html = html + "</li>";
                }

            }
        }
        
        var _scripthtml="<script type='text/javascript'>ischool.ExamPaper.bindeventradiocheckbox('"+guid+"')</script>";

        //htmloptions="<div class='examquestioncontentcheckedbox' id='"+guid+"'><ul>"+htmloptions+_scripthtml+"</ul></div>";
        if(ischool.ExamPaper.isstudentshowsubmit==false)
            htmloptions="";
        if (ischool.ExamPaper.isread)
            htmloptions = "";
        html="<ul>"+html+"</ul>";
       /*
        var htmldisabled = " disabled='disabled'";
        console.log(handleranswer);
        var myarrayanswer = handleranswer.split("|")[1].split("#@#");
        var arrayanswer = answer.replace(/;/g,"#@#").replace(/#GAP#/g,"#@#").split("#@#");
        var _isright=handleranswer.split("|")[0]
         if(_isright=="")
            _isright=-1;
        if(ischool.ExamPaper.type=="homework")
        {
            if(_isright==0)
            {
                htmldisabled="";
            }
        }
        else
        {
            if (ischool.ExamPaper.isstudentshowsubmit) {
                htmldisabled = "";
            }
        }
        var htmlinput = "<input type='$$' " + htmldisabled + " name=\"" + attrname + "\"  value=\"##\" #check#>";
        if (type == 20)
        { htmlinput = htmlinput.replace("$$", "checkbox"); }
        if (type == 40 || type == 90) {
            htmlinput = "<textarea  name=\"" + attrname + "\"  " + htmldisabled + " id='" + attrname + "'  data-type='"+type+"'>##</textarea>";
            var temphtml = htmlinput.replace("$$", "text");
            htmlinput = "";
            for (var i = 0; i < arrayanswer.length; i++) {
                htmlinput = htmlinput + "(" + (i + 1) + ") ";
                if (ischool.ExamPaper.isstudentshowsubmit == true&&ischool.ExamPaper.type=="homework") {
                    if(_isright==0)
                    {
                        if(myarrayanswer.length>i) {
                            htmlinput = htmlinput + temphtml.replace("##", myarrayanswer[i]) + "<br />";
                        }
                        else
                        {
                            htmlinput = htmlinput + temphtml.replace("##", "") + "<br />";
                        }
                    }
                    else {
                        htmlinput = htmlinput + temphtml.replace("##", arrayanswer[i]) + "<br />";
                    }

                }
                else {
                    htmlinput = htmlinput + temphtml.replace("##", myarrayanswer[i]) + "<br />";
                }
            }
        }
        if (type == 10 || type == 30)
        { htmlinput = htmlinput.replace("$$", "radio"); }
        if (ischool.ExamPaper.isstudentshowsubmit==false) {
            htmlinput = "";
        }
        //设置只读模式
        if (ischool.ExamPaper.isread) {
            htmlinput = "";
        }

        if (type == 40 || type == 90) {
            html = html + htmlinput;
        }
        else {
            if (null == subjectjson)
            { }
            else
            {
                for (var i = 0; i < subjectjson.length; i++) {
                    var maxlength = subjectjson[i].qaitem.length - 1;
                    html = html + "<li>";
                    var temphtmlinput = htmlinput;
                    for (var a = 0; a < arrayanswer.length; a++) {
                        temphtmlinput = temphtmlinput.replace("##", subjectjson[i].qachoose);
                        if (myarrayanswer[a] == subjectjson[i].qachoose) {
                            temphtmlinput = temphtmlinput.replace("#check#", "checked='checked'");
                            break;
                        }
                    }
                    html = html + temphtmlinput.replace("#check#", "") + " ";
                    for (var item = 0; item < subjectjson[i].qaitem.length; item++) {
                        var qcontent = subjectjson[i].qaitem[item].qaitemcont.replace("：", ":");
                        if (qcontent == ":")
                            qcontent = ".";
                        //alert(qcontent);
                        html = html + this.replacequestioncontent(qcontent);
                    }
                    html = html + "</li>";
                }
            }
        }
        */
    
        return html;
    },
    handleranswerList: function (bignum, smallnum, type, sureanswer) {
        var array = new Array();
        var studentrighttype = "";
        var answer="";
         if ((this.usertype == "student"|| this.studentid!="") && ischool.ExamPaper.isstudentshowsubmit == false)
         {
             // console.log(ischool.ExamPaper.jsonanswer)
             if (typeof (ischool.ExamPaper.jsonanswer) != "undefined")
             {
                 if (null == ischool.ExamPaper.jsonanswer)
                 { }
                 else
                 {
                     //console.log(bignum + "==================" + smallnum)
                     for (var i = 0; i < ischool.ExamPaper.jsonanswer.ans.length; i++)
                     {
                        // console.log(bignum + "==================" + smallnum)
                         if (ischool.ExamPaper.jsonanswer.ans[i].anmaincode == bignum)
                         {
                             for (var y = 0; y < ischool.ExamPaper.jsonanswer.ans[i].anmainitem.length; y++)
                             {
                                 if (ischool.ExamPaper.jsonanswer.ans[i].anmainitem[y].anpaqanum == smallnum)
                                 {
                                     answer = ischool.ExamPaper.jsonanswer.ans[i].anmainitem[y].ancont
                                     studentrighttype = ischool.ExamPaper.jsonanswer.ans[i].anmainitem[y].anisright;
                                     break;
                                 }
                             }
                         }
                     }
                 }
             }
        
         }
         if (type == 40 || type == 90 || type == 110) {
            //alert(answer.split("#GAP#").length)
            for (var i = 0; i < answer.split("#GAP#").length; i++) {
                array.push(answer.split("#GAP#")[i]);;
            }
        }
        else {
            for (var i = 0; i < answer.length; i++) {
                array.push(answer.substr(i, 1));
            }
        }
        return studentrighttype + "|" + array.join("#@#").replace(/\^SPACE\^/g, "");
    },
    //上次主观题
    uploadImges:function(frmid)
    {
        var hideForm = $('#' + frmid)
        var options = {
            dataType: "json",
            type: 'POST',
            beforeSubmit: ischool.layout.loadding('正在上传....'),
            success: function (result) {
                ischool.layout.hide();
                if (result.status) {
                    //$('#' + frmid).prev().val($('#' + frmid).prev().val()+"[img]"+result.path+"[/img]");
                    var temphtml = "<div class=\"processanswer myimganswer\" title=\"点击查看答题答案\" style='display:block'>" +
                      "<a href=\"" + result.path + "\" target=\"_blank\">" +
                       "<img src=\"" + result.path + "\"></a>" +
                       "<span onclick=\"$(this).parent().remove();\"></span></div>";
                    $('#' + frmid).prev().append(temphtml);
                    // $file.remove();
                }
                else {
                    alert(result.msg);
                }
            },
            error: function (result) {
                ischool.layout.hide();
                var data = jQuery.parseJSON(result.result);
                var message = data.message;
                //$file.remove();
                alert(message);
            }
        };
        hideForm.ajaxSubmit(options);
        return false;
    },
    //上次答题过程
    uploadprocessanswer: function (frmid) {
        var hideForm = $('#' + frmid)
        var options = {
            dataType: "json",
            type: 'POST',
            beforeSubmit: ischool.layout.loadding('正在上传....'),
            success: function (result) {
                ischool.layout.hide();
                if (result.status) {
                    //$('#' + frmid).find(".uploadcontainer").hide();before
                    var temphtml = "<div class=\"processanswer myprocessanswer\" title=\"点击查看答题过程\" style='display:block'>" +
                        "<a href=\""+result.path+"\" target=\"_blank\">"+
                         "<img src=\""+result.path+"\"></a>"+
                         "<span onclick=\"$(this).parent().remove();\"></span></div>";
                    $('#' + frmid).find(".uploadcontainer").before(temphtml);
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
                ischool.layout.hide();
                var data = jQuery.parseJSON(result.result);
                var message = data.message;
                //$file.remove();
                alert(message);
            }
        };
        hideForm.ajaxSubmit(options);
        return false;
    },
    questiontypename: function (type) {

        //10=单选、20=-多选、30=判断对错、40=填空,主观:90=主观
        switch (type) {
            case 10: return "单选";
            case 20: return "多选";
            case 30: return "判断对错";
            case 40: return "填空";
            case 60: return "连线题";
            case 90: return "主观";
            case 110: return "主观填空";
            default: return "";
        }

    },
    rate:function(num)
    {
        num = num || "0";
        
        num = parseInt(num, 10);
        if (num > 5)
        {
            num = num / 2;
        }
        var tips = "非常简单";
        switch (num) {
            case 1:
                tips = "非常简单";
                break;
            case 2:
                tips = "简单";
                break;
            case 3:
                tips = "一般";
                break;
            case 4:
                tips = "难";
                break;
            case 1:
                tips = "非常难";
                break;

        }
        var html = "<div class='GlobalRate GlobalRate16' title='" + tips + "'>";
       
        for (var i = 1; i <= num; i++)
        {
            html = html + "<a class='active'></a>";
        }
        for (var i = 5 - num; i >= 1; i--)
        {
            html = html + "<a></a>";
        }
        //html = html + "<span style='color:#f06000'>(难度：" + tips + ")</span>
        html = html + "</div>";
        return html;
    },
    replacequestioncontent: function (content) {
        if (content == null)
            return "";
        if (content == "")
            return "";
        content = content.replace("：", ":");
        content = content.replace(/&lt;/g, "<");
        content = content.replace(/&gt;/g, ">");
        content = content.replace(/&amp;/g, "&");
        content = content.replace(/&quot;/g, "\"");
        content = content.replace(/<\\/g, "<");
        //content = content.replace(/\&nbsp;/g, "");
        content = content.replace("\n", "<br />");
        content = content.replace("<br>", "<br />");
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
        //console.log(content);
        return content;

    },
    bindevetTimer: function ()
    {
        ischool.ExamPaper.overplusexamtime = ischool.ExamPaper.overplusexamtime - 1;
        if (ischool.ExamPaper.overplusexamtime == 0)
        {
            $("#exam_submit_container").find(".btn-success").attr("data-isautopost","true");
            $("#exam_submit_container").find(".btn-success").click();
        }
        else
        {
            if (ischool.ExamPaper.examtimeicondeg >= 360) {
                ischool.ExamPaper.examtimeicondeg = 0;
            }
            //console.log(ischool.ExamPaper.examtime)
            ischool.ExamPaper.examtimeicondeg = ischool.ExamPaper.examtimeicondeg + 10;
            var hours = Math.floor((ischool.ExamPaper.overplusexamtime) / 3600);
            var minutes = Math.floor((ischool.ExamPaper.overplusexamtime - hours * 3600) / 60);
            var seconds = (ischool.ExamPaper.overplusexamtime - hours * 3600 - minutes * 60);
            if (hours < 10)
                hours = "0" + hours;
            if (minutes < 10)
                minutes = "0" + minutes;
            if (seconds < 10)
                seconds = "0" + seconds;
            $("#examtime_icon").css("transform", "rotate(" + ischool.ExamPaper.examtimeicondeg + "deg)");
            $("#examtime_text").html(hours + ":" + minutes + ":" + seconds)
            setTimeout("ischool.ExamPaper.bindevetTimer()", 1000);
        }
    },
    bindeventradiocheckbox:function(guid)
    {
        $("#"+guid).find("a").bind("click",function(){
            if(typeof $(this).attr("disabled")=="string")
                 return false;
            if ($(this).hasClass("radio")) {
                $("#" + guid).find("a").removeClass('checked');
                $(this).addClass('checked')
            }
            else {
                $(this).toggleClass('checked');
            }
            var index = $(this).parent().parent().parent().parent().attr("data-id");
            $("#answercardcontainer").find("a[data-index='" + index + "']").addClass("active");
            $("#" + guid).parent().parent().attr("data-isanswer", "1");
        });
        $("#" + guid).find("textarea").bind("blur", function () {
            var val = "";
            $("#" + guid).find("textarea").each(function () {

                val = val+$(this).val();
            });
            var index = $(this).parent().parent().parent().attr("data-id");
            if ($.trim(val) != "") {
                $("#answercardcontainer").find("a[data-index='" + index + "']").addClass("active");
                $("#" + guid).parent().parent().attr("data-isanswer", "1");
            }
            else {
                $("#answercardcontainer").find("a[data-index='" + index + "']").removeClass("active");
                $("#" + guid).parent().parent().attr("data-isanswer", "0");
            }
        });
       $("#"+guid).prev().find('li').bind('click',function(){

           $("#"+guid).find("a[data-value='"+$(this).attr('data-value')+"']").click()
           }
       );
    },
    linequestion:
    {
        x: [],
        y: [],
        tempindex: "",
        _this: null,
        pointclass: "point",
        autoline: function (obj, answer) {

            for (var key in answer.split(",")) {
                $(obj).parent().prev().find("[index='" + answer.split(",")[key].split("-")[0] + "']").attr("onclick", "ischool.ExamPaper.linequestion.clickEvent(this)");

                $(obj).parent().prev().find("[index='" + answer.split(",")[key].split("-")[1] + "']").attr("onclick", "ischool.ExamPaper.linequestion.clickEvent(this)");
                $(obj).parent().prev().find("[index='" + answer.split(",")[key].split("-")[0] + "']").click();
                $(obj).parent().prev().find("[index='" + answer.split(",")[key].split("-")[1] + "']").click();
                $(obj).parent().prev().find("[index='" + answer.split(",")[key].split("-")[0] + "']").removeAttr("onclick");
                $(obj).parent().prev().find("[index='" + answer.split(",")[key].split("-")[1] + "']").removeAttr("onclick");

            }
        },
        showlineanswer: function (obj, answer) {
            if ($(obj).html() == "显示答案") {

                if ($(".point").length > 0) {
                    $(".point").css("display", "")
                }
                else {
                    ischool.ExamPaper.linequestion.pointclass = 'point';
                    ischool.ExamPaper.linequestion.autoline(obj, answer);
                }
                $(obj).html("隐藏答案");
            }
            else {
                $(".point").css("display", "none");
                $(obj).html("显示答案");

            }
        },
        createOptions: function (json, answerattname) {
            var html = "";
            var linkq = "";
            var linkq1 = "";
            for (var i = 0; i < json.length; i++) {
                var subjson = json[i].qasubchoose;
                linkq = linkq + "<div index='" + String.fromCharCode(65 + i) + "1' class='linecontent'  $click$>";
                linkq = linkq + "<u>" + String.fromCharCode(65 + i) + "1</u>";
                for (var ss = 0; ss < subjson[0].qasubitem.length; ss++) {
                    linkq = linkq + ischool.ExamPaper.replacequestioncontent(subjson[0].qasubitem[ss].qaitemcont);
                }
                linkq = linkq + "</div>";
                linkq1 = linkq1 + "<div index='" + String.fromCharCode(65 + i) + "2' class='linecontent' $click$>";
                linkq1 = linkq1 + "<u>"+ String.fromCharCode(65 + i) + "2</u>";
                for (var ss = 0; ss < subjson[1].qasubitem.length; ss++) {
                    if (typeof subjson[1].qasubitem[ss] != "undefined")
                        linkq1 = linkq1 + ischool.ExamPaper.replacequestioncontent(subjson[1].qasubitem[ss].qaitemcont);
                }
                linkq1 = linkq1 + "</div>";
            }
            html = html + "<div style='width:120px; float:left; margin-right:200px;'>" + linkq + "</div><div style='width:120px; float:left; margin:0;'>" + linkq1 + "</div>"
            html = html + "<input type='hidden' name='" + answerattname + "' id='" + answerattname + "'/>"
            
            return html;
        },
        getX: function (obj) {
            var parObj = obj;
            var left = obj.offsetLeft;
            // parObj = parObj.offsetParent
            while (parObj = parObj.offsetParent) {
                left += parObj.offsetLeft;
            }
            return left;
        },

        getY: function (obj) {
            var parObj = obj;
            var top = obj.offsetTop;

            while (parObj = parObj.offsetParent) {
                top += parObj.offsetTop;
            }
            return top;
        },
        clickEvent: function (obj) {
            // e = window.event || e;
            //var tx = e.clientX;
            // var ty = e.clientY;


            var top = ischool.ExamPaper.linequestion.getY(obj);
            var left = ischool.ExamPaper.linequestion.getX(obj);
            ischool.ExamPaper.linequestion.x.push(left); //tx+document.documentElement.scrollLeft
            ischool.ExamPaper.linequestion.y.push(top + 30); //ty+document.documentElement.scrollTop
           // console.log(ischool.ExamPaper.linequestion.x);
             //console.log(ischool.ExamPaper.linequestion.y);
            ischool.ExamPaper.linequestion._this = $(obj);
            if (ischool.ExamPaper.linequestion.x.length == 1) {
                ischool.ExamPaper.linequestion.tempindex = $(obj).attr("index");
            }

            if (ischool.ExamPaper.linequestion.x.length == 2 && ischool.ExamPaper.linequestion.y.length == 2) {
                if (Math.abs(ischool.ExamPaper.linequestion.x[0] - ischool.ExamPaper.linequestion.x[1]) > 100) {

                    if (ischool.ExamPaper.linequestion.tempindex.indexOf("2") > 0) {
                        ischool.ExamPaper.linequestion.tempindex = $(obj).attr("index") + "-" + ischool.ExamPaper.linequestion.tempindex;
                    }
                    else {
                        ischool.ExamPaper.linequestion.tempindex = ischool.ExamPaper.linequestion.tempindex + "-" + $(obj).attr("index")
                    }
                    var isline = ischool.ExamPaper.linequestion.checkpointAnswer(ischool.ExamPaper.linequestion.tempindex);
                    if (isline == false)
                        ischool.ExamPaper.linequestion.createLine(ischool.ExamPaper.linequestion.x[0], ischool.ExamPaper.linequestion.y[0], ischool.ExamPaper.linequestion.x[1], ischool.ExamPaper.linequestion.y[1]);
                }
                ischool.ExamPaper.linequestion.x.length = 0;
                ischool.ExamPaper.linequestion.y.length = 0;
                ischool.ExamPaper.linequestion.tempindex = "";
            }
        },
        checkpointAnswer: function (tempindex) {
            var array = ischool.ExamPaper.linequestion._this.parent().parent().find("input").val().split(",");
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
            ischool.ExamPaper.linequestion._this.parent().parent().find("input").val(array.join(","));
            /*console.log("------------------------------");
            for (var key in array)
            {
            console.log(array[key]);
            }*/
            return false;
        },
        point: function (x, y) {
            var div = document.createElement('div');
            div.style.left = x + 'px';
            div.style.top = y + 'px';
            div.className = ischool.ExamPaper.linequestion.pointclass + " " + ischool.ExamPaper.linequestion.tempindex.replace("-", "");
            document.body.appendChild(div);
            // console.log(x + "====" + y);
        },
        createLine: function (x1, y1, x2, y2) {
            var tmp, x, y;
            if (x1 >= x2) {
                tmp = x1;
                x1 = x2;
                x2 = tmp;
                tmp = y1;
                y1 = y2;
                y2 = tmp;
            }
            x1 = x1 + 120;
            x2 = x2 - 4;
            for (var i = x1; i < x2; i++) {
                x = i;
                y = (y2 - y1) / (x2 - x1) * (x - x1) + y1;
                ischool.ExamPaper.linequestion.point(x, y);
            }
        }
    },
    postscore: function () {
        var tempjson = "";
        $(".examContainer").each(function () {
           
            var temp = "";
            $(this).find(".exam").each(function () {
                var myscore = $(this).find("[data-type='myscorevalue']").val();
                if (typeof myscore != "undefined") {
                    var score = $(this).find("[data-type='myscorevalue']").attr("data-value");
                    //console.log(score);
                    var issure = 0;
                    if (myscore == "") {
                        myscore = 0;
                    }
                    if (parseInt(score, 10) >= parseInt(myscore, 10)) {
                        issure = 1;
                    }
                    if (temp != "") {
                        temp = temp + ",";//.getTime()
                    }
                    temp = temp + "{\"anpaqanum\":" + $(this).attr("data-id") + ",\"anpaqacloudnum\":\"" + $(this).attr("data-culdid") + "\",\"anitemdesignscore\":\"" + score + "\",\"anitemgetscore\":\"" + myscore + "\",\"anisright\":" + issure + "}"
                }
            });
            if (temp != "") {
                if (tempjson != "") {
                    tempjson = tempjson + ",";
                }
                tempjson = tempjson + "{\"anmaincode\":\"" + $(this).attr("data-id") + "\",\"anmainitem\":[" + temp + "]}";
            }
        });
       // var postjson = "{\"anuuid\":\"" + ischool.ExamPaper.epid + "\",\"anstuid\":\"$studentid$\",\"aname\":\"$studentname$\",\"marktype\":\"\",\"ans\":[" + tempjson + "]}";
        //console.log(tempjson);
        $.ajax({
            url: "/Space/Microclass/ajax_markexamanswer", data: { anuuid: ischool.ExamPaper.epid, depid: ischool.ExamPaper.depid, marktype: 1, ans: eval("([" + tempjson + "])") }, type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    ischool.layout.success("评分提交成功");
                    location.href = location.href;

                }
                else {
                    ischool.layout.error(json.msg);
                }
            }
        });
        
    },
    postanswer: function ()
    {
        var tempjson = "";
        var angetscore=0;
        $(".examContainer").each(function () {

            if (tempjson != "")
            {
                tempjson = tempjson + ",";
            }
            
            var temp = "";

            $(this).find(".exam").each(function () {
                var name = $(this).attr("name");
                var type = $(this).attr("data-type");
                var answer = $(this).find(".answer").val();
                var radioval = "";
                var sourcescore=$(this).attr("data-score");
               /* if ($(this).find("input:radio:checked").length > 0) {
                    radioval = radioval + $(this).find("input:radio:checked").val();
                }*/
                var checkval = "";
                if ($(this).find(".examquestioncontentcheckedbox").find("a").length>1) {

                    $(this).find(".examquestioncontentcheckedbox").find(".checked").each(function () {
                        radioval = radioval + $(this).attr("data-value");
                    });
                }
               /* $(this).find("input:checkbox:checked").each(function () {
                    checkval = checkval + $(this).val();
                });*/
                var textval = "";
               
                $(this).find("textarea").each(function () {
                    /*if (textval != "") {
                        textval = textval + "#GAP#";
                    }
                    textval = textval + $(this).val();*/
                   // console.log(eval($(this).attr("name")+".getContent()"))
                    // return false;
                    if ($(this).attr("data-type") == "90") {
                        textval = $(this).val(); //UE.getEditor($(this).attr("name")).getContent();
                    }
                    else {
                        textval =  $(this).val();
                    }
                });
                var hidval = "";
                if ($(this).find("input:hidden").length > 0) {
                    if ($(this).find("input:hidden").attr("class") != "answer") {
                        hidval = $(this).find("input:hidden").val();
                        var tempval = hidval.split(",");

                        if (hidval.split(",").length > 1) {
                            for (var i = 0; i < hidval.split(",").length; i++) {
                                tempval[hidval.split(",")[i].substr(0, 1).charCodeAt(0) - 65] = hidval.split(",")[i];
                            }
                            hidval = tempval.join(",");
                            //alert(hidval);
                        }
                    }
                }
                if(typeof sourcescore=="undefined")
                    sourcescore=0;
                var value = radioval + checkval + textval + hidval;
                var issure = 2;
                var score = 0;
               
                if (type != 90)
                {
                    issure = 0;
                    if (answer == value)
                    {
                        issure = 1;
                        score=sourcescore;
                        angetscore=angetscore+parseInt(score,10);
                    }
                }

                if (temp != "")
                {
                    temp = temp + ",";//.getTime()
                }
                temp = temp + "{\"anpaqanum\":" + $(this).attr("data-id") + ",\"anpaqacloudnum\":\"" + $(this).attr("data-culdid") + "\",\"ancont\":\"" + value + "\",\"anitemdesignscore\":" + sourcescore + ",\"anitemgetscore\":" + score + ",\"anisright\":" + issure + ",\"ancontType\":1}"
            });
            tempjson = tempjson + "{\"anmaincode\":\"" + $(this).attr("data-id") + "\",\"anmainitem\":[" + temp + "]}";
        })
        ischool.layout.loadding("正在提交试卷中");
        var postjson = "{\"anuuid\":\"" + ischool.ExamPaper.epid + "\",\"anstuid\":\"$studentid$\",\"aname\":\"$studentname$\",\"andesignscore\":" + $("#hidpascore").val() + ",\"angetscore\":" + angetscore + ",\"anstartime\":" + Math.round((ischool.ExamPaper.begindate.getTime()) / 1000) + ",\"anendtime\":" + Math.round($.now() / 1000) + ",\"ans\":[" + tempjson + "]}";
     // console.log(ischool.ExamPaper.postanswerapi);
        $.ajax({
            url: "/Home/Learnsquare/ajax_examanswer",
             data: { epid: ischool.ExamPaper.epid, answerbean: eval("(" + postjson + ")") }, type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    ischool.layout.success("答题成功", location.href);
                 
                }
                else {
                    ischool.layout.error(json.msg);
                }
            }
        });
       //console.log(postjson);
    },
    collectlist: function () {
        $.ajax({
            url: "/Home/Homework/ajax_getcollectionwork",
            data: { userid: "", paperid: ischool.ExamPaper.epid, curpage: 0, pagesize: 999, subjectid: "0" },
            type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    for (var i = 0; i < json.data.dataList.length; i++) {
                      //  console.log(json.data.dataList[i]["questionid"])
                        var obj = $(".examContainer[data-id='" + json.data.dataList[i]["questionid"] + "']").find(".examcollect");
                        //console.log($(".examContainer[data-id='" + json.data.dataList[i]["questionid"] + "']").html())
                        obj.addClass("active");
                        obj.attr("data-sid", json.data.dataList[i]["sid"]);
                    }
                    $(".examcollect").bind("click", function () {
                        if ($(this).hasClass("active")) {
                            ischool.ExamPaper.cancelcollect($(this).attr("data-sid"));
                            $(this).removeClass("active");
                        }
                        else {
                            var obj = $(this).parent().parent();
                            var questionid = 0;
                            if (obj.hasClass("examContainer "))
                            { questionid = obj.attr("data-id") }
                            else
                            {
                                questionid = obj.parent().attr("data-id")
                            }
                            //.attr("data-id")
                            ischool.ExamPaper.addcollect(questionid);
                        }
                    });
                }
            }
        });
    },
    addcollect: function (questionid)
    {
     
        var questionjson = "";
        var questiontotalscore = 0;
     
        $(".examContainer[data-id='" + questionid + "']").find(".exam").each(function () {
            if (questionjson != "") {
                questionjson = questionjson + ",";
            }
            var itemjson = "";
            var linetemjson = "";
            var temppointsjson = "";
            var _pointscontent = $(this).find(".apppoints").html().replace(/;/g, "；");
            for (var pi = 0; pi < _pointscontent.split("；").length; pi++) {
                if (temppointsjson != "") {
                    temppointsjson = temppointsjson + ",";
                }
                temppointsjson = temppointsjson + "{\"qapointlabel\":\"" + _pointscontent.split("；")[pi] + "\",\"qapointlabelid\":\"\"}";
            }
            $(this).find(".examquestioncontent").find("li").each(function () {
                if (itemjson != "") {
                    itemjson = itemjson + ",";
                }
                itemjson = itemjson + "{\"qachoose\": \"" + $(this).attr(".data-value") + "\",\"qaitem\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + ischool.ExamPaper.replacechar($(this).html()) + "\"}]}";
            });
            var _title = ischool.ExamPaper.replacechar($(this).find(".examquestion_content").html());
            questionjson = questionjson + "{\"paqanum\": " + $(this).attr("data-id") + ",\"paqacloudnum\": \"\",\"paqaitem\": {" +
                                "\"qacoursecode\":\"\"," +
                                "\"qagradecode\": \"\"," +
                                "\"qavercode\": 2," +
                                "\"qaterm\": 10," +
                                "\"qatype\": " + $(this).attr("data-type") + "," +
                                "\"qapointname\": \"\"," +
                                "\"qapointid\": \"\"," +
                                "\"qatitile\": \"" + _title + "\"," +
                                "\"qacomment\": \"qacomment\"," +
                                "\"qanalysis\": \"qanalysis\"," +
                                "\"qadetail\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + ischool.ExamPaper.replacechar($(this).find(".appexplain").html()) + "\"}]," +
                                "\"qateachreq\": \"\"," +
                                "\"qafrom\": \"1\"," +
                                "\"qadesc\": \"\"," +
                                "\"qans\": [{\"qaitemseq\": 1,\"qaflag\": 1,\"qaitemcont\": \"" + ischool.ExamPaper.replacechar($(this).find(".appanswer").html()).replace("略", "") + "\"}]," +
                                "\"qamain\": [{\"qamainseq\": 1,\"qaflag\": 1,\"qamaincont\": \"" + _title + "\"}]," +
                                "\"qaitemlist\": [" + itemjson + "]," +
                                "\"qaitemlistline\": [" + linetemjson + "]," +
                                "\"qachoose\": \"\"," +
                                "\"qaitemseq\": 0," +
                                "\"qaitemcont\": \"\"," +
                                "\"qadif\": \"" + ischool.ExamPaper.replacechar($(this).attr("data-diff")) + "\"," +
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
                                "\"qascore\": \"" + $(this).attr("data-score") + "\"," +
                                "\"postdetailflag\":" + $(this).find(".examuploadfile").length + "," +
                                 "\"qapointlabels\":[" + temppointsjson + "]" +
                                "}}";
            questiontotalscore = questiontotalscore + parseInt($(this).attr("data-score"), 10);
        });
        var _bigcontent = $(".examContainer[data-id='" + questionid + "']").find(".exam_bigcontent").html();
        if (typeof _bigcontent == "undefined")
            _bigcontent = "";
        else
        {
            _bigcontent = ischool.ExamPaper.replacechar(_bigcontent);
        }
        var listjson =  "{" +
                    "\"paqamainnum\": " + questionid + "," +
                    "\"paqamaincloudnum\": \"\"," +
                    "\"paqamaintitle\": \"" + _bigcontent + "\"," +
                    "\"paqamaincocount\": \"" + $(".examContainer[data-id='" + questionid + "']").find(".exam").length + "\"," +
                    "\"paqamainallscore\": \"" + questiontotalscore + "\"," +

                    "\"paqamaintype\": " + $(".examContainer[data-id='" + questionid + "']").attr("data-type") + "," +
                    "\"paqamaincont\": [" + questionjson + "]}";
       
        $.ajax({
            url: "/Home/Homework/ajax_collectionwork",
            data: { userid: "", paperid: ischool.ExamPaper.epid, questionid: questionid, questioncontent: eval("(" + listjson + ")"), subjectid: ischool.ExamPaper.subjectid },
            type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    ischool.layout.success("收藏成功");
                    //location.href = location.href;
                    $(".examContainer[data-id='" + questionid + "']").find(".examcollect").addClass("active");
                    $(".examContainer[data-id='" + questionid + "']").find(".examcollect").attr("data-sid",json.data);
                }
                else {
                    ischool.layout.error(json.msg);
                }
            }
        });// 
    },
    cancelcollect: function (sid,url) {
        $.ajax({
            url: "/Home/Homework/ajax_deletecollectionwork",
            data: { sid: sid},
            type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    ischool.layout.success("操作成功");
                    if(typeof url!="undefined")
                        location.href = url;
                }
                else {
                    ischool.layout.error(json.msg);
                }
            }
        });// 
    },
    replacechar: function (content) {
        if (typeof content == "undefined")
            return "";
        if (content == null)
            return "";
        content = content.replace(/<img style=\"vertical-align:middle\" src=\"/g, "[img]");
        content = content.replace(/<img src=\"/g, "[img]");
        content = content.replace(/<IMG src=\"/g, "[img]");
        content = content.replace(/<IMG SRC=\"/g, "[img]");
        content = content.replace(/\" data-value=\"img\">/g, "[/img]");
        return content.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
    },
}