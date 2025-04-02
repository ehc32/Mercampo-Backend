import random
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.db.models import Q
from django.db.models import Count
from django.db.models import Avg
from backend.pagination import CustomPagination
from .models import PayPalConfig, Role, User, Seller, Enterprise, EnterprisePost, PostComment, PasswordReset , MercadoPagoConfig

from .serializers import (
    PostCommentSerializer,
    EnterprisePostSerializer,
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
    search_query = request.query_params.get('search', None)
    
    # Filtro corregido para incluir NULL como activo
    enterprises = Enterprise.objects.all()
    
    if search_query:
        enterprises = enterprises.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(tipo_productos__icontains=search_query) |
            Q(address__icontains=search_query)
        )
    
    paginator = CustomPagination()  
    result_page = paginator.paginate_queryset(enterprises, request)  
    serializer = EnterpriseSerializer(result_page, many=True)
    
    response = paginator.get_paginated_response(serializer.data)
    response.data['total_enterprises'] = enterprises.count()
    
    return response

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

@api_view(['GET'])
def get_enterprise_by_user(request, user_id):
    try:
        enterprise = Enterprise.objects.select_related('owner_user').get(owner_user_id=user_id)
        
        enterprise_serializer = EnterpriseSerializer(enterprise)
        user_serializer = UserSerializer(enterprise.owner_user)
        
        response_data = {
            'enterprise': enterprise_serializer.data,
            'owner': user_serializer.data
        }
        
        return Response(response_data)
    except Enterprise.DoesNotExist:
        return Response(
            {"detail": "No se encontró empresa para este usuario"}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def create_post(request):
    try:
        # Verificar que el usuario tenga empresa
        enterprise = Enterprise.objects.get(owner_user=request.user)
        
        # Copiar datos y asignar relaciones
        data = request.data.copy()
        data['enterprise'] = enterprise.owner_user_id
        data['owner'] = request.user.id
        
        # Convertir imágenes a formato correcto si vienen como objeto
        if 'images' in data:
            if isinstance(data['images'], dict):
                # Si viene como objeto (ej: {"0": "img1", "1": "img2"})
                data['images'] = list(data['images'].values())
            elif isinstance(data['images'], str):
                # Si viene como string, convertir a lista de un elemento
                data['images'] = [data['images']] if data['images'] else []
            # Si ya es lista, no hacer nada
            
            # Filtrar imágenes vacías
            data['images'] = [img for img in data['images'] if img and img.strip()]
        
        # Validar que haya al menos una imagen o un redirect_link
        if not data.get('images') and not data.get('redirect_link'):
            return Response(
                {"detail": "Debe proporcionar al menos una imagen o un enlace de redirección"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = EnterprisePostSerializer(data=data)
        
        if serializer.is_valid():
            post = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Enterprise.DoesNotExist:
        return Response(
            {"detail": "El usuario no tiene una empresa registrada"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"detail": f"Error inesperado: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def create_comment(request, post_id):
    """
    Crea un comentario en un post
    Requiere:
    - comment (string)
    - rating (float opcional entre 0-5)
    """
    try:
        post = EnterprisePost.objects.get(pk=post_id)
    except EnterprisePost.DoesNotExist:
        return Response(
            {"detail": "Post no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    data = request.data.copy()
    data['post'] = post.id
    data['user'] = request.user.id  # Asigna automáticamente el usuario logueado
    
    serializer = PostCommentSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_posts_with_comments(request, owner_user_id):
    try:
        enterprise = Enterprise.objects.get(owner_user_id=owner_user_id)
    except Enterprise.DoesNotExist:
        return Response(
            {"detail": "Empresa no encontrada"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    posts = EnterprisePost.objects.filter(
        enterprise=enterprise, 
    ).order_by('-created_at')
    
    paginator = CustomPagination()
    paginated_posts = paginator.paginate_queryset(posts, request)
    
    posts_data = []
    for post in paginated_posts:
        post_serializer = EnterprisePostSerializer(post)
        
        comments = PostComment.objects.filter(
            post=post, 
            is_active=True
        ).order_by('created_at')
        comments_serializer = PostCommentSerializer(comments, many=True)
        
        posts_data.append({
            **post_serializer.data,
            'comments': comments_serializer.data
        })
    
    return paginator.get_paginated_response(posts_data)

@api_view(['GET'])
def get_all_posts_with_comments(request):
    # Obtener parámetros de consulta
    order_by_date = request.query_params.get('order_by_date', 'desc')  # 'asc' o 'desc'
    order_by_comments = request.query_params.get('order_by_comments', None)  # 'asc' o 'desc'
    search_query = request.query_params.get('search', None)
    
    # Obtener todos los posts activos
    posts = EnterprisePost.objects.filter(is_active=True)
    
    # Aplicar filtro de búsqueda si existe
    if search_query:
        posts = posts.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)  # Cambiado de content a description
        )
    
    # Anotar con el conteo de comentarios activos para todos los posts
    posts = posts.annotate(
        active_comment_count=Count(
            'comments', 
            filter=Q(comments__is_active=True)
        )
    )
    
    # Aplicar ordenamiento por fecha
    if order_by_date.lower() == 'asc':
        posts = posts.order_by('created_at')
    else:  # Por defecto orden descendente
        posts = posts.order_by('-created_at')
    
    # Aplicar ordenamiento por cantidad de comentarios si se solicita
    if order_by_comments:
        if order_by_comments.lower() == 'asc':
            posts = posts.order_by('active_comment_count')
        else:
            posts = posts.order_by('-active_comment_count')
    
    # Contar el total de posts antes de la paginación
    total_posts = posts.count()
    
    # Configurar la paginación
    paginator = CustomPagination()
    paginated_posts = paginator.paginate_queryset(posts, request)
    
    posts_data = []
    for post in paginated_posts:
        # Serializar el post
        post_serializer = EnterprisePostSerializer(post)
        
        # Obtener todos los comentarios activos para este post
        comments = post.comments.filter(is_active=True).order_by('created_at')
        comments_serializer = PostCommentSerializer(comments, many=True)
        
        # Agregar los datos del post con sus comentarios
        posts_data.append({
            **post_serializer.data,
            'comments': comments_serializer.data,
            'comment_count': post.active_comment_count  # Usamos la anotación ya calculada
        })
    
    # Obtener la respuesta paginada
    response = paginator.get_paginated_response(posts_data)
    
    # Agregar el contador total al response
    response.data['total_posts'] = total_posts
    
    return response

@api_view(['GET'])
def get_single_post(request, post_id):
    try:
        post = EnterprisePost.objects.get(pk=post_id, is_active=True)
    except EnterprisePost.DoesNotExist:
        return Response(
            {"detail": "Post no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    post_serializer = EnterprisePostSerializer(post)
    
    comments = PostComment.objects.filter(
        post=post, 
        is_active=True
    ).order_by('created_at')
    
    paginator = CustomPagination()
    paginated_comments = paginator.paginate_queryset(comments, request)
    comments_serializer = PostCommentSerializer(paginated_comments, many=True)
    
    response_data = {
        **post_serializer.data,
        'comments': paginator.get_paginated_response(comments_serializer.data).data
    }
    
    return Response(response_data)

@api_view(['PATCH', 'DELETE'])
def update_or_delete_post(request, post_id):
    try:
        post = EnterprisePost.objects.get(pk=post_id)
    except EnterprisePost.DoesNotExist:
        return Response(
            {"detail": "Post no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar que el usuario es el dueño del post o admin
    if request.user != post.owner and request.user.role != 'admin':
        return Response(
            {"detail": "No tienes permiso para realizar esta acción"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PATCH':
        data = request.data.copy()
        
        # Convertir imágenes a lista si vienen como string
        if 'images' in data and isinstance(data['images'], str):
            data['images'] = [data['images']] if data['images'] else []
        
        serializer = EnterprisePostSerializer(
            post, 
            data=data, 
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        post.delete()
        return Response(
            {"detail": "Post eliminado correctamente"},
            status=status.HTTP_204_NO_CONTENT
        )
        
@api_view(['PATCH', 'DELETE'])
def update_or_delete_comment(request, comment_id):
    """
    Vista para actualizar o eliminar un comentario.
    - PATCH: Actualiza el comentario y/o rating
    - DELETE: Elimina el comentario (marca como inactivo)
    """
    try:
        comment = PostComment.objects.get(pk=comment_id)
    except PostComment.DoesNotExist:
        return Response(
            {"detail": "Comentario no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar que el usuario es el autor del comentario o admin
    if request.user != comment.user and request.user.role != 'admin':
        return Response(
            {"detail": "No tienes permiso para modificar este comentario"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PATCH':
        serializer = PostCommentSerializer(
            comment, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            updated_comment = serializer.save()
            
            # Actualizar rating promedio del post si se modificó el rating
            if 'rating' in request.data:
                post = comment.post
                comments = post.comments.filter(rating__isnull=False, is_active=True)
                avg_rating = comments.aggregate(Avg('rating'))['rating__avg']
                post.rating = avg_rating or 0
                post.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Marcar como inactivo en lugar de borrar físicamente
        comment.is_active = False
        comment.save()
        
        # Recalcular el rating promedio del post
        post = comment.post
        comments = post.comments.filter(rating__isnull=False, is_active=True)
        avg_rating = comments.aggregate(Avg('rating'))['rating__avg']
        post.rating = avg_rating or 0
        post.save()
        
        return Response(
            {"detail": "Comentario eliminado correctamente"},
            status=status.HTTP_204_NO_CONTENT
        )
