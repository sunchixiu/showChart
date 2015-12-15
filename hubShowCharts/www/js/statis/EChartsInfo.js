/**ECharts 图标信息**/
$(function () {
    jQuery.support.cors = true;

});
var myChart;
function EChartsInit(objId, EChartsType, data, legendTitle, para, key, bclick,Func) {
    require.config({
        paths: {

            'echarts': '/js',
        }
    });
    require(
           [
               'echarts',
               'echarts/chart/bar', // 柱状图
               'echarts/chart/line', // 折线图
               'echarts/chart/pie' // 饼图
           ], function (ec, defaultTheme) {
               curTheme = "macarons";
               echarts = ec;
               switch (EChartsType) {
                   case "Borkenline":
                       BorkenlineLoad(objId, data, legendTitle, para, key, bclick);
                       break;
                   case "Line":
                       LineLoad(objId, data, legendTitle, para, key, bclick);
                       break;  
                   case "Line2":
                       LineLoad2(objId, data, legendTitle, para, key, bclick, Func);
                       break;
                   case "Pie":
                       PieLoad(objId, data, legendTitle, bclick);
                       break;
               }

               window.onresize = myChart.resize;
           }

       );
}
function BorkenlineLoad(objId, data, legendTitle, para, key, bclick) {
    myChart = echarts.init(document.getElementById(objId)) 
    option = {
        grid:{
            x:46,
            y:36,
            x2:12,
            y2:54
        },
        tooltip: {
            trigger: 'axis'
          
        },
        toolbox: {
            show: true,
            feature: {
              
             
                magicType: { show: true, type: ['line', 'bar'] },
               
                saveAsImage: { show: false }
            }
        },
        legend: {
            x: 'left',
            data: function () {
                var dataTitle = [];
                for (var i = 1; i < legendTitle.length; i++) {
                    dataTitle.push(legendTitle[i]);
                }
                return dataTitle;
            }()
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    number: "0",
                    rotate:-90,
                },
                data: function () {
                    var dataX = [];
                    for (var i = 0; i < data.length; i++) {
                        dataX.push(data[i][para[0]]);
                    }
                    return dataX;
                }()
            }
        ],
        yAxis: [
            {
                type: 'value',
                
                max:100,
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        series: function () {
            var serie = [];
            for (var i = 1; i < para.length; i++) {
                var item = {
                    name: legendTitle[i],
                    type: "line",
                    //stack: '总量',
                    //key: function () {
                    //    var dataKey = [];
                    //    for (var j = 0; j < data.length; j++) {
                    //        dataKey.push(data[j][key]);
                    //    }
                    //    return dataKey;
                    //}(),
                    data: function () {
                        var dataS = [];
                        for (var j = 0; j < data.length; j++) {
                            //dataS.push(data[j][para[i]].toString().replace("%", ""));
                            var _temp = data[j][para[i]].toString();
                            if (_temp != "") {
                                if (_temp.indexOf("/") > 0) {
                                    var _tempcount = 0;
                                    for (var t = 0; t < _temp.split("/").length; t++) {
                                        _tempcount = _tempcount + parseInt($.trim(_temp.split("/")[t].replace("%", "")), 10);
                                    }
                                    _temp = (_tempcount / _temp.split("/").length)+""
                                }
                                else {
                                    _temp = _temp.replace("%", "")
                                }

                                _temp = _temp.replace("--", "'-'");
                            }
                            else { _temp="0"}
                            dataS.push(_temp);
                        }
                        
                        return dataS;
                    }()

                }

                serie.push(item);
            } 
    
            return serie;

        }()
    };

    myChart.setOption(option,true);
    myChart.setTheme(curTheme);
    if (bclick) {
        echartsOnClick(myChart);
    }
}

