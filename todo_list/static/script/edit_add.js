var obj={
        type:'POST',
		timeout:5000,
		data:{},
		error:function(){loader.fadeOut();},
		success: undefined,
    };
var loader=$('#preloader');

///Прячет кнопку "добавить",выкатывает форму
$('#centr .add div').click({'sel':'#add_task','update':upd_select},hideBottom);   // для задания
$('#left .add div').click({'sel':'#add_project','update':function(){}},hideBottom);   // для прокта

////Кнопка Готово
$('#add_task  .end').click({'url':'shuban-add/','func':add_form,'cont':'.task','fF':fadeForm,'text': 'Задание успешно ','add':'добавленно','edit':'измененно'},end);
$('#add_project  .end').click({'url':'shuban-add_pr/','func':add_form_pr,'cont':'.project','fF':fadeForm_pr,'text': 'Проект успешно ','add':'добавлен','edit':'изменен'},end);


/// Кнопка Отмена
$('#add_task  .esc').click({'fF':fadeForm,'cont':'.tasks','self':$('#add_task  .esc')},esc);
$('#add_project  .esc').click({'fF':fadeForm_pr,'cont':'.project','self':$('#add_project  .esc')},esc);



$('#centr').on('click',function(e){

    if ($(e.target).hasClass('menu')) ///        выкатывает меню в шапке записи
    {
        e.stopPropagation();
        men($(e.target),{'fF':fadeForm,'contId':'#add_task'});
    }

    if (($(e.target).hasClass('menu_esc')))////  закатывает меню обратно
    {
        e.stopPropagation();
        menu_esc($(e.target),{'fF':fadeForm,'contId':'#add_task','cont':'.tasks'});
    }

    if (($(e.target).hasClass('menu_edit')))   // Кнопка "изменить запись". Подтягивает форму для изменения. Отправлять форму будет кнопка на самой форме
    {
        e.stopPropagation();
        (function(self){
            upd_select();
            var head=self.parents('.tasks > header');
            var form=$('#add_task');
            self.parents('.tasks').append(form);
            form.show();
            $('.taskName',self.parents('.tasks')).hide();
            //приоритет
            $('input[name=priority][value='+$('.priority',head).attr('data-prior')+"]").prop('checked',true);
            //Проект
            $('option[value='+$('.projectName',head).attr('data-proj')+']',form).attr('selected','selected');
            $('#add_name',form).val($('.taskName',head.parents('.tasks')).text());
            $('#add_datetime',form).val($('span[date-datime]',head.parents('.tasks')).text());
            form.attr('data-id',head.parent('.tasks').attr('data-id'));
        })($(e.target));
    }

    if (($(e.target).hasClass('menu_del')))
    {
         e.stopPropagation();
         (function(self){
             obj.url='shuban-del-task/';
             obj.data={'id_task':self.parents('.tasks').attr('data-id')};
             obj.success=function(){
                 massage('Задание успешно удаленно',1000);
                 load_content();
                 load_projects();
            };
            $.ajax(obj);
        })($(e.target));
    }
});



$('#left').on('click',function(e){

    if ($(e.target).hasClass('menu')) ///        выкатывает меню в шапке записи
    {
        e.stopPropagation();
        men($(e.target),{'fF':fadeForm_pr,'contId':'#add_project'});
    }

    if (($(e.target).hasClass('menu_esc')))////  закатывает меню обратно
    {
        e.stopPropagation();
        menu_esc($(e.target),{'fF':fadeForm_pr,'contId':'#add_project','cont':'.project'});
    }

    if (($(e.target).hasClass('menu_edit')))   // Кнопка "изменить запись". Подтягивает форму для изменения. Отправлять форму будет кнопка на самой форме
    {
        e.stopPropagation();
        (function(self){  // Кнопка "изменить запись". Подтягивает форму для изменения. Отправлять форму будет кнопка на самой форме
            var form=$('#add_project');
            self.parents('.project').append(form);
            form.show();
            $('>div:first-child',self.parents('.project')).css('visibility','hidden');
            $('.icon',form).attr('data-num',$('.icon',self.parents('.project')).attr('data-num'));
            form.attr('data-id',self.parents('.project').attr('data-id'));
            icone('.project');
            $('#add_name_pr').val( $('.name',self.parents('.project')).text());
            self.parent('.menu_act').css('height',$('.name',self.parents('.project')).innerHeight()+"px");

        })($(e.target));
    }

    if (($(e.target).hasClass('menu_del')))
    {
         e.stopPropagation();
         (function(self){
             obj.url='shuban-del-pr/';
             obj.data={'id_pr':self.parents('.project').attr('data-id')};
             obj.success=function(e){
                if(e=='1'){
                    massage('Проект успешно удален',1500);
                    load_content();
                    load_projects();
                }else{
                    massage('Невозможно удалить проект у которого есть незавершенные задачи',3500);
                }

             };
             $.ajax(obj);
         })($(e.target));

    }
});

