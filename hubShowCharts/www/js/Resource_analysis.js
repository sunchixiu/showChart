$(function () {
    jQuery.support.cors = true;
});

var echarts;
function webapi_ajax(Id, url, begintime, endtime, Postion,ParaType,siteID) {
    $.ajax({
        url: url,
        data: { "Id": "" + Id + "", "begintime": "" + begintime + "", "endtime": "" + endtime + "", "Postion": "" + Postion + "", "ParaType": "" + ParaType + "", "siteID": "" + siteID + "" },
        type: "post",
        dataType: "jsonP",
        contentType: "application/jsonp; charset=utf-8",
        processData: true,
        success: function (data) {
            sa_Data(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

function sa_Data(data) {
    if (data != "") {

        $('.dataerror').hide();
        var resultList = data.split('@--@');
        var v_Count = 0;
        var T_Data = eval('(' + resultList[0] + ')');
        T_Data.grid = {//改变图表宽度留白
            x:36,
            y:56,
            x2:32,
            y2:54
        };
        $(".divDataList").html(resultList[1]);

        $("#tb_list .td_count").each(function () {
            v_Count += parseInt($(this).html());;
        });
        $("#s_count").html(Math.round(v_Count));
        $("#s_avg").html(formatNum(Math.round(v_Count / GetDateDiff($("#txtbegin").val(), $("#txtend").val(), "day")).toString()));
        Echarts_Line(T_Data);
    } else {
        $('.tempLoading').hide();
        $('.dataerror').show();
    }

}
 

function Echarts_Line(dataS) {
    require.config({
        paths: {

            'echarts': '/js',
        }
    });
    require(
           [
               'echarts',
               'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
           ], function (ec, defaultTheme) {
               curTheme = "macarons";
               echarts = ec;
               EcLine("chartResourcetype", dataS);
               window.onresize = myChart.resize;
           }

       );
}

 


//柱状图
function EcLine(objId, dataS) {
    myChart = echarts.init(document.getElementById(objId));
    option = dataS;
    myChart.setOption(option);
    $('.tempLoading').hide();
    //myChart.setTheme(curTheme);

}


function GetDateDiff(startTime, endTime, diffType) {
   
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/"); 
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime);      //开始时间
    var eTime = new Date(endTime);  //结束时间 
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}
//每三位数字增加逗号
function formatNum(str) {
    return str.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('')
}