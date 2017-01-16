//*后台管理页JS函数，Jquery扩展
//*作者：rolin
//*时间：2013年01月08日
//*********************多语言开始*****************************//
var lgcs="";
if (QueryString("lg") != "") {
    lgcs = "?lg=" + QueryString("lg");
}
//document.write(unescape("%3Cscript src='/Ajax/GetLanguage.ashx" + lgcs + "' type='text/javascript'%3E%3C/script%3E"));
var wlh = "http://" + window.location.host;//获取域名
document.write(unescape("%3Cscript src='" + wlh + "/Ajax/GetLanguage.ashx" + lgcs + "' type='text/javascript'%3E%3C/script%3E"));
//**********************多语言结束******************************//
$.ajaxSetup({
    cache: false
});
$(function () {
    $('.aspNetHidden').hide();
    Loading(false);
    publicobjcss();
    $("#txt_Search").focus().select(); //搜索框默认焦点
    // $.getScript("http://s24.cnzz.com/stat.php?id=3777247&web_id=3777247");
    var _hmt = _hmt || [];
    (function () {
        //        var hm = document.createElement("script");
        //        hm.src = "//hm.baidu.com/hm.js?0ac10225ac9f496032a0b03e84f52861";
        //        var s = document.getElementsByTagName("script")[0];
        //        s.parentNode.insertBefore(hm, s);
    })();
})
//=============================切换验证码======================================
function ToggleCode(obj, codeurl) {
    $("#txtCode").val("");
    $("#" + obj).attr("src", codeurl + "?time=" + Math.random());
}
//回调
function windowload() {
    rePage();
}
/**
 刷新页面
 **/
function rePage() {
    Loading(true);
    window.location.href = window.location.href.replace('#', '');
    return false;
}
/**
 * 返回上一级
 */
function back() {
    window.history.back(-1);
    Loading(true)
}
//跳转页面
function Urlhref(url) {
    Loading(true);
    window.location.href = url;
    return false;
}

function Loading(bool) {
    /// <summary>
    ///     1: Loading(bool) - 在页面最顶层的框架中显示"正在加载"的消息
    ///     &#10;   在页面最顶层的框架中显示"正在加载"的消息
    /// </summary>
    /// <param name="bool" type="Boolean">
    ///     为true表示显示该消息，false则隐藏该消息
    /// </param>
    /// <returns type="void" />
    if (bool) {
        top.$("#loading").show();
    } else {
        setInterval(loadinghide, 800);
    }
}
function loadinghide() {
    /// <summary>
    ///     1: loadinghide() - 隐藏页面最顶层框架中"正在加载"的消息
    ///     &#10;   本函数仅辅助Loading(bool)方法，当然也可以单独调用本函数
    /// </summary>
    /// <returns type="void" />
    top.$("#loading").hide();
}
function TopLoading(msg, time) {
    /// <summary>
    ///     1: TopLoading(msg, time) - 在页面最顶层的框架中显示"加载"的消息
    ///     &#10;   在页面最顶层的框架中显示"加载"对话框，并在指定的时间后隐藏该消息
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <param name="time" type="Int">
    ///     消息停留时间，以毫秒(ms)单位，默认为1000ms
    /// </param>
    /// <returns type="void" />
    var _time = 1000;
    if (IsNullOrEmpty(time)) {
        _time = time;
    }
    top.$("#Toploading").show().html(msg);
    top.$('#Toploading').css("left", ($(window).width() - $("#Toploading").width()) / 2);
    setInterval(Toploadinghide, _time);

}
function Toploadinghide() {
    top.$("#Toploading").hide();
}
function BeautifulGreetings() {
    var now = new Date();
    var hour = now.getHours();
    if (hour < 3) { return (lghour1) }
    else if (hour < 9) { return (lghour2) }
    else if (hour < 12) { return (lghour3) }
    else if (hour < 14) { return (lghour4) }
    else if (hour < 18) { return (lghour5) }
    else if (hour < 23) { return (lghour6) }
    else { return (lghour7) }
}
function showTipsMsg(msg, time, type) {
    /// <summary>
    ///     1: showTipsMsg(msg, time, type) - 显示消息函数
    ///     &#10;   该函数短暂的显示消息（无操作按钮）
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <param name="time" type="Int">
    ///     消息停留时间，以毫秒(ms)单位
    /// </param>
    /// <param name="type" type="Int">
    ///     消息类型{ 4：成功，5：失败，3：警告 }
    /// </param>
    /// <returns type="void" />
    top.ZENG.msgbox.show(msg, type, time);
}

