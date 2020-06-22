from django import forms

from todo_list.models import Task


class PriorityTask(forms.Field):
    priority = ['a', 'b', 'c']

    def validate(self, value):
        super(PriorityTask, self).validate(value)

        if value not in self.priority:
            raise forms.ValidationError('Неверное значение поля Приоритет!')


class ProjectTask(forms.Field):
    def validate(self, value):
        super(ProjectTask, self).validate(value)

        if not Task.objects.get(id=int(value)):
            raise forms.ValidationError('Неверное значение поля Проект!')


class ProjectForm(forms.Form):
    id_project = forms.IntegerField(min_value=1, required=False)
    name = forms.CharField(max_length=100)
    img = forms.IntegerField(min_value=0, max_value=17)


class TaskForm(forms.Form):
    name = forms.CharField(max_length=100)
    pub_date = forms.DateTimeField()
    priority = PriorityTask()
    project = ProjectTask()
