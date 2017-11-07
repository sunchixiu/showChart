/**
 * Created by Wilson on 2017/5/10.
 */

//设置title
function setTitle(title,state) {
    try {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.setlifeTitle(function success(arg) {
                }, function error(arg) {
                }, [title,state]);

            }, false);
        } else {
            cordova.plugins.traceclass.setlifeTitle(function success(arg) {
            }, function error(arg) {
            }, [title,state]);
        }
    }catch (e) {

    };

};

//支付宝购买
function payZFB(number,price,title) {
    try
    {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.zfbPay(function success(arg) {
                }, function error(arg) {
                }, [number,price,title]);

            }, false);
        } else {
            cordova.plugins.traceclass.zfbPay(function success(arg) {}, function error(arg) {}, [number,price,title]);
        }

    }
    catch (e)
    {
    }
};
//微信购买
function payWX(number,price,title) {
    try
    {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.wxPay(function success(arg) {
                }, function error(arg) {
                }, [number,price,title]);

            }, false);
        } else {
            cordova.plugins.traceclass.wxPay(function success(arg) {}, function error(arg) {}, [number,price,title]);
        }

    }
    catch (e)
    {
    }
};

//去购买
function gobuy(){
    goodsdetailvue.confirmorderdetail(goodsdetailvue.goodsdetailjson.goods.goodsName);
};

//进入直播课堂
function gotolive(courseid) {
    alert(courseid);
    try
    {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.gotolive(function success(arg) {
                }, function error(arg) {
                }, [courseid]);

            }, false);
        } else {
            cordova.plugins.traceclass.gotolive(function success(arg) {}, function error(arg) {}, [courseid]);
        }

    }
    catch (e)
    {
    }
};
//回播
function gotoplayback(courseid) {
    alert(courseid);
    try
    {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.gotoplayback(function success(arg) {
                }, function error(arg) {
                }, [courseid]);

            }, false);
        } else {
            cordova.plugins.traceclass.gotoplayback(function success(arg) {}, function error(arg) {}, [courseid]);
        }

    }
    catch (e)
    {
    }
};

//播放视频
function goplay(ccid,type,lasttime,classid,courseid,videoname) {
    try
    {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.dianbo(function success(arg) {
                }, function error(arg) {
                }, [ccid,type,lasttime,classid,courseid,videoname]);

            }, false);
        } else {
            cordova.plugins.traceclass.dianbo(function success(arg) {}, function error(arg) {}, [ccid,type,lasttime,classid,courseid,videoname]);
        }

    }
    catch (e)
    {
    }
};

//播放完成后重置目录、学习人数
function resetdirect(){
    if($('.in').attr('id') == 'q-goods'){
        goodsdetailvue.getdirectjson();
        if(morecoursevue.goodstype == 'goods'){
            morecoursevue.getmorecourse();
        }else{
            morecoursevue.getlivegoodslist();
        };
    }else if($('.in').attr('id') == 'q-course'){
        coursedetailvue.getdirectjson();
        courselistvue.getmycoursecount();
        courselistvue.gettypecourse(courselistvue.tabtype,'course');
    }else{
        mall.layout.alert('调试','目录不在商品和课程中');
    };
};

//销毁
function destroylife(state) {
    try {
        if (cordova == null || cordova.plugins == null || cordova.plugins.traceclass == null) {
            document.addEventListener('deviceready', function () {
                cordova.plugins.traceclass.life_finish(function success(arg) {
                }, function error(arg) {
                }, [state]);

            }, false);
        } else {
            cordova.plugins.traceclass.life_finish(function success(arg) {
            }, function error(arg) {
            }, [state]);
        }
    }catch (e) {

    };

};

//初始购物车状态，是否为空
getgoodsstatus();
function getgoodsstatus(){
    var url = urlapi+"/goodsCart/getGoodsCart.rest";
    var params = {
        "userId": userId
    };
    $.ajax({
        url: url,
        data: JSON.stringify(params),
        type:'post',
        dataType:'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(data){
            if(data.code == 1){
                if(data.data.length == 0){
                    buycartvue.status = '1';
                }else{
                    buycartvue.status = '11';
                };
            }else{
                //mall.layout.alert('提示',data.errorMessage);
            };
        },
        error: function(data){
            mall.layout.alert('提示','接口error');
        }
    });
}