function showFaceMsg(msg) {
    /// <summary>
    ///     1: showFaceMsg(msg) - 显示“提醒”对话框
    ///     &#10;   在页面最顶层的框架中显示"提醒"对话框，包含确定和关闭按钮
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <returns type="void" />
    top.art.dialog({
        id: 'faceId',
        title: dialogtitle,
        content: msg,
        icon: 'face-smile',
        time: 10,
        background: '#000',
        opacity: 0.1,
        lock: true,
        okVal: lgclose,
        ok: true
    });
}
function showWarningMsg(msg) {
    /// <summary>
    ///     1: showFaceMsg(msg) - 显示“系统提示”对话框
    ///     &#10;   在页面最顶层的框架中显示"系统提示"的警告对话框，包含确定和关闭按钮
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <returns type="void" />
    top.art.dialog({
        id: 'warningId',
        title: dialogtitle,
        content: msg,
        icon: 'warning',
        time: 10,
        background: '#000',
        opacity: 0.1,
        lock: true,
        okVal: lgclose,
        ok: true
    });
}
function showConfirmMsg(msg, callBack) {
    /// <summary>
    ///     1: showFaceMsg(msg) - 显示“系统提示”对话框
    ///     &#10;   在页面最顶层的框架中显示"系统提示"的警告对话框，包含确定和关闭按钮
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <param name="callBack" type="Function">
    ///     确定按钮事件中触发的回调函数
    /// </param>
    /// <returns type="void" />
    top.art.dialog({
        id: 'confirmId',
        title: dialogtitle,
        content: msg,
        icon: 'warning',
        background: '#000000',
        opacity: 0.1,
        lock: true,
        button: [{
            name: lgqd,
            callback: function () {
                callBack(true);
            },
            focus: true
        }, {
            name: lgqx,
            callback: function () {
                this.close();
                return false;
            }
        }]
    });
}


function showConfirmMsg3(msg, callBack) {
    /// <summary>
    ///     1: showFaceMsg(msg) - 显示“系统提示”对话框
    ///     &#10;   在页面最顶层的框架中显示"系统提示"的警告对话框，包含确定和关闭按钮
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <param name="callBack" type="Function">
    ///     确定按钮事件中触发的回调函数
    /// </param>
    /// <returns type="void" />
    top.art.dialog({
        id: 'confirmId',
        title: dialogtitle,
        content: msg,
        icon: 'warning',
        background: '#000000',
        opacity: 0.1,
        lock: true,
        button: [{
            name: lgdel,
            callback: function () {
                callBack(true);
            },
            focus: true
        }, {
            name: lgdel2,
            callback: function () {
                callBack(false);
            },
            focus: false
        },  {
            name: lgqx,
            callback: function () {
                this.close();
                return false;
            }
        }]
    });
}

function showConfirmMsg2(msg, callBack) {
    /// <summary>
    ///     1: showFaceMsg(msg) - 显示“系统提示”对话框
    ///     &#10;   在页面最顶层的框架中显示"系统提示"的警告对话框，包含确定和关闭按钮
    /// </summary>
    /// <param name="msg" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <param name="callBack" type="Function">
    ///     确定按钮事件中触发的回调函数
    /// </param>
    /// <returns type="void" />
    top.art.dialog({
        id: 'confirmId',
        title: dialogtitle,
        content: msg,
        icon: 'warning',
        background: '#000000',
        opacity: 0.1,
        lock: true,
        button: [{
            name: lgcxlx,
            callback: function () {
                callBack(false);
            },
            focus: true
        }, {
            name: lgjxlx,
            callback: function () {
                callBack(true);
            },
            focus: true
        }
//        , {
//            name: '取消',
//            callback: function () {
//                this.close();
//                return false;
//            }
//        }
        ]
    });
}

/*弹出网页
 /*url:          表示请求路径
 /*_id:          ID
 /*_title:       标题名称
 /*width:        宽度
 /*height:       高度
 ---------------------------------------------------*/
