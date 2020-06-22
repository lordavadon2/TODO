from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse


class Project(models.Model):
    """
    Модель проектов
    """
    name = models.CharField(max_length=100, help_text="Введите название проекта.", verbose_name='Имя')
    img = models.IntegerField(default=0, verbose_name='id изображения')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')

    def __str__(self):
        """String for representing the Model object (in Admin site etc.)"""
        return self.name

    class Meta:
        verbose_name_plural = 'Проекты'
        verbose_name = 'Проект'
        ordering = ['-name']

    # def get_absolute_url(self):
    #     return reverse('post_detail', kwargs={'id': self.id})

    # def get_update_url(self):
    #     return reverse('post_update', kwargs={'slug': self.slug})

    # def get_delete_url(self):
    #     return reverse('post_delete', kwargs={'slug': self.slug})


class Task(models.Model):
    """
    Модель заданий
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name='Проект')
    name = models.CharField(max_length=100, help_text="Введите название задачи.", verbose_name='Имя')
    PRIORITY_LIST = {
        ('a', 'red'),
        ('b', 'orange'),
        ('c', 'white'),
    }
    priority = models.CharField(max_length=1, choices=PRIORITY_LIST,
                                default='c', help_text='Приоретет задачи.', verbose_name='Приоритет')
    date_time = models.DateTimeField(verbose_name='Дата и время')
    status = models.BooleanField(default=False, verbose_name='Архив')

    class Meta:
        verbose_name_plural = 'Задачи'
        verbose_name = 'Задачу'
        ordering = ['project', 'name']

    # def get_absolute_url(self):
    #     return reverse('post_detail', kwargs={'id': self.id})

    def __str__(self):
        """String for representing the Model object (in Admin site etc.)"""
        return self.name