function showpay(ordernumber, price, ordertitle, orderid){
    showMask('#z-payment');
    $('#z-payment').attr('data-orderid',orderid);
    $('#z-payment').find('.zfb').attr('href','javascript:payZFB("'+ordernumber+'","'+price+'","'+ordertitle+'","'+orderid+'");');
    $('#z-payment').find('.wx').attr('href','javascript:payWX("'+ordernumber+'","'+price+'","'+ordertitle+'","'+orderid+'");');
};

// 排序效果
$(".z-tagArea .count").click(function() {
    $(this).toggleClass("active").siblings().removeClass("active");
})
//购物车全选
$(document).delegate("#checkall","click",function () {
    $("input[name='checkboxone[]']").prop("checked", this.checked);
    $('.q-buy-js').find('em').html($('.q-swipe-delete input:checked').length);
});
$(document).delegate("input[name='checkboxone[]']","click",function () {
    var $subs = $("input[name='checkboxone[]']");
    $("#checkall").prop("checked", $subs.length == $subs.filter(":checked").length ? true : false);
    $('.q-buy-js').find('em').html($('.q-swipe-delete input:checked').length);
});
// 删除效果
function prevent_default(e) {
    e.preventDefault();
}
function disable_scroll() {
    $(document).on('touchmove', prevent_default);
}
function enable_scroll() {
    $(document).unbind('touchmove', prevent_default)
}
var x;
$(document).delegate('.q-swipe-delete .q-buy-list > .q-buy-con','touchstart', function(e) {
    $('.q-swipe-delete .q-buy-list > .q-buy-con').css('left', '0px'); // close em all
    $(e.currentTarget).addClass('open');
    x = e.originalEvent.targetTouches[0].pageX; // anchor point
});
$(document).delegate('.q-swipe-delete .q-buy-list > .q-buy-con','touchmove', function(e) {
    var change = e.originalEvent.targetTouches[0].pageX - x;
    change = Math.min(Math.max(-50, change), 0) // restrict to -100px left, 0px right
    $(this)[0].style.left = change + 'px';
    if (change < -10) disable_scroll(); // disable scroll once we hit 10px horizontal slide
    e.preventDefault();
});
$(document).delegate('.q-swipe-delete .q-buy-list > .q-buy-con','touchend', function(e) {
    var left = parseInt(e.currentTarget.style.left);
    var new_left;
    if (left < -35) {
        new_left = '-50px'
    } else if (left > 35) {
        new_left = '50px'
    } else {
        new_left = '0px'
    }
    // e.currentTarget.style.left = new_left
    $(e.currentTarget).animate({left: new_left}, 200)
    enable_scroll()
});
$(document).delegate('.q-buy-del','click', function(e) {
    e.preventDefault();
    $(this).parents('.q-buy-list').slideUp('fast', function() {
        $(this).remove()
    });
    $('.q-buy-js').find('em').html($('.q-swipe-delete input:checked').length);
});

