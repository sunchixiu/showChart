var classjson = [];
$.ajax({
    url: "/Space/Homework/ajax_class/",
    type: "get",
    dataType: "json",
    success: function (json) {
        if (json.status) {
            var ghtml = "";
            var shtml = "";
            var chtml = "";
            classjson = json.classsubject;
            for (var i = 0; i < json.classsubject.length; i++) {
                if (ghtml.indexOf(json.classsubject[i].gradeid) == -1) {
                    ghtml = ghtml + "<li data-value='" + json.classsubject[i].gradeid + "'>" + json.classsubject[i].gradename + "</li>";
                }
                //    if (shtml.indexOf(json.classsubject[i].kccode) == -1)
                //        shtml = shtml + "<li data-value='" + json.classsubject[i].kccode + "'>" + json.classsubject[i].kcname + "</li>";
                //    chtml = chtml + "<li data-value='" + json.classsubject[i].classid + "'>" + json.classsubject[i].classname + "</li>";
            }
            $("#divgrade").find("ul").html(ghtml);
            $("#divsubject").find("ul").html(shtml)
            $("#divclass").find("ul").html(chtml)
            $("#divgrade").find("li").bind("click", function () {
                getsubject($(this).attr("data-value"));
            });
            $("#divgrade").find("li").eq(0).click();
        }
    }
});
function getsubject(gradeid) {
    var shtml = "";
    for (var i = 0; i < classjson.length; i++) {

        if (classjson[i].gradeid == gradeid)
            if (shtml.indexOf(classjson[i].kccode) == -1)
                shtml = shtml + "<li data-value='" + classjson[i].kccode + "'>" + classjson[i].kcname + "</li>";

    }

    $("#divsubject").find("ul").html(shtml)
    $("#divclass").find("ul").html("")
    $("#divclass").find("div").html("班级")
		 $("#divsubject").find("li").unbind();
    $("#divsubject").find("li").bind("click", function () {
       $("#divsubject").find("div").html($(this).html())
        $("#divsubject").find("input").val($(this).attr("data-value"))
        getclass($("#divgrade").find("input").val(), $("#divsubject").find("input").val());
		//console.log($(this).attr("data-value"))
    });
    $("#divsubject").find("li").eq(0).click();
	$("#divsubject").find("input").val($("#divsubject").find("li").eq(0).attr("data-value"))

}
var dataclassjson = "";
function getclass(gradeid, subjectid) {
	    gradeid = $("#divgrade").find("input").val();
    subjectid=$("#divsubject").find("input").val();
	 console.log(subjectid)
    var chtml = "";
    var classid = "";
    var subjectname = "";
    dataclassjson = "";
    for (var i = 0; i < classjson.length; i++) {

        if (classjson[i].gradeid == gradeid && classjson[i].kccode == subjectid) {

            chtml = chtml + "<li data-value='" + classjson[i].classid + "'>" + classjson[i].classname + "</li>";
            if (classid != "") {
                classid = classid + ",";
                dataclassjson = dataclassjson + ",";
            }
            classid = classid + classjson[i].classid;
            dataclassjson = dataclassjson + "{'classid':'" + classjson[i].classid + "','classname':'" + classjson[i].classname + "','StudentCount':[],'PartakeUserCount':[],'PartakeRate':[],'PageViews':[],'ResidenceTime':[],'AccuracyRate':[],'CompletionRate':[]}";
        }

    }
    subjectname = $("#divsubject").find("div").html();
  
    $("#divclass").find("ul").html(chtml)
    $("#divclass").find("li").bind("click", function () {
        $("#divclass").find("div").html($(this).html())
        dataclassjson = "{'classid':'" + $(this).attr("data-value") + "','classname':'" + $(this).html() + "','StudentCount':[],'PartakeUserCount':[],'PartakeRate':[],'PageViews':[],'ResidenceTime':[],'AccuracyRate':[],'CompletionRate':[]}";
        datainit($(this).attr("data-value"), subjectname);
    });
    console.log(classid);
    datainit(classid, subjectname);
}
var optiontemplate = "{tooltip: { trigger: 'axis'},legend: {data: [#_classid#]}," +
      " toolbox: {show: true,feature: {mark: { show: true },dataView: { show: true, readOnly: false },magicType: { show: true, type: ['line', 'bar'] },restore: { show: true },saveAsImage: { show: true } }}," +
       "calculable: true,xAxis: [{type: 'category',data: [#pointname#]}],yAxis: [{ type: 'value'}],series: [#data#]}";
var datatemplate = "{name: '#name#', type: '#type#', #itemstyle#data: [#data#], markPoint: { data: [{ type: 'max', name: '最大值',value:'10' }, { type: 'min', name: '最小值' }] }, markLine: { data: [{ type: 'average', name: '平均值' }] }}";

function randomcolor() {
    return parseInt(Math.random() * 255, 10)
}