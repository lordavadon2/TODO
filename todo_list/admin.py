from django.contrib import admin

# Register your models here.
from .models import Project, Task


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Отображение проектов в админке
    """
    list_display = ('id', 'name', 'user')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Отображение заданий в админке
    """
    list_display = ('id', 'name', 'project', 'priority', 'date_time', 'status')
    list_filter = ('priority', 'date_time')
    list_editable = ('status',)
