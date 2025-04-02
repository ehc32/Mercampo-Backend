from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Enterprise, PayPalConfig, User, Seller , MercadoPagoConfig
from django.contrib.auth.models import AnonymousUser

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
        token['avatar'] = user.avatar
        token['phone'] = user.phone
        token['phone'] = user.phone
        token['role'] = user.role
        token['can_publish'] = user.can_publish

        return token

class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "name", "phone", "avatar", "role"]  

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        instance.phone = validated_data.get('phone', instance.phone)
        
        avatar = validated_data.get('avatar', None)
        if avatar:
            instance.avatar = avatar
        
        instance.save()
        return instance


class PayPalConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPalConfig
        fields = ['app_name', 'client_id', 'secret_key']

    def create(self, validated_data):
        user = self.context.get('user')
        if user:
            paypal_config = PayPalConfig.objects.create(user=user, **validated_data)
            return paypal_config
        else:
            raise serializers.ValidationError("Usuario no proporcionado en el contexto.")
        
        
class MercadoPagoConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = MercadoPagoConfig
        fields = [ 'user', 'public_key', 'access_token' , 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context.get('user')
        if user:
            mercado_pago_config = MercadoPagoConfig.objects.create(user=user, **validated_data)
            return mercado_pago_config
        else:
            raise serializers.ValidationError("Usuario no proporcionado en el contexto.")


class UserCanPublishSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['can_publish']

    def update(self, instance, validated_data):
        instance.can_publish = not instance.can_publish
        instance.save()
        return instance


class EnterpriseSerializer(serializers.ModelSerializer):

    owner_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Enterprise
        fields = [
            'owner_user', 'name', 'phone', 'rut', 'tipo_productos', 'facebook',
            'instagram', 'whatsapp', 'address', 'products_length', 'description',
            'link_enterprise', 'avatar', 'is_active'
        ]

    def create(self, validated_data):
        owner_user = validated_data.pop('owner_user')

        avatar = validated_data.get('avatar', [None])
        rut = validated_data.get('rut', [None])
        
        tipo_productos = validated_data.get('tipo_productos', [])
        if isinstance(tipo_productos, list):
            tipo_productos = ', '.join(tipo_productos)

        validated_data['avatar'] = avatar
        validated_data['rut'] = rut
        validated_data['tipo_productos'] = tipo_productos
        
        # Validaciones opcionales
        if Enterprise.objects.filter(owner_user=owner_user).exists():
            raise serializers.ValidationError("Este usuario ya tiene una empresa registrada.")

        # Crear la empresa
        enterprise = Enterprise.objects.create(owner_user=owner_user, **validated_data)
        return enterprise
    


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=4)
    new_password = serializers.CharField(write_only=True)