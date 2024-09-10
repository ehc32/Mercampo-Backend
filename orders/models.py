from django.db import models
from users.models import User
from products.models import Product


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) 
    # persona que compró, no se pone la persona a la que compro porque esta esta vinculada a 1 o mas productos,
    # y la orden puede tener mas de un vendedor
    total_price = models.CharField(max_length=250, blank=True)
    is_delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


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
