from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    UserManager
)
from enum import Enum

class Role(Enum):
    ADMIN = "admin"
    CLIENT = "client"
    SELLER = "seller"

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Debes tener un correo electronico")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email=None, password=None, role=None, **extra_fields):
        extra_fields.setdefault("role", role)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", Role.ADMIN.value)
        return self.create_user(email, password, **extra_fields)

def validate_role(value):
    if value not in [tag.value for tag in Role]:
        raise ValueError("Rol no válido")

class User(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True, default=None)
    avatar = models.ImageField(default="avatar.png")
    can_publish = models.BooleanField(default=False, null=False)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=10, choices=[(tag.name, tag.value) for tag in Role], default=Role.CLIENT.value)
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["-date_joined"]

class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)