//搜索切换
$('.searchtype a').click( function () {
    $('.searchtype ul').toggle();
    $('.searchtype em').toggleClass('hover');
})
var lival=$(".searchtype li");
$(".searchtype li").click(function(){
    var count=$(this).index();
    var Tresult=lival.eq(count-1).text();
    $(".searchtype a").html(Tresult);
    if (Tresult == '课程'){
        $('.searchvalue').attr('placeholder','请输入您想找的课程名称...')
    }else if (Tresult == '机构'){
        $('.searchvalue').attr('placeholder','请输入您想找的机构名称...')
    }else if (Tresult == '教师'){
        $('.searchvalue').attr('placeholder','请输入您想找的教师名称...')
    }else {
        $('.searchvalue').attr('placeholder','请输入您想找的课程名称...')
    };
    $('.searchtype ul').hide();
    $('.searchtype em').toggleClass('hover');
})
// 替换效果
$(document).ready(function() {
    var str = "508.00";
    str = str.replace('.','.<font style="font-size:10px;">') + '</font>';
    $('.z-summation label').html('合计：￥' + str);
});
// 判断简介是否出现点点点
function setheight(){
    if ($(".z-intro p").height() >= 72) {
        $(".unfold").show();
        $(".packup").hide();
        $(".z-intro p").addClass("webkit");
        $(".z-intro p").css('opacity','1');
    }else{
        $(".unfold").hide();
        $(".packup").hide();
        $(".z-intro p").css('opacity','1');
    };
};
// 展开
$(document).delegate(".unfold","click",function() {
    $(this).hide().siblings("p").removeClass("webkit");
    $(this).siblings("h3").show();
});
// 收起
$(document).delegate(".packup","click",function() {
    $(this).hide().siblings("p").addClass("webkit");
    $(this).siblings("h3").show();
});
//滚动
$(window).scroll(function(){
    Wscroll();

    //滚动到底
    if($(window).scrollTop() != 0){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
            switch ($('.in').eq(0).attr('id')){
                case 'morecourse':
                    morecoursevue.scrollstatus = 1;
                    morecoursevue.curpage += 1;
                    if(morecoursevue.goodstype == 'goods'){
                        morecoursevue.getmorecourse();
                    }else if(morecoursevue.goodstype == 'live'){
                        morecoursevue.getlivegoodslist();
                    };
                    break;
                case 'myorder':
                    myorderlistvue.scrollstatus = 1;
                    myorderlistvue.curpage += 1;
                    myorderlistvue.getmyorderlist(myorderlistvue.ordertype);
                    break;
                case 'mycourses':
                    courselistvue.scrollstatus = 1;
                    courselistvue.curpage += 1;
                    courselistvue.gettypecourse(courselistvue.tabtype,courselistvue.coursetype);
                    break;
                case 'q-goods':
                    goodsdetailvue.curpage += 1;
                    goodsdetailvue.getcommentjson();
                    break;
                case 'q-course':
                    coursedetailvue.curpage += 1;
                    coursedetailvue.getcommentjson();
                    break;
                case 'searchResult':
                    searchResultvue.scrollstatus = 1;
                    searchResultvue.curpage += 1;
                    if(searchResultvue.searchtype == 2){
                        searchResultvue.getunit();
                    }else if(searchResultvue.searchtype == 3){
                        searchResultvue.getteacher();
                    };
                    break;
                case 'agencyparticulars':
                    agencyparticularsvue.curpage += 1;
                    if(agencyparticularsvue.detailstype == 1){
                        agencyparticularsvue.getTeachersdetails();
                    }else if(agencyparticularsvue.detailstype == 2){
                        agencyparticularsvue.getunitdetails();
                    };
                default :
                    break;
            };
        };
    };
});
function Wscroll(){
    var scrollTop = $("body").scrollTop();
    var disH = $(".z-dis").height() + parseInt($(".z-dis").css("margin-bottom"));
    if (scrollTop > disH) {
        $("#agencyparticulars .z-jg").css("margin-top","5.8rem");
        $("#agencyparticulars .z-screening").css({"position":"fixed","top":"0"});
    }else{
        $("#agencyparticulars .z-jg").css("margin-top","1rem");
        if($(".screening").hasClass('up')){
            return false;
        };
        $("#agencyparticulars .z-screening").css("position","relative");
    };
};
// 关闭下拉
function closeoselect() {
    $(".screening").removeClass("up");
    $(".oselect").hide();
    $('html,body').css("overflow","auto");
    $(".z-shade").hide();
    $(".z-dis").show();
    // $(".z-screening").css({"position":"relative"});
    Wscroll();
};
// 筛选
$(document).delegate(".screening","click",function() {
    $(this).toggleClass("up").siblings().removeClass("up");
    $(this).siblings().children(".oselect").hide();
    $(this).children(".oselect").toggle();
    if ($(this).hasClass("up")) {
        $(this).parents(".page").find(".z-shade").show();
        $(this).parents(".page").find(".z-dis").hide();
        $('html,body').css({"overflow":"hidden"});
        $(this).parents(".page").find(".z-screening").css({"position":"fixed","top":"0"});
    }else{
        closeoselect();
    };
    // 阻止冒泡
    $(".oselect").click(function(event) {
        event.stopPropagation();
    });
    // 选择自己
    $('.check').delegate("a","click",function(){
        var marqueehtml = $(this).parent().siblings().children('.active').find('marquee').html();
        $(this).parent().siblings().children('.active').html(marqueehtml);
        $(this).map(function() {
            if (this.offsetWidth < this.scrollWidth) {
                var html = $(this).html();
                html = '<MARQUEE scrollAmount="2">'+ html + '</MARQUEE>';  //文字滚动
                $(this).html(html);
            };
        });
        $(this).addClass("active").parent().siblings().children().removeClass("active");

        var _this = $(this);
        //set next all is active
        var nextfilter = $(this).parents('.directfilter').nextAll('.directfilter');
        if(nextfilter.length > 0){
            for(var i=0; i<nextfilter.length; i++){
                var marqueehtml = nextfilter.eq(i).find('.active').find('marquee').html();
                if(marqueehtml){
                    nextfilter.eq(i).find('.active').html(marqueehtml);
                };
                nextfilter.eq(i).find('a').eq(0).addClass('active').parent().siblings().find('a').removeClass('active');
            };
        };
    });
    // 键盘出来时判断高度
    $(window).resize(function() {
        var H = parseInt($("body").height()) - parseInt($(".screening").height());
        if (H  < $(".filtrate").height()) {
            $(".filtrate").css("height",H+'px');
        }else{
            $(".filtrate").css("height",'40rem');
        };
    });
});