function openDialog(url, _id, _title, _width, _height, left, top) {
    /// <summary>
    ///     1: openDialog(url, _id, _title, _width, _height, left, top) - 显示对话框,该对话框用于加载某一iframe框架并弹出
    ///     &#10;   显示对话框,该对话框用于加载某一iframe框架并弹出
    /// </summary>
    /// <param name="url" type="String">
    ///     消息内容，允许Html标签
    /// </param>
    /// <param name="_id" type="String">
    ///     要加载的iframe框架路径
    /// </param>
    /// <param name="_title" type="String">
    ///     消息框标题
    /// </param>
    /// <param name="_width" type="Int">
    ///     消息框宽度
    /// </param>
    /// <param name="_height" type="Int">
    ///     消息框高度
    /// </param>
    /// <param name="left" type="Int">
    ///     消息框x轴位置，以百分比(%)为单位
    /// </param>
    /// <param name="top" type="Int">
    ///     消息框y轴位置，以百分比(%)为单位
    /// </param>
    /// <returns type="void" />
    art.dialog.open(url, {
        id: _id,
        title: _title,
        width: _width,
        height: _height,
        left: left + '%',
        top: top + '%',
        background: '#000000',
        opacity: 0.1,
        lock: true,
        resize: false,
        close: function () { }
    }, false);
}
//窗口关闭
function OpenClose() {
    /// <summary>
    ///     1: OpenClose() - 关闭当前所有的弹窗窗口
    ///     &#10;   关闭当前所有的弹窗窗口
    /// </summary>
    /// <returns type="void" />
    art.dialog.close();
}
/*验证
 /*id:        表示请求
 --------------------------------------------------*/
function IsEditdata(id) {
    var isOK = true;
    if (id == undefined || id == "") {
        isOK = false;
        showWarningMsg(lgweixuanze);
    } else if (id.split(",").length > 1) {
        isOK = false;
        showFaceMsg(lgznyh);
    }
    return isOK;
}
function IsDelData(id) {
    var isOK = true;
    if (id == undefined || id == "") {
        isOK = false;
        showWarningMsg(lgweixuanze);
    }
    return isOK;
}
function IsNullOrEmpty(str) {
    var isOK = true;
    if (str == undefined || str == "") {
        isOK = false;
    }
    return isOK;
}
/*数据放入回收站
 /*url:        表示请求路径
 /*parm：      条件参数
 --------------------------------------------------*/
function delConfig(url, parm, msg) {
    /// <summary>
    ///     1: delConfig(url, parm, msg) - 将数据置入回收站方法
    ///     &#10;   将数据置入回收站方法
    /// </summary>
    /// <param name="url" type="String">
    ///     进行异步处理的处理程序路径
    /// </param>
    /// <param name="parm" type="Function">
    ///     数据参数
    /// </param>
    /// <param name="msg" type="Function">
    ///     [允许为空]确认提示的消息内容，为空表示采用默认消息
    /// </param>
    /// <returns type="void" />
    if (!msg)
        msg = lgqrsanchu;
    showConfirmMsg(msg, function (r) {
        if (r) {
            getAjax(url, parm, function (rs) {
                if (parseInt(rs) > 0) {
                    showTipsMsg(lgdel3, 2000, 4);
                    windowload();
                } else if (parseInt(rs) == 0) {
                    showTipsMsg(lgdel4, 3000, 3);
                }
                else {
                    showTipsMsg("<span style='color:red'>" + lgdel5 + "</span>", 4000, 5);
                }
            });
        }
    });
}

/*数据放入回收站
 /*url:        表示请求路径
 /*parm：      条件参数
 --------------------------------------------------*/
function delConfig2(url, parm, msg) {
    /// <summary>
    ///     1: delConfig(url, parm, msg) - 将数据置入回收站方法
    ///     &#10;   将数据置入回收站方法
    /// </summary>
    /// <param name="url" type="String">
    ///     进行异步处理的处理程序路径
    /// </param>
    /// <param name="parm" type="Function">
    ///     数据参数
    /// </param>
    /// <param name="msg" type="Function">
    ///     [允许为空]确认提示的消息内容，为空表示采用默认消息
    /// </param>
    /// <returns type="void" />
    if (!msg)
        msg = lgqrsanchu;
    showConfirmMsg3(msg, function (r) {
        if (r) {//删除管理数据
            getAjax(url, parm, function (rs) {
                if (parseInt(rs) > 0) {
                    showTipsMsg(lgdel3, 2000, 4);
                    windowload();
                } else if (parseInt(rs) == 0) {
                    showTipsMsg(lgdel4, 3000, 3);
                }
                else {
                    showTipsMsg("<span style='color:red'>" + lgdel5 + "</span>", 4000, 5);
                }
            });
        } else {//删除此数据
            getAjax(url, parm + "&delque=A", function (rs) {
                if (parseInt(rs) > 0) {
                    showTipsMsg(lgdel3, 2000, 4);
                    windowload();
                } else if (parseInt(rs) == 0) {
                    showTipsMsg(lgdel4, 3000, 3);
                }
                else {
                    showTipsMsg("<span style='color:red'>" + lgdel5 + "</span>", 4000, 5);
                }
            });
        }
    });
}

