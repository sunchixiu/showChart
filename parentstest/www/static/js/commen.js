/**
 * Created by Wilson on 2017/7/3.
 */
document.addEventListener('touchstart', function(){});
document.documentElement.style.fontSize=document.documentElement.clientWidth/36+'px';

//自定义弹窗
var app = {};
app.layout =
{
    callback: (function () { }),
    init: function (opts)
    {
        if (typeof opts.title == "undefined") opts.title = "消息提示";
        if (typeof opts.content == "undefined") opts.content = "";
        if (typeof opts.width != "number") opts.width = "26rem";
        if (typeof opts.height != "number") opts.height = "580";
        if (typeof opts.callback != "function") opts.callback = (function () { });
        if (typeof opts.cancelcallback != "function") opts.cancelcallback = (function () { });
        if (typeof opts.surebuttonname == "undefined") opts.surebuttonname = "确定";
        if (typeof opts.isshowbutton == "undefined") opts.isshowbutton =true;

        app.layout.ccallback = opts.cancelcallback;
        var html = "<div style=\" \" id=\"globallayoutbg\"></div><div id=\"globallayout\"  style='width:" + opts.width + "px'>" +
            "<div class='globallayout_title'><span title='关闭'  id='globallayout_close'>X</span><h1 id='globallayout_title'>" + opts.title + "</h1></div>" +
            "<div id='globallayout_infocontent'><div class='globallayout_content' id='globallayout_infocontent_content' style='max-height: "+opts.height+"px; overflow-y: auto'>" + opts.content + "</div>";
        //if (opts.isshowbutton) {
        html = html + "<div class='globallayout_footer'><button type=\"button\" class=\"btn\"  id=\"globallayoutcancelbtn\">取消</button><button type=\"button\" class=\"btn btn-success\" id='globallayoutsavebtn'>" + opts.surebuttonname + "</button></div>";
        // }
        html = html + " </div>";
        html=html+ "<div id='globallayout_infomessage'><div class='globallayout_content ajax'></div>";
        html = html + "<div class='globallayout_footer'><button type=\"button\" class=\"btn btn-default\" onclick=\"app.layout.hide()\">取消</button><button type=\"button\" class=\"btn btn-success\" id='globallayoutalertsurebutton'>确定</button></div>";
        html = html + " </div>";
        //console.log(html);
        if (!document.getElementById("globallayout"))
        {
            $("body").append(html);
        }
        else
        {
            $("#globallayout_title").html(opts.title);
            $("#globallayout_infocontent_content").html(opts.content);
        }
        $("#globallayout").width( opts.width );
        if(opts.isshowbutton)
        {
            $("#globallayout_infocontent").find(".globallayout_footer").show();
            $("#globallayoutsavebtn").show();
            $("#globallayoutsavebtn").html(opts.surebuttonname);
        }
        else
        {$("#globallayout_infocontent").find(".globallayout_footer").hide();}

        $("#globallayout_infomessage").css("display", "none");
        $("#globallayout_infocontent").css("display", "block");
        $("#globallayout_close").css("display", "block");

        $("#globallayoutbg").height($(document).height());
        var top = ( (
        $(window).height() -$("#globallayout").height())/2 + $(document).scrollTop());
        if (top < 0)
            top = 10;
        $("#globallayout").css("top", top + "px");

        $("#globallayout").css("left", ($(document).width() / 2 - $("#globallayout").width() / 2) + "px");
        $("#globallayoutbg").fadeIn("slow");
        $("#globallayout").fadeIn("slow");
        $("#globallayout_close").unbind();
        $("#globallayout_close").bind("click", function () { opts.cancelcallback(); app.layout.hide(); });
        $("#globallayoutcancelbtn").unbind();
        $("#globallayoutcancelbtn").bind("click", function () { opts.cancelcallback(); app.layout.hide(); });
        $("#globallayoutsavebtn").unbind();
        $("#globallayoutsavebtn").bind("click", function () { opts.callback(); });
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { app.layout.hide()});
    },
    messageinit: function (title)
    {
        if (!document.getElementById("globallayout")) {
            if (typeof title == "undefined") title = "消息提示";
            app.layout.init({ title: title });
        }
        else {
            $("#globallayout").css('width', '26rem');
        }
        $("#globallayout_title").html(title);
        $("#globallayoutbg").height($(document).height());
        var top = (($(window).height() - $("#globallayout").height()) / 2 + $(document).scrollTop());
        if (top < 0)
            top = 10;
        $("#globallayout").css("top", top + "px");
        $("#globallayout").css("left", ($(document).width() / 2 - $("#globallayout").width() / 2) + "px");

        $("#globallayout").fadeIn("slow");
        $("#globallayoutbg").fadeIn("slow");
        $("#globallayout_close").css("display", "none");
        $("#globallayout_infomessage").css("display", "block");
        $("#globallayout_infomessage").find(".globallayout_footer").css("display", "block");
        $("#globallayout_infocontent").css("display", "none");
        $("#globallayout_infomessage").find(".globallayout_content").removeClass("ajax");
        $("#globallayout_infomessage").find(".globallayout_content").removeClass("error");
        $("#globallayout_infomessage").find(".globallayout_content").removeClass("ok");
        $("#globallayout_infomessage").find(".globallayout_content").removeClass("info");
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "none");

    },
    loadding: function (message)
    {
        if (typeof message == "undefined") message = "加载数据中。。。";
        app.layout.messageinit("消息提示");

        $("#globallayout_infomessage").find(".globallayout_content").addClass("ajax");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayout_infomessage").find(".globallayout_footer").css("display", "none");
    },
    success: function (message, url)
    {
        if (typeof message == "undefined") message = "操作成功";
        app.layout.messageinit("消息提示");
        $("#globallayout_infomessage").find(".globallayout_content").addClass("ok");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { app.layout.hide() });
        url = url || 2000;
        if (typeof url=="number")
            setTimeout(app.layout.hide, url);
        else
            location.href = url;
    },
    error: function (message, autodisplay)
    {

        if (typeof message == "undefined") message = "操作异常";
        app.layout.messageinit("消息提示");

        $("#globallayout_infomessage").find(".globallayout_content").addClass("error");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () {  app.layout.hide() });
        if (typeof autodisplay == "number") {
            //autodisplay = 5000;
            setTimeout(app.layout.hide, autodisplay);
        }
    },
    alert: function (title, message, callback,autodisplay)
    {
        if (typeof message == "undefined") message = "";
        app.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        //$("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { app.layout.hide(); });
        $("#globallayoutalertsurebutton").bind("click", function () { app.layout.hide(); callback(); });
        if (typeof autodisplay == "number") {
            //autodisplay = 5000;
            setTimeout(app.layout.hide, autodisplay);
        }
    },
    confirm: function (title, message, callback) {
        if (typeof message == "undefined") message = "";
        if (typeof title == "function") title='提示';
        if (typeof message == "function") message='';
        app.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { app.layout.hide();});
        $("#globallayoutalertsurebutton").bind("click", function () { app.layout.hide(); callback();});

    },
    doubleconfirm: function (title, message, callback, leftbutton, rightbutton, leftcallback) {
        if (typeof message == "undefined") message = "";
        if (typeof title == "function") title='提示';
        if (typeof message == "function") message='';
        app.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        if(typeof leftbutton != undefined) $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).html(leftbutton);
        if(typeof rightbutton != undefined) $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(1).html(rightbutton);
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { app.layout.hide();});
        $("#globallayoutalertsurebutton").bind("click", function () { app.layout.hide(); callback();});
        if (typeof leftcallback != "function") leftcallback = (function () { app.layout.hide();});
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).unbind();
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).bind("click", function () { app.layout.hide(); leftcallback();});

    },
    hide: function ()
    {
        $("#globallayout").fadeOut("slow");
        $("#globallayoutbg").fadeOut("slow");

    }
};