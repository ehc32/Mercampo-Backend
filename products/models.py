from enum import Enum

from django.db import models
from django.utils import timezone

from users.models import User


# Mantener el Enum para compatibilidad temporal durante migración
class Category(Enum):
    FRUTAS = 'Frutas'
    VERDURAS = 'Verduras'
    GRANOS = 'Granos'
    ABARROTES = 'Abarrotes'
    UNIDAD = 'Unidad'
    OTROS = 'Otros'


class ProductCategory(models.Model):
    """Modelo para categorías de productos parametrizables"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Categoría de Producto"
        verbose_name_plural = "Categorías de Productos"
        ordering = ['name']

    def __str__(self):
        return self.name


class UnitOfMeasurement(models.Model):
    """Modelo para unidades de medición parametrizables"""
    name = models.CharField(max_length=100, unique=True)
    abbreviation = models.CharField(max_length=20, blank=True, null=True, help_text="Abreviatura de la unidad (ej: kg, g, L, ml)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Unidad de Medición"
        verbose_name_plural = "Unidades de Medición"
        ordering = ['name']

    def __str__(self):
        if self.abbreviation:
            return f"{self.name} ({self.abbreviation})"
        return self.name


class Product(models.Model):
    slug = models.SlugField(max_length=50, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True)
    # Mantener category como CharField para compatibilidad durante migración
    category = models.CharField(max_length=100, choices=[(tag.name, tag.value) for tag in Category], blank=True, null=True)
    # Nueva relación ForeignKey
    product_category = models.ForeignKey(
        ProductCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='products'
    )
    description = models.CharField(max_length=350, blank=True, null=False)
    map_locate = models.CharField(max_length=100, default='desconocido', blank=False, null=False)
    locate = models.CharField(max_length=100, default='desconocido', blank=False, null=False)
    count_in_stock = models.IntegerField(default=0)
    count_in_sells = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # Mantener unit como CharField para compatibilidad durante migración
    unit = models.CharField(max_length=100, blank=True, null=True)
    # Nueva relación ForeignKey
    unit_of_measurement = models.ForeignKey(
        UnitOfMeasurement,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )
    num_reviews = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created = models.DateTimeField(auto_now_add=True)
    tiempoL = models.IntegerField(default=0)
    fecha_limite = models.DateTimeField(null=True, blank=True)
    status = models.BooleanField(default=False)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    image = models.ImageField(default='placeholder.png')

class Reviews(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    rating = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)