/**
 * Created by Cyril on 13-12-31.
 */
$(document).ready(function(){
    $('.select').find('.toggle_down,.selected').on("click",function(){
        $(this).parent().toggleClass('open')
    }).end().find(".option").on("click",function(){
            $(this).parents('.select').find('.option').removeClass('active');
            $(this).addClass("active");
            $(this).parents('.select').find('.selected').text($(this).text()).end().removeClass("open")
        })
    $('.toggle_sort').on('click',function(){
        $(".items_list").toggleClass("list");
        $(this).toggleClass('list');
    });
    $('.check_more_items').on('click',function(){
        var _this = this;
        if($(_this).hasClass('loaded')){
            $(_this).html($(_this).attr('data-content'));
            $('.hasLarge ul.items').find('li').slice(5,13).remove();
            $(_this).removeClass('loaded');
        }else{
            $.ajax({
                url:"jiaoan_more.html",
                method: 'GET',
                dataType:"html",
                beforeSend: function(){
                    $(_this).attr("data-content",$(_this).html());
                    $(_this).text('Loading...');
                },
                success: function(e){
                    $(e).appendTo('.hasLarge ul.items');
                    $(_this).text("折叠").addClass('loaded');
                },
                error: function(){
                    alert('Error!');
                }
            })
        }
    });
    $('ul.jiaoan_items li').hover(function(){
        rightWidth = 1170 - $(this).offset().left + $('.main').offset().left;
        var left = rightWidth > 800? 325: -451;
        $(this).find('.hover_show_box .modal').show().removeClass('hide').removeClass('fade').css({
            "top":'0',
            "left": left
        });
    },function(){
        $(this).find('.hover_show_box .modal').fadeOut();
    });

//    View Homework Complication Status
    $("#complateStatus").find(".class_group ul.class_list li a").on('click',function(){
        $.ajax({
            url:'xuesheng_homework_status.html',
            method:"GET",
            dataType:"html",
            success: function(data){
                $('#complateStatus').find('.modal-body .class_group').hide();
                $("#complateStatus").addClass('wide').find('.modal-body').append($(data));
            }

        });
        return false
    });
    window.backToStuList = function backToStuList(){
        $("#complateStatus").removeClass('wide').find('.homework_content').remove().end().find('.backToStuList').remove().end().find('.class_group').fadeIn();
    };

    $('#application_trigger').hover(function(){
        $("#application").modal("show");
    },function(){});
    $('#application').find('.modal-body').on('click',function(e){
        console.log(e);
        if(e.originalEvent.target.nodeName!="A"|| $(e.originalEvent.target).parent()[0].nodeName == "A"){
            $("#application").modal("hide");
        }
    });

    window.selectToGo = window.selectToGo||function(a){window.location = $(a).attr('href');};
    $(function(){
    	  var hash = window.location.hash;
    	  hash && $('ul.nav a[href="' + hash + '"]').tab('show');
    	  $('.nav-tabs a').click(function (e) {
    	    $(this).tab('show');
    	    var scrollmem = $('body').scrollTop();
    	    window.location.hash = this.hash;
    	    $('html,body').scrollTop(scrollmem);
    	  });
    	});

});