function DeleteData(url, parm) {
    /// <summary>
    ///     1: delConfig(url, parm, msg) - 将数据置入回收站方法
    ///     &#10;   将数据置入回收站方法
    /// </summary>
    /// <param name="url" type="String">
    ///     进行异步处理的处理程序路径
    /// </param>
    /// <param name="parm" type="Function">
    ///     数据参数
    /// </param>
    /// <returns type="void" />
    showConfirmMsg(lgqrsanchu2, function (r) {
        if (r) {
            getAjax(url, parm, function (rs) {
                if (parseInt(rs) > 0) {
                    showTipsMsg(lgdel3, 2000, 4);
                    windowload();
                } else if (parseInt(rs) == 0) {
                    showTipsMsg(lgdel4, 3000, 3);
                }
                else {
                    showTipsMsg("<span style='color:red'>" + lgdel3 + "</span>", 4000, 5);
                }
            });
        }
    });
}
/*验证数据是否存在
 /*url:        表示请求路径
 /*parm：      条件参数
 --------------------------------------------------*/
function IsExist_Data(url, parm, opType) {
    var num = 0;
    if (!opType) {
        getAjax(url, parm, function (rs) {
            num = parseInt(rs);
        });
        return num;
    } else {
        getAjax(url, parm, function (result) {
            num = result;
        });
        return num;
    }
}
/* 请求Ajax 带返回值，并弹出提示框提醒
 --------------------------------------------------*/
function getAjax(url, parm, callBack) {
    $.ajax({
        type: 'post',
        dataType: "text",
        url: url,
        data: parm,
        cache: false,
        async: false,
        success: function (msg) {
            callBack(msg);
        }
    });
}
/**
 数据验证完整性
 **/
function CheckDataValid(id) {
    if (!JudgeValidate(id)) {
        return false;
    } else {
        return true;
    }
}
/**
 文本框，下拉框输入事件
 作用是，如果没有对表单值更新，就不提交到数据库
 **/
var haveinputValue = "";
function Haveinput() {
    $("textarea,input[type='text']").keydown(function () {
        haveinputValue = 1;
    })
    $("select").change(function () {
        haveinputValue = 1;
    });
}
/********
 接收地址栏参数
 key:参数名称
 **********/
function GetQuery(key) {
    var search = location.search.slice(1); //得到get方式提交的查询字符串
    var arr = search.split("&");
    for (var i = 0; i < arr.length; i++) {
        var ar = arr[i].split("=");
        if (ar[0] == key) {
            return ar[1];
        }
    }
}
/**
 文本框只允许输入数字
 **/
function Keypress(obj) {
    $("#" + obj).bind("contextmenu", function () {
        return false;
    });
    $("#" + obj).css('ime-mode', 'disabled');
    $("#" + obj).keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
}
/**
 获取选中复选框值
 值：1,2,3,4
 **/
function CheckboxValue() {
    var reVal = '';
    $('[type = checkbox]').each(function () {
        if ($(this).attr("checked")) {
            reVal += $(this).val() + ",";
        }
    });
    reVal = reVal.substr(0, reVal.length - 1);
    return reVal;
}
/**
 Table固定表头
 gv:             table id
 scrollHeight:   高度
 **/
function FixedTableHeader(gv, scrollHeight) {
    //暂停固定头部，有对不齐的情况
    // var gvn = $(gv).clone(true).removeAttr("id");
    //    scrollHeight = scrollHeight - 15;
    //    var gvn = $(gv).clone(true).attr("id", "tabletop");
    //    $(gvn).find("tr:not(:first)").hide();
    //    $(gv).before(gvn);
    //    $(gv).find("tr:first").remove();
    //    $(gv).wrap("<div id='FixedTable' style='width:auto;height:" + scrollHeight + "px;overflow-y: auto; overflow-x: hidden;scrollbar-face-color: #e4e4e4;scrollbar-heightlight-color: #f0f0f0;scrollbar-3dlight-color: #d6d6d6;scrollbar-arrow-color: #240024;scrollbar-darkshadow-color: #d6d6d6; padding: 0;margin: 0;'></div>");
    //    var lie = $(gvn).find('thead').find("td").length - 1;
    //    var arr = $(gvn).find('thead').find("td");
    //    if ($("#FixedTable").height() > scrollHeight) {
    //        var lastwidth = $(arr[lie]).width() + 17;
    //        $(arr[lie]).attr('style', 'width:' + lastwidth + 'px;border-right: 0px');
    //    } else {
    //        $(arr[lie]).attr('style', 'border-right: 0px')
    //    }

    if (document.getElementById("table1") != null) {
        var maxwidth = 110;
        var minwidth = 60; //每格最小显示宽度
        if (maxwidth * document.getElementById("table1").rows[0].cells.length > $(window).width()) {
            $("#table1").width(maxwidth * document.getElementById("table1").rows[0].cells.length);
        }
    }

}

