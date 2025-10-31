from django.db import models
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    UserManager
)
from enum import Enum
import datetime

class Role(Enum):
    ADMIN = "admin"
    CLIENT = "client"
    SELLER = "seller"

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Debes tener un correo electrónico")
        email = self.normalize_email(email)
        role = extra_fields.pop("role", Role.CLIENT.value)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, role=None, **extra_fields):
        if role is None:
            role = Role.CLIENT.value
        return self._create_user(email, password, role=role, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", Role.ADMIN.value)
        return self.create_user(email, password, **extra_fields)

def validate_role(value):
    if value not in [tag.value for tag in Role]:
        raise ValueError("Rol no válido")

class Enterprise(models.Model):
    owner_user = models.OneToOneField(
        'User', 
        on_delete=models.CASCADE, 
        primary_key=True, 
        related_name='enterprise_owner'
    )
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, null=True, blank=True, default=None)
    rut = models.TextField(help_text="Imagen del RUT en formato base64", default="img in base 64")
    tipo_productos = models.CharField(
        max_length=255, 
        help_text="Lista de tipos de productos separados por comas",
        default="Varios"
    )
    facebook = models.CharField(max_length=255, null=True, blank=True)
    instagram = models.CharField(max_length=255, null=True, blank=True)
    whatsapp = models.CharField(max_length=20, null=True, blank=True)
    link_enterprise = models.CharField(max_length=255, null=True, blank=True)
    date_registered = models.DateTimeField(default=timezone.now)
    address = models.CharField(max_length=255)
    products_length = models.CharField(max_length=255, default=0)
    description = models.CharField(max_length=255, default="Description in blank")
    avatar = models.TextField(help_text="Imagen del avatar en formato base64", default="img in base 64")
    is_active = models.BooleanField(default=True, null=True)

    def __str__(self):
        return f"Empresa: {self.name}"

class User(AbstractBaseUser, PermissionsMixin):
    email = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, null=True, blank=True, default=None)
    role = models.CharField(
        max_length=10,
        choices=[(tag.name, tag.value) for tag in Role],
        default=Role.CLIENT.value,
    )   
    can_publish = models.BooleanField(default=False)
    num_reviews = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True, null=True)
    accepted_politicy = models.BooleanField(default=True, null=True)
    enterprise = models.OneToOneField(
        Enterprise, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='user_enterprise'
    )
    avatar = models.TextField(help_text="Imagen del avatar en formato base64", default="img in base 64")
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ["-date_joined"]

class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    date_requested = models.DateTimeField(default=timezone.now)

class Reviews_User(models.Model):
    user_target = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='target_reviews'
    )
    user_wrote = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='written_reviews'
    )
    rating = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user_wrote.name} for {self.user_target.name}"

class PayPalConfig(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    app_name = models.CharField(max_length=255)
    client_id = models.CharField(max_length=255)
    secret_key = models.CharField(max_length=255)
    date_configured = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"PayPal Config for {self.user.name}"
    
class MercadoPagoConfig(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255)
    public_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"MercadoPago Config for {self.user.name}"

# --- Nuevo Modelo para Recuperación de Contraseña ---
class PasswordReset(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=4)


# --- Google Maps configuration (global) ---
class GoogleMapsConfig(models.Model):
    api_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Google Maps Configuration"
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        # El código expira en 10 minutos
        expiration_time = self.created_at + datetime.timedelta(minutes=10)
        return expiration_time < timezone.now()

    def __str__(self):
        return f"PasswordReset for {self.user.email} - Code: {self.code}"
    
class EnterprisePost(models.Model):
    enterprise = models.ForeignKey(
        Enterprise, 
        on_delete=models.CASCADE,
        related_name='posts'
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='enterprise_posts'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    images = models.TextField(
        help_text="Imágenes en formato base64 separadas por comas", 
        blank=True, 
        null=True
    )
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0,
        help_text="Calificación de 0 a 5"
    )
    redirect_link = models.URLField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Link al que redirige el post"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Post: {self.title} - {self.enterprise.name}"

class PostComment(models.Model):
    post = models.ForeignKey(
        EnterprisePost,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='post_comments'
    )
    comment = models.TextField()
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        null=True,
        blank=True,
        help_text="Calificación de 0 a 5"
    )
    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.user.name if self.user else 'Anonymous'} on {self.post.title}"
