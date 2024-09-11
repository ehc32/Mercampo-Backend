from celery import shared_task
from django.utils import timezone
from .models import Product

@shared_task
def eliminar_productos_expirados():
    now = timezone.now()
    productos_expirados = Product.objects.filter(fecha_limite__lt=now)
    productos_expirados.delete()
