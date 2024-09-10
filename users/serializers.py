from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import PayPalConfig, User, Seller

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "id", "can_publish", "avatar", "role", "phone", "date_joined"]

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "phone", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone']

class SellerRequestSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()

    class Meta:
        model = Seller
        fields = ['user', 'date_requested']
        read_only_fields = ['date_requested']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.get(pk=user_data['id'])

        if Seller.objects.filter(user=user).exists():
            raise serializers.ValidationError("El usuario ya ha solicitado ser vendedor.")
        
        user.can_publish = 'solicitando'
        user.save()

        seller = Seller.objects.create(user=user)
        return seller


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['userId'] = user.id
        token['email'] = user.email
        token['name'] = user.name
        token['avatar'] = user.avatar.url
        token['phone'] = user.phone
        token['role'] = user.role
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

class PayPalConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPalConfig
        fields = ['user','app_name', 'client_id', 'secret_key']

    def create(self, validated_data):
        user = self.context['request'].user  # Obtén el usuario del contexto
        paypal_config = PayPalConfig.objects.create(user=user, **validated_data)
        return paypal_config
