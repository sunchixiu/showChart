// JavaScript source code
var Notice = {

};
Notice.MemberSource = [],
Notice.bindTree = function (strtreejson)
{
    $('.treelist').html("<div class=\"AjaxModelTree\"></div>");

     $("#globallayout_infocontent").find(".AjaxModelTree").jstree({
        "checkbox": {
            "keep_selected_style": false
        },
         "plugins": ["checkbox"],
         'core': {
            'data': eval("[" + strtreejson + "]")
        }
    });
     $("#globallayout_infocontent").find(".AjaxModelTree").on("changed.jstree", function (e, data)
    {
        $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").html("");
        $("#globallayout_infocontent").find(".AjaxModelMemberList").html("");

        if (data && data.selected && data.selected.length)
        {
           // console.log(data.selected)
           
            Notice.setMember(data.selected);
            return;
        }

    });
};
Notice.setMember = function (idarr)
{
    var memberhtml = "";
    var selectedhtml = "";
    for (var i = 0; i < Notice.MemberSource.length; i++)
    {
        for (var key in idarr)
        {
            if (Notice.MemberSource[i].parentid == idarr[key])
            {
                var classname = " class='active'";
                var temphtml = "";
                if ( $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").html() != "")
                {
                    if ( $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("[userid='" + Notice.MemberSource[i].userid + "']").length == 0)
                        classname = "";
                }

                memberhtml = memberhtml + "<ul class=\"o-selected-ul  o-active\">";
                memberhtml = memberhtml + "<li userid=\"" + Notice.MemberSource[i].userid + "\" " + classname + ">";
                memberhtml = memberhtml + "<a  href=\"javascript:void(0)\">";
                temphtml = temphtml + "<span><b></b></span>";
                //temphtml = temphtml + "<img src=\"" + Notice.MemberSource[i].useridphoto + "\"   onerror=\"this.src='/Public/images/space/default.gif';\"  style='width:21px; height:21px;'>";
                temphtml = temphtml + "<span>" + Notice.MemberSource[i].username + "</span>";
                if (Notice.MemberSource[i].rolelist.length > 0)
                {
                    for (var y = 0; y < Notice.MemberSource[i].rolelist.length; y++)
                    {
                        temphtml = temphtml + "<span class=\"label label_studies fontw_normal ml5\">" + Notice.MemberSource[i].rolelist[y].rolename + "</span>";
                    }
                }
                memberhtml = memberhtml + temphtml;
                memberhtml = memberhtml + "</a>";
                memberhtml = memberhtml + "</li>";
                memberhtml = memberhtml + "</ul>";
                if (classname != "")
                {
                    selectedhtml = selectedhtml + "<li userid=\"" + Notice.MemberSource[i].userid + "\" style=\"display: list-item;\"><b></b>" + temphtml + "<span class=\"span-delete\">X</span></li>";
                }
            }
        }
    }
    //console.log(selectedhtml)
     $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").css("display", "block");
     $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").html(selectedhtml);
     $("#globallayout_infocontent").find(".AjaxModelMemberList").html(memberhtml);
     $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").unbind();
    //���°��¼�
     $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").bind("click", function () {
         var userid = $(this).attr("userid");
         $("#globallayout_infocontent").find(".AjaxModelMemberList").find("[userid='" + userid + "']").removeClass("active");
         $(this).remove();
         if ($("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").length == 0)
             $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").css("display", "none");
     });
    $("#globallayout_infocontent").find(".AjaxModelMemberList").find("ul").bind("click", function ()
    {
        var html = $(this).find("a").html();
        var active = $(this).find("li").attr("class");
        if (active != "active")
        {
            $(this).find("li").addClass("active");
            html = html.replace("<b></b>", "");
            html = "<li userid=\"" + $(this).find("li").attr("userid") + "\" style=\"display: list-item;\">" + html + "<span class=\"span-delete\">X</span></li>";
             $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").css("display", "block");
             $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").append(html);
            //ȡ���
            $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").unbind();
            //���°��¼�
            $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").bind("click", function ()
            {
                var userid = $(this).attr("userid");
                 $("#globallayout_infocontent").find(".AjaxModelMemberList").find("[userid='" + userid + "']").removeClass("active");
                $(this).remove();
                if ( $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").length == 0)
                     $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").css("display", "none");
            });
        }
        else
        {
            var userid = $(this).find("li").attr("userid");
            $(this).find("li").removeClass("active");
            $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("[userid='" + userid + "']").remove();
            if ( $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").length == 0)
                 $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").css("display", "none");
        }
    });
};
Notice.init=function (type)
{
    $("#globallayout_infocontent").find('.AjaxModelTree').html("");
    $("#globallayout_infocontent").find('.AjaxModelSelectMemberList').find("ul").html("");
    $("#globallayout_infocontent").find('.AjaxModelMemberList').html("");
    if (type == "school") {
        Notice.School.init();
    }
    else {
        Notice.Class.init();
    }
    //$("#AjaxModel").modal('show');
    $("#globallayout_infocontent").find(".globallayout_footer").find("button").eq(1).bind("click", function () {
        Notice.hide();
        var jsondata = "";
         $("#globallayout_infocontent").find(".AjaxModelSelectMemberList").find("ul").find("li").each(function () {
            if (jsondata != "") {
                jsondata = jsondata + ",";
            }
            jsondata = jsondata + "{\"id\":\"" + $(this).attr("userid") + "\",\"name\":\"" + $(this).find("span").eq(0).html() + "\",\"photo\":\"" + $(this).find("img").attr("src") + "\"}";

        });
        var json = eval("[" + jsondata + "]");
        $(".btnNoticePanel").next().html("已选" + json.length + "人");
        var html = "";
        $("#hidUserIDs").val();
        var ids = "";
        for (var i = 0; i < json.length; i++) {
            if (ids != "") ids = ids + ",";
            ids = ids + json[i].id;
            html = html + "<dl class=\"notice-add-dl\"><dt><img src=\"" + json[i].photo + "\"></dt> <dd>" + json[i].name + "</dd> </dl>";
        }
        $("#hidUserIDs").val(ids);
        $(".btnNoticePanel").next().next().html(html);
        Notice.hide();
    });
       
};
Notice.hide = function ()
{
    ischool.layout.hide();
}
Notice.School = {
    DataSource: [],
    memberstring: "",
    init: function ()
    {
        var treedata = "";
        var json = "";
        Notice.MemberSource = [];
        Notice.School.memberstring = "";
         $("#globallayout_infocontent").find(".AjaxModelMemberList").html("");
        $.getJSON("/space/my/ajaxgetDeparment", function (data)
        {
            if (data.status)
            {
                Notice.School.DataSource = data.msg.departmentlist;
                for (var i = 0; i < Notice.School.DataSource.length; i++)
                {
                    if (treedata != "")
                    {
                        treedata = treedata + ",";
                    }
                    treedata = treedata + "{\"id\":\"" + Notice.School.DataSource[i].departmentid + "\",\"parent\":\"#\",\"text\":\"" + Notice.School.DataSource[i].departmentname + "\"}";
                    if (typeof Notice.School.DataSource[i].depmemberlist == "object")
                    {
                        if (Notice.School.DataSource[i].depmemberlist.length > 0)
                        {
                            for (var m = 0; m < Notice.School.DataSource[i].depmemberlist.length; m++)
                            {
                                if (Notice.School.memberstring != "")
                                {
                                    Notice.School.memberstring = Notice.School.memberstring + ",";
                                }
                                var ulist = "";
                                for (var u = 0; u < Notice.School.DataSource[i].depmemberlist[m].roleuserlist.length; u++)
                                {
                                    if (ulist != "")
                                    {
                                        ulist = ulist + ",";
                                    }
                                    ulist = ulist + "{\"roleid\":\"" + Notice.School.DataSource[i].depmemberlist[m].roleuserlist[u].roleid + "\",\"rolename\":\"" + Notice.School.DataSource[i].depmemberlist[m].roleuserlist[u].rolename + "\"}"
                                }

                                Notice.School.memberstring = Notice.School.memberstring + "{\"parentid\":\"" + Notice.School.DataSource[i].departmentid + "\",\"userid\":\"" + Notice.School.DataSource[i].depmemberlist[m].userid + "\",\"username\":\"" + Notice.School.DataSource[i].depmemberlist[m].username + "\",\"userimg\":\"" + Notice.School.DataSource[i].depmemberlist[m].useridphoto + "\",\"rolelist\":[" + ulist + "]}";
                            }
                        }
                    }
                    //alert(Notice.School.memberstring);
                    if (typeof Notice.School.DataSource[i].departmentlist == "object")
                    {
                        if (Notice.School.DataSource[i].departmentlist.length > 0)
                            treedata = treedata + Notice.School.recursion(Notice.School.DataSource[i].departmentid, Notice.School.DataSource[i].departmentlist);
                    }
                }
                //alert(Notice.School.memberstring);
                Notice.MemberSource = eval("[" + Notice.School.memberstring + "]");
                //console.log(Notice.School.memberstring)
                Notice.bindTree(treedata);
            }
        }
        );
    },
    recursion: function (id, data)
    {
        var jsondata = ""
        for (var i = 0; i < data.length; i++)
        {
            jsondata = jsondata + ",{\"id\":\"" + data[i].departmentid + "\",\"parent\":\"" + id + "\",\"text\":\"" + data[i].departmentname + "\"}";
            //alert(data[i].depmemberlist.length);
            if (typeof data[i].depmemberlist == "object")
            {
                if (data[i].depmemberlist.length > 0)
                {
                    for (var m = 0; m < data[i].depmemberlist.length; m++)
                    {
                        if (Notice.School.memberstring != "")
                        {
                            Notice.School.memberstring = Notice.School.memberstring + ",";
                        }
                        var ulist = "";
                        for (var u = 0; u < data[i].depmemberlist[m].roleuserlist.length; u++)
                        {
                            if (ulist != "")
                            {
                                ulist = ulist + ",";
                            }
                            ulist = ulist + "{\"roleid\":\"" + data[i].depmemberlist[m].roleuserlist[u].roleid + "\",\"rolename\":\"" + data[i].depmemberlist[m].roleuserlist[u].rolename + "\"}"
                        }
                        Notice.School.memberstring = Notice.School.memberstring + "{\"parentid\":\"" + data[i].departmentid + "\",\"userid\":\"" + data[i].depmemberlist[m].userid + "\",\"username\":\"" + data[i].depmemberlist[m].username + "\",\"userimg\":\"" + data[i].depmemberlist[m].useridphoto + "\",\"rolelist\":[" + ulist + "]}";
                    }
                }
            }
            if (typeof data[i].departmentlist == "object")
            {
                if (data[i].departmentlist.length > 0)
                    jsondata = jsondata + Notice.School.recursion(data[i].departmentid, data[i].departmentlist);
            }
        }
        return jsondata;
    }
}
Notice.Class = {
    DataSource: [],
    init: function ()
    {
        var treedata = "";
        var json = "";
        Notice.MemberSource = [];
        $("#globallayout_infocontent").find(".AjaxModelMemberList").html("");
        //$.ajax({
        //    url:'http://111.40.226.57:8888/TSB_ISCHOOL_SMS_SERVER/school/getstudentstree',
        //    type:'post',
        //    dataType:'json',
        //    data:JSON.stringify({"companycode":"765276c35afe4c8091897eaf042e5e0a","userid":"cb7a90ba1797421fa4f27f9170e0f064"}),
        //    contentType: "application/json; charset=utf-8",
        //    success:function(datajson){
                var datajson = {"code":1,"errorCode":0,"data":{"bean":[{"typeid":"2","typename":"初中","yearBean":[{"yearid":"2016","yearname":"一年级","classBean":[{"classid":"7b5dd3fcb87d4effa2e1e954876320bc","classname":"01班","stuBean":[{"userid":"8292c698dfee4ce5a435a2cd868139cd","username":"学生一","userimg":null},{"userid":"e08e85b9f342409c939ee2ab55c924e9","username":"学生二","userimg":"/3204010001/headimg/2016/09/13/14/14737467673527.png"},{"userid":"9638fb86e55b4942ba38220e7fc959e8","username":"学生一","userimg":null}]}]}]},{"typeid":"1","typename":"小学","yearBean":[{"yearid":"2016","yearname":"一年级","classBean":[{"classid":"8e510f9721314ae088b202eab44d12ed","classname":"01班","stuBean":[{"userid":"7b4b2d7d3a3b4b43836b3fd1eb853533","username":"李凯凯","userimg":null},{"userid":"069413040453445aa7bef621640edfa4","username":"王辛","userimg":null}]},{"classid":"3c0cffcd255a4ca294922a2f1a58375f","classname":"02班","stuBean":[{"userid":"28482a0ef4fe4f4faaa76cb60e32dbce","username":"路新余","userimg":null}]}]}]}]},"errorMessage":""};
                var data = datajson.data;
                if (data.bean.length > 0) {
                    Notice.Class.DataSource = data.bean;
                    for (var i = 0; i < Notice.Class.DataSource.length; i++)
                    {
                        if (treedata != "") {
                            treedata = treedata + ",";
                        }
                        treedata = treedata + "{\"id\":\"" + Notice.Class.DataSource[i].typeid + "\",\"parent\":\"#\",\"text\":\"" + Notice.Class.DataSource[i].typename + "\"}";
                        var yearbean = Notice.Class.DataSource[i].yearBean
                        if (yearbean.length > 0)
                        {

                            for (var year = 0; year < yearbean.length; year++)
                            {
                                var id = Notice.Class.DataSource[i].typeid + "" + yearbean[year].yearid;
                                treedata = treedata + ",{\"id\":\"" + id + "\",\"parent\":\"" + Notice.Class.DataSource[i].typeid + "\",\"text\":\"" + yearbean[year].yearname + "\"}";
                                var classBean = yearbean[year].classBean;
                                if (classBean.length > 0) {
                                    for (var c = 0; c < classBean.length; c++) {
                                        treedata = treedata + ",{\"id\":\"" + classBean[c].classid + "\",\"parent\":\"" + id + "\",\"text\":\"" + classBean[c].classname + "\"}";
                                        var stuBean = classBean[c].stuBean;
                                        if (stuBean.length > 0) {
                                            for (var s = 0; s < stuBean.length; s++) {
                                                if (json != "") {
                                                    json = json + ",";
                                                }
                                                json = json + "{\"parentid\":\"" + classBean[c].classid + "\",\"userid\":\"" + stuBean[s].userid + "\",\"username\":\"" + stuBean[s].username + "\",\"userimg\":\"" + stuBean[s].userimg + "\",\"rolelist\":[]}";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //alert(json)
                    Notice.MemberSource = eval("[" + json + "]");
                    Notice.bindTree(treedata);
                }
        //    },
        //    error:function(json){
        //        alert('shibai');
        //    }
        //});
    }
}


