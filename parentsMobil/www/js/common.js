var ischool = {};
ischool.layout =
{
    ccallback: (function () { }),
    init: function (opts)
    {
        if (typeof opts.title == "undefined") opts.title = "消息提示";
        if (typeof opts.content == "undefined") opts.content = "";
        if (typeof opts.width != "number") opts.width = "500";
        if (typeof opts.callback != "function") opts.callback = (function () { });
        if (typeof opts.cancelcallback != "function") opts.cancelcallback = (function () { });
        if (typeof opts.surebuttonname == "undefined") opts.surebuttonname = "确定";
        if (typeof opts.isshowbutton == "undefined") opts.isshowbutton =true;

        ischool.layout.ccallback = opts.cancelcallback; 
        var html = "<div style=\" \" id=\"globallayoutbg\"></div><div id=\"globallayout\"  style='width:" + opts.width + "px'>" +
              "<div class='globallayout_title'><span title='关闭'  id='globallayout_close'>X</span><h1 id='globallayout_title'>" + opts.title + "</h1></div>" +
              "<div id='globallayout_infocontent'><div class='globallayout_content' id='globallayout_infocontent_content'>" + opts.content + "</div>";
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
        if (!document.getElementById("globallayout"))
        {
            if (typeof title == "undefined") title = "消息提示";
            ischool.layout.init({ title: title });
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
        ischool.layout.messageinit();
        $("#globallayout_infomessage").find(".globallayout_content").addClass("ajax");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayout_infomessage").find(".globallayout_footer").css("display", "none");
    },
    success: function (message)
    {
        if (typeof message == "undefined") message = "操作成功";
        ischool.layout.messageinit();
        $("#globallayout_infomessage").find(".globallayout_content").addClass("ok");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { ischool.layout.hide() });
        setTimeout(ischool.layout.hide, 5000);
    },
    error: function (message, autodisplay)
    {

        if (typeof message == "undefined") message = "操作异常";
        ischool.layout.messageinit();
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
        ischool.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { ischool.layout.hide(); });
        $("#globallayoutalertsurebutton").bind("click", function () { ischool.layout.hide(); callback(); });
        
    },
    hide: function ()
    {
        $("#globallayout").fadeOut("slow");
        $("#globallayoutbg").fadeOut("slow");
        
    }

}
function deepCopy(p, c) {
　　　　var c = c || {};
　　　　for (var i in p) {
　　　　　　if (typeof p[i] === 'object') {
　　　　　　　　c[i] = (p[i].constructor === Array) ? [] : {};
　　　　　　　　deepCopy(p[i], c[i]);
　　　　　　} else {
　　　　　　　　　c[i] = p[i];
　　　　　　}
　　　　}
　　　　return c;
　　}
  Date.prototype.dateAdd = function(interval, number) {
        var d = this;
        switch(interval.toLowerCase()){ 
            case "y": return new Date(d.setFullYear(d.getFullYear()+number)); 
            case "m": return new Date(d.setMonth(d.getMonth()+number)); 
            case "d": return new Date(d.setDate(d.getDate()+number)); 
            case "w": return new Date(d.setDate(d.getDate()+7*number)); 
            case "h": return new Date(d.setHours(d.getHours()+number)); 
            case "n": return new Date(d.setMinutes(d.getMinutes()+number)); 
            case "s": return new Date(d.setSeconds(d.getSeconds()+number)); 
            case "l": return new Date(d.setMilliseconds(d.getMilliseconds()+number)); 
         } 
        return d;
    }
    Date.prototype.dateDiff = function(interval, objDate2) {
        var d = this, i = {}, t = d.getTime(), t2 = objDate2.getTime();
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
    }
    Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
    String.prototype.format = function()
{
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,                
        function(m,i){
            return args[i];
        });
}
String.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
} 
     function getWeekName(day) {
        switch (day) {
            case 1:
                return "周一";
            case 2:
                return "周二";
            case 3:
                return "周三";
            case 4:
                return "周四";
            case 5:
                return "周五";
            case 6:
                return "周六";
            default:
                return "周日"
        }
    }
   function getNumberChinese(num) {
        switch (num) {
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
            default:
                return ""
        }
    }
    function ExamQuestionType(type)
    {
          //10=单选、20=-多选、30=判断对错、40=填空,主观:90=主观
        switch (type)
        {
            case 10: return "单选";
            case 20: return "多选";
            case 30: return "判断对错";
            case 40: return "填空";
            case 60: return "连线题";
            case 90: return "主观";
            default: return "";
        }
    }
    function StringBuilder() {
        this.__strings__ = new Array;
    }

    StringBuilder.prototype.append = function (str) {
        this.__strings__.push(str);
    };

    StringBuilder.prototype.toString = function () {
        return this.__strings__.join("");
    };
    function UrlHandler(capture)
    {
        var url = location.href
        if (typeof capture == "undefined")
        {
            capture = ""; 
        }
        if (capture == "")
        {
            return null; 
        }
        if (url.split(capture).length == 1)
        {
            return null; 
        }
        url = url.split(capture)[1];
        var par = "";
        for (var i = 0; i < url.split("/").length; i++)
        {
            if (par != "debug")
            {
                if (i % 2 == 0)
                    par = par + ","
                else
                    par = par + ":"
                par = par + "\"" + url.split("/")[i].replace("#", "") + "\"";
            }
        }
        par = par.substr(1);
        par = "{" + par + "}";
		console.log(par);
        return eval("(" + par + ")");
    }
