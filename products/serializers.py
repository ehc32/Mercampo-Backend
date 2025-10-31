import base64
from io import BytesIO
from PIL import Image

from django.core.files.base import ContentFile
from django.db import models
from rest_framework import serializers

from .models import Product, ProductImage, Reviews, User, ProductCategory, UnitOfMeasurement


class ProductReadSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    unit_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_first_image(self, obj):
        first_image_instance = ProductImage.objects.filter(product=obj).first()
        if first_image_instance and first_image_instance.image:
            with first_image_instance.image.open("rb") as image_file:
                image_data = image_file.read()
                encoded_image = base64.b64encode(image_data).decode('utf-8')
                try:
                    fmt = Image.open(BytesIO(image_data)).format.lower()
                    image_type = {'jpeg': 'jpg', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif', 'webp': 'webp'}.get(fmt, 'jpg')
                except Exception:
                    image_type = 'jpg'
                return f'data:image/{image_type};base64,{encoded_image.replace("dataimage/jpegbase64", "")}'
        return None

    def get_category_name(self, obj):
        # Priorizar product_category si existe
        if obj.product_category:
            return obj.product_category.name
        # Fallback a category (string) si existe
        elif obj.category:
            return obj.category
        return None

    def get_unit_name(self, obj):
        # Priorizar unit_of_measurement si existe
        if obj.unit_of_measurement:
            return obj.unit_of_measurement.name
        # Fallback a unit (string) si existe
        elif obj.unit:
            return obj.unit
        return None

class ProductCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        product = super().create(validated_data)

        for i, image in enumerate(images):
            image_data = base64.b64decode(image)
            try:
                fmt = Image.open(BytesIO(image_data)).format.lower()
                image_type = {'jpeg': 'jpg', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif', 'webp': 'webp'}.get(fmt, 'jpg')
            except Exception:
                image_type = 'jpg'
            image_name = f'image_{i}.{image_type}'
            image_file = ContentFile(image_data, name=image_name)
            ProductImage.objects.create(product=product, image=image_file)

        return product

    
    
class ProductImagesSerializer(serializers.Serializer): # brings the imgs from that product
    images = serializers.SerializerMethodField()

    def get_images(self, obj):
        product_images = ProductImage.objects.filter(product=obj)
        images_data = []
        for image in product_images:
            with image.image.open("rb") as image_file:
                image_data = image_file.read()
                encoded_image = base64.b64encode(image_data).decode('utf-8')
                try:
                    fmt = Image.open(BytesIO(image_data)).format.lower()
                    image_type = {'jpeg': 'jpg', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif', 'webp': 'webp'}.get(fmt, 'jpg')
                except Exception:
                    image_type = 'jpg'
                images_data.append(f'data:image/{image_type};base64,{encoded_image.replace("dataimage/jpegbase64", "")}')
        return images_data
    
class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = ['product', 'user', 'rating', 'comment']

    def create(self, validated_data):
        review = Reviews.objects.create(**validated_data)

        product = validated_data['product']

        latest_reviews = Reviews.objects.filter(product=product).order_by('-created')[:20]

        if latest_reviews.exists():
            product.rating = latest_reviews.aggregate(models.Avg('rating'))['rating__avg']
        else:
            product.rating = None

        product.num_reviews = Reviews.objects.filter(product=product).count()

        product.save()

        return review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'avatar']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Incluir el serializer del usuario

    class Meta:
        model = Reviews
        fields = ['product', 'user', 'rating', 'comment', 'created']


# Serializers para ProductCategory y UnitOfMeasurement
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UnitOfMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOfMeasurement
        fields = ['id', 'name', 'abbreviation', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
