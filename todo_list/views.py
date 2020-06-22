import datetime as dt

import pytz
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from .forms import ProjectForm, TaskForm
from .models import Project, Task


def main_counter(request, stat):
    """
    Функция для подсчета кол-ва заданий: сегодня, в течени 7 дней, всех.

    :param request:
    :param stat:
    :return: counter
    """
    counter = {
        'today': 0,
        'seven': 0,
        'all': 0,
    }
    d = dt.datetime.now()
    counter['today'] = Task.objects.filter(date_time__date=dt.date(d.year, d.month, d.day), status=stat,
                                           project__user=get_user(request)).count()
    counter['seven'] = Task.objects.filter(date_time__range=(dt.date(d.year, d.month, d.day),
                                                  (dt.date(d.year, d.month, d.day) + dt.timedelta(days=7))),
                                           status=stat, project__user=get_user(request)).count()
    counter['all'] = Task.objects.filter(status=stat, project__user=get_user(request)).count()
    return counter


def get_user(request):
    """
    Получаем юзера из базы

    :param request:
    :return: User
    """
    return User.objects.get(username=request.user.username)


@login_required
def index(request):
    """
    Отображение основной страницы

    :param request:
    :return: render
    """
    return render(request, 'todo/main.html')


def task_add(request):
    """
    Добавляем/изменяем задание в таблицу(е) Task БД

    :param request:
    :return: HttpResponse
    """
    p = request.POST
    if p:
        form = TaskForm(p)
        if form.is_valid():
            if p.get('id_tasks'):
                if Task.objects.filter(id=p['id_tasks'], project=Project.objects.get(pk=int(p['project']))):
                    q = Task(id=p['id_tasks'], name=p['name'], priority=p['priority'],
                         project=Project.objects.get(pk=int(p['project'])), date_time=p['pub_date'])
                else:
                    return valid_error('<br>Неверный ИД задания!')
            else:
                q = Task(name=p['name'], priority=p['priority'],
                         project=Project.objects.get(pk=int(p['project'])), date_time=p['pub_date'])
            q.save()
            return HttpResponse('')
        return valid_error()


def valid_error(error='<br>Неверно указаны данные!'):
    # my_form.errors.as_data()
    return HttpResponse(error)


def project_add(request):
    """
    Добавляем/изменяем проект в таблицу(е) Project БД

    :param request:
    :return: HttpResponse
    """
    p = request.POST
    if p:
        form = ProjectForm(p)
        if form.is_valid():
            if p.get('id_project'):
                if Project.objects.filter(id=p['id_project'], user=get_user(request)):
                    q = Project(id=p['id_project'], name=p['name'], img=p['img'], user=get_user(request))
                else:
                    return valid_error('<br>Неверный ИД проекта!')
            else:
                q = Project(name=p['name'], img=p['img'], user=get_user(request))
            q.save()
            return HttpResponse('')
        return valid_error()


@login_required
def del_task(request):
    """
    Удаляем задание с таблицы Task БД

    :param request:
    :return: HttpResponse
    """
    ts = Task.objects.get(id=int(request.POST.get('id_task')))
    ts.delete()
    return HttpResponse('')


def func_show_pr(request, stat=False):
    """
    Получение проектов из БД

    :param request:
    :param stat:
    :return: Project's
    """
    projects = Project.objects.filter(user=get_user(request))
    for pr in projects:
        pr.count = pr.task_set.filter(project=pr.id, status=stat).count()
    return projects


@login_required
def show_projects(request):
    """
    Отображение проектов на сайте

    :param request:
    :return: render
    """
    arch = str(request.path) == '/shuban-projects/'
    if arch:
        projects = func_show_pr(request)
    else:
        projects = func_show_pr(request, True)
    return render(request, 'todo/project.html', {'projects': projects, 'arch': arch})


