from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    user = models.OneToOneField('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='client_profile')
    
    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, default='#3b82f6')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='projects')
    deadline = models.DateField(null=True, blank=True)
    estimated_duration = models.BigIntegerField(null=True, blank=True) # in ms
    
    def __str__(self):
        return self.name

class Task(models.Model):
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    RECURRENCE_CHOICES = [('none', 'None'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')]

    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    start_time = models.BigIntegerField(null=True, blank=True)
    duration = models.BigIntegerField(default=0)
    date = models.DateField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    recurrence = models.CharField(max_length=10, choices=RECURRENCE_CHOICES, default='none')
    comment = models.TextField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.description
