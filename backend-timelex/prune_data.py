
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'timelex_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import Client, Project, Task

User = get_user_model()

def prune():
    print("Pruning data...")
    
    # Delete Tasks
    tasks_count = Task.objects.count()
    Task.objects.all().delete()
    print(f"Deleted {tasks_count} tasks.")

    # Delete Projects
    projects_count = Project.objects.count()
    Project.objects.all().delete()
    print(f"Deleted {projects_count} projects.")

    # Delete Clients
    clients_count = Client.objects.count()
    Client.objects.all().delete()
    print(f"Deleted {clients_count} clients.")

    # Delete non-staff Users (Clients)
    users_to_delete = User.objects.filter(is_staff=False, is_superuser=False)
    users_count = users_to_delete.count()
    users_to_delete.delete()
    print(f"Deleted {users_count} client users.")

    print("Data pruned successfully.")

if __name__ == '__main__':
    prune()
