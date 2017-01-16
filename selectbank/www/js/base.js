/**
 * Created by wilson on 2016/7/31.
 */
document.addEventListener('touchstart', function(){});
document.documentElement.style.fontSize=document.documentElement.clientWidth/36+'px';
document.onselectstart = function(){
    return false;
};

function addClass(obj, cls){
    var obj_class = obj.className;
    var blank = (obj_class != '') ? ' ' : '';
    var added = obj_class + blank + cls;
    obj.className = added;//替换原来的 class.
};

function removeClass(obj, cls){
    var obj_class = ' '+obj.className+' ';
    obj_class = obj_class.replace(/(\s+)/gi, ' ');
    var removed = obj_class.replace(' '+cls+' ', ' ');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    obj.className = removed;//替换原来的 class.
};

function hasClass(obj, cls){
    var obj_class = obj.className;
    var obj_class_lst = obj_class.split(/\s+/);
    var x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {
            return true;
        }
    }
    return false;
};

function removeElement(_element){
    var _parentElement = _element.parentNode;
    if(_parentElement){
        _parentElement.removeChild(_element);
    }
};