from enum import Enum
from django.db import models
from users.models import User


class Category(Enum):
    FRUTAS = 'Frutas'
    VERDURAS = 'Verduras'
    GRANOS = 'Granos'
    ABARROTES = 'Abarrotes'
    OTROS = 'Otros'

class Product(models.Model):
    slug = models.SlugField(max_length=50, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, choices=[(tag.name, tag.value) for tag in Category])
    description = models.CharField(max_length=350, blank=True, null=False)
    map_locate = models.CharField(max_length=100, default='desconocido', blank=False, null=False) # location google maps
    locate = models.CharField(max_length=100, default='desconocido', blank=False, null=False) # this is the place where's product offer
    count_in_stock = models.IntegerField(default=0) # how many units
    price = models.DecimalField(max_digits=10,
                                decimal_places=2,
                                null=True, blank=True)
    unit = models.CharField(max_length=100, blank=True)
    num_reviews = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=10,
                                 decimal_places=2,
                                 null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # user who's offer the product
    created = models.DateTimeField(auto_now_add=True) # when was created

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)  # Cambiado a 'product'
    image = models.ImageField(default='placeholder.png')

class Reviews(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    rating = models.DecimalField(max_digits=10,
                                 decimal_places=2,
                                 null=True, blank=True)
    comment = models.CharField(max_length=100, blank=True)
    created = models.DateTimeField(auto_now_add=True)