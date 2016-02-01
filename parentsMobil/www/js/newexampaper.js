// JavaScript source code
ischool.newExamPaper = {
    questionindex:1,
    init: function (json) {
        var excontent = new StringBuilder();

        for (var level = 0; level < json.length; level++) {
			if(typeof json[level].paleveltitle =="string")
                excontent.append("<div>" + json[level].paleveltitle + "</div>");
            for (var p = 0; p < json[level].pacont.length; p++) {
                excontent.append("<div class='exambigquestion' data-id='" + json[level].pacont[p].pamaincode + "'>");
                if(typeof json[level].pacont[p].pamaincont =="string")
				{
					if (json[level].pacont[p].pamaincont!="")
						 excontent.append("<div class='examebigtitle'>" + json[level].pacont[p].pamaincont + "</div>");
				}
                excontent.append(ischool.newExamPaper.createquestion(json[level].pacont[p].paqacont));
                excontent.append("</div>");
            }
        }
        return excontent.toString();
    },
    createquestion: function (questionjson) {
        var html = new StringBuilder();
        for (var q = 0; q < questionjson.length; q++) {
            var _bigcontent = questionjson[q].paqamaintitle||"";
            
            if (_bigcontent != "") {
                if (_bigcontent.indexOf("[Audio]") > 0) {
                    var _bigclass = "examlisten";
                    var _url = _bigcontent.substr(_bigcontent.indexOf("[Audio]")).replace("[Audio]", "").replace("[/Audio]", "");
                    _bigcontent = _bigcontent.substr(0, _bigcontent.indexOf("[Audio]"));
                    _bigcontent = "<span class='audioplay' data-url='" + _url + "' title='点击播放听力'></span><span class='tingtips'>听</span><div class='exam_bigcontent_content'>" + _bigcontent + "</div>";
                }
            }
            
            var _questiontype = parseInt(questionjson[q].paqamaintype, 10);
            var _bigclass = "";
            var _collecthtml = "<span class='examcollect'>收藏本题</span>";
            if (ischool.ExamPaper.iscomplate == false)
                _collecthtml = "";
            if (ischool.ExamPaper.type != "sumhomework")
                _collecthtml = "";
            html.append("<div class='examContainer " + _bigclass + "' data-id='" + questionjson[q].paqamainnum + "' data-culdid='" + questionjson[q].paqamaincloudnum + "' data-type='" + questionjson[q].paqamaintype + "'>");
            //判断是否有大题内容
            if ($.trim(_bigcontent) != "") {

                if (_questiontype==100) {
                    _bigcontent = _collecthtml + _bigcontent;
                }
                html.append(" <div class='exam_bigcontent'>" + ischool.ExamPaper.replacequestioncontent(_bigcontent) + "  </div>");
            }
           
            var bignum = questionjson[q].paqamainnum;
            for (var s = 0; s < questionjson[q].paqamaincont.length; s++) {
                if (_questiontype ==100) {
                    _collecthtml = "";
                }
                var smallnum = questionjson[q].paqamaincont[s].paqanum;
                var subjectjson = questionjson[q].paqamaincont[s].paqaitem;
                var subjecttype = parseInt(subjectjson.qatype, 10);
                var mycurrent = this.getcurrentuseranswer(bignum, smallnum, subjecttype);
                var _andetail = mycurrent.andetail;//答题过程；
                var _dataisanswer = 0;
                var answerattname = "answer" + bignum + "" + smallnum;

               
                var strclass = "";
                var  _examclass="";
                if (mycurrent.isright == 0) {
                    strclass = " wrong"
                    if (mycurrent.answer != "")
                    {
                        _dataisanswer = 1;
                    }
                }
                else { _dataisanswer = 1 }
                if (mycurrent.isright == 1 && ischool.ExamPaper.isstudentshowsubmit == true) {
                   
                    _examclass = "  examright"
                    if(ischool.ExamPaper.type=="sumhomework"&&ischool.ExamPaper.answercount==0)
                        _examclass = "  "
                }
               // console.log(mycurrent);
                //获取正确答案
                var _questionanswer = "";
                if (subjectjson.qans != null) {
                    _questionanswer = subjectjson.qans[0].qaitemcont
                }
                html.append("<div class='exam' name=\"" + answerattname + "\"  data-id='" + smallnum + "' data-culdid='" + questionjson[q].paqamaincont[s].paqacloudnum + "' data-type='" + subjectjson.qatype + "' data-score='" + subjectjson.qascore + "' data-diff='" + subjectjson.qadif + "' data-isanswer='" + _dataisanswer + "'>");
                count = ischool.newExamPaper.questionindex;
                //判断是否已经做过
                if (mycurrent.answer != "") {
                    $("#answercardcontainer").append("<a href='#q" + count + "' data-index='" + count + "' class='active'>" + count + "</a>");
                }
                else {
                    $("#answercardcontainer").append("<a href='#q" + count + "' data-index='" + count + "'>" + count + "</a>");
                }
                html.append("<a name='q" + count + "' data-index='" + count + "'></a>");

                html.append(" <div class=\"examquestion\">");
                if(smallnum>0)
                {
                    //html.append(" <span class='number'>" + smallnum + ".</span> ");
                }
                html.append("<div class='examquestion_content'>"+" <span class='number'>" + smallnum + ".</span> ");
                if (subjectjson.qamain != null) {
                    for (var i = 0; i < subjectjson.qamain.length; i++) {
                        html.append(ischool.ExamPaper.replacequestioncontent(subjectjson.qamain[i].qamaincont));
                    }
                }
                html.append("</div>"+_collecthtml+"</div>");
                html.append(" <div class=\"examquestioncontent"+_examclass+"\">");
               
                if (subjecttype == 60) {
                    if (subjectjson.qaitemlistline != null) {
                        html.append(ischool.ExamPaper.linequestion.createOptions(subjectjson.qaitemlistline, answerattname));
                    }
                }
                else {
                    html.append(ischool.ExamPaper.handdleroptions(answerattname, subjecttype, subjectjson.qaitemlist, mycurrent.isright + "|" + mycurrent.answer, _questionanswer));
                }
                //html = html + subjectjson.qaitemcont
                html.append("</div>");
                var guid = new GUID().newGUID();
                var _htmlformdelete = "<span onclick='$(this).parent().hide();$(this).parent().next().css(\"display\",\"inline-block\")'></span>";
                var _htmlformpost = "<a class='uploadcontainer' ><input type=\"file\" name=\"image\" accept='.jpg,png,jpeg,gif'  onchange=\"$('#insertPicForm" + guid + "').prev().val('');ischool.ExamPaper.uploadprocessanswer('insertPicForm" + guid + "')\"></a>";
                if (ischool.ExamPaper.isread)
                {
                    _htmlformdelete = "";
                    _htmlformpost = "";
                }
                if (ischool.ExamPaper.isstudentshowsubmit == false)
                {
                    _htmlformdelete = "";
                    _htmlformpost = "";
                }
                var htmlform = "<form id=\"insertPicForm" + guid + "\" action=\"/Home/Learnsquare/ajax_questions_pic\" enctype=\"multipart/form-data\">";
                htmlform = htmlform + "<div class='examuploadfile examuploadfile1'><span>上传答题过程</span>";
                if (_andetail != "")
                {
                    if (_andetail.split("[/img]").length == 1)
                    {
                        htmlform = htmlform + "<div class=\"processanswer myprocessanswer\" title=\"点击查看答题过程\" style='display:block'>";
                        htmlform = htmlform + "<a href=\"" + _andetail + "\" target=\"_blank\">";
                        htmlform = htmlform + "<img src=\"" + _andetail + "\"></a>";
                        htmlform = htmlform + _htmlformdelete;
                        htmlform = htmlform + "</div>";
                    }
                    else
                    {
                        for (var di = 0; di < _andetail.split("[/img]").length; di++) {
                            if (_andetail.split("[/img]")[di] != "") {
                                htmlform = htmlform + "<div class=\"processanswer myprocessanswer\" title=\"点击查看答题过程\" style='display:block'>";
                                htmlform = htmlform + "<a href=\"" + _andetail.split("[/img]")[di].replace("[img]", "") + "\" target=\"_blank\">";
                                htmlform = htmlform + "<img src=\"" + _andetail.split("[/img]")[di].replace("[img]", "") + "\"></a>";
                                htmlform = htmlform + _htmlformdelete;
                                htmlform = htmlform + "</div>";
                            }
                        }
                    }
                }

                htmlform = htmlform + _htmlformpost
                htmlform = htmlform + "</div>";
                htmlform = htmlform + "</form>";
                if (subjectjson.postdetailflag == 0)
                {
                    htmlform = "";
                }
                html.append(htmlform);
                html.append("<input type='hidden' class='answer' value=\"" + _questionanswer + "\">");

                var answerhtml = new StringBuilder();
                var _questionanalysis = "";
                var _questionpoint = "";
                if (subjectjson.qadetail!=null)
                {
                    _questionanalysis = subjectjson.qadetail[0].qaitemcont
                }
               
                if (typeof subjectjson.qapointlabels != "undefined")
                {
                    if (subjectjson.qapointlabels!=null)
                    for (var qp = 0; qp < subjectjson.qapointlabels.length; qp++)
                    {
                        _questionpoint = _questionpoint + subjectjson.qapointlabels[qp].qapointlabel + "；";
                    }
                }
                if (ischool.ExamPaper.isread) {
                    //answerhtml.append("<div class='answercontainer'><a href='javascript:void(0)' onclick='if($(this).html()==\"显示答案\"){$(this).html(\"隐藏答案\");$(this).parent().next().show();}else{$(this).html(\"显示答案\");$(this).parent().next().hide();}' class='btn btn-success'>显示答案</a></div>");
                    answerhtml.append("<div class='answercontainer_detail  viewanalyze'>");
                    answerhtml.append("<div class='item'><label>正确答案：</label><span class='appanswer'>" + ischool.ExamPaper.showanswer(subjecttype, _questionanswer).replace("答案：", "") + "</span></div>");
                    answerhtml.append("</div>");
                    if (_questionanalysis != "") {
                        answerhtml.append("<div class='answercontainer_detail viewanalyze'>");
                        answerhtml.append("<div class='item'><label>难度系数：</label><div class='analyzecontent'>" +ischool.ExamPaper.rate( subjectjson.qadif)+ "</div></div>");
                        answerhtml.append("<div class='item'><label class='keep'>考&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label><div class='analyzecontent apppoints'>" + ischool.ExamPaper.replacequestioncontent(_questionpoint) + "</div></div>");
                        answerhtml.append("<div class='item'><label class='list'>参考解析：</label><div class='analyzecontent appexplain'>" + ischool.ExamPaper.replacequestioncontent(_questionanalysis) + "</div></div>");
                        answerhtml.append("</div>");
                    }
                }
                else {

                    //if (ischool.ExamPaper.isstudentshowsubmit == false) {

                        if (subjecttype != 90&&subjecttype!=110) {
                            //answerhtml.append("<div class='answercontainer'><span>正确答案：" + ischool.ExamPaper.showanswer(subjecttype, questionjson[q].paqamaincont[s].paqaitem.qans[0].qaitemcont) + "</span> <span " + strclass + ">我的答案：" + ischool.ExamPaper.showanswer(subjecttype, mycurrent.answer.replace(/#@#/g, " ")) + "</span></div>");
                            answerhtml.append("<div class='answercontainer_detail'>");
                            var _myanswer = ischool.ExamPaper.showanswer(subjecttype, mycurrent.answer.replace(/#@#/g, " ")).replace("答案：", "");
                           
                            answerhtml.append("<div class='answercontent  " + strclass + "'><i class='label'>我的答案：</i><span class='appanswer'>" + _myanswer + "</span></div>");
                            answerhtml.append("<div class='answercontent'><i class='label'>正确答案：</i><span class='appanswer'>" + ischool.ExamPaper.showanswer(subjecttype, _questionanswer).replace("答案：", "") + "</span></div>");
                            answerhtml.append("<div class='viewanalyzebtn'>收起解析</div>");
                            answerhtml.append("</div>");
                            if (_questionanalysis != "") {
                                answerhtml.append("<div class='answercontainer_detail viewanalyze'>");
                                answerhtml.append("<div class='item'><label>难度系数：</label><span class='analyzecontent'>" + ischool.ExamPaper.rate(subjectjson.qadif) + "</span></div>");
                                answerhtml.append("<div class='item'><label class='keep'>考&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label><span class='analyzecontent apppoints'>" + ischool.ExamPaper.replacequestioncontent(_questionpoint) + "</span></div>");
                                answerhtml.append("<div class='item'><label class='list'>参考解析：</label><span class='analyzecontent appexplain'>" + ischool.ExamPaper.replacequestioncontent(_questionanalysis) + "</span></div>");
                                answerhtml.append("</div>");
                            }
                        }
                        else {
                            var _isshowscorestyle = " style='display:none'";
                            if (ischool.ExamPaper.usertype == "teacher") {
                                if (mycurrent.score != mycurrent.sourcescore&&$.trim(mycurrent.answer)!="") {
                                    var _isshowscorestyle = "";
                                }
                               
                            }
                            //寒假作业保存时不显示
                            if (ischool.ExamPaper.answercount == 0 && ischool.ExamPaper.type == "sumhomework") {

                            }
                            else
                            {
                                answerhtml.append("<div class='answercontainer_detail'>");
                                answerhtml.append("<div class='item'><label>我的答案：</label><span class='myanswer analyzecontent'>" + ischool.ExamPaper.showanswer(subjecttype, mycurrent.answer.replace(/#@#/g, " ")).replace("答案：", "") + "</span></div>");
                                answerhtml.append("<div class='item'><label>正确答案：</label><span class='analyzecontent appanswer'>" + ischool.ExamPaper.showanswer(subjecttype, questionjson[q].paqamaincont[s].paqaitem.qans[0].qaitemcont).replace("答案：", "") + "</span></div>");
                                answerhtml.append("</div>");

                                answerhtml.append("<div class='answercontainer' " + _isshowscorestyle + ">手动评分:本题" + questionjson[q].paqamaincont[s].paqaitem.qascore + "分,学生的得分<u></u> <u><input type='text' class='input' style='width:50px;' data-value='" + questionjson[q].paqamaincont[s].paqaitem.qascore + "' data-type='myscorevalue' value='" + mycurrent.score + "'><a href='javascript:void(0)' class='btn btn-success btnselfscore' data-type='myscore' style='display:none'>评分</a></u></div>");
                                if (_questionanalysis != "") {
                                    answerhtml.append("<div class='answercontainer_detail viewanalyze'>");
                                    answerhtml.append("<div class='item'><label>难度系数：</label><div class='analyzecontent'>" + ischool.ExamPaper.rate(subjectjson.qadif) + "</div></div>");
                                    answerhtml.append("<div class='item'><label class='keep'>考&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label><div class='analyzecontent apppoints'>" + ischool.ExamPaper.replacequestioncontent(_questionpoint) + "</div></div>");
                                    answerhtml.append("<div class='item'><label class='list'>参考解析：</label><div class='analyzecontent appexplain'>" + ischool.ExamPaper.replacequestioncontent(_questionanalysis) + "</div></div>");
                                    answerhtml.append("</div>");
                                }
                               
                            }
                        }

                   // }
                    
                        if (ischool.ExamPaper.type == "homework" || ischool.ExamPaper.type == "sumhomework")
                    {
                       
                            if(ischool.ExamPaper.isstudentshowsubmit) {
                                //if (subjecttype == 90 &&parseInt( mycurrent.isright,10)>-1) {

                                //}
                                //else {
                                    answerhtml = null;
                                    answerhtml = new StringBuilder();
                                //}
                            }
                        
                       
                    }
                    else
                    {
                        if (ischool.ExamPaper.usertype == "student" && ischool.ExamPaper.isstudentshowsubmit == true) {
                            answerhtml = null;
                            answerhtml = new StringBuilder();

                        }
                    }
                }

                html.append(answerhtml.toString());
                html.append("</div>");
                ischool.newExamPaper.questionindex = ischool.newExamPaper.questionindex + 1;
            }
            html.append("</div>");
        }
        if (ischool.ExamPaper.usertype == "student" && ischool.ExamPaper.isstudentshowsubmit == true) {
            return html.toString().replace(/\$click\$/g, "onclick='ischool.ExamPaper.linequestion.clickEvent(this)'")
        }
        else {
            return html.toString().replace(/\$click\$/g, "");
        }

    },
    getcurrentuseranswer:function(bignum, smallnum,type)
    {
        //获取当题的用户作答情况
        var json = "{\"score\":0,\"sourcescore\":0,\"answer\":\"\",\"isright\":-1,\"andetail\":\"\"}";
        var array = new Array();
        if (typeof (ischool.ExamPaper.jsonanswer) != "undefined") {
            if (null == ischool.ExamPaper.jsonanswer)
            { }
            else
            {
                for (var i = 0; i < ischool.ExamPaper.jsonanswer.ans.length; i++) {
                    //anpaqamainnum
                    for (var b = 0; b < ischool.ExamPaper.jsonanswer.ans[i].anmainitem.length; b++) {
                        var bjon = ischool.ExamPaper.jsonanswer.ans[i].anmainitem[b];
                        if (bjon.anpaqamainnum == bignum) {
                            for (var y = 0; y < bjon.anpaqamainitem.length; y++) {

                                if (bjon.anpaqamainitem[y].anpaqanum == smallnum) {
                                  
                                    _andetail = bjon.anpaqamainitem[y].andetail;
                                    answer = bjon.anpaqamainitem[y].ancont
                                    studentrighttype = bjon.anpaqamainitem[y].anisright;
                                    if (answer == null)
                                    {
                                        answer = "";
                                    }

                                    if (type == 40 || type == 90||type==110) {
                                       
                                        if (answer.indexOf("#GAP#") > 0) {
                                            for (var a = 0; a < answer.split("#GAP#").length; a++) {
                                                array.push(answer.split("#GAP#")[a]);

                                            }
                                        }
                                        else {
                                            if (answer.indexOf("<img") < 0)
                                                for (var a = 0; a < answer.split(";").length; a++) {
                                                    array.push(answer.split(";")[a]);
                                                    
                                                }
                                        }

                                    }
                                    else {
                                        for (var a = 0; a < answer.length; a++) {
                                            array.push(answer.substr(a, 1));
                                        }
                                    }//
                                    if (typeof _andetail == "undefined")
                                        _andetail = ""
                                    json = "{\"score\":" + bjon.anpaqamainitem[y].anitemgetscore;
                                    json = json + ",\"sourcescore\":" + bjon.anpaqamainitem[y].anitemdesignscore;
                                    json = json + ",\"answer\":\"" + array.join("#@#").replace(/\^SPACE\^/g, "").replace("\"", "\\\"") + "\"";
                                    json = json + ",\"isright\":" + studentrighttype;
                                    json = json + ",\"andetail\":\"" + _andetail + "\"}";
                                    //console.log(json);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        //console.log(json)
        return eval("("+json+")");
    },
   
    checkexame: function () {
        $(".exambigquestion").each(function () {
            $(this).find(".examContainer").each(function () {
                $(this).find(".exam").each(function () {
                    var type = $(this).attr("data-type");
                    var answer = $(this).find(".answer").val();
                    //替换不规则的字符
                    answer = answer.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/。/g, "").replace(/；/g, ";");
                    if (parseInt(type, 10) != 90)
                    {
                        var radioval = "";


                        if ($(this).find(".examquestioncontentcheckedbox").find("a").length > 1) {

                            $(this).find(".examquestioncontentcheckedbox").find(".checked").each(function () {
                                radioval = radioval + $(this).attr("data-value");
                            });
                        }

                        var textval = "";

                        $(this).find("textarea").each(function () {

                            if ($(this).attr("data-type") == "90") {
                                textval = $(this).val(); //UE.getEditor($(this).attr("name")).getContent();
                            }
                            else {
                                if (textval != "") {
                                    textval = textval + "#GAP#";
                                }
                                textval = textval + $(this).val();
                            }
                        });
                        var _issure=true;;
                        var value = radioval + textval;
                        value = value.replace("’", "'").replace("；", ";");

                        for(var an=0;an<answer.split(";").length;an++)
                        {
                            _issure=false;
                            var _length = answer.split(";").length;
                            var myvalue = value.replace(/;/g, "#GAP#");
                            if (myvalue.split("#GAP#").length > an) {
                                var _myanswer = myvalue.split("#GAP#")[an];
                                var _sureanswer=answer.split(";")[an];
                                if(_sureanswer.split("||").length>1) {
                                    for (var t = 0; t < _sureanswer.split("||").length; t++) {
                                        if (_sureanswer.split("||")[t] == _myanswer) {
                                            _issure = true;
                                        }
                                    }
                                }
                                else
                                {
                                    if ($.trim(_sureanswer) == $.trim(_myanswer)) {
                                        _issure = true;
                                    }
                                }
                            }
                            if(_issure==false)
                            {
                                break;
                            }
                        }
                        if (_issure == false) {
                            if (value == answer) {
                                _issure = true;
                            }
                        }
                        if (_issure)
                        {
                            $(this).find(".examquestioncontent").addClass('examright');
                        }
                    }
                });
            });
        });
    },
    getanswerbeanjson:function()
    {
        var json = "";
        var angetscore = 0;
        $(".exambigquestion").each(function () {
            if (json != "") {
                json = json + ",";
            }
            var tempjson = "";
            $(this).find(".examContainer").each(function () {

                if (tempjson != "") {
                    tempjson = tempjson + ",";
                }

                var temp = "";
                var errcount = 0;
                var qissure = 2;
                var totalscore = 0;
                var myscore = 0;
                $(this).find(".exam").each(function () {
                    var name = $(this).attr("name");
                    var type = $(this).attr("data-type");
                    var answer = $(this).find(".answer").val();
                    //替换不规则的字符
                    answer = answer.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/。/g, "").replace(/；/g, ";");
                    var radioval = "";
                    var sourcescore = $(this).attr("data-score");
                    var processanswer = "";
                    $(this).find(".myprocessanswer>a").each(function () {
                        processanswer = processanswer + "[img]" + $(this).attr("href") + "[/img]";
                    });


                    //console.log(processanswer)
                    totalscore = totalscore + parseInt(sourcescore, 10);

                    if ($(this).find(".examOptions").length > 1) {

                        $(this).find(".examOptions").find(".checked").each(function () {
                            radioval = radioval + $(this).attr("data-value");
                        });
                    }
                    if (typeof radioval == "undefined")
                        radioval = "";
                    var textval = "";

                    $(this).find("textarea").each(function () {

                        if ($(this).attr("data-type") == "90" || $(this).attr("data-type") == "110") {
                            textval = $(this).val(); //UE.getEditor($(this).attr("name")).getContent();
                            var _imgs = "";
                            $(this).next().find(".myimganswer>a").each(function () {
                                _imgs = _imgs + "[img]" + $(this).attr("href") + "[/img]";
                            })
                            textval = textval + _imgs;
                        }
                        else {

                            if (textval != "") {
                                textval = textval + "#GAP#";
                            }
                            textval = textval + $(this).val();
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
                    if (typeof sourcescore == "undefined")
                        sourcescore = 0;
                    // console.log(radioval);
                    var value = radioval + textval + hidval;
                    //替换中文符号带来的问题
                    value = value.replace("’", "'").replace("；", ";");
                    //console.log(radioval  +"===="+ textval+"===" + hidval)
                    var issure = 2;
                    var score = 0;

                    if (type != 90 && type != 60) {
                        issure = 0;
                        /* if (answer == value) {
                             issure = 1;
                             score = sourcescore;
                             angetscore = angetscore + parseInt(score, 10);
                             myscore = myscore + parseInt(score, 10);
                         }*/
                        var _issure = true;;
                        var myvalue = value.replace(/;/g, "#GAP#");
                        for (var an = 0; an < answer.split(";").length; an++) {
                            _issure = false;
                            var _length = answer.split(";").length;

                            if (myvalue.split("#GAP#").length > an) {
                                var _myanswer = myvalue.split("#GAP#")[an];
                                var _sureanswer = answer.split(";")[an];
                                if (_sureanswer.split("||").length > 1) {
                                    for (var t = 0; t < _sureanswer.split("||").length; t++) {
                                        if (_sureanswer.split("||")[t] == _myanswer) {
                                            _issure = true;
                                            score = score + (sourcescore / answer.split(";").length);
                                        }
                                    }
                                }
                                else {
                                    if ($.trim(_sureanswer) == $.trim(_myanswer)) {
                                        _issure = true;
                                    }
                                }
                            }
                            if (_issure == false) {
                                break;
                            }
                        }
                        if (_issure == false) {
                            if (value == answer) {
                                _issure = true;
                            }
                        }
                        if (_issure) {
                            issure = 1;
                            score = sourcescore;
                            angetscore = angetscore + parseInt(score, 10);
                            myscore = myscore + parseInt(score, 10);
                        }
                    }
                    else if (type == 60) {
                        var myvalue = value.replace(/;/g, ",");
                        //console.log(answer + "-----" + myvalue);
                        if (myvalue == answer.replace(/;/g, ",")) {
                            issure = 1;
                            score = sourcescore;
                            angetscore = angetscore + parseInt(score, 10);
                            myscore = myscore + parseInt(score, 10);
                            //console.log("=======")
                        }
                    }
                    else {
                        score = $(this).find(".answercontainer").find("input").val();

                        if (typeof score == "string") {
                            if (score == "") score = 0;
                            if (score == sourcescore)
                            { issure = 1; }
                            angetscore = angetscore + parseInt(score, 10);

                            myscore = myscore + parseInt(score, 10);
                        }
                        else { score = 0; }
                    }
                    if (temp != "") {
                        temp = temp + ",";//.getTime()
                    }
                    temp = temp + "{\"anpaqanum\":" + $(this).attr("data-id") + ",\"anpaqacloudnum\":\"" + $(this).attr("data-culdid") + "\"," +
                        "\"ancont\":\"" + value + "\",\"anitemdesignscore\":" + sourcescore + ",\"anitemgetscore\":" + score + ",\"anqatype\":\"" + $(this).attr("data-type") + "\",\"anisright\":" + issure + ",\"ancontType\":1,\"andetail\":\"" + processanswer + "\"}"
                });
                tempjson = tempjson + "{\"anpaqamainnum\":" + $(this).attr("data-id") + ",\"anpaqamaincloudnum\":\"" + $(this).attr("data-culdid") + "\"," +
                    "\"anpaqamaintype\":\"" + $(this).attr("data-type") + "\",\"anpaqamainisallright\":" + qissure + ",\"anpaqamaincocount\":" + $(this).find(".exam").length + "," +
                    "\"anpaqamainwrongcount\":" + errcount + ",\"anmainitemdesignscore\":\"" + totalscore + "\",\"anmainitemgetscore\":\"" + myscore + "\",\"anpaqamainitem\":[" + temp + "]}";
            });
            json = json + "{\"anmaincode\":\"" + $(this).attr("data-id") + "\",\"anmainitem\":[" + tempjson + "]}";
        });
        var postjson = "{\"anuuid\":\"" + ischool.ExamPaper.epid + "\",\"anstuid\":\"$studentid$\",\"aname\":\"$studentname$\",\"andesignscore\":" + $("#hidpascore").val() + ",\"angetscore\":" + angetscore + ",\"anstartime\":" + Math.round((ischool.ExamPaper.begindate.getTime()) / 1000) + ",\"anendtime\":" + Math.round($.now() / 1000) + ",\"antotalusetime\":" + (ischool.ExamPaper.examtime - ischool.ExamPaper.overplusexamtime) + ",\"ans\":[" + json + "]}";
        return postjson;
    },
    saveanswer: function () {

        var json = "";
        var angetscore = 0;

        
        ischool.layout.loadding("保存试卷进度中...");
        $(".btn-post").hide();


        $.ajax({
            url: ischool.ExamPaper.saveanswerapi, data: { workid: ischool.ExamPaper.epid, stuid:"",answercontent: eval("(" + ischool.newExamPaper.getanswerbeanjson() + ")") }, type: "post", dataType: "json", success: function (json) {
                if (json.status) {
                    var msg="已经成功暂存作业进度。你还有"+(3-1-ischool.ExamPaper.savecount)+"次暂存作业机会。"
                    ischool.layout.alert("提示", msg, function () { location.href = "/Home/Homework/choose_school" });
                   
                }
                else {
                    ischool.layout.error(json.msg);
                    $(".btn-post").show();
                }
            }
        });

    },
    postanswer: function () {
        var json = "";
        var angetscore = 0;
        
        //验证是否答题时间截至了，触发自动提交
        var _isautopost = false;
        if ($("#exam_submit_container").length > 0) {
            if ($("#exam_submit_container").find("div").attr("data-isautopost") == "true") {
                _isautopost = true;
            }
        }
       // var postjson = "{\"anuuid\":\"" + ischool.ExamPaper.epid + "\",\"anstuid\":\"$studentid$\",\"aname\":\"$studentname$\",\"andesignscore\":" + $("#hidpascore").val() + ",\"angetscore\":" + angetscore + ",\"anstartime\":" + Math.round((ischool.ExamPaper.begindate.getTime()) / 1000) + ",\"anendtime\":" + Math.round($.now() / 1000) + ",\"ans\":[" + json + "]}";
        var postjson=ischool.newExamPaper.getanswerbeanjson();
        if (_isautopost == false) {
            var isconfirm = false;
            var questionnum = $(".exam").length;
            var complatequestionnum = $(".exam[data-isanswer='1']").length;
            var msg = "你还有题目尚未完成，是否确认提交？";
            if (ischool.ExamPaper.type == "sumhomework")
            {
                if(ischool.ExamPaper.savecount<3)
                { msg = "你有题目尚未作答，建议保存当前作答记录，方便下次继续作答。确认直接提交吗？"; }
            }
           if (questionnum == complatequestionnum) {
               ischool.newExamPaper.submitpostanswer(postjson);
           }
           else {
               ischool.layout.confirm("提示", msg, function () {
                   ischool.newExamPaper.submitpostanswer(postjson);
               });
           }
        }
        else {
            ischool.newExamPaper.submitpostanswer(postjson);
        }
    },
    submitpostanswer:function(postjson)
    {
        var _msgpost = "正在提交试卷中";
        var _msgcomplate = "答题成功";
        if ($("#exam_submit_container").length > 0) {
            if ($("#exam_submit_container").find("div").attr("data-isautopost") == "true") {
                _msgpost = "答题超时，系统自动提交试卷中...";
                _msgcomplate = "答题超时,系统自动提交，如果需要可再次进行作答";
               
            }
        }
        ischool.layout.loadding(_msgpost);
        $(".btn-post").hide();
        if (ischool.ExamPaper.postcallback != null) {
            ischool.ExamPaper.postcallback(postjson);
        }
        else {
            $.ajax({
                url: ischool.ExamPaper.postanswerapi, data: { epid: ischool.ExamPaper.epid, answerbean: eval("(" + postjson + ")") }, type: "post", dataType: "json", success: function (json) {
                    if (json.status) {
                        ischool.layout.success(_msgcomplate,location.href);
                        
                      
                    }
                    else {
                        ischool.layout.error(json.msg);
                        $(".btn-post").show();
                    }
                }
            });
        }
    },
    postscore: function () {
        var json = "";
        $(".exambigquestion").each(function () {
            if (json != "") {
                json = json + ",";
            }
            var tempjson = "";
            $(this).find(".examContainer").each(function () {

                var temp = "";
                $(this).find(".exam").each(function () {
                    var myscore = $(this).find("[data-type='myscorevalue']").val();
                    if (typeof myscore != "undefined") {
                      //myscore="";
                        var score = $(this).find("[data-type='myscorevalue']").attr("data-value");
                       // console.log(score);
                        var issure = 0;
                        if (myscore == "") {
                            myscore = 0;
                        }
						if(parseInt(score, 10) >= parseInt(myscore, 10))
						{
							score=myscore;
						}
                        if (parseInt(score, 10)*0.6 >= parseInt(myscore, 10)) {
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
                    tempjson = tempjson + "{\"anpaqamainnum\":\"" + $(this).attr("data-id") + "\",\"anpaqamaintype\":\"" + $(this).attr("data-type") + "\",\"anpaqamaincloudnum\":\"" + $(this).attr("data-culdid") + "\",\"anpaqamainitem\":[" + temp + "]}";
                }
            });
            json = json + "{\"anmaincode\":\"" + $(this).attr("data-id") + "\",\"anmainitem\":[" + tempjson + "]}";
        });
        // var postjson = "{\"anuuid\":\"" + ischool.ExamPaper.epid + "\",\"anstuid\":\"$studentid$\",\"aname\":\"$studentname$\",\"marktype\":\"\",\"ans\":[" + tempjson + "]}";
        //console.log(json);
        $.ajax({
            url: "/Space/Homework/ajax_markexamanswer", data: { anuuid: ischool.ExamPaper.epid, depid: ischool.ExamPaper.depid, marktype: 1, ans: eval("([" + json + "])") }, type: "post", dataType: "json", success: function (json) {
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
    
}
