var loader=$('#preloader');
loader.fadeOut();

load_content();
load_projects();
icone('.project');


icone('#add_project');


$('.filter').bind('click',function(){ //:not(.active) почему-то не обновляется
    $('.project.active').removeClass('active');
    if($(this).hasClass('active'))
    {
        $(this).removeClass('active');
        $('.filter[data-day=1]').addClass('active');
    }
    else
    {
         $('.filter.active').removeClass('active');
         $(this).addClass('active');
    }
    get_content();

});

$('.panel> div').on('click','.project>div:first-child',function(e){

    $('.filter.active').removeClass('active');

    if(event.target.className=='menu')          //раскошные костыли
        return 0
    a=$('.project.active');
    $(this).parents('.project').toggleClass('active');
    a.removeClass('active');

    if(!$('.project.active').length){
        $('.filter[data-day=1]').addClass('active');
    }

    get_content();
    $('#left').toggleClass('active');
});
function load_projects() {
    $.get("shuban-projects/", function (data) {
        $('#left > div:first').html(data);
        icone('.project');
        if (!$('.filter.active').length)
            $('.filter[data-day=1]').addClass('active');
    });
};

function load_content(){
    $.get( "shuban-tasks/", function( data ) {
        $('#centr>div:first').html(data);
        icone('.tasks');
        $('.filter[data-day=1] > span').text($('#update_filter').attr('data-today'));
        $('.filter[data-day=7] > span').text($('#update_filter').attr('data-seven'));
        $('.filter[data-day=0] > span').text($('#update_filter').attr('data-all'));
});

};

function get_content(){
    var obj={
    	type:'POST',
		timeout:5000,
		data:{},
		error:function(){loader.fadeOut();},
		url:'shuban-tasks/',
		success:function(data){
		    $('#centr>div:first').html(data);
		    icone('.tasks');
		    loader.fadeOut(200);

		},
    }
    loader.fadeIn(200);
    obj.data['day']=$('.panel > header > .active').attr('data-day');
    a=$('.panel > div> .active');
    if (a.length)
        obj.data['id_projects']=a.attr('data-id');
    $.ajax(obj);
}

function icone(context){
    var h,numIcon,sizeIcon=parseInt($('.icon:first',context).innerHeight());
    $('.icon',context).each(function(){
            numIcon=$(this).attr('data-num');
            $(this).css({
                'min-width': sizeIcon+'px',
                'max-width': sizeIcon+'px',
                'background-size':  sizeIcon*6+'px '+sizeIcon*3+'px',
                'background-position': -(Math.floor((numIcon)%6)*sizeIcon)+'px '+(-Math.floor(numIcon/6)*sizeIcon)+'px',
            });
    });

}




 function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });


