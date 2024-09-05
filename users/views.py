from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import PublishStatus, Role, User, Seller
from .serializers import (
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
    serializer = RegisterUserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save(password=make_password(data['password']))
        return Response(UserSerializer(user).data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def request_seller(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    print(user.can_publish)
    if user.can_publish == "cliente":
        serializer = SellerRequestSerializer(data={'user': user.id})
        if serializer.is_valid():
            serializer.save(user=user)
            user.can_publish = "solicitando"
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Ya tienes una solicitud pendiente o eres vendedor.'}, status=status.HTTP_400_BAD_REQUEST)

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
        
        if user.role == Role.CLIENT.value and user.can_publish == PublishStatus.SOLICITANDO.value:
            user.role = Role.SELLER.value
            user.can_publish = PublishStatus.VENDIENDO.value
            user.save()
            return Response({'detail': 'Solicitud aprobada y usuario actualizado a vendedor.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'El usuario no es un cliente solicitante.'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Seller.DoesNotExist:
        return Response({'detail': 'Solicitud no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    