// 换字
$(".oselect li").click(function() {
    $(this).parents(".screening").find("label").html($(this).html());
    closeoselect();
});

//浏览器点击回退按钮时触发的事件
window.onpopstate = function(){
    // console.log($('#agencyparticulars').hasClass('in'));
    // if($('#agencyparticulars').hasClass('in')){

    // };
    closeoselect();

};





//弹窗
function showMask(id){
    //showMaskBg(); 因为有弹窗嵌套的情况，黑色背景可能不需要
    var popups=$(id);
    var iTop=( $(window).height() - popups.height() ) /2  ;
    popups.css('top',iTop).show();
    $('body').css('overflow','hidden');
    var h = popups.find(".cons").height() /2;
    popups.find(".cons").css('margin-top','-' + h + 'px');
    popups.find('.closeA').click(function(){
        $('.mask').hide();
        popups.hide();
        $('body').css('overflow','auto')
    });
};

function catalogmore(_this) {
    _this.parents('.q-catalog-h1').next('ul').toggle();
    _this.toggleClass('active');
};
//评星
$(document).delegate(".q-star a","click",function() {
    var num = $(this).index()+1;
    $(this).parent().attr("class", "q-star s"+num);
});
$(document).delegate("#q-evaluate .q-evaluate-tab a","click",function() {
    $(this).toggleClass("active");
});
//字数限制
$(document).delegate('.q-evaluate textarea','input',function(){
    var ta = $(this), p = ta.parent(), ml = parseInt(ta.attr('maxlength')), v = ta.val(), h = ta.attr('placeholder');
    if (v == h) v = '';
    p.css({'position': 'relative'});
    if (v.length > ml) {
        ta.val(v.substring(0, ml))
    }
    $("#number").text(ml - ta.val().length);
});

// 换页面
// 我的课程
function curriculum() {
    window.location.href = '#&mycourses';
    setTitle('我购买的课程','99');
    if(backarr.length == 0){
        setbacktitle('生命大学','0','q-home')
    };
};
// 购物车
function shopcart() {
    window.location.href = '#&q-buycart';
    setTitle('购物车','2');
    setTimeout(function(){
        buycartvue.getbuycartlist();
    },300);
    if(backarr.length == 0){
        setbacktitle('生命大学','0','q-home')
    };
};
// 我的订单
function myorder() {
    window.location.href = '#&myorder';
    setTitle('我的订单','99');
    if(backarr.length == 0){
        setbacktitle('生命大学','0','q-home')
    };
};
// 立即购买订单
function instantorder() {
    window.location.href = '#&instantOrder';
    setTitle('确认订单','99');
};
// 确认订单
function clearing() {
    if($('#q-buycart').hasClass('in')){
        if($('.q-buy-rad input:checked').length == 0){
            mall.layout.alert('提示','还没有选择商品！');
            return false;
        }else{
            window.location.href = '#&confirmOrder';
            setTitle('确认订单','99');
            setbacktitle('购物车','2','q-buycart');
        };
    }else{
        window.location.href = '#&confirmOrder';
        setTitle('订单详情','99');
        setbacktitle('我的订单','99','myorder');
    };
};

