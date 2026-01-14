# Backend Integration Guide: Django + MySQL

This guide outlines the steps required to connect the **Timelex** frontend to a professional **Django** backend using **MySQL**.

## 1. Prerequisites

* Python 3.9+
* MySQL Server 8.0+
* `mysqlclient` or `pymysql` (Python database connectors)

## 2. Environment Setup

### Install Dependencies

```bash
pip install django djangorestframework django-cors-headers mysqlclient
```

### Database Creation

Login to your MySQL terminal and run:

```sql
CREATE DATABASE timelex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 3. Django Configuration (`settings.py`)

Configure the database engine to use MySQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'timelex_db',
        'USER': 'pytimelex',
        'PASSWORD': 'sEgl1bLdQYjy69I',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Must be at the top
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # Update to your frontend URL
]
```

## 4. Models Definition (`models.py`)

Based on our `types.ts`, here is the corresponding Django ORM structure:

```python
from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')

class Project(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, default='#3b82f6')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='projects')
    deadline = models.DateField(null=True, blank=True)
    estimated_duration = models.BigIntegerField(null=True, blank=True) # in ms

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
```

## 5. API Layer (DRF)

### Serializers (`serializers.py`)

```python
from rest_framework import serializers
from .models import Client, Project, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

# Similar for Client and Project...
```

### Views (`views.py`)

```python
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
```

## 6. Frontend Connection

To connect the frontend, you should replace the state-based hooks in `App.tsx` with `fetch` or `axios` calls to your new endpoints:

```typescript
// Example frontend fetch
const fetchTasks = async () => {
  const response = await fetch('http://localhost:8000/api/tasks/');
  const data = await response.json();
  setTasks(data);
};
```

## 7. Migration Commands

```bash
python manage.py makemigrations
python manage.py migrate
```
