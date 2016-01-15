/**
 * Created by Wilson on 2016/1/9.
 */
var calender = {
    CHOOSE_DATE: "",
    TODAY_DATE: "",
    IS_LOADING: false
};

function getdate(Y,M,D,W){
    /**********************日历初始化开始************************/
    // 填充日期
    if(!Y){
        var preDate = new Date(),
            nextDate = new Date(),
            now = new Date(),
            week = now.getDay(),
            thisYear = now.getFullYear(),
            thisMonth = now.getMonth() + 1, // 显示月份
            thisDate = now.getDate();
    }else{
        var preDate = new Date(),
            nextDate = new Date(),
            now = new Date(),
            week = W,
            thisYear = Y,
            thisMonth = M, // 显示月份
            thisDate = D; // 显示日期
    };


    // 今天的月份
    if (thisMonth < 10) {
        thisMonth = "0" + thisMonth;
    }


    $("#thisY").html(thisYear + '年');
    $("#thisM").html(thisMonth + '月');
    $("#thisW").html(turnWeek(week));

    // 今天日期，小于10前面补0
    if (thisDate < 10) {
        thisDate = "0" + thisDate;
    }

    $('.week_con_down > ul > li').removeClass('active');

    $("#week" + week).children("em").html(thisDate);
    $("#week" + week).attr("class", "active");
    // 默认初始化时，选择的时间为当前时间
    calender.CHOOSE_DATE = thisYear + "-" + thisMonth + "-" + thisDate + "-" + week;
    calender.TODAY_DATE = calender.CHOOSE_DATE;
    $("#week" + week).attr("full-date", calender.CHOOSE_DATE);

    var thisDateD = thisDate;
    var thisDateX = thisDate;
    // 大于当前天
    for (var i = week + 1; i < 7; i++) {
        thisDateD = parseInt(thisDateD) + 1;
        thisMonth = parseInt(thisMonth) - 1;

        nextDate.setFullYear(thisYear,thisMonth,thisDateD);

        thisYear = nextDate.getFullYear();
        thisMonth = nextDate.getMonth() + 1;
        thisDateD = nextDate.getDate();
        var thisWeek = nextDate.getDay();

        if (thisMonth < 10) {
            thisMonth = "0" + thisMonth;
        }

        if (thisDateD < 10) {
            thisDateD = "0" + thisDateD;
        }
        $("#week" + i).children("em").html(thisDateD);
        $("#week" + i).attr("full-date",thisYear + "-" + thisMonth + "-" + thisDateD + "-" + thisWeek);
    }
    // 小于当前天
    for (var i = week - 1; i >= 0; i--) {
        thisDateX = parseInt(thisDateX) - 1;
        thisMonth = parseInt(thisMonth) - 1;

        preDate.setFullYear(thisYear,thisMonth,thisDateX);

        thisYear = preDate.getFullYear();
        thisMonth = preDate.getMonth() + 1;
        thisDateX = preDate.getDate();
        var thisWeek = preDate.getDay();

        if (thisMonth < 10) {
            thisMonth = "0" + thisMonth;
        };

        if (thisDateX < 10) {
            thisDateX = "0" + thisDateX;
        }
        $("#week" + i).children("em").html(thisDateX);
        $("#week" + i).attr("full-date",thisYear + "-" + thisMonth + "-" + thisDateX + "-" + thisWeek);
    }
    /**********************日历初始化结束************************/

    // 给每个日期增加点击事件
    $('.week_con_down > ul > li').click(function(){
        $(this).attr('class','active').siblings().removeAttr('class');
        var dateArr = $(this).attr('full-date').split('-');

        $("#thisY").html(dateArr[0] + '年');
        $("#thisM").html(dateArr[1] + '月');
        $("#thisW").html(turnWeek(dateArr[3]));

        $('#rili').attr('data-value','00'+dateArr[0]+'-'+dateArr[1]+'-'+dateArr[2]);
    });

    function turnWeek(week){
        var week = parseInt(week);
        var weekText;
        switch (week){
            case 0: weekText = '周日'; break;
            case 1: weekText = '周一'; break;
            case 2: weekText = '周二'; break;
            case 3: weekText = '周三'; break;
            case 4: weekText = '周四'; break;
            case 5: weekText = '周五'; break;
            case 6: weekText = '周六'; break;
            default : weekText = '周六'; break;
        };
        return weekText;
    };
}