//提交订单
function sebmitorder(){
    window.location.href = '#&orderdetail';
    setTitle('订单详情','99');
    setbacktitle('确认订单','99','confirmOrder');
};

// 搜索
function Search() {
    setTitle('搜索','99');
    if(backarr.length == 0){
        setbacktitle('生命大学','0','q-home');
    };
    window.location.href = '#&q-search';
    if(window.localStorage.coursehistory){
        var arr = window.localStorage.coursehistory.split(',');
        var html = '';
        for(var i=0; i<arr.length; i++){
            html += '<a href="#" onclick="searchvue.search(\''+arr[i]+'\');setTitle(\'搜索结果\',\'99\');">'+arr[i]+'</a>';
            $('#coursehistory').html(html);
        };
    };
    if(window.localStorage.unithistory){
        var arr = window.localStorage.unithistory.split(',');
        var html = '';
        for(var i=0; i<arr.length; i++){
            html += '<a href="#" onclick="searchvue.search(\''+arr[i]+'\');setTitle(\'搜索结果\',\'99\');">'+arr[i]+'</a>';
            $('#unithistory').html(html);
        };
    };
    if(window.localStorage.teacherhistory){
        var arr = window.localStorage.teacherhistory.split(',');
        var html = '';
        for(var i=0; i<arr.length; i++){
            html += '<a href="#" onclick="searchvue.search(\''+arr[i]+'\');setTitle(\'搜索结果\',\'99\');">'+arr[i]+'</a>';
            $('#teacherhistory').html(html);
        };
    };
    if(window.localStorage.livehistory){
        var arr = window.localStorage.livehistory.split(',');
        var html = '';
        for(var i=0; i<arr.length; i++){
            html += '<a href="#" onclick="searchvue.search(\''+arr[i]+'\');setTitle(\'搜索结果\',\'99\');">'+arr[i]+'</a>';
            $('#livehistory').html(html);
        };
    };
};
// 搜索结果
function searchflsh() {
    setTitle('搜索结果','99');
    setbacktitle('搜索','99','q-search');
    window.location.href = '#&searchResult';
};

//删除localstorage
function dellocalstorage(){
    if(searchvue.searchtype == 1){
        window.localStorage.removeItem('coursehistory');
        $('#coursehistory').html('');
    }else if(searchvue.searchtype == 2){
        window.localStorage.removeItem('unithistory');
        $('#unithistory').html('');
    }else if(searchvue.searchtype == 3){
        window.localStorage.removeItem('teacherhistory');
        $('#teacherhistory').html('');
    };
};

// 更多课程
function morecourse() {
    if($('#q-search').hasClass('in')){
        setTitle('搜索结果','99');
        setbacktitle('搜索','99','q-search');
    }else{
        setTitle('名师课堂','99');
        setbacktitle('生命大学','0','q-home');
    };
    window.location.href = '#&morecourse';
};
// 直播课程
function morelive() {
    if($('#q-search').hasClass('in')){
        setTitle('搜索结果','99');
        setbacktitle('搜索','99','q-search');
    }else{
        setTitle('直播课程','99');
        setbacktitle('生命大学','0','q-home');
    };
    window.location.href = '#&morecourse';
};
// 机构老师详情
function agencyparticulars(_this) {
    setTitle(_this.attr('data-name').replace('<font class="red">','').replace('</font>',''),'99');
    setbacktitle('搜索结果','99','searchResult');
    window.location.href = '#&agencyparticulars';
};
// 课程详情
function courseDetails(_this) {
    window.location.href = '#&q-course';
};
// 商品详情
function goodsDetails(_this) {
    setTitle(_this.attr('data-name').replace('<font class="red">','').replace('</font>',''),buycartvue.status);
    if(backarr.length > 1){
        setbacktitle('搜索结果','99','morecourse');
    }else{
        setbacktitle('名师课堂','99','morecourse');
    };
    window.location.href = '#&q-goods';
};
// 课程评价
function evaluation(_this) {
    $('.q-evaluate-star .q-star').attr('class','q-star s0');
    $('.q-evaluate textarea').val('');
    setTitle('课程评价','3');
    if($('#q-goods').hasClass('in')){
        setbacktitle(_this.attr('data-title'),buycartvue.status,'q-goods');
    }else if($('#q-course').hasClass('in')){
        setbacktitle(_this.attr('data-title'),'99','q-course');
    };
    window.location.href = '#&q-evaluate';
};


