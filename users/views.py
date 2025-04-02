import random
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.template.loader import render_to_string

from backend.pagination import CustomPagination
from .models import PayPalConfig, Role, User, Seller, Enterprise , PasswordReset , MercadoPagoConfig

from .serializers import (
    EnterpriseSerializer,
    PayPalConfigSerializer,
    RegisterUserSerializer,
    MyTokenObtainPairSerializer,
    UserCanPublishSerializer,
    UserSerializer,
    EditUserSerializer,
    SellerRequestSerializer,
     PasswordResetRequestSerializer, PasswordResetVerifySerializer , MercadoPagoConfigSerializer
)

@api_view(['GET'])
def get_solo_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)

class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['PUT'])
def edit_profile(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.user.role == "admin" or request.user == user:
        serializer = EditUserSerializer(user, data=request.data, partial=True)  # Permite actualizar parcialmente
        if serializer.is_valid():
            # Si se envía una contraseña en la solicitud, actualízala
            if 'password' in request.data:
                user.set_password(request.data['password'])

            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'No tienes permiso para editar este perfil.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def search(request):
    query = request.query_params.get('query', '')
    users = User.objects.filter(email__icontains=query)
    serializer = UserSerializer(users, many=True)
    return Response({'users': serializer.data})


@api_view(['DELETE'])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.user.role == "admin":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
def get_users(request):
    users = User.objects.exclude(email='admin@admin.com')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def register(request):
    data = request.data
    print(data)
    serializer = RegisterUserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save(password=data['password'])
        
        return Response(UserSerializer(user).data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_seller(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if not Seller.objects.filter(user=user).exists():
        seller = Seller(user=user)
        seller.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)



@api_view(['GET'])
def get_request_seller(request):
    sellers = Seller.objects.all()
    serializer = SellerRequestSerializer(sellers, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_request(request, pk):
    try:
        seller_request = Seller.objects.get(pk=pk)
        seller_request.delete()
        return Response({'detail': 'Solicitud eliminada exitosamente.'}, status=status.HTTP_204_NO_CONTENT)
    except Seller.DoesNotExist:
        return Response({'detail': 'Solicitud no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def approve_request(request, pk):
    try:
        seller_request = Seller.objects.get(pk=pk)
        user = seller_request.user
        
        if user.role == Role.CLIENT.value and not user.can_publish:
            user.role = Role.SELLER.value
            user.can_publish = True  
            user.save()
            seller_request.delete()
            return Response({'detail': 'Solicitud aprobada y usuario actualizado a vendedor.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'El usuario no es un cliente solicitante o ya tiene permisos de publicación.'}, status=status.HTTP_400_BAD_REQUEST)
        
    except Seller.DoesNotExist:
        return Response({'detail': 'Solicitud no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def request_seller_paypal_config(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = PayPalConfigSerializer(data=request.data, context={'request': request, 'user': user})
        if serializer.is_valid():
            serializer.save()  # El serializador se encargará de asignar el usuario
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_seller_paypal_config_done(request, pk):
    try:
        paypal_config = PayPalConfig.objects.get(user_id=pk)
        serializer = PayPalConfigSerializer(paypal_config)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PayPalConfig.DoesNotExist:
        return Response({'detail': 'Configuración de PayPal no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def request_seller_mercado_pago_config(request, pk):
    try:
        user = User.objects.get(pk=pk)
        
        # Verifica si ya existe configuración para este usuario
        existing_config = MercadoPagoConfig.objects.filter(user=user).first()
        
        if existing_config:
            serializer = MercadoPagoConfigSerializer(existing_config, data=request.data, partial=True)
        else:
            serializer = MercadoPagoConfigSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_seller_mercado_pago_config(request, pk):
    try:
        mercado_pago_config = MercadoPagoConfig.objects.get(user_id=pk)
        serializer = MercadoPagoConfigSerializer(mercado_pago_config)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except MercadoPagoConfig.DoesNotExist:
        return Response({'detail': 'Configuración de MercadoPago no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def change_can_publish(request, idUser):
    try:
        user = User.objects.get(pk=idUser)
        
        if user.role == 'seller' or user.role == 'admin':
            serializer = UserCanPublishSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({'detail': f'Estado de publicación actualizado: {user.can_publish}'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif user.role == 'client':
            return Response({'detail': 'Los vendedores no pueden cambiar el estado de publicación.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'detail': 'Rol de usuario no permitido para esta acción.'}, status=status.HTTP_400_BAD_REQUEST)
    
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def create_enterprise(request, idUser):
    try:
        user = User.objects.get(pk=idUser)

        enterprise_data = request.data.copy()
        enterprise_data['owner_user'] = user.id

        serializer = EnterpriseSerializer(data=enterprise_data)
        
        if serializer.is_valid():
            enterprise = serializer.save()
            user.enterprise = enterprise
            user.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_enterprises(request):
    enterprises = Enterprise.objects.all()
    paginator = CustomPagination()  
    result_page = paginator.paginate_queryset(enterprises, request)  
    serializer = EnterpriseSerializer(result_page, many=True)  
    return paginator.get_paginated_response(serializer.data) 



@api_view(['POST'])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'No se encontró una cuenta asociada a este correo.'}, status=status.HTTP_404_NOT_FOUND)
        
        code = f"{random.randint(1000, 9999)}"
        
        PasswordReset.objects.create(user=user, code=code)
        
        html_message = render_to_string("emails/password_reset.html", {"code": code})
        plain_message = strip_tags(html_message)  # Para clientes sin soporte HTML
        
        # Enviar correo
        send_mail(
            "Recuperación de contraseña",
            plain_message,
            "noreply@tudominio.com",
            [email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return Response({'detail': 'Hemos enviado un código de verificación a tu correo. Revisa tu bandeja de entrada o spam.'}, status=status.HTTP_200_OK)
    
    return Response({'detail': 'Por favor, proporciona un correo válido.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def password_reset_verify(request):
    serializer = PasswordResetVerifySerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Buscar el código más reciente para el usuario
        try:
            reset_entry = PasswordReset.objects.filter(user=user, code=code).latest('created_at')
        except PasswordReset.DoesNotExist:
            return Response({'detail': 'Código inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si el código ha expirado
        if reset_entry.is_expired():
            return Response({'detail': 'El código ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Actualizar la contraseña
        user.set_password(new_password)
        user.save()
        
        # Eliminar todas las entradas de recuperación para este usuario (opcional)
        PasswordReset.objects.filter(user=user).delete()
        
        return Response({'detail': 'Contraseña actualizada correctamente.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)