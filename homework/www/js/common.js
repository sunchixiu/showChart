var ischool = {};
ischool.layout =
{
    ccallback: (function () { }),
    init: function (opts)
    {
        if (typeof opts.title == "undefined") opts.title = "消息提示";
        if (typeof opts.content == "undefined") opts.content = "";
        if (typeof opts.width != "number") opts.width = "280";
        if (typeof opts.height != "number") opts.height = "380";
        if (typeof opts.callback != "function") opts.callback = (function () { });
        if (typeof opts.cancelcallback != "function") opts.cancelcallback = (function () { });
        if (typeof opts.surebuttonname == "undefined") opts.surebuttonname = "确定";
        if (typeof opts.isshowbutton == "undefined") opts.isshowbutton =true;

        ischool.layout.ccallback = opts.cancelcallback; 
        var html = "<div style=\" \" id=\"globallayoutbg\"></div><div id=\"globallayout\"  style='width:" + opts.width + "px'>" +
              "<div class='globallayout_title'><span title='关闭'  id='globallayout_close'>X</span><h1 id='globallayout_title'>" + opts.title + "</h1></div>" +
              "<div id='globallayout_infocontent'><div class='globallayout_content' id='globallayout_infocontent_content' style='max-height: "+opts.height+"px; overflow-y: auto'>" + opts.content + "</div>";
        //if (opts.isshowbutton) {
            html = html + "<div class='globallayout_footer'><button type=\"button\" class=\"btn\"  id=\"globallayoutcancelbtn\">取消</button><button type=\"button\" class=\"btn btn-success\" id='globallayoutsavebtn'>" + opts.surebuttonname + "</button></div>";
       // }
        html = html + " </div>";
              html=html+ "<div id='globallayout_infomessage'><div class='globallayout_content ajax'></div>";
              html = html + "<div class='globallayout_footer'><button type=\"button\" class=\"btn btn-default\" onclick=\"ischool.layout.hide()\">取消</button><button type=\"button\" class=\"btn btn-success\" id='globallayoutalertsurebutton'>确定</button></div>";
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
        $("#globallayout_close").bind("click", function () { opts.cancelcallback(); ischool.layout.hide(); });
        $("#globallayoutcancelbtn").unbind();
        $("#globallayoutcancelbtn").bind("click", function () { opts.cancelcallback(); ischool.layout.hide(); });
        $("#globallayoutsavebtn").unbind();
        $("#globallayoutsavebtn").bind("click", function () { opts.callback(); });
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { ischool.layout.hide()});
    },
    messageinit: function (title)
    {
        if (!document.getElementById("globallayout")) {
            if (typeof title == "undefined") title = "消息提示";
            ischool.layout.init({ title: title });
        }
        else {
            $("#globallayout").width(280);
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
        ischool.layout.messageinit("消息提示");

        $("#globallayout_infomessage").find(".globallayout_content").addClass("ajax");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayout_infomessage").find(".globallayout_footer").css("display", "none");
    },
    success: function (message, url)
    {
        if (typeof message == "undefined") message = "操作成功";
        ischool.layout.messageinit("消息提示");
        $("#globallayout_infomessage").find(".globallayout_content").addClass("ok");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { ischool.layout.hide() });
        url = url || 2000;
        if (typeof url=="number")
            setTimeout(ischool.layout.hide, url);
        else
            location.href = url;
    },
    error: function (message, autodisplay)
    {

        if (typeof message == "undefined") message = "操作异常";
        ischool.layout.messageinit("消息提示");
  
        $("#globallayout_infomessage").find(".globallayout_content").addClass("error");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () {  ischool.layout.hide() });
        if (typeof autodisplay == "number") {
            //autodisplay = 5000;
            setTimeout(ischool.layout.hide, autodisplay);
        }
    },
    alert: function (title, message, callback,autodisplay)
    {
        if (typeof message == "undefined") message = "";
        ischool.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        //$("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { ischool.layout.hide(); });
        $("#globallayoutalertsurebutton").bind("click", function () { ischool.layout.hide(); callback(); });
        if (typeof autodisplay == "number") {
            //autodisplay = 5000;
            setTimeout(ischool.layout.hide, autodisplay);
        }
    },
    confirm: function (title, message, callback) {
        if (typeof message == "undefined") message = "";
        if (typeof title == "function") title='提示';
        if (typeof message == "function") message='';
        ischool.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { ischool.layout.hide();});
        $("#globallayoutalertsurebutton").bind("click", function () { ischool.layout.hide(); callback();});
        
    },
    hide: function ()
    {
        $("#globallayout").fadeOut("slow");
        $("#globallayoutbg").fadeOut("slow");
        
    },
    popdiv: function (id, title, callback) {
        if ($('#' + id + 'mask').length > 0) return false;
        var content = $('#' + id + '');
        var oldcontent = $('#' + id + '').html();
        var firstcontent = content.children('div');
        firstcontent.addClass('extendclass');
        firstcontent.css({ 'max-height': '480px', 'min-height': '200px', 'overflow-x': 'hidden', 'overflow-y': 'auto'});

        $('body').append('' +
        '<div style="position: fixed; width: 100%; height: 100%; bottom:0 !important; top: 0 !important; left: 0; right: 0; background: rgb(219,219,234); opacity: 0.4; filter:alpha(opacity=40); z-index: 1000;" id="' + id + 'mask"></div>' +
        '');
        content.css({ 'position': 'fixed', 'z-index': '1001', 'display': 'block', 'background': '#fff', 'box-shadow': '0px 0px 10px #666', 'border-radius': '5px', 'margin': '0 auto', 'padding-bottom': '12px', 'min-width': '400px', 'min-height': '200px', 'border':'1px solid #999'});
        content.attr('class', '' + id + 'div');
        content.prepend('<h1 id="' + id + 'title" style="font-size: 16px; color: #000; line-height: 50px; border-bottom: 1px solid #ddd; font-weight: normal; padding: 0px 20px;">' + title + '<a href="javascript:;" id="' + id + 'close" style="float: right;"><img src="/Public/static/common/images/btn_close.png" onmouseover=$(this).attr("src","/Public/static/common/images/btn_close_hover.png") onmouseout=$(this).attr("src","/Public/static/common/images/btn_close.png") style="width: 16px; height: 16px;"></a></h1>');

        if (typeof callback == 'function') {
            callback();
        };

        $('body').css('overflow', 'hidden');
        content.css({ "top": (($(window).height() - (content.height())) / 2 - 120), "left": (($(window).width() - (content.width())) / 2) });
        if(parseInt(content.css('top')) < 40){
            content.css('top','30px');
        };
        $("#" + id + "close").click(function () {
            content.css('display', 'none');
            content[0].innerHTML = oldcontent;
            $('#' + id + 'mask').remove();
            $('#' + id + 'title').remove();
            $('body').css('overflow', 'auto')
        });

        $(window).resize(function() {
            $('#' + id).css({'top':(($(window).height() - (content.height())) / 2 - 20), 'left': (($(window).width() - (content.width())) / 2)});
        });
    }

}