function GUID() {
    this.date = new Date();

    /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID != 'function') {

        /* 生成GUID码 */
        GUID.prototype.newGUID = function() {
            this.date = new Date();
            var guidStr = '';
            sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
            sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
            for (var i = 0; i < 9; i++) {
                guidStr += Math.floor(Math.random()*16).toString(16);
            }
            guidStr += sexadecimalDate;
            guidStr += sexadecimalTime;
            while(guidStr.length < 32) {
                guidStr += Math.floor(Math.random()*16).toString(16);
            }
            return this.formatGUID(guidStr);
        }

        /*
         34          * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
         35          * 返回值：返回GUID日期格式的字条串
         36          */
        GUID.prototype.getGUIDDate = function() {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        }

        /*
         42          * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
         43          * 返回值：返回GUID日期格式的字条串
         44          */
        GUID.prototype.getGUIDTime = function() {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero( parseInt(this.date.getMilliseconds() / 10 ));
        }

        /*
         50          * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
         51          * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
         52          * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
         53          */
        GUID.prototype.addZero = function(num) {
            if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        }

        /*
         63          * 功能：将y进制的数值，转换为x进制的数值
         64          * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
         65          * 返回值：返回转换后的字符串
         66          */
        GUID.prototype.hexadecimal = function(num, x, y) {
            if (y != undefined) {
                return parseInt(num.toString(), y).toString(x);
            } else {
                return parseInt(num.toString()).toString(x);
            }
        }

        /*
         76          * 功能：格式化32位的字符串为GUID模式的字符串
         77          * 参数：第1个参数表示32位的字符串
         78          * 返回值：标准GUID格式的字符串
         79          */
        GUID.prototype.formatGUID = function(guidStr) {
            var str1 = guidStr.slice(0, 8) + '-',
                str2 = guidStr.slice(8, 12) + '-',
                str3 =  guidStr.slice(12, 16) + '-',
                str4 = guidStr.slice(16, 20) + '-',
                str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        }
    }
}
    var logintemplate = "<div class=\"layoutlogin\"><form class=\"form-horizontal\"  id=\"layoutloginform\" method=\"post\">";
    logintemplate = logintemplate + "<div class=\"form_row\"><input type=\"text\" class=\"input login\" name=\"lgnname\" placeholder=\"学籍号/登录名\"><span class=\"uin_icon\"></span></div>";
    logintemplate = logintemplate + "<div class=\"form_row\"><input type=\"password\" class=\"input pwd\" name=\"pwd\" placeholder=\"输入密码\"><span class=\"pwd_icon\"></span></div>";
    logintemplate = logintemplate + "<div class=\"form_row\">认证学生无需注册可用学籍号登录,初始密码是111111哦！</div>";
    logintemplate = logintemplate + "<div class=\"form_row\" ><input type=\"checkbox\" name=\"remind\" value=\"1\"> 记住密码<a  href=\"/Home/index/pwdStep1\"><span  style=\"color:red; float:right\" >忘记密码</span></a></div>";
    logintemplate = logintemplate + "<div class=\"form_row\" style='text-align:right'><button class='btn btn-success btnlogin' onclick='ischool.login.post()'>登录</button><a  class='btn btn-warning'  href='/home/register'>注册</a></div>";
    logintemplate = logintemplate + "</form></div>";
    ischool.login = {
        init: function () {
			//$(this).unbind();
            //$(this).removeAttr("onclick");
            //console.log($(this).attr("onclick"))
			ischool.layout.error('登录后才能使用此功能！',1000);
            //ischool.layout.init({ title: "帐号登录", content: logintemplate, isshowbutton: false, width: 400 });
            return false;
        },
        post: function () {
            $('#layoutloginform').submit(function () {
                var options = {
                    url: '/Home/Index/dologin',
                    type: 'POST',
                    dataType: "json",
                    beforeSend: ischool.layout.loadding("登录中，请稍候。。。"),
                    success: function (message) {
                        if (message.status) {
                            window.location.href = location.href;
                            return true;
                        } else {
                            ischool.layout.error("用户名或密码错误");
                            return false;
                        }
                    }
                };

                $('#layoutloginform').ajaxSubmit(options);
                return false;
            }
            );
        }

    }
    function keepevent(evt) {
        
        var e = (evt) ? evt : window.event;
       
            e.cancelBubble = true;
        
            e.stopPropagation();
            //console.log("event1");
        
    }
    $(document).ready(function () {
        $("[data-login='false']").unbind();
        $("[data-login='false']").each(function () {
            $(this).removeAttr("onclick");
            $(this).removeAttr("onblur");
            $(this).removeAttr("onchange");
            $(this).removeAttr("onfocus");
            $(this).removeAttr("onkeydown");
            $(this).removeAttr("onkeyup");
            $(this).removeAttr("onmousedown");
            $(this).removeAttr("onmouseout");
            $(this).removeAttr("onmouseover");
            $(this).removeAttr("onkeypress");
            $(this).removeAttr("onmousemove");
            $(this).removeAttr("onmouseup");
           // console.log()
        })
        $("[data-login='false']").bind("click", ischool.login.init);
    });