/**.div-body 自应表格高度**/
function divresize(height) {
    resizeU();
    $(window).resize(resizeU);
    function resizeU() {
        $(".div-body").css("height", $(window).height() - height);
    }
}
//Tab标签切换
function GetTabClick(e) {
    Loading(true);
    $("#menutab div").each(function () {
        this.className = "Tabremovesel";
    });
    e.className = "Tabsel";
    Loading(false);
}
/**
 初始化样式
 **/
function publicobjcss() {
    /*****************普通表格********************************/
    $('.grid tr').hover(function () {
        $(this).addClass("trhover");
    }, function () {
        $(this).removeClass("trhover");
    });
    $('.grid tbody tr:odd').addClass('alt');
    if ($('.grid').attr('singleselect') == 'true') {
        $('.grid tr td').click(function (e) {
            if ($(this).parents('tr').find("td").hasClass('selected')) {
                $('.grid tr td').parents('tr').find("td").removeClass('selected');
                $('.grid tr td').parents('tr').find('input[type="checkbox"]').removeAttr('checked');
            } else {
                $('.grid tr td').parents('tr').find("td").removeClass('selected');
                $('.grid tr td').parents('tr').find('input[type="checkbox"]').removeAttr('checked');
                $(this).parents('tr').find("td").addClass('selected');
                $(this).parents('tr').find('input[type="checkbox"]').attr('checked', 'checked');
            }
        });
    } else {
        $('.grid tr td').click(function (e) {
            if (!$(this).hasClass('oper')) {
                if ($(this).parents('tr').find("td").hasClass('selected')) {
                    $(this).parents('tr').find("td").removeClass('selected');
                    $(this).parents('tr').find('input[type="checkbox"]').removeAttr('checked');
                } else {
                    $(this).parents('tr').find("td").addClass('selected');
                    $(this).parents('tr').find('input[type="checkbox"]').attr('checked', 'checked');
                }
            }
        });
    }
    /*****************树表格********************************/
    $('#dnd-example tbody tr:odd').addClass('alt');
    $("#dnd-example tr").click(function () {
        $('#dnd-example tr').removeClass("selected");
        $(this).addClass("selected"); //添加选中样式
    })
    /*****************按钮********************************/
    $(".l-btn").hover(function () {
        $(this).addClass("l-btnhover");
        $(this).find('span').addClass("l-btn-lefthover");
    }, function () {
        $(this).removeClass("l-btnhover");
        $(this).find('span').removeClass("l-btn-lefthover");
    });
}
/*****************树形样式********************************/
function treeAttrCss() {
    $('.strTree').lightTreeview({
        collapse: true,
        line: true,
        nodeEvent: true,
        unique: false,
        style: 'black',
        animate: 100,
        fileico: false,
        folderico: true
    });
    treeCss();
}
function treeCss() {
    $(".strTree li div").css("cursor", "pointer");
    $(".strTree li div").click(function () {
        if ($(this).attr('class') == "" || $(this).attr('class') == undefined) {
            $(".strTree li div").removeClass("collapsableselected");
            $(this).addClass("collapsableselected"); //添加选中样式
        }
    })
}
/**********复选框 全选/反选**************/
var CheckAllLinestatus = 0;
function CheckAllLine() {
    if (CheckAllLinestatus == 0) {
        CheckAllLinestatus = 1;
        $("#checkAllOff").attr('title', lgfanxuan);
        $("#checkAllOff").attr('id', 'checkAllOn');
        $(".grid :checkbox").attr("checked", true);
        $('.grid tr').find('td').addClass('selected');
        $("#dnd-example :checkbox").attr("checked", true);
        $('#dnd-example tr').find('td').addClass('selected');
    } else {
        CheckAllLinestatus = 0;
        $("#checkAllOn").attr('title', lgquanxuan);
        $("#checkAllOn").attr('id', 'checkAllOff');
        $(".grid :checkbox").attr("checked", false);
        $('.grid tr').find('td').removeClass('selected');
        $("#dnd-example :checkbox").attr("checked", false);
        $('#dnd-example tr').find('td').removeClass('selected');
    }
}
///防止重复提交
function SubmitCheckForRC() {
    $("#Save .l-btn-left").html('<img src="/Themes/Images/loading1.gif" alt="" />' + lgtijiao);
    $("#Save").attr('disabled', "true");
    $("#Close").hide();
}
///清空防止重复提交
function SubmitCheckEmpty() {
    $("#Save").removeAttr("disabled")
    $("#Save .l-btn-left").html('<img src="/Themes/Images/disk.png" alt="" />' + lgbaocun);
    $("#Close").show();
}
//树表格复选框，点击子，把父也打勾
function ckbValueObj(e) {
    var item_id = '';
    var arry = new Array();
    arry = e.split('-');
    for (var i = 0; i < arry.length - 1; i++) {
        item_id += arry[i] + '-';
    }
    item_id = item_id.substr(0, item_id.length - 1);
    if (item_id != "") {
        $("#" + item_id).attr("checked", true);
        ckbValueObj(item_id);
    }
}
//得到QueryString
function QueryString(fieldName) {
    var reg = new RegExp("(^|&)" + fieldName.toLowerCase() + "=([^&]*)(&|$)", "i");
    var r = window.location.search.toLowerCase().substr(1).match(reg);
    if (r != null) return unescape(r[2]); return "";
}
/**显示进度条
 /*value:         进度值
 /*maxvalue:      总值
 /*color:        （可选）进度条需要显示的颜色
 **/
