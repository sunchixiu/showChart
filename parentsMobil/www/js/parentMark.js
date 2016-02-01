/**
 * Created by Wilson on 2016/1/20.
 */
//        alert(document.documentElement.clientHeight);
//        $('.js-signature').attr('data-height',window.innerHeight);

function popMark(subjectId,workid){
    $(document.body).append('' +
    '<div id="bgMark" class="bgMark">' +
        '<div class="js-signature" data-width="100%" data-height="200" data-border="1px solid #999" data-line-color="#333" data-auto-fit="true"></div>' +
        '<div class="canvas_btn">' +
            '<ul>' +
                '<li><button id="clearBtn" onclick="clearCanvas();">清除</button></li>' +
                '<li><button id="saveBtn" onclick=saveSignature('+subjectId+',"'+workid+'") class="confirm" disabled>确定</button></li>' +
                '<li><button id="cancelBtn" onclick="cancelMark();">取消</button></li>' +
            '</ul>' +
        '</div>' +
    '</div>' +
    '');

    setTimeout(function(){
        $('#bgMark').css({'opacity':1});
        $('.js-signature').attr('data-height',(window.innerHeight - 46));
        $('.js-signature').jqSignature();

        $('.js-signature').on('jq.signature.changed', function() {
            $('#saveBtn').attr('disabled', false);
            $('#saveBtn').removeClass('confirm');
        });
    },10);
};
function clearCanvas() {
    $('.js-signature').jqSignature('clearCanvas');
    $('#saveBtn').attr('disabled', true);
    $('#saveBtn').addClass('confirm');
};

function saveSignature(subjectId,workid) {
    var dataUrl = $('.js-signature').jqSignature('getDataURL');
    //alert(dataUrl);
    $(document.body).append('' +
    '<div class="attention" id="attention"><label>正在提交签名...</label></div>' +
    '');

    $.ajax({
        url:websiteurl + '/TSB_ISCHOOL_LCS_SERVER/stulessonwork/dofamsignwork',
        type:'post',
        dataType:'json',
        data:JSON.stringify({"workid":workid,"stuid":studentid,"sign":dataUrl}),
        contentType: "application/json; charset=utf-8",
        success:function(data){
            $('#attention > label').html('签名提交成功');
            $('input.mark_btn[data-workid = "'+workid+'"]').attr({'data-url':dataUrl}).val('签名完毕').removeClass('mark_btn').addClass('markal_btn');
            $('input[data-workid = "'+workid+'"]').attr('onclick','popImg("'+dataUrl+'")');

            $('#attention > label').css('opacity','0');
            cancelMark();
            $('#attention').remove();
        },
        error:function(data){
            $('#attention > label').html('签名提交失败');
            $('#attention > label').css('opacity','0');
            $('#attention').remove();
        }
    });
};

function cancelMark(){
    $('#bgMark').css({'opacity':0});
    setTimeout(function(){
        $('#bgMark').remove();
    },300);

};


function popImg(picUrl){
    $(document.body).append('' +
    '<div id="bgMark" class="bgMark">' +
        '<div class="js-signature" style="background: #fff;"><img src="'+picUrl+'"></div>' +
            '<div class="canvas_btn">' +
                '<ul>' +
                    '<li><button id="cancelBtn" onclick="cancelMark();" style="margin-top: 6px;">取消</button></li>' +
                '</ul>' +
        '</div>' +
    '</div>' +
    '');

    setTimeout(function(){
        $('#bgMark').css({'opacity':1});
        $('.js-signature').attr({'height':(window.innerHeight - 52)});
    },10);
};
