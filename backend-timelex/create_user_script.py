import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'timelex_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
email = 'bhavanbadhe@gmail.com'
password = 'admin'

try:
    # Try to get user by email directly first if possible, but username is usually unique.
    # We'll try to find by email.
    users = User.objects.filter(email=email)
    if users.exists():
        user = users.first()
        created = False
    else:
        user = User(email=email, username='bhavan') # Default username
        created = True

    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    
    action = "Created" if created else "Updated"
    print(f"SUCCESS: {action} user {email} as ADMIN. Password: '{password}'")

except Exception as e:
    print(f"ERROR: {e}")
