from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from django.db.models import Avg
from .models import Enterprise, PayPalConfig, User, Seller, EnterprisePost, PostComment, MercadoPagoConfig, GoogleMapsConfig
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
        fields = ['public_key', 'access_token', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context.get('user')
        if user:
            # Asegurar que ambos campos estén presentes
            if 'access_token' not in validated_data or not validated_data.get('access_token'):
                raise serializers.ValidationError({"access_token": "El access_token es requerido"})
            if 'public_key' not in validated_data or not validated_data.get('public_key'):
                raise serializers.ValidationError({"public_key": "El public_key es requerido"})
            
            mercado_pago_config = MercadoPagoConfig.objects.create(user=user, **validated_data)
            return mercado_pago_config
        else:
            raise serializers.ValidationError("Usuario no proporcionado en el contexto.")
    
    def update(self, instance, validated_data):
        # Actualizar solo los campos proporcionados
        # Asegurarse de que ambos campos se actualicen si están presentes
        if 'public_key' in validated_data:
            instance.public_key = validated_data['public_key']
        if 'access_token' in validated_data:
            # Verificar que el access_token no esté vacío
            if validated_data['access_token'] and validated_data['access_token'].strip():
                instance.access_token = validated_data['access_token']
            else:
                raise serializers.ValidationError({"access_token": "El access_token no puede estar vacío"})
        instance.save()
        return instance


class GoogleMapsConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoogleMapsConfig
        fields = ["api_key", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]
    
    # Eliminado to_representation para que devuelva los datos completos cuando se necesite


class UserCanPublishSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['can_publish']

    def update(self, instance, validated_data):
        instance.can_publish = not instance.can_publish
        instance.save()
        return instance


class EnterpriseSerializer(serializers.ModelSerializer):
    owner_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    tipo_productos = serializers.CharField(required=False)

    class Meta:
        model = Enterprise
        fields = [
            'owner_user', 'name', 'phone', 'rut', 'tipo_productos', 'facebook',
            'instagram', 'whatsapp', 'address', 'products_length', 'description',
            'link_enterprise', 'avatar', 'is_active'
        ]
        extra_kwargs = {
            'rut': {'required': False},
            'products_length': {'required': False},
            'is_active': {'required': False},
        }

    def validate_tipo_productos(self, value):
        # Si viene como lista, convertir a string separado por comas
        if isinstance(value, list):
            return ', '.join(value)
        return value

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
        
        if Enterprise.objects.filter(owner_user=owner_user).exists():
            raise serializers.ValidationError("Este usuario ya tiene una empresa registrada.")

        enterprise = Enterprise.objects.create(owner_user=owner_user, **validated_data)
        return enterprise

    def update(self, instance, validated_data):
        # Procesar campos específicos si están presentes
        if 'tipo_productos' in validated_data:
            if isinstance(validated_data['tipo_productos'], list):
                validated_data['tipo_productos'] = ', '.join(validated_data['tipo_productos'])
        
        return super().update(instance, validated_data)
    
class EnterprisePostSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        write_only=True,
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = EnterprisePost
        fields = '__all__'
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.images:
            representation['images'] = [
                f"data:image/jpeg;base64,{img}" if not img.startswith('data:image') else img
                for img in instance.images.split(',')
            ]
        else:
            representation['images'] = []
        return representation
    
    def validate_images(self, value):
        # Filtrar imágenes vacías o nulas
        return [img for img in value if img and img.strip()]
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        if images:
            validated_data['images'] = ','.join(images)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if 'images' in validated_data:
            images = validated_data.pop('images', [])
            validated_data['images'] = ','.join(images) if images else ''
        
        # Continúa con la actualización normal
        return super().update(instance, validated_data)

class PostCommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault()
    )
    
    class Meta:
        model = PostComment
        fields = [
            'id', 'post', 'user', 'comment', 'rating',
            'created_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'user']

    def validate_rating(self, value):
        """Valida que el rating esté entre 0 y 5"""
        if value is not None and (value < 0 or value > 5):
            raise serializers.ValidationError("El rating debe estar entre 0 y 5")
        return value

    def create(self, validated_data):
        """
        Crea el comentario y actualiza el rating promedio del post.
        """
        comment = PostComment.objects.create(**validated_data)
        
        # Actualizar rating promedio del post si se proporcionó un rating
        if comment.rating is not None:
            post = comment.post
            comments = post.comments.filter(rating__isnull=False)
            avg_rating = comments.aggregate(Avg('rating'))['rating__avg']
            post.rating = avg_rating or 0
            post.save()
            
        return comment

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=4)
    new_password = serializers.CharField(write_only=True)