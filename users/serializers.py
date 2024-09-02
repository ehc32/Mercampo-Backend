from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User, Seller

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "id", "can_publish", "avatar", "role", "phone", "date_joined"]

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class SellerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['user', 'date_requested']
        read_only_fields = ['date_requested']

    def create(self, validated_data):
        user = validated_data['user']
        # Check if the user is already a seller
        if Seller.objects.filter(user=user).exists():
            raise serializers.ValidationError("El usuario ya ha solicitado ser vendedor.")
        # Change the can_publish status to 'solicitando'
        user.can_publish = 'solicitando'
        user.save()

        # Create the Seller instance
        seller = Seller.objects.create(user=user)
        return seller

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['name'] = user.name
        token['avatar'] = user.avatar.url
        token['phone'] = user.phone
        token['can_publish'] = user.can_publish

        return token

class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "password"]

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