//查询价格区间
function locating(_this) {
    var input1 = _this.parents('.filtrate').find('.rmb').eq(0);
    var input2 = _this.parents('.filtrate').find('.rmb').eq(1);
    if (input1.val() == '' && input2.val() == '') {

    }else{
        var val1 = parseInt(input1.val()) || 0;
        var val2 = parseInt(input2.val()) || 0;
        if(val1 < val2){
            input1.val(val1);
            input2.val(val2);
        }else{
            input1.val(val2);
            input2.val(val1);
        };
    };
};

// 重置
function reset(_this) {
    var check = _this.parents('.filtrate').children('.filter-req').children('.check');
    var marqueediv = check.children('.box').find('.active').find('marquee');
    for(var i=0; i<marqueediv.length; i++){
        var html = marqueediv.eq(i).html();
        marqueediv.eq(i).parent().html(html);
    };
    check.children('.box').find('a').removeClass('active');
    check.each(function(){
        $(this).children('.box').eq(0).find('a').addClass('active');
    });
    _this.parents('.filtrate').find('.rmb').val('');
};

//后退
var backarr = [];
function goback(){
    mall.layout.hide();
    $('input,textarea').blur();
    if($('.z-tck').is(':visible')){
        $('.z-tck').hide();
    };
    if(backarr.length > 0){
        window.location.href = '#&'+backarr[0].id;
        setTitle(backarr[0].title,backarr[0].state);
        backarr.shift();
    }else{
        destroylife('0');
    };
    if($('video').length > 0){
        $('.page video').eq(0)[0].pause();
        $('.q-play').remove();
        $('head').find('div').remove();
    };
};

document.addEventListener("backbutton", goback, false);
function setbacktitle(title,state,id){
    var json = {};
    json.title = title;
    json.id = id;
    json.state = state;
    backarr.unshift(json);
};
function setinittitle(){
    setTitle('生命大学','0');
    backarr = [];
};

//支付结果返回
function setpaystate(type){
    $('.z-tck').hide();
    setTitle('订单详情','99');
    backarr = [];
    setbacktitle('生命大学','0','q-home');
    setbacktitle('我的订单','99','myorder');
    var orderid = $('#z-payment').attr('data-orderid');
    orderdetailvue.getorderlist(orderid);
    window.location.href = '#&orderdetail';
    if(type == '0'){
        showMask('#z-failure');
        $('#z-failure').find('a').eq(0).attr('href','javascript:resetpay();');
        $('#z-failure').find('a').eq(1).attr('href','javascript:cancelorder("'+orderid+'");');
    }else if(type == "1"){
        showMask('#z-succeed');
        myorderlistvue.getmyorderlist(2);
        $('#z-succeed').find('a').eq(0).attr('href','javascript:gostudy();');
    }else{
        mall.layout.alert('提示','返回参数有误');
    };
};
function resetpay(){
    $('#z-failure').hide();
    showMask('#z-payment');
};
function cancelorder(numid){
    orderdetailvue.cancelmyorder(numid);
};
function gostudy(){
    $('.z-tck').hide();
    courselistvue.loading = true;
    setTimeout(function(){
        courselistvue.gettypecourse(1,'course',true);
        courselistvue.getmycoursecount();
    },300);
    setTitle('我购买的课程','99');
    setbacktitle('订单详情','99','orderdetail');
    window.location.href = '#&mycourses';
};

//回车键搜索
$(document).keydown(function(event){
    if($('.searchvalue').is(":focus")){
        if(event.keyCode == 13){
            var keyword = $('.searchvalue').val();
            searchvue.search(keyword);
            $('input,textarea').blur();
        };
    };
});








