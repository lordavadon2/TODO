from django.urls import path, include
from . import views

app_name = 'todo'

urlpatterns = [
    path('', views.index, name='main_str'),
    path('accounts/login/', views.log_in, name='log_in',),
    path('accounts/logout/', views.log_out, name='log_out'),
    path('shuban-add/', views.task_add, name='task_add'),
    path('shuban-add_pr/', views.project_add, name='project_add'),
    path('shuban-update_select/', views.upd_task, name='upd_task'),
    path('shuban-del-pr/', views.del_pr, name='del_pr'),
    path('shuban-del-task/', views.del_task, name='del_task'),
    path('shuban-projects/', views.show_projects, name='show_projects'),
    path('archive/shuban-projects/', views.show_projects, name='show_projects_arch'),
    path('archive/shuban-tasks/', views.show_tasks, name='show_tasks_archive'),
    path('shuban-tasks/', views.show_tasks, name='show_tasks'),
    path('shuban-id/', views.check_status, name='check_status'),
    path('archive/shuban-id/', views.check_status, name='check_status_arch'),
    path('archive/', views.archive, name='archive'),
]
