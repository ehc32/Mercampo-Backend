import base64
import imghdr

from django.core.files.base import ContentFile
from django.db import models
from rest_framework import serializers

from .models import Product, ProductImage, Reviews, User


class ProductReadSerializer(serializers.ModelSerializer):
    first_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_first_image(self, obj):
        first_image_instance = ProductImage.objects.filter(product=obj).first()
        if first_image_instance and first_image_instance.image:
            with first_image_instance.image.open("rb") as image_file:
                image_data = image_file.read()
                encoded_image = base64.b64encode(image_data).decode('utf-8')
                image_type = imghdr.what(None, image_data) or 'jpg'
                return f'data:image/{image_type};base64,{encoded_image.replace("dataimage/jpegbase64", "")}'
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
            image_type = imghdr.what(None, image_data)
            if image_type is None:
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
                image_type = imghdr.what(None, image_data) or 'jpg'
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
