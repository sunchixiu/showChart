/**
 * Created by Wilson on 2016/1/9.
 */
var calender = {
    CHOOSE_DATE: "",
    TODAY_DATE: "",
    IS_LOADING: false,
    /**
     * 改变当前选择时间
     * @param {object} obj 当前控件（应该是span）
     */
    changeFocus: function(obj) {
        var doc = document,
            fDate = obj.getAttribute("full-date"),
            pre = doc.querySelector(".focus"),
            preClass, thisClass,
            arr = fDate.split("-");

        doc.getElementById("thisYM").innerText = arr[0] + "年" + arr[1] + "月";
        if(pre != null) {
            preClass = pre.getAttribute("class");
            preClass = preClass.replace("focus", "");
            pre.setAttribute("class", preClass);
        }
        thisClass = obj.getAttribute("class");
        obj.setAttribute("class", thisClass + " focus");
        // 改变全局变量的值
        calender.CHOOSE_DATE = obj.getAttribute("full-date");
    },

    /**
     * 滑动改变日期
     * @param {number} type 递增正数，递减为负数；可自行修改。
     */
    changeDate: function(type) {
        var doc = document;
        // 去除之前的focus样式和today样式
        var focus = doc.querySelector(".focus"),
            focusClass;
        if (focus != null) {
            focusClass = focus.getAttribute("class");
            focusClass = focusClass.replace("focus", "");
            focus.setAttribute("class", focusClass);
        }
        var active = doc.querySelector(".active"),
            todayClass;
        if (active != null) {
            todayClass = active.getAttribute("class");
            todayClass = todayClass.replace("active", "");
            active.setAttribute("class", todayClass);
        }

        // 改变日期
        for (var i = 0, infor, preDate, fdate; i < 7; i++) {
            infor = doc.getElementById("week" + i);
            preDate = infor.getAttribute("full-date");
            var arr = preDate.split("-"),
                preYear = arr[0],
                preMonth = arr[1],
                preDate = arr[2];
            preMonth = preMonth - 1;
            var now = new Date();
            now.setFullYear(preYear, preMonth, preDate);
            now.setDate(now.getDate() + type);
            var year = now.getFullYear(),
                month = now.getMonth() + 1,
                thisDate = now.getDate(),
                thisWeek = now.getDay();


            if (month < 10) {
                month = "0" + month;
            }
            if (thisDate < 10) {
                thisDate = "0" + thisDate;
            }
            // 如果最后一天的月份不等于之前月份
            //if(i == 6){
            //    if (month != (preMonth + 1) || year != preYear) {
            //        doc.getElementById("thisYM").innerText =
            //            year + "年" + month + "月";
            //    }
            //}

            infor.innerHTML = '<em>'+thisDate+'</em>';
            fdate = year + "-" + month + "-" + thisDate + "-" + thisWeek;
            infor.setAttribute("full-date", fdate);
            // 判断是否滑动回到选择的时间
            if (fdate == calender.CHOOSE_DATE) { // 上次选择的时间
                var thisClass = 'active';
                infor.setAttribute("class", thisClass);
            };
        }
    },
    mouseDown: function(obj, thisX){
        var tX=0;
        var disX=thisX;

        function fnMove(ev){
            tX=ev.targetTouches[0].pageX-disX;
            obj.style.WebkitTransform='translate('+tX+'px,0px)';
        }
        obj.addEventListener('touchmove',fnMove,false);

        function fnEnd(){
            if(tX > 60 && !calender.IS_LOADING){
                obj.style.webkitTransform = 'translate(0,0)';
                calender.IS_LOADING = true;
                calender.changeDate(-7);
            }else if(tX < -60 && !calender.IS_LOADING){
                obj.style.webkitTransform = 'translate(0,0)';
                calender.IS_LOADING = true;
                calender.changeDate(7);
            };
            obj.removeEventListener('touchmove',fnMove,false);
            obj.removeEventListener('touchend',fnEnd,false);
            calender.IS_LOADING = false;
        }
        obj.addEventListener('touchend',fnEnd,false);
    }
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
};



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