function getprogress(value, maxvalue, color) {
    var w;
    if (maxvalue <= 0)
        w = 0;
    else
        w = value * 100 / maxvalue;
    if (value > maxvalue) {
        w = 100;
    }
    try {
        //alert("");
        document.open("text/html", "replace");
        document.writeln("<div class=\"process-bar\">");
        document.writeln("     <div class=\"pb-wrapper\">");
        //document.writeln("          <div class=\"pb-highlight\"></div>");
        document.writeln("          <div class=\"pb-container\">");
        document.writeln("               <div class=\"pb-text\">");
        document.writeln("               " + value + "--" + maxvalue + "</div>");
        if (color == undefined || color == "") { color = "" } else { color = "background-color:" + color + ";"; }
        document.writeln("               <div class=\"pb-value\" style=\"width: " + w + "%;" + color + "\">");
        document.writeln("               </div>");
        document.writeln("         </div>");
        document.writeln("     </div>");
        document.writeln("</div>");
        document.close();
    }
    catch (e) { alert(e.message) }
}
function ajaxUpdateData(url, para, success, error, warnMsg) {
    /// <summary>
    ///     1: delData(url, para, callBack, error) - ajax异步执行方法
    ///     &#10;   该函数主要用于执行一些关键性操作，所以会进行弹窗提示是否确定操作
    ///     &#10;   author:linkFly
    /// </summary>
    /// <param name="url" type="String">
    ///     异步加载的url
    /// </param>
    /// <param name="para" type="Json">
    ///     异步加载的参数，只接受Json格式参数
    /// </param>
    /// <param name="success" type="Function">
    ///     在用户确定后，异步加载成功后执行的回调函数，参数Data为异步加载完成的Data
    /// </param>
    /// <param name="error" type="Function">
    ///     [允许为空，但不建议为空]异步加载异常后执行的函数，允许为空，但不建议为空。默认不进行任何操作
    /// </param>
    /// <param name="warnMsg" type="String">
    ///     [允许为空]在弹窗提示是否确定操作的时候，作为弹窗的内容，为空则采用默认内容
    /// </param>
    /// <returns type="void" />
    if (!warnMsg)
        warnMsg = lgqrsanchu3;
    showConfirmMsg(warnMsg, function (isOK) {
        if (isOK) {
            $.ajax({
                url: url,
                type: 'post',
                dataType: "json",
                contentType: 'application/x-www-form-urlencoded',
                //  contentType: 'application/json',//当后台接收不到参数的时候可以尝试这个
                data: para,
                cache: false,
                success: function (data) {
                    success(data);
                },
                error: function () {
                    if (error)
                        error();
                }
            });
        }
    });
}