def func_show_task(request, stat=False):
    """
    Получение заданий из БД

    :param request:
    :param stat:
    :return: tasks, filtr, flag
    """
    post = request.POST
    ntime = pytz.utc.localize(dt.datetime.now())
    if post:
        if post.get('id_projects'):
            tasks = Task.objects.filter(project=int(post['id_projects']), status=stat, project__user=get_user(request))\
                .order_by('date_time')
        elif post.get('day'):
            day = post.get('day')
            d = dt.datetime.now()
            if day == '1':
                tasks = Task.objects.filter(
                    date_time__date=dt.date(d.year, d.month, d.day), status=stat, project__user=get_user(request)) \
                    .order_by('date_time')
            elif day == '7':
                tasks = Task.objects.filter(
                    date_time__range=(dt.date(d.year, d.month, d.day),
                                      (dt.date(d.year, d.month, d.day)
                                       + dt.timedelta(days=7))), status=stat, project__user=get_user(request))\
                    .order_by('date_time')
            elif day == '0':
                tasks = Task.objects.filter(status=stat, project__user=get_user(request)).order_by('date_time')
    else:
        tasks = Task.objects.filter(status=stat, project__user=get_user(request)).order_by('date_time')

    if not stat:
        flag = Task.objects.filter(date_time__lt=ntime, status=stat, project__user=get_user(request)).count()
    else:
        flag = None

    for task in tasks:
        if task.date_time > ntime or stat:
            task.later = 'tasks'
        else:
            task.later = 'tasks later'
        task.date_time = task.date_time.strftime('%Y-%m-%d %H:%M')

    filtr = main_counter(request, stat)

    return tasks, filtr, flag


@login_required
def show_tasks(request):
    """
    Отображение заданий на сайте

    :param request:
    :return: render
    """
    arch = str(request.path) == '/shuban-tasks/'
    if arch:
        tasks, filtr, flag = func_show_task(request)
    else:
        tasks, filtr, flag = func_show_task(request, True)
    return render(request, 'todo/task.html', {'tasks': tasks, 'filt': filtr, 'flag': flag, 'arch': arch})


def check_status(request):
    """
    Проверка состояния задания и отображения на сайте

    :param request:
    :return: HttpResponse
    """
    p = request.POST
    if p:
        q = Task.objects.get(id=int(p['id']))
        if p['status'] == 'True':
            q.status = False
        else:
            q.status = True
        q.save()
    return HttpResponse('True')


@login_required
def del_pr(request):
    """
    Удаление проектов из БД

    :param request:
    :return: HttpResponse
    """
    pr = Project.objects.get(id=int(request.POST.get('id_pr')), user=get_user(request))
    if pr.task_set.filter(status=False).count():
        return HttpResponse('0')
    pr.delete()
    return HttpResponse('1')


@login_required
def upd_task(request):
    """
    Подтягивание списка проектов в форму добавление/изменение задания

    :param request:
    :return: HttpResponse
    """
    data = serializers.serialize('json', Project.objects.filter(user=get_user(request)), fields=('pk', 'name'))
    return HttpResponse(data)


@login_required
def archive(request):
    """
    Отображения архива проектов и заданий на сайте

    :param request:
    :return: render
    """
    return render(request, 'todo/archive.html')


def log_out(request):
    """
    Выход пользователя с сайта

    :param request:
    :return: redirect
    """
    logout(request)
    return redirect('todo:log_in')


def log_in(request):
    """
    Вход пользователя на сайт

    :param request:
    :return: render or redirect
    """
    if request.POST:
        ctx = {}
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('todo:main_str')
            else:
                ctx['text'] = 'Учетная запись заблокирована!'
                ctx['flag'] = True
        else:
            ctx['text'] = 'Неверное имя пользователя или пароль!'
            ctx['flag'] = True
        return render(request, 'todo/autorization/index.html', {'ctx': ctx})
    else:
        return render(request, 'todo/autorization/index.html')

