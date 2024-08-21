import base64
import imghdr
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Product, ProductImage, Reviews

class ReviewSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Reviews
        fields = "__all__"

    def get_avatar(self, obj):
        if obj.user.avatar:
            return obj.user.avatar.url
        return None

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
                return f'data:image/{image_type};base64,{encoded_image}'
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
            match = re.match(r'data:image/(?P<type>.+);base64,(?P<data>.+)', image)
            if match:
                image_type = match.group('type')
                image_data = base64.b64decode(match.group('data'))
            else:
                image_type = 'jpg'
                image_data = base64.b64decode(image)

            image_name = f'image_{i}.{image_type}'
            image_file = ContentFile(image_data, name=image_name)
            ProductImage.objects.create(product=product, image=image_file)

        return product