/***********dropdown plug**********/
        (function ($)
        {

            $(document).on("click.bs.dropdown",function ()
            {
                
                $(".dropdown").each(function () {
                    
                    if ($(this).hasClass("active"))
                    {
                       // console.log($(this).attr("class"));
                         $(this).removeClass("active");
                         $(this).find("ul").css("display", "none");
                    }
                });
                $("#GalleryView").hide();
                $(".Searchteacher").hide();

            }).on("click.bs.dropdown", ".dropdown > div", function (evt)
            {
                if($(this).parent().is(".disabled,:disabled"))
                {
                    //console.log("12121212121")
                    return false;
                }
                //console.log($(this).parent().attr("class"))
              
                if(!$(this).parent().is(".active"))
                {
                   $(".dropdown").removeClass("active");
                   $(".dropdown").find("ul").css("display","none")
                   $(this).parent().addClass("active");
                   $(this).parent().find("ul").css("display", "block")
              
                }
                 else
                 {
                      $(this).parent().removeClass("active");
                       $(this).parent().find("ul").css("display","none")
                }
                keepevent(evt);
                
            }).on("click.bs.dropdown.select", ".dropdown-menu > li", function (evt)
            {
                var val=$(this).html();
                if($(this).find("a").length==1)
                {
                    val=$(this).find("a").html();
                }
                $(this).parent().prev().html(val);
                $(this).parent().parent().removeClass("active");
                $(this).parent().css("display","none")
               var obj=$(this).parent().parent().find("input[type='hidden']");
               $(this).parent().find("li").removeAttr("data-select");
               $(this).attr("data-select", "selected");
               if(obj.length>0)
               {
                   if(typeof($(this).attr("data-value"))!="undefined")
                   {
                       obj.val($(this).attr("data-value"));
                   }
                   else {
                       obj.val($(this).attr("uid"));
                   }
               }
               keepevent(evt);
            });
          
            $(document).ready(function () {

                $(".buttongroup").each(function () {
                    var length = $(this).find(".dropdown").length + $(this).find(".input").length + $(this).find(".btn").length;
                    if (length > 1) {
                        //console.log($(this).children().length)
                        $(this).children().each(function (i) {
                            if (i == 0) {
                                $(this).addClass("fistr");
                            }
                            else if (i == length - 1) {
                                $(this).addClass("last");
                            }
                            else {
                                $(this).addClass("center");
                            }
                        });
                    }
                });
                $("[data-select='selected']").each(function () {
                    $(this).parent().prev().html($(this).html());
                    $(this).parent().next().val($(this).attr("data-value"));
                   
                })
            });
        })(jQuery)