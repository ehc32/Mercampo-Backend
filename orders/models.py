from django.db import models
from users.models import User
from products.models import Product

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="buyer_orders")  # Comprador
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="seller_orders")  # Vendedor
    payment_method = models.CharField(max_length=200, null=True, blank=True)
    tax_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    is_delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_id = models.CharField(max_length=200, null=True, blank=True)


class Orderitem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    price = models.CharField(max_length=250, blank=True)


class ShoppingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=250, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True, null=True)  # Agregar este campo



class TemporaryOrder(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="buyer_temp_orders")  # Comprador
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="seller_temp_orders")  # Vendedor
    order_data = models.JSONField()
    mp_preference_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=50, default="created")
    created_at = models.DateTimeField(auto_now_add=True)



class Notification(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)  # El usuario al que va dirigida la notificación (el vendedor)
    message = models.CharField(max_length=255)  # El contenido de la notificación
    link = models.URLField(max_length=200, null=True, blank=True)  # Enlace a la orden o detalle relacionado
    is_read = models.BooleanField(default=False)  # Si la notificación ha sido leída o no
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación de la notificación

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"


        
class OrderConfirmation(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    confirmed_by_user = models.ForeignKey(User, on_delete=models.CASCADE)
    confirmed_at = models.DateTimeField(auto_now_add=True)