//全局变量（标签业务）：标签对应的json字符串，标签需要操作的表，标签需要操作的表主键名
var globalTagsStr, globalTableName, globalTableKey;
function globalSetTags(tN, tV) {
    /// <summary>
    ///     1: 根据传入的表名和表主键和生成右键菜单相关联，如果本页面需要使用右键菜单并且需要操作菜单里的标签，则必须按照约定的参数调用本方法，建议本函数在页面底部调用，但请在CreateContextJs之前调用
    ///     &#10;   globalSetTags(tN,tV)
    /// </summary>
    /// <param name="tN" type="String">
    ///     表名
    /// </param>
    /// <param name="tV" type="String">
    ///     表主键
    /// </param>
    /// <returns type="undefined" />
    $.ajax({
        type: 'get',
        contentType: 'application/json',
        dataType: "text",
        url: "/RMBase/SysTag/Tags_Search.ashx",
        data: 'tN=' + tN + '&tV=' + tV + '',
        async: false,
        cache: false,
        success: function (data) {
            if (parseInt(data) < 1) {
                globalTagsStr = "";
                return;
            }
            globalTagsStr = data;
        }
    });
    globalTableName = tN;
    globalTableKey = tV;
}
//设置标签的时候随机生成颜色
var _globalColors = ['#000000', '#609022', '#aa41cd', '#35909e', '#3d6aaa', '#4d53a5', '#b48e43', '#c26502', '#b3341a', '#c24d96', '#b20e0e', '#e59c00', '#ec6928', '#9d569d', '#955959', '#ae7841', '#abab4e', '#ec5105', '#ab4646', '#950695', '#703b70', '#3b994f', '#21b1b1', '#1e87ef', '#4b9d8f', '#7c657c', '#5487ed', '#354b66', '#2768ea', '#7044b2', '#1f28df', '#a59f79', '#8899ab', '#585858', '#343434'];
function globalAddTages(obj) {
    /// <summary>
    ///     1: 新建标签通用方法
    ///     &#10;   globalAddTages(obj)
    /// </summary>
    /// <param name="obj" type="Object">
    ///     被单击的数据行DOM对象
    /// </param>
    /// <returns type="undefined" />
    var addDom = $('<div id="editTags"><input id="txtTages" style=" border:1px solid #CCC; width:370px; line-height:20px; height:20px; font-size:10pt;" /><span style="color:#fd5b78;padding-left:10px;">最大只允许6位字符</span></div>');
    art.dialog({
        id: 'art_editTags',
        title: lgtagnew,
        content: addDom.get(0),
        button: [
            {
                name: lgbaocun,
                callback: function () {
                    var txtVal = jQuery.trim(addDom.find('#txtTages').val()); //标签名
                    if (jQuery.trim(txtVal).length < 1) {//删除标签
                        showTipsMsg(lgtagename, 1000, 3);
                        return false;
                    } else {
                        if (txtVal.length > 6) {
                            showTipsMsg(lgtagzifushu, 1000, 3);
                            return false;
                        }
                        //验证通过
                        var color = _globalColors[Math.ceil(Math.random() * 35)]; //随机生成颜色
                        var dataId = $(obj).find("input[type=checkbox]").val(); //获取值
                        $.post("/RMBase/SysTag/Tags_Oprater.ashx", { dI: dataId, gN: txtVal, tN: globalTableName, tK: globalTableKey, tC: color }, function (data) {
                            var result = parseInt(data);
                            if (result == -1) {
                                showTipsMsg(lgtagyichang1, 1500, 5);
                                return false;
                            } else if (result == -2) {
                                showTipsMsg(lgtagyichang2, 1500, 5);
                                return false;
                            } else if (result == -4) {
                                showTipsMsg(lgtagyichang3, 1500, 3);
                                return false;
                            } else {

                                //改变DOM模型
                                location.reload();
                                showTipsMsg(lgchenggong, 1500, 4);
                                /*
                                 var xuanzhongobj = null;
                                 $('[type = checkbox]').each(function () {
                                 if ($(this).attr("checked")) {
                                 // reVal +=  + ",";
                                 xuanzhongobj = $(this).parent().parent().find('.tagsContainer');
                                 }
                                 });

                                 var tagObj = xuanzhongobj;
                                 tagObj.append('<span style="background-color:' + color + '" id="' + data + '">' + txtVal + '</span>');*/
                            }
                        });
                    }
                    return true;
                },
                focus: true
            },
            {
                name: lgclose,
                callback: function () {
                    addDom.remove();
                    return true;
                }
            }
        ]
    });
}


