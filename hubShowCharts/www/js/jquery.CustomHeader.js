//自定义表头插件v1.0 @20140313
//email:v_wuzengwei@xdf.cn
//调用方法：1.$("table的id或class").CustomHeader();  2.$("table的id或class").CustomHeader({fixedColumns:"",buttonID:"CustomHeader-btn-setting",callback:function(){}})
//button按钮代码： <a class="btn2" href="javascript:;" style="margin-right:0" x-id="#TableHeaderLayer" id="CustomHeader-btn-setting"><i class="ico-ie6 ico-settings"></i>自定义表头</a>
(function() {
    $.fn.CustomHeader = function(options) {
        $.fn.CustomHeader.defaults = $.extend($.fn.CustomHeader.defaults, options);
        opts = $.fn.CustomHeader.defaults;
        _this = $(this);
        // if (!document.getElementById("TableHeaderLayer")) {
        if (!document.getElementById("TableHeaderLayer"))
            $("body").append(CreatetableColumnLayer); //加入层
        if (typeof (opts.isHeaderSort) != "boolean") {
            opts.isHeaderSort = false;
        }
        if (typeof (opts.tableHeader) != "object") {
            opts.tableHeader = [];
        }
        if (opts.isHeaderSort) {
            $("#TableHeaderLayer_sort").css("display", "");
        }
        var url = window.location.href;
        if (url.indexOf("?") > 0) {
            url = url.substring(0, url.indexOf("?"))
        }
        cookiename = $.fn.CustomHeader.defaults.role + url.split("/")[url.split("/").length - 2] + url.split("/")[url.split("/").length - 1];
        if (opts.tableHeader.length > 0) {
            syncReaderTable();
        }
        else {
            synReaderTable();
        }
        //保存自定义表头设置
        $("#TableHeaderLayer-save-settings").bind("click", function() {
            var values = "";
            $("#TableHeaderLayer-left-setting").find("option").each(function() {
                if (values != "")
                    values = values + ",";
                values = values + $(this).attr("value");
            });
            var rvalues = "";
            $("#TableHeaderLayer-right-setting").find("option").each(function() {
                if (rvalues != "")
                    rvalues = rvalues + ",";
                rvalues = rvalues + $(this).attr("value");
            });
            setValue(values + "|" + rvalues);
            if (typeof (opts.callback) == "function") {
                opts.callback();
            }
            refreshTable();
        });
        //绑定表头设置界面
        if (opts.buttonID != "") {
            $("#" + opts.buttonID).bind("click", function() { $("#" + opts.buttonID).XLshow(); });
        }
        $("[choice-menu]").bind('dblclick', function() {        	//鼠标双击添加菜单
            var flag = $(this).attr("choice-menu");
            if (flag == "right") {
                $(this).children("option:selected").appendTo("[choice-menu='left']").attr("selected", false); ;
                $(this).children("option:selected").remove();
            } else {
                $(this).children("option:selected").appendTo("[choice-menu='right']").attr("selected", false); ;
                $(this).children("option:selected").remove();
            }
        });
        $("[choice-btn]").click(function() {						//点击选择按钮，做相应的操作
            var btnflag = $(this).attr("choice-btn");
            var sortlist = $("[choice-menu='right'] option");
            var choicesize = $("[choice-menu='right'] option:selected").size();

            if (btnflag == "add") {
                $("[choice-menu='right'] option:selected").appendTo("[choice-menu='left']").attr("selected", false);
                $("[choice-menu='right'] option:selected").remove();
            }
            if (btnflag == "del") {
                $("[choice-menu='left'] option:selected").appendTo("[choice-menu='right']").attr("selected", false);
                $("[choice-menu='left'] option:selected").remove();
            }
            if (btnflag == "up") {								//点击上移
                if (choicesize > 1 || choicesize <= 0) {
                    alert("调整菜单快捷组的项目顺序时，请选择其中一项！");
                } else {
                    sortlist.each(function(index, item) {
                        if ($(item).attr("selected")) {
                            if (index < 1) {
                                alert("已经是最前面，不能再上移了");
                                return;
                            }
                            sortlist.eq(index - 1).before($(item));
                        }
                    });
                }
            }
            if (btnflag == "down") {									//点击下移
                if (choicesize > 1 || choicesize <= 0) {
                    alert("调整菜单快捷组的项目顺序时，请选择其中一项！");
                } else {
                    sortlist.each(function(index, item) {
                        if ($(item).attr("selected")) {
                            if (index == sortlist.length - 1) {
                                alert("已经是最后一行，不能再下移了");
                                return;
                            }
                            sortlist.eq(index + 1).after($(item));
                        }
                    });
                }
            }
        });
        refreshTable();
        // }

    };
    var cookiename = ""; //
    var columnHeaderJson;
    var tableJson;
    var _this;
    var opts;
    //异步生成表头
    function syncReaderTable() {
        var columnjson = "";
        for (var i = 0; i < opts.tableHeader.length; i++) {
            if (columnjson != "") {
                columnjson = columnjson + ",";
            }
            if (opts.tableHeader[i].Name != "" && opts.tableHeader[i].Name != "操作" && opts.fixedColumns.indexOf(opts.tableHeader[i].Name) == -1) {

                columnjson = columnjson + "{\"index\":" + i + ",\"name\":\"" + opts.tableHeader[i].Name + "\",\"sort\":" + i + ",\"isFix\":false}";

            }
            else {
                columnjson = columnjson + "{\"index\":" + i + ",\"name\":\"" + opts.tableHeader[i].Name + "\",\"sort\":" + i + ",\"isFix\":true}";
            }
        }
        columnHeaderJson = eval("[" + columnjson + "]")
    }
    //读取页面表头信息
    function synReaderTable() {
        var tabheader;
        if (_this.find("tr").eq(0).find("th").length > 0) {

            tabheader = _this.find("tr").eq(0).find("th");
        }
        else {
            tabheader = _this.find("tr").eq(0).find("td");
        }
        var columnjson = "";

        tabheader.each(function(i) {
            var name = $.trim($(this).html()).replace(/\"/g, "\\\"").replace(/\n/g, "").replace(/\r/g, "");
            var replacehtmlname = $.trim(name.replace(/<[^>]*>|/g, ""));
            if (columnjson != "") {
                columnjson = columnjson + ",";
            }
            //表头读取
            if (replacehtmlname != "" && replacehtmlname.indexOf("input") < 0 && replacehtmlname != "操作" && opts.fixedColumns.indexOf(replacehtmlname) == -1) {

                columnjson = columnjson + "{\"index\":" + i + ",\"name\":\"" + name + "\",\"sort\":" + i + ",\"isFix\":false}";

            }
            else {
                columnjson = columnjson + "{\"index\":" + i + ",\"name\":\"" + name + "\",\"sort\":" + i + ",\"isFix\":true}";
            }
        });
        columnHeaderJson = eval("[" + columnjson + "]"); //序列化表头

        //支持排序遍历table表
        if (opts.isHeaderSort) {
            var tablehtmljson = "";
            _this.find("tr").each(function(i) {
                //排除表头
                if (i > 0) {
                    if (tablehtmljson != "")
                        tablehtmljson = tablehtmljson + ",";
                    var tdjson = "";
                    $(this).find("td").each(function(y) {
                        if (tdjson != "")
                            tdjson = tdjson + ",";
                        tdjson = tdjson + "{\"index\":" + y + ",\"value\":\"" + $(this).html().replace(/\"/g, "\\\"").replace(/\n/g, "").replace(/\r/g, "") + "\"}";
                    });
                    tablehtmljson = tablehtmljson + "[" + tdjson + "]";
                }
            });
            tableJson = eval("[" + tablehtmljson + "]"); //序列化表
        }
    }
    function refreshTable() {
        var delvalues = getValue();
        var showvalues = "";
        if (delvalues.indexOf("|") >= 0) {
            showvalues = $.trim(delvalues.split("|")[1]);
            delvalues = $.trim(delvalues.split("|")[0]);
        }

        $("#TableHeaderLayer-left-setting").html("");
        $("#TableHeaderLayer-right-setting").html("");
        if (showvalues != "") {
            for (var i = 0; i < showvalues.split(",").length; i++) {
                $("#TableHeaderLayer-right-setting").append("<option value='" + columnHeaderJson[showvalues.split(",")[i]].index + "'>" + columnHeaderJson[showvalues.split(",")[i]].name.replace(/<[^>]*>|/g, "") + "</option>");
            }
        }
        if (delvalues != "") {
            for (var i = 0; i < delvalues.split(",").length; i++) {
                $("#TableHeaderLayer-left-setting").append("<option value='" + columnHeaderJson[delvalues.split(",")[i]].index + "'>" + columnHeaderJson[delvalues.split(",")[i]].name.replace(/<[^>]*>|/g, "") + "</option>");
            }
        }
        var refresIndex = "";
        var sortsetp = 0;
        for (var y = 0; y < columnHeaderJson.length; y++) {
            if (columnHeaderJson[y].isFix) {
                refresIndex = refresIndex + y + ",";
            }
            else {
                if (delvalues == "" && showvalues == "") {
                    refresIndex = refresIndex + y + ",";
                    $("#TableHeaderLayer-right-setting").append("<option value='" + columnHeaderJson[y].index + "'>" + columnHeaderJson[y].name.replace(/<[^>]*>|/g, "") + "</option>");
                }
                else {
                    if (("," + delvalues + ",").indexOf("," + y + ",") == -1) {
                        if (("," + showvalues + ",").indexOf("," + y + ",") >= 0) {
                            refresIndex = refresIndex + showvalues.split(",")[sortsetp] + ",";
                            sortsetp = sortsetp + 1;
                        }
                    }
                }
            }
        }
        if (opts.tableHeader.length == 0) {
            //支持排序表重新生成
            if ($.fn.CustomHeader.defaults.isHeaderSort) {
                if (refresIndex.length > 0) {
                    refresIndex = refresIndex.substring(0, refresIndex.length - 1);
                }
                var columns = refresIndex.split(",");
                var tablewritehtml = "<thead><tr>";

                //refresIndex = "," + refresIndex + ",";
                for (var i = 0; i < columns.length; i++) {
                    tablewritehtml = tablewritehtml + "<th>" + columnHeaderJson[columns[i]].name + "</th>";
                    // 
                }

                tablewritehtml = tablewritehtml + "</tr></thead>";
                for (var i = 0; i < tableJson.length; i++) {
                    tablewritehtml = tablewritehtml + "<tr>";
                    var row = tableJson[i];
                    for (var r = 0; r < columns.length; r++) {
                        tablewritehtml = tablewritehtml + "<td>" + row[columns[r]].value + "</td>";
                    }
                    tablewritehtml = tablewritehtml + "</tr>";
                }
                _this.html(tablewritehtml);
            }
            else {
                _this.find("tr").each(function() {
                    $(this).find("td").css("display", "");
                    $(this).find("th").css("display", "");
                    if (delvalues != "") {
                        for (var i = 0; i < delvalues.split(",").length; i++) {
                            $(this).find("td").eq(delvalues.split(",")[i]).css("display", "none");
                            $(this).find("th").eq(delvalues.split(",")[i]).css("display", "none");
                        }
                    }
                });
            }
        }
        else {
            if (refresIndex.length > 0) {
                refresIndex = refresIndex.substring(0, refresIndex.length - 1);
            }
            var columns = refresIndex.split(",");
            var tablewritehtml = "<thead><tr>";

            //refresIndex = "," + refresIndex + ",";
            for (var i = 0; i < columns.length; i++) {
                tablewritehtml = tablewritehtml + "<th>" + columnHeaderJson[columns[i]].name + "</th>";
                //
            }
            tablewritehtml = tablewritehtml + "</tr></thead>";
            for (var i = 0; i < opts.tableSource.length; i++) {
                for (var c = 0; c < columns.length; c++) {
                    tablewritehtml = tablewritehtml + "<td>";
                    var htmlmode = "$Name$";
                    //是否有列的特殊设置
                    if (Object.prototype.toString.apply(opts.tableHeader[columns[c]].Mode) === '[object Array]') {
                        htmlmode = "";
                        for (var m = 0; m < opts.tableHeader[columns[c]].Mode.length; m++) {
                            var stringformat = "";
                            if (opts.tableHeader[columns[c]].Mode[m].Value != "" && opts.tableHeader[columns[c]].Mode[m].Fomart != "") {
                                for (var f = 0; f < opts.tableHeader[columns[c]].Mode[m].Fomart.split(",").length; f++) {
                                    if (stringformat != "")
                                        stringformat = stringformat + ",";
                                    stringformat = stringformat + eval("opts.tableSource[" + i + "]." + opts.tableHeader[columns[c]].Mode[m].Fomart.split(",")[f]);
                                }
                                stringformat = eval("String.format(\"" + opts.tableHeader[columns[c]].Mode[m].Value + "\",\"" + stringformat.replace(/,/g, "\",\"") + "\")");

                            }
                            if (opts.tableHeader[columns[c]].Mode[m].Type == "checkbox") {
                                htmlmode = htmlmode + "<input type=\"checkbox\" class=\"chkbox " + opts.tableHeader[columns[c]].Mode[m].Css + "\" " + stringformat + ">";
                            }
                            if (opts.tableHeader[columns[c]].Mode[m].Type == "link") {
                                var parentname = opts.tableHeader[columns[c]].Mode[m].Text
                                if (parentname == "")
                                    parentname = "$Name$";
                                if (stringformat.indexOf(".aspx") > 0)
                                { htmlmode = htmlmode + "<a class=\"" + opts.tableHeader[columns[c]].Mode[m].Css + "\" href=\"" + stringformat + "\">" + parentname + "</a>"; }
                                else {
                                    htmlmode = htmlmode + "<a class=\"" + opts.tableHeader[columns[c]].Mode[m].Css + "\" href=\"javascript:void(0);\" onclick=\"" + stringformat + "\">" + parentname + "</a>";
                                }
                            }
                        }
                    }

                    if (opts.tableHeader[columns[c]].Code != "") {
                        var val="";
                        if(typeof opts.tableHeader[columns[c]].Operate=="object" )
                        {
                            val = eval("opts.tableSource[" + i + "]." + opts.tableHeader[columns[c]].Code + opts.tableHeader[columns[c]].Operate.Symbol + "opts.tableSource[" + i + "]." + opts.tableHeader[columns[c]].Operate.Value);
                            if(opts.tableHeader[columns[c]].Operate.Symbol=="/")
                            {
                                if(eval("opts.tableSource[" + i + "]." + opts.tableHeader[columns[c]].Code)==0||eval("opts.tableSource[" + i + "]." + opts.tableHeader[columns[c]].Operate.Value)==0)
                                {
                                    val=0;
                                }
                                else
                                {
                                    val=Math.round(val*10000)/100+"%"
                                }
                            }

                        }
                        else
                        { val = eval("opts.tableSource[" + i + "]." + opts.tableHeader[columns[c]].Code);}

                        if (htmlmode.indexOf("$Name$") >= 0)
                            htmlmode = htmlmode.replace("$Name$", val);
                        else {
                            htmlmode = val;
                        }
                    }
                    tablewritehtml = tablewritehtml + htmlmode;
                    tablewritehtml = tablewritehtml + "</td>";
                }
                tablewritehtml = tablewritehtml + "</tr>";
            }
            _this.html(tablewritehtml);

        }

    }
    function setValue(value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        //alert(value + "===" + cookiename);
        document.cookie = cookiename + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
    function getValue() {
        var arr = document.cookie.match(new RegExp("(^| )" + cookiename + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return "";

    }
    $.fn.CustomHeader.defaults = {
        tableHeader: [], //设置表头
        tableSource: [], //设置数据源
        fixedColumns: "学管姓名,学员姓名,班级编号", //固定列
        buttonID: "CustomHeader-btn-setting", //调用自定义表头的层
        isHeaderSort: false,
        role: "", //针对同页面不同角色访问设置
        callback: function() { } //回调函数
    };
    //表头设置界面模板
    var CreatetableColumnLayer = "<div id=\"TableHeaderLayer\" style=\"position: absolute; left: 343px; top: 294px; z-index: 7786; display:none;background-color: #fff; \">" +
"        <div class=\"UI-XL\">" +
"            <div class=\"XL-bg-blue\">" +
"                <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">" +
"                    <tbody>" +
"                        <tr>" +
"                            <td>" +
"                                <div class=\"XL-content-blue\">" +
"                                    <div class=\"XL-title-blue\"></div>" +
"                                        <a class=\"XL-close-blue\" node-type=\"close\" title=\"关闭\" href=\"javascript:void(0);\">" +
"                                        </a>" +
"                                        <div class=\"XL-inner-blue\">" +
"                                            <table align=\"center\">" +
"                                                <tbody>" +
"                                                    <tr>" +
"                                                        <td align=\"left\">可添加列</td>" +
"                                                        <td></td>" +
"                                                        <td align=\"left\">已存在列</td>" +
"                                                        <td></td>" +
"                                                    </tr>" +
"                                                    <tr>" +
"                                                          <td align=\"center\">" +
"                                                                 <select id=\"TableHeaderLayer-left-setting\" class=\"setting-selected\" name=\"selected\" choice-menu=\"left\" style=\"width:215px;height:250px;\" multiple=\"\"></select>" +
"                                                            </td>" +
"                                                            <td align=\"center\" style=\"width: 25px;\">" +
"                                                                <a class=\"btn2 location-pt\" style=\"margin: 0 0 5px 0;\" choice-btn=\"del\" href=\"javascript:;\"><i class=\"ico-ie6 ico-right-arrow-gray\"></i><b class=\"sign-leftline bd-line\"></b></a>" +
"                                                                <a class=\"btn2 location-pt\" style=\"margin: 0;\" choice-btn=\"add\" href=\"javascript:;\"><i class=\"ico-ie6 ico-left-arrow-gray\"></i><b class=\"sign-rightline bd-line\"></b></a>" +
"                                                            </td>" +
"                                                            <td align=\"center\">" +
"                                                                <select id=\"TableHeaderLayer-right-setting\" class=\"setting-selected\" name=\"notselected\" choice-menu=\"right\" style=\"width: 215px; height: 250px;\" multiple=\"\"></select>" +
"                                                            </td>" +
"                                                            <td align=\"center\" style=\"width: 25px; display:none\" id=\"TableHeaderLayer_sort\">" +
"                                                                <a class=\"btn2 location-pt\" style=\"margin: 0 0 5px 0;\" choice-btn=\"up\" href=\"javascript:;\"><i class=\"ico-ie6 ico-up-arrow-gray\"></i><b class=\"sign-leftline bd-line\"></b></a>" +
"                                                                <a class=\"btn2 location-pt\" style=\"margin: 0;\" choice-btn=\"down\" href=\"javascript:;\"><i class=\"ico-ie6 ico-down-arrow-gray\"></i><b class=\"sign-rightline bd-line\"></b></a>" +
"                                                            </td>" +
"                                                    </tr>" +
"                                                    <tr>" +
"                                                        <td align=\"left\" colspan=\"4\">" +
"                                                            <div class=\"mt10\">" +
"                                                                <a id=\"TableHeaderLayer-save-settings\" class=\"btn\" node-type=\"close\" href=\"javascript:void(0);\">确定</a>" +
"                                                                <a class=\"btn\" node-type=\"close\" title=\"取消\" href=\"javascript:void(0);\">取消</a>" +
"                                                            </div>" +
"                                                        </td>" +
"                                                    </tr>" +
"                                                </tbody>" +
"                                            </table>" +
"                                        </div>" +
"                                    </div>" +
"                            </td>" +
"                        </tr>" +
"                    </tbody>" +
"                </table>" +
"            </div>" +
"        </div>" +
"    </div>";
})(jQuery);