//自定义弹窗
var mall = {};
mall.layout =
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

        mall.layout.ccallback = opts.cancelcallback;
        var html = "<div style=\" \" id=\"globallayoutbg\"></div><div id=\"globallayout\"  style='width:" + opts.width + "px'>" +
            "<div class='globallayout_title'><span title='关闭'  id='globallayout_close'>X</span><h1 id='globallayout_title'>" + opts.title + "</h1></div>" +
            "<div id='globallayout_infocontent'><div class='globallayout_content' id='globallayout_infocontent_content' style='max-height: "+opts.height+"px; overflow-y: auto'>" + opts.content + "</div>";
        //if (opts.isshowbutton) {
        html = html + "<div class='globallayout_footer'><button type=\"button\" class=\"btn\"  id=\"globallayoutcancelbtn\">取消</button><button type=\"button\" class=\"btn btn-success\" id='globallayoutsavebtn'>" + opts.surebuttonname + "</button></div>";
        // }
        html = html + " </div>";
        html=html+ "<div id='globallayout_infomessage'><div class='globallayout_content ajax'></div>";
        html = html + "<div class='globallayout_footer'><button type=\"button\" class=\"btn btn-default\" onclick=\"mall.layout.hide()\">取消</button><button type=\"button\" class=\"btn btn-success\" id='globallayoutalertsurebutton'>确定</button></div>";
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
        $("#globallayout_close").bind("click", function () { opts.cancelcallback(); mall.layout.hide(); });
        $("#globallayoutcancelbtn").unbind();
        $("#globallayoutcancelbtn").bind("click", function () { opts.cancelcallback(); mall.layout.hide(); });
        $("#globallayoutsavebtn").unbind();
        $("#globallayoutsavebtn").bind("click", function () { opts.callback(); });
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { mall.layout.hide()});
    },
    messageinit: function (title)
    {
        if (!document.getElementById("globallayout")) {
            if (typeof title == "undefined") title = "消息提示";
            mall.layout.init({ title: title });
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
        mall.layout.messageinit("消息提示");

        $("#globallayout_infomessage").find(".globallayout_content").addClass("ajax");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayout_infomessage").find(".globallayout_footer").css("display", "none");
    },
    success: function (message, url)
    {
        if (typeof message == "undefined") message = "操作成功";
        mall.layout.messageinit("消息提示");
        $("#globallayout_infomessage").find(".globallayout_content").addClass("ok");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () { mall.layout.hide() });
        url = url || 2000;
        if (typeof url=="number")
            setTimeout(mall.layout.hide, url);
        else
            location.href = url;
    },
    error: function (message, autodisplay)
    {

        if (typeof message == "undefined") message = "操作异常";
        mall.layout.messageinit("消息提示");

        $("#globallayout_infomessage").find(".globallayout_content").addClass("error");
        $("#globallayout_infomessage").find(".globallayout_content").html("" + message);
        $("#globallayoutalertsurebutton").unbind();
        $("#globallayoutalertsurebutton").bind("click", function () {  mall.layout.hide() });
        if (typeof autodisplay == "number") {
            //autodisplay = 5000;
            setTimeout(mall.layout.hide, autodisplay);
        }
    },
    alert: function (title, message, callback,autodisplay)
    {
        if (typeof message == "undefined") message = "";
        mall.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        //$("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { mall.layout.hide(); });
        $("#globallayoutalertsurebutton").bind("click", function () { mall.layout.hide(); callback(); });
        if (typeof autodisplay == "number") {
            //autodisplay = 5000;
            setTimeout(mall.layout.hide, autodisplay);
        }
    },
    confirm: function (title, message, callback) {
        if (typeof message == "undefined") message = "";
        if (typeof title == "function") title='提示';
        if (typeof message == "function") message='';
        mall.layout.messageinit(title);
        $("#globallayout_infomessage").find(".globallayout_content").addClass("info");
        $("#globallayout_infomessage").find(".globallayout_content").html(message);
        $("#globallayout_infomessage").find(".globallayout_footer").find("button").eq(0).css("display", "");
        $("#globallayoutalertsurebutton").unbind();
        if (typeof callback != "function") callback = (function () { mall.layout.hide();});
        $("#globallayoutalertsurebutton").bind("click", function () { mall.layout.hide(); callback();});

    },
    hide: function ()
    {
        $("#globallayout").fadeOut("slow");
        $("#globallayoutbg").fadeOut("slow");

    }
};

// 滚动到底
//$(window).scroll(function(){
//    if($(window).scrollTop() != 0){
//        if($(window).scrollTop() == $(document).height() - $(window).height()){
//            switch ($('.in').eq(0).attr('id')){
//                case 'morecourse':
//                    morecoursevue.curpage += 1;
//                    morecoursevue.getmorecourse();
//                    break;
//                default :
//                    break;
//            };
//        };
//    };
//});