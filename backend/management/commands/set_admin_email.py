from django.core.management.base import BaseCommand, CommandParser
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Set email for a user (default: admin)"

    def add_arguments(self, parser: CommandParser):
        parser.add_argument('--username', default='admin')
        parser.add_argument('--email', required=True)

    def handle(self, *args, **options):
        User = get_user_model()
        username = options['username']
        email = options['email']
        try:
            user = User.objects.get(username=username)
            user.email = email
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Updated {username} email to {email}"))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' does not exist"))
