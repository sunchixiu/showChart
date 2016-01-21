/**
 * Created by Wilson on 2016/1/20.
 */
//        alert(document.documentElement.clientHeight);
//        $('.js-signature').attr('data-height',window.innerHeight);

function popMark(subjectId){
    $(document.body).append('' +
    '<div id="bgMark" class="bgMark">' +
        '<div class="js-signature" data-width="100%" data-height="200" data-border="1px solid #999" data-line-color="#333" data-auto-fit="true"></div>' +
        '<div class="canvas_btn">' +
            '<ul>' +
                '<li><button id="clearBtn" onclick="clearCanvas();">清除</button></li>' +
                '<li><button id="saveBtn" onclick="saveSignature('+subjectId+');" class="confirm" disabled>确定</button></li>' +
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

function saveSignature(subjectId) {
    var dataUrl = $('.js-signature').jqSignature('getDataURL');
    //alert(dataUrl);
    $(document.body).append('' +
    '<div class="attention" id="attention"><label>正在提交签名...</label></div>' +
    '');
    $.ajax({
        url:'',
        type:'post',
        data:{},
        success:function(data){
            setTimeout(function(){
                $('#attention > label').html('签名提交成功');
                $('input.mark_btn[data-subject = "'+subjectId+'"]').val('签名完毕').removeClass('mark_btn').addClass('markal_btn').attr('data-url',dataUrl);
                setTimeout(function(){
                    $('#attention > label').css('opacity','0');
                    cancelMark();
                    $('#attention').remove();
                },1000);
            },2000);
        },
        error:function(data){
            //alert(data);
            setTimeout(function(){
                $('#attention > label').html('签名提交成功');
                $('input.mark_btn[data-subject = "'+subjectId+'"]').val('签名完毕').removeClass('mark_btn').addClass('markal_btn').attr('data-url',dataUrl);
                setTimeout(function(){
                    $('#attention > label').css('opacity','0');
                    cancelMark();
                    $('#attention').remove();
                },1000);
            },2000);
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