function globalSetTages(obj, templentObj) {
    /// <summary>
    ///     1: 设置标签通用方法
    ///     &#10;   globalSetTages()
    /// </summary>
    /// <param name="obj" type="Object">
    ///     被单击的数据行DOM对象
    /// </param>
    /// <param name="templentObj" type="String">
    ///     模板数据对象
    /// </param>
    /// <returns type="undefined" />
    if (IsEditdata(CheckboxValue())) {
        var dataId = CheckboxValue();
        // var dataId = $(obj).find("input[type=checkbox]").val(); //获取操作的数据ID
        $.post("/RMBase/SysTag/Tags_Oprater.ashx", { dI: dataId, rT: templentObj.attr('id'), action: 'cp' }, function (data) {
            var result = parseInt(data);
            if (result == -1) {
                showTipsMsg(lgtagyichang1, 1500, 5);
                return false;
            } else if (result == -2) {
                showTipsMsg(lgtagyichang2, 1500, 5);
                return false;
            } else if (result == -4) {
                showTipsMsg(lgtagyichang3, 1500, 3);
                return false;
            } else {

                //改变DOM模型
                /*
                 var xuanzhongobj = null;
                 $('[type = checkbox]').each(function () {
                 if ($(this).attr("checked")) {
                 // reVal +=  + ",";
                 xuanzhongobj = $(this).parent().parent().find('.tagsContainer');
                 }
                 });

                 var tagObj = xuanzhongobj;
                 tagObj.append('<span style="background-color:' + templentObj.children('span').children('span').css('background-color') + '" id="' + data + '">' + jQuery.trim(templentObj.children('span').text()) + '</span>');*/
                location.reload();
                showTipsMsg(lgtagyichang4, 1500, 4);
            }
        });
    }
}
function globalDeleteTages(obj) {
    /// <summary>
    ///     1: 删除标签通用方法
    ///     &#10;   globalSetTages()
    /// </summary>
    /// <param name="obj" type="Object">
    ///     被单击的数据行DOM对象
    /// </param>
    /// <returns type="undefined" />
    if (IsEditdata(CheckboxValue())) {
        var dataId = CheckboxValue(); // $(obj).find("input[type=checkbox]").val(); //获取操作的数据ID
        $.post("/RMBase/SysTag/Tags_Oprater.ashx", { dI: dataId, tN: globalTableName, tK: globalTableKey, action: 'dl' }, function (data) {
            var result = parseInt(data);
            if (result == -3) {
                showTipsMsg(lgtagyichang5, 1500, 1);
                //return false
            } else if (result < 1) {
                showTipsMsg(lgtagyichang1, 1500, 3);
                return false;
            } else {
                location.reload();
                showTipsMsg(lgtagyichang4, 1500, 4);
                //改变DOM模型
                /*var xuanzhongobj = null;
                 $('[type = checkbox]').each(function () {
                 if ($(this).attr("checked")) {
                 // reVal +=  + ",";
                 xuanzhongobj = $(this).parent().parent().find('.tagsContainer');
                 }
                 });
                 var tagObj = xuanzhongobj;
                 tagObj.text("");*/
            }
        });
    }
}

//获得coolie 的值
function cookie(name) {
    var cookieArray = document.cookie.split("; "); //得到分割的cookie名值对
    var cookie = new Object();
    for (var i = 0; i < cookieArray.length; i++) {
        var arr = cookieArray[i].split("=");       //将名和值分开
        if (arr[0] == name) return unescape(arr[1]); //如果是指定的cookie，则返回它的值
    }
    return "";
}

function delCookie(name)//删除cookie
{
    document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
}

function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
}

function addCookie(objName, objValue, objHours) {      //添加cookie
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {                               //为时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

function SetCookie(name, value)//两个参数，一个是cookie的名子，一个是值
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)//取cookies函数
{
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
}

function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
//通用界面获得表格报表
function TableCharts() {
    $("#container").show();
    $("#container").html("<center>" + lgjiazai + "...</center>");
    auto_init_script('/Themes/Scripts/highcharts/highcharts.js', { 'callback': function () {
        auto_init_script('/Themes/Scripts/highcharts/jquery.highchartTable.js', { 'callback': function () {
            $("#table1").highchartTable();
        }
        });
    }
    });
    $("#container").before("<span id=\"closetablechart\" onclick=\"closetablechart()\">" + lgclose + "</span>");
}
function closetablechart() {
    $("#container").hide();
    $("#closetablechart").remove();

}
//动态载入JS
function auto_init_script(url, cfg) {
    if (!url) return false;
    var cfg = cfg || {};
    /*初始化参数*/
    callback = cfg.callback || function () { };
    var doc = document;
    var head = doc.getElementsByTagName('head')[0];
    var charset = cfg.charset || false;
    var node = doc.createElement('script');
    var script_id = cfg.id || false;
    if (script_id) {
        if (doc.getElementById(script_id)) return false;
        node.id = script_id
    }
    node.type = 'text/javascript';
    node.async = true;
    if (charset) node.charset = charset;
    /*初始化参数*/
    if (doc.addEventListener) {
        // IE内核
        node.addEventListener('load', function () {
            (typeof callback == 'function') && callback(node);
        }, false);
        node.addEventListener('error', function () { }, false);
    }
    else {
        // 非IE内核
        node.onreadystatechange = function () {
            if (node.readyState == 'loaded' || node.readyState == 'complete') {
                node.onreadystatechange = null;
                (typeof callback == 'function') && callback(node);
            }
        };
    }
    node.src = url;
    head.insertBefore(node, head.firstChild);
    return node;
}



var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

//客户端Base64解码
function Jjiemi(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}