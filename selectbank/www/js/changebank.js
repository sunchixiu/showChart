var $divhtml = '<div class="page out" id="changebank"><div class="tab_fixed" style="display: block;"><div class="city"><label><a href="#&homePage" data-rel="back">返回</a></label></div></div><div class="bank_k"><div class="bank_txt"><label>选择银行：</label></div><div class="banks m index1" id="headbank"></div></div><div class="bank_btn m"><input class="btn input_btn" type="button" value="进入" onclick="selectBank();"></div></div>';

$('body').append($divhtml);

var headbank = '<select name="bank" class="bank1 pickout" placeholder="选择银行"><option value="gsyh">工商银行</option><option value="zsyh">招商银行</option><option value="nyyh">农业银行</option><option value="zgyh">中国银行</option><option value="jsyh">建设银行</option><option value="bjyh">北京银行</option></select>';

$('#headbank').append(headbank);

pickout.to({
    el:'.bank1',
    theme: 'dark',
    search: true
});
pickout.updated('.bank1');

//ajax获取支行列表
function getBanks(index){
    var index = parseInt(index);
    var num = document.querySelectorAll('.banks').length;
    if(index < num){
        for(var i=0; i<num; i++){
            if(i+1 > index){
                removeElement(document.querySelectorAll('.banks')[index]);
            };
        };
    };

    //ajax获取的银行列表
    var banks = '<select name="bank" class="bank'+(index+1)+' pickout" placeholder="继续选择支行"><option value="nyyh">农业银行</option><option value="zgyh">中国银行</option><option value="jsyh">建设银行</option><option value="bjyh">北京银行</option><option value="gsyh">工商银行</option><option value="zsyh">招商银行</option></select>';

    var newdiv = document.createElement("div");
    newdiv.className = 'banks m index'+(index+1);
    newdiv.innerHTML = banks;
    document.querySelector('.bank_k').appendChild(newdiv);
    pickout.to({
        el:'.bank'+(index+1),
        theme: 'dark'
    });
};

function selectBank(){
    //切换银行
    window.location.href = "#&homePage";
};

function removeElement(_element){
    var _parentElement = _element.parentNode;
    if(_parentElement){
        _parentElement.removeChild(_element);
    }
};