$('#add_project .icon').click(function(){
        p=$('#icon_panel');
        wL=$('#left').width();
        $('#icon_panel .shadow').css({'width':wL/6+'px','height':wL/6+'px'});
        p.css({
            'width':wL+'px',
             'height':wL/2+'px',
        });
        p.show();
        $('#icon_panel').on('click','.shadow',function(e){
            e.stopPropagation();
           // $(this).css('background','red');
           $('#add_project .icon').attr('data-num',((Math.floor(6*(e.pageY-p.offset().top)/wL)*6)+Math.floor(6*(e.pageX-p.offset().left)/wL)));
            p.hide(300);
            icone('#add_project');
             $('#icon_panel').off('click');
        });
});

function fadeForm(self){
 
    $('input[name=priority]:checked').prop('checked',false);$('#add_name').val('');$('#add_datetime').val('');
    self.parents('#add_task').removeAttr('data-id').fadeOut(100);
    $('div:last-child',self.parents('.add')).fadeIn(100);
    $('.taskName',self.parents('.tasks')).show();
    $('#add_task').appendTo('body');
};

function fadeForm_pr(self){
    $('#add_name_pr').val('');$('#add_project .icon').attr('data-num','2');
    icone('.project');
    self.parents('#add_project').removeAttr('data-id').fadeOut(100);
    $('div:last-child',self.parents('.add')).fadeIn(100);
    $('>div:first-child',self.parents('.project')).css('visibility','visible');
    $('#add_project').appendTo('body');
    $('#icon_panel').hide();

};

function add_form(){
    obj.data={}
    obj.data.priority=$('input[name=priority]:checked').val();
    obj.data.project=$('#add_task option[value]:selected').val();
    obj.data.name=$('#add_name').val();
    obj.data.pub_date=$('#add_datetime').val();

    for(var key in obj.data){
        if (!obj.data[key]){
            massage('Все поля обязательны для заполнения');
            return 0;
        }
    }
    obj.data.id_tasks=undefined;
    if($('#add_task').attr('data-id')){
                obj.data.id_tasks=$('#add_task').attr('data-id');
                return 2;// выведет запись успешно "измененна"
    }

    return 1; // выведет запись успешно Добавленна

}
function add_form_pr(){
    obj.data={}
    obj.data.name=$('#add_name_pr').val();
    obj.data.img=$('#add_project .icon').attr('data-num');

    if (!obj.data.name){
            massage('Введите название',1000);
            return 0;
    }
    obj.data.id_project=undefined;
    if($('#add_project').attr('data-id')){
                obj.data.id_project=$('#add_project').attr('data-id');
                return 2;   // выведет запись успешно "измененна"
    }

    return 1;  // выведет запись успешно Добавленна
};
function massage(str,time){
    time=time || 2000;
    $('#error_message').html(str);
    $("#error_box").fadeIn(500).delay(time).fadeOut(500);

};

function hideBottom(e){
    e.stopPropagation();
    esc({'data':{'fF':fadeForm,'cont':'.tasks','self':$('#add_task  .esc')},'stopPropagation':function(){}});
    esc({'data':{'fF':fadeForm_pr,'cont':'.project','self':$('#add_project  .esc')},'stopPropagation':function(){}});
    var self=$(this).parent('.add');
    $('div:last-child',self).fadeOut(function(){
        $(e.data.sel).prependTo(self).fadeIn(150);
    });
    e.data.update();
};
function end (e){///   кнопка "Готово" на форме добавления-изменения
    e.stopPropagation();
    self=$(this);
    a=e.data.func()
    if (a==0)    // заполняет data хламом из формы
        return 0
    else
    {
        if (a==1)
            text=e.data.text+e.data.add
        else
            text=e.data.text+e.data.edit
    }
    obj.url=e.data.url;
    obj.success=function(stat){
        if (stat.length > 0){
            massage('Вы допустили следующие ошибки: ' + stat, 1000);
        }
        else {
            massage(text, 1000);
            load_content();    //грyзит контент в цетр
            icone(e.data.cont);
            e.data.fF(self);   // прячет форму добавления\изменения и возвращает кнопку "добавить"
            // massage(text,1000);
            load_projects();
        }
    };
    $.ajax(obj);
};

function esc(e){//// прячет форму
     e.stopPropagation();
      $('.menu',e.data.self.parents('.project')).css('height',$('.name',e.data.self.parents('.project')).innerHeight()+"px");
     e.data.fF(e.data.self);
     $('.menu.menu_act').removeClass('menu_act');


}

function men(self,e){
    $('.menu.menu_act').removeClass('menu_act');
    e.fF($(e.contId+' .esc'));
    self.addClass('menu_act');

};
function menu_esc(self,e){
    self.parents('.menu').removeClass('menu_act');
    e.fF($(e.contId+' .esc'));
    $('.menu',$(e.contId).parents(e.cont)).removeClass('menu_act');
    self.parent('.menu').css('height',$('.name',self.parents('.project')).innerHeight()+"px");
};

function upd_select(){
    $.get( "shuban-update_select/", function( data ) {
            data= JSON.parse(data)
            sel=$('#add_task select');
            text=''
            for (var i in  data){
                text+='<option value="'+data[i].pk+'">'+data[i].fields.name+'</option>';
            }
            if(!data.length)
                massage('Задания являются частью проекта, для начала работы необходимо создать проект',3500);
            sel.html(text);
});


};