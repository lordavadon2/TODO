$('#logout').click(function(){
    $(this).parent('form').submit();
});

var loader=$('#preloader');
loader.fadeOut();


$('#add_datetime').datepicker({dateFormat: 'yy-mm-dd T'}).timePicker();

var text='';
for(var i=0;i<18;i++){
    text+='<div class="shadow"></div>';
}
$('#icon_panel').html(text);

if (String(window.location.href).includes('archive')){
     $('#archive').addClass('active');
}

$(window).resize(function(){
  icone('#wrap');
});
 // $('input,textarea,select').bind('touchstart mousedown',function(event){
 //        var self=$(this);
 //        event.preventDefault()
 //        $('body').css({
 //                'min-width':$(document).width()+'px',
 //                'min-height':$(document).height()+'px'
 //        });
 //        setTimeout(function (){self.focus()},40);
 // });
  $('input,textarea,select').blur(function(event){
        $('body').css({
                'min-width':'inherit',
                'min-height':'inherit'
        });
 });