from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Role, User, Seller
from .serializers import (
    PayPalConfigSerializer,
    RegisterUserSerializer,
    MyTokenObtainPairSerializer,
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


@api_view(['PUT'])
def edit_profile(request, email):
    try:
        user = User.objects.get(email=email)
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
def request_seller(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    # Verificar si ya existe una solicitud de vendedor
    if Seller.objects.filter(user=user).exists():
        return Response({'detail': 'El usuario ya ha solicitado ser vendedor.'}, status=status.HTTP_400_BAD_REQUEST)

    # Crear la solicitud de vendedor
    seller = Seller(user=user)
    seller.save()

    serializer = SellerRequestSerializer(seller)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

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
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = PayPalConfigSerializer(data=request.data, context={'user': user})
    
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    