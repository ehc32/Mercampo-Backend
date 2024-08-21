import base64
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Product, ProductImage, Reviews

class ReviewSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(source='user.avatar.url')
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Reviews
        fields = "__all__"

    def get_avatar(self, obj):
        return obj.user.avatar.url

class ProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def validate_images(self, value):
        for image in value:
            try:
                base64.b64decode(image)
            except Exception as e:
                raise serializers.ValidationError("La imagen no es una cadena de base64 válida")
        return value

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        product = super().create(validated_data)
        
        for i, image in enumerate(images):
            image_data = base64.b64decode(image)
            
            # Crear un nombre único para el archivo de imagen
            image_name = f'image_{i}.jpg'
            
            # Usar ContentFile para crear el archivo en memoria
            image_file = ContentFile(image_data, name=image_name)
            
            # Crear la instancia de ProductImage con el campo product
            ProductImage.objects.create(product=product, image=image_file)
        
        return product