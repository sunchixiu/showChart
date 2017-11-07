
var examenginemobile = {
    bindevent: function () {
        $(".equestion").hide();
        $(".subquestion").hide();
        $(".equestion").eq(examengine.singleindex).show();
        $(".subquestion").eq(examengine.singleindex).show();

        var ifradio = '';
        if (examengine.status == 'piyue') {
            ifradio = $(".equestion").eq(examengine.singleindex).find('.subquestion').eq(0).attr('data-isobjective');
            showhideradio(ifradio, examengine.singleindex);
        };
        $(".subquestion").on("swiperight", function () {
            $(".subquestion").hide();
            var _bigid = $(".subquestion").eq(examengine.singleindex).parent().attr("data-id");
            if (examengine.singleindex <= 0)
                examengine.singleindex = 0;
            else
                examengine.singleindex = examengine.singleindex - 1;
            var _newbigid = $(".subquestion").eq(examengine.singleindex).parent().attr("data-id");
            if (_bigid != _newbigid) {
                $(".equestion[data-id='" + _bigid + "']").hide();
                $(".equestion[data-id='" + _newbigid + "']").show();
            }
            $(".subquestion").eq(examengine.singleindex).show();
            if (examengine.status == 'piyue') {
                ifradio = $(this).attr('data-isobjective');
                showhideradio(ifradio, examengine.singleindex);
            };
        }).on("swipeleft", function () {
            $(".subquestion").hide();
            var _bigid = $(".subquestion").eq(examengine.singleindex).parent().attr("data-id");
            if (examengine.singleindex >= $(".subquestion").length - 1)
                examengine.singleindex = $(".subquestion").length - 1;
            else
                examengine.singleindex = examengine.singleindex + 1;
            var _newbigid = $(".subquestion").eq(examengine.singleindex).parent().attr("data-id");
            if (_bigid != _newbigid)
            {
                $(".equestion[data-id='" + _bigid + "']").hide();
                $(".equestion[data-id='" + _newbigid + "']").show();
            }
            $(".subquestion").eq(examengine.singleindex).show();

            if (examengine.status == 'piyue') {
                ifradio = $(this).attr('data-isobjective');
                showhideradio(ifradio, examengine.singleindex);
            };
        });


    },

    //获取评论点赞
    commentscontent : '',
    getcomments : function (id) {
        if (examenginemobile.commentscontent != '') {
            var commentsarr = examenginemobile.commentscontent.comments;
            var html = '';
            var delhtml = '';
            if (examengine.status == 'piyue') {
                delhtml = '<i class="del" onclick="$(this).parent().parent().remove();"></i>';
            };
            alert(id + ',' + commentsarr[i].ownerid);
            for (var i = 0; i < commentsarr.length; i++) {
                if (commentsarr[i].ownerid == id) {
                    if (commentsarr[i].type == '1') {
                        html = html + '<div class="gooddiv"><span class="good"></span></div>';
                    } else if (commentsarr[i].commenttype == '2') {
                        html = html + '<div><p class="voice voicestop"><span></span><i class="voicetime"></i><i class="voicetime"><label></label>”</i>' + delhtml + '</p><audio src="' + commentsarr[i].comment + '"></audio></div>';
                    } else if (commentsarr[i].commenttype == '1') {
                        html = html + '<div><p><label>' + commentsarr[i].comment + '</label>' + delhtml + '</p></div>';
                    };
                };
            };
            return html;
        } else {
            return '';
        };
    },

    //获取老师批阅但没提交的分数
    piyuescorejson : '',
    getpiyuescore:function(id){
        var piyuescore = '';
        if (examenginemobile.piyuescorejson != '') {
            var piyuescorearr = examenginemobile.piyuescorejson.answerbean.ans;
            for(var i=0; i<piyuescorearr.length; i++){
                if(piyuescorearr[i].queid == id){
                    piyuescore = piyuescorearr[i].score;
                };
            };
        };
        return piyuescore;
    }
}

//是否显示录音录入框
function showhideradio(state) {
    if (state == 'false') {
        //alert('显示录音输入框');
    } else {
        //alert('隐藏录音输入框');
    };
};


//拍照
var pictureSource;		//图片来源
var destinationType;		//设置返回值的格式

// 等待PhoneGap连接设备
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap准备就绪，可以使用！
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
};

var obj = null;
function capturePhoto(_this) {
    obj = _this;
    // 使用设备上的摄像头拍照，并获得Base64编码字符串格式的图像
    //navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: 0 });//base64
    if ($(".equestion").eq(examengine.singleindex).find('.addphoto li').length > 9) {
        alert('最多上传9张图片！');
        return false;
    };
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
};


function onPhotoDataSuccess(imageData) {
    // 取消注释以查看Base64编码的图像数据
    uploadPhoto(imageData);
}
// 当有错误发生时触发此函数
function onFail(mesage) {
    alert('Failed because: ' + message);
};

//上传图片
function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey = "uploadfile";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.userid = "36cd5422826e4c80846b0206be2503c9";

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, testurl + "/Home/Interface/uploadfile", win, fail, options);
}

function win(r) {
    var imgurl = JSON.parse(r.response).data.url;
    var lihtml = '<li><span onclick="$(this).parent().remove();"></span><img src="' + imgurl + '"></li>';

    obj.parent().prepend(lihtml);
}

function fail(error) {
    alert("上传失败" + error);
};


//插入文本
function addtext(str) {
    var html = "<div><p><label>" + str + "</label><i class='del' onclick='$(this).parent().parent().remove();'></i></p></div>";
    $('.examparts').find('.equestion').eq(examengine.singleindex).find('.radiophoto').append(html);
};

//插入音频
function addvoice(url, timenum) {
    var html = "<div><p class='voice voicestop'><span></span><i class='voicetime'></i><i class='voicetime'><label>" + timenum + "</label>”</i><i class='del' onclick='$(this).parent().parent().remove();'></i></p><audio src='" + url + "'></audio></div>";
    $('.examparts').find('.equestion').eq(examengine.singleindex).find('.radiophoto').append(html);
};

//播放声音
$(document).delegate('.voicestop', 'click', function () {
    var _this = $(this);
    $(this).attr('class', 'voice voiceplay');
    var myVid = $(this).next('audio').eq(0)[0];
    myVid.play();
    myVid.onended = function () {
        _this.attr('class', 'voice voicestop');
    };
});

//点赞
function adddelgood() {
    if ($('.examparts').find('.equestion').eq(examengine.singleindex).find('.gooddiv').length == 0) {
        var html = "<div class='gooddiv'><span class='good'></span></div>";
        $('.examparts').find('.equestion').eq(examengine.singleindex).find('.radiophoto').prepend(html);
    } else {
        $('.examparts').find('.equestion').eq(examengine.singleindex).find('.gooddiv').eq(0).remove();
    };
};