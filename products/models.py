from django.db import models
from users.models import User


class Product(models.Model):
    slug = models.SlugField(max_length=50, null=True, blank=True)
    image = models.ImageField(default='placeholder.png')
    name = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=100, blank=True, null=False)
    map_locate = models.CharField(max_length=100, blank=False, null=False) # location google maps
    locate = models.CharField(max_length=100, blank=False, null=False) # this is the place where's product offer
    count_in_stock = models.IntegerField(default=0) # how many units
    price = models.DecimalField(max_digits=10,
                                decimal_places=2,
                                null=True, blank=True)
    unit = models.CharField(max_length=100, blank=True) # m, kg, 
    num_reviews = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=10,
                                 decimal_places=2,
                                 null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # user who's offer product
    created = models.DateTimeField(auto_now_add=True) # when was created


class Reviews(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    rating = models.DecimalField(max_digits=10,
                                 decimal_places=2,
                                 null=True, blank=True)
    description = models.CharField(max_length=100, blank=True)
    created = models.DateTimeField(auto_now_add=True)