function LineLoad(objId, data, legendTitle, para) {
    myChart = echarts.init(document.getElementById(objId))
    option = {
        grid:{
            x:36,
            y:36,
            x2:12,
            y2:54
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
               
                
                magicType: { show: true, type: ['line', 'bar'] },
                
                saveAsImage: { show: false }
            }
        },
        legend: {
            x: 'left',
            data: function () {
                var dataTitle = [];
                for (var i = 1; i < legendTitle.length; i++) {
                    dataTitle.push(legendTitle[i]);
                }
                return dataTitle;
            }()
        },
      
        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    number: "0",
                    rotate: -30,
                },
                data: function () {
                    var dataX = [];
                    for (var i = 0; i < data.length; i++) {
                        dataX.push("题"+data[i].QuestionNum);
                    }
                    return dataX;
                }()
            }
        ],
        yAxis: [
            {
                type: 'value',
                max: 100,
                splitArea: { show: true }
            }
        ],
        series: function () {
            var serie = [];
            for (var i = 1; i < para.length; i++) {
                var item = {
                    name: legendTitle[i],
                    type: "bar", 
                    data: function () {
                        var dataS = [];
                        for (var j = 0; j < data.length; j++) {
                            var _temp = data[j][para[i]].toString();
                            if (_temp != "")
                            { 
                            if (_temp.indexOf("/") > 0) {
                                var _tempcount = 0;
                                for (var t = 0; t < _temp.split("/").length; t++) {
                                    _tempcount = _tempcount + parseInt($.trim(_temp.split("/")[t].replace("%", "")), 10);
                                }
                                _temp = (_tempcount / _temp.split("/").length)+""
                            }
                            else {
                                _temp = _temp.replace("%", "")
                            }
                           
                            _temp = _temp.replace("--", "'-'");//'-'
                            }
                            else { _temp = "0" }
                            dataS.push(_temp);
                        }
                        return dataS;
                    }()

                }

                serie.push(item);
            }

            return serie;

        }()
    };

    myChart.setOption(option,true);
    myChart.setTheme(curTheme);
}

function LineLoad2(objId, data, legendTitle, para, key, bclick,Func) {
    myChart = echarts.init(document.getElementById(objId))
    option = {
        grid:{
            x:36,
            y:36,
            x2:12,
            y2:54
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: false }
            }
        },
        legend: {
            x: 'left',
            data: function () {
                var dataTitle = [];
                for (var i = 1; i < legendTitle.length; i++) {
                    dataTitle.push(legendTitle[i]);
                }
                return dataTitle;
            }()
        },

        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisLabel: {
                    number: "0",
                    rotate: -90,
                },
                data: function () {
                    var dataX = [];
                    for (var i = 0; i < data.length; i++) {
                        dataX.push(data[i][para[0]]);
                    }
                    return dataX;
                }()
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: function () {
            var serie = [];
            for (var i = 1; i < para.length; i++) {
                var item = {
                    name: legendTitle[i],
                    type: "bar",
                    data: function () {
                        var dataS = [];
                        for (var j = 0; j < data.length; j++) {
                            var _temp = data[j][para[i]].toString();
                            if (_temp != "") {
                                if (_temp.indexOf("/") > 0) {
                                    var _tempcount = 0;
                                    for (var t = 0; t < _temp.split("/").length; t++) {
                                        _tempcount = _tempcount + parseInt($.trim(_temp.split("/")[t].replace("%", "")), 10);
                                    }
                                    _temp = (_tempcount / _temp.split("/").length) + ""
                                }
                                else {
                                    _temp = _temp.replace("%", "")
                                }

                                _temp = _temp.replace("--", "'-'");//'-'
                            }
                            else { _temp = "0" }
                            dataS.push(_temp);
                        }
                        return dataS;
                    }() 
                }

                serie.push(item);
            }

            return serie;

        }()
    };

    myChart.setOption(option, true);
    myChart.setTheme(curTheme);

    if (bclick) {
        echartsOnClick_Func(myChart,Func,key,data);
    }
}

function echartsOnClick(ethis) {
    ethis.on('click', function (param) {
         
        for (var i = 0; i < Data_Source.length; i++) {
            if (i == param.dataIndex) {
                FiresPointId = Data_Source[i]["PointID"];
                FiresPointName = Data_Source[i]["PointName"];
                FiresChapterID = Data_Source[i]["ChapterID"];
                FiresChapterName = Data_Source[i]["ChapterName"];
                GetWork_Practice();
            }
        }
        
    });
}

function echartsOnClick_Func(ethis,Func, key,data) {
    ethis.on('click', function (param) {
        for (var i = 0; i < data.length; i++) {
            if (i == param.dataIndex) {
               Func(data[i][key]);
            }
        }

    });
}
function PieLoad(objId, data, legendTitle, bclick) {

    myChart = echarts.init(document.getElementById(objId))
    option = { 
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
         
        calculable: true,
        series: [
            {
                name: legendTitle[0] ,
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: function () {
                    var dataX = [];
                    for (var i = 0; i < data.length; i++) {
                        dataX.push({ value: data[i].Value, name: data[i].Key });
                    }
                    return dataX;
                }()
            }
        ]
    };

    myChart.setOption(option, true);
    myChart.setTheme(curTheme);
    if (bclick) {
        echartsOnClick(myChart);
    }
}