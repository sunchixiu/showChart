/**
 * Created by Wilson on 2016/3/25.
 */
videoListApp.controller("videoListCtrl",function($scope,$http,$sce) {
    $scope.bookArr = [
        {bookName: '数学0'}, {bookName: '英语1'}, {bookName: '语文2'}, {bookName: '数学3'}
    ];

    $scope.renderFinish = function () {
        childLayout();
    };

    $scope.pointArr = [
        {
            pointName: '第一章',
            pointContent: [{name: '第一课时名'}, {name: '第二课时名'}, {name: '第三课时名'}, {name: '第四课时名'}, {name: '第五课时名'}, {name: '第六课时名'}]
        },
        {pointName: '第二章', pointContent: [{name: '第一课时名'}, {name: '第二课时名'}, {name: '第三课时名'}, {name: '第四课时名'}]}
    ];

    //跳转页面
    var t1 = null; //解决点击两次问题
    $scope.popDiv = function (index, str, _this) {
        if (t1 == null){
            t1 = new Date().getTime();
        }else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 500){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        };//解决双击问题

        if (_this) {
            _pointid = _this.attr('data-pointid');
            _unitid = _this.attr('data-unitid');
            _termid = _this.attr('data-termid');
            _versionid = _this.attr('data-versionid');
            _gradeid = _this.attr('data-gradeid');
        }
        ;

        if (index == 1) {
            window.location.href = '#&page1';
        } else if (index == 2) {
            //$('#AudioclassName').html(str);
            $scope.bookName = str;
            window.location.href = '#&page2';
            $scope.ajaxVideo('100464325', '2016-1-28');
            playVideo();
        } else if (index == 3) {
            window.location.href = '#&page2_2';
        }
        ;
    };

    //$scope.ifshow = false;
    $scope.ajaxVideo = function (iinum, date){
        $http({
            method: 'post',
            url: 'http://182.48.115.253:71/TSB_ISCHOOL_LCS_SERVER/stulessonwork/getstulessonwork',
            data: {"iinum": iinum, "date": date}
        }).success(function (req) {
            $scope.videoUrl = $sce.trustAsResourceUrl('http://images.sohu.com/ytv/SH/Coke/64036020120714021103.mp4');
            $scope.ifshow = true;
            alert(req.code);
        });
    };
});

//post参数设置
videoListApp.config(function($httpProvider) {
    //$httpProvider.defaults.transformRequest = function (obj) {
    //    var str = [];
    //    for (var p in obj) {
    //        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //    }
    //    return str.join("&");
    //};
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/json; charset=UTF-8'
    };
});

//ng-repeat渲染结束
videoListApp.directive('repeatFinish',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                //console.log('ng-repeat执行完毕')
                scope.$eval( attr.repeatFinish )
            }
        }
    }
});

