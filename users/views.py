from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import PayPalConfig, Role, User, Seller

from .serializers import (
    PayPalConfigSerializer,
    RegisterUserSerializer,
    MyTokenObtainPairSerializer,
    UserCanPublishSerializer,
    UserSerializer,
    EditUserSerializer,
    SellerRequestSerializer
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
        user = User.objects.get(id=id)  # Cambiar de email a id
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.user.role == "admin" or request.user == user:
        serializer = EditUserSerializer(user, data=request.data)
        if serializer.is_valid():
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
def register(request):
    data = request.data
    print(data)
    
    serializer = RegisterUserSerializer(data=data)
    
    if serializer.is_valid():
        user = serializer.save(password=data['password'])
        
        if data.get('wantBeSeller', False):
            if not Seller.objects.filter(user=user).exists():
                seller = Seller(user=user)
                seller.save()

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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