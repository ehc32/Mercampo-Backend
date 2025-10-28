import os
import sys
from pathlib import Path
import django

# Ensure project root is on sys.path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = "admin"
email = "xzenzi259@gmail.com"
try:
    user = User.objects.get(username=username)
    user.email = email
    user.save()
    print(f"Updated {username} email to {email}")
except User.DoesNotExist:
    print(f"User '{username}' does not exist")
