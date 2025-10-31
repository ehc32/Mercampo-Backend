import base64
import imghdr
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import timedelta, datetime

from rest_framework.response import Response
from django.http import QueryDict
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.text import slugify
from rest_framework import status
from rest_framework.response import Response
from . models import Category, Product, ProductImage, Reviews, ProductCategory, UnitOfMeasurement
from . serializers import (
    ProductCreateSerializer, 
    ProductReadSerializer, 
    ProductImagesSerializer, 
    ReviewCreateSerializer, 
    ReviewSerializer,
    ProductCategorySerializer,
    UnitOfMeasurementSerializer
)
from backend.pagination import CustomPagination


@api_view(['POST'])
def create_product(request):
    if request.user.role == 'seller' or request.user.role == 'admin':
        product_serializer = ProductCreateSerializer(data=request.data)
        
        if product_serializer.is_valid():
            name = product_serializer.validated_data['name']
            
            # Obtener categoría: priorizar product_category si existe, sino usar category
            category_str = ''
            if 'product_category' in product_serializer.validated_data and product_serializer.validated_data['product_category']:
                category_obj = product_serializer.validated_data['product_category']
                category_str = category_obj.name if hasattr(category_obj, 'name') else str(category_obj)
            elif 'category' in product_serializer.validated_data:
                category_str = product_serializer.validated_data['category']
            
            tiempoL_value = product_serializer.validated_data.get('tiempoL', None)

            if tiempoL_value is None:
                weeks_to_add = 1
            elif tiempoL_value == 1:
                weeks_to_add = 2
            else:
                weeks_to_add = 0

            fecha_limite = datetime.now() + timedelta(weeks=weeks_to_add)

            s = name + category_str
            slug = slugify(s)

            unique_slug = slug
            num = 1

            while Product.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{slug}-{num}"
                num += 1

            product_serializer.save(user=request.user, slug=unique_slug, fecha_limite=fecha_limite)
            return Response(status=status.HTTP_201_CREATED)
        else:
            print(product_serializer.errors)
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
def get_prod_by_cate(request, category):
    products = Product.objects.filter(category=category)
    paginator = CustomPagination()
    result_page = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

#traer precios de productos similares y promediar
@api_view(['GET'])
def search_products_similar(request, search):
    products = Product.objects.filter(name__icontains=search)
    if not products.exists():
        return Response({'message': 'No se encontraron productos que coincidan con la búsqueda.'}, status=status.HTTP_201_OK)
    prices = products.values_list('price', flat=True)
    average_price = sum(prices) / len(prices) if prices else 0
    return Response({'average_price': average_price}, status=status.HTTP_200_OK) #retornamos el promedio, aqui podemos traer mas datos que se requieran, de momento solo prom

@api_view(['GET'])
def news_products(request):
    products = Product.objects.filter(status=False)
    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_prod_by_caterandom(request, category):
    products = Product.objects.filter(category=category).order_by('?')[:12]
    serializer = ProductReadSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product_images(request, product_id):
    product = Product.objects.get(id=product_id)
    serializer = ProductImagesSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    product = Product.objects.filter(name__icontains=query)
    serializer = ProductReadSerializer(product, many=True)
    return Response({'products': serializer.data})


@api_view(['PUT'])
def update_status(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.status = True
        product.save()
        return Response({'message': 'El estado del producto se ha actualizado correctamente.'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_products_by_locate(request):
    locate = request.query_params.get('locate')
    if locate is None:
        return Response({'error': 'La ubicación es requerida'}, status=400)
    products = Product.objects.filter(location__icontains=locate)
    if not products:
        return Response({'error': 'No se encontraron productos con esa ubicación'}, status=404)
    serializer = ProductReadSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_locate(request):
    locations = Product.objects.values_list('locate', flat=True).distinct()
    return Response(list(locations))


@api_view(['GET'])
def get_products_random(request):
    products = Product.objects.order_by('?')[:8]
    serializer = ProductReadSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_last_12_products(request):
    order_by = request.query_params.get('order_by')
    if order_by is None:
        order_by = '-created'
    products = Product.objects.all().order_by(order_by)[:8]
    
    serializer = ProductReadSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.filter(status=True)
    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def FilterProductsView(request):
    products = Product.objects.filter(status=True)  # Filtra solo los productos activos

    locate = request.GET.get('locate')
    if locate and locate != 'Todos':
        products = products.filter(locate=locate)

    categories = request.GET.get('categories')
    if categories:
        category_names = categories.split(',')
        products = products.filter(category__in=category_names)

    price_range = request.GET.get('price')
    if price_range:
        if price_range == '1':
            products = products.filter(price__gte=0, price__lte=50000)
        elif price_range == '2':
            products = products.filter(price__gte=50000, price__lte=150000)
        elif price_range == '3':
            products = products.filter(price__gt=150000)

    time_range = request.GET.get('time')
    if time_range:
        if time_range == 'hoy':
            products = products.filter(created__date=datetime.date.today())
        elif time_range == 'semana':
            products = products.filter(created__gte=datetime.date.today() - datetime.timedelta(days=7))
        elif time_range == 'mes':
            products = products.filter(created__gte=datetime.date.today() - datetime.timedelta(days=30))
        elif time_range == 'manual':
            start_date = request.GET.get('startDate')
            end_date = request.GET.get('endDate')
            if start_date and end_date:
                products = products.filter(created__range=[start_date, end_date])
        elif time_range == 'todos':
            pass  # No se aplica ningún filtro de tiempo

    search_item = request.GET.get('searchItem')
    if search_item:
        products = products.filter(name__icontains=search_item)

    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_product_admin(request, id):
    products = Product.objects.get(id=id)
    serializer = ProductReadSerializer(products, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, slug):
    products = Product.objects.get(slug=slug)
    serializer = ProductReadSerializer(products, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_random_products_by_offer(request):
    today = timezone.now() 
    four_days_later = today + timedelta(days=4)    
    products = Product.objects.filter(
        fecha_limite__range=[today, four_days_later]
    ).order_by('?')[:15]    
    serializer = ProductReadSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_top_selling_products(request):
    products = Product.objects.all().order_by('-count_in_sells')[:15]
    serializer = ProductReadSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def edit_product(request, pk):
    
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    print(request.user.role)

    if request.user.role not in ["seller", "admin"]:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    # Guardamos el estado actual antes de la edición
    current_status = product.status
    
    # Procesamos los datos del producto
    serializer = ProductCreateSerializer(product, data=request.data, partial=True)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Actualizamos el slug si cambió el nombre o categoría
    name = serializer.validated_data.get('name', product.name)
    category = serializer.validated_data.get('category', product.category)
    s = name + category
    slug = slugify(s)
    
    # Procesamos las imágenes EXACTAMENTE como en el serializer de creación
    if 'images' in request.data:
        image = request.data['images']
        
        # Asegurarse de que es solo una imagen, no una lista
        if isinstance(image, list):
            image = image[0]  # Solo tomamos la primera

        try:
            # Limpiar imagen base64
            if "," in image:
                image = image.split(",")[1]

            image_data = base64.b64decode(image)
            image_type = imghdr.what(None, image_data)
            if image_type is None:
                image_type = 'jpg'
            image_name = f'image_0.{image_type}'
            image_file = ContentFile(image_data, name=image_name)

            # Eliminar imagen anterior
            ProductImage.objects.filter(product=product).delete()

            # Crear nueva imagen
            ProductImage.objects.create(product=product, image=image_file)
        except Exception as e:
            print(f"Error procesando la imagen: {str(e)}")

    # Guardamos el producto manteniendo el estado original
    updated_product = serializer.save(
        user=request.user, 
        slug=slug,
        status=current_status  # Mantenemos el estado original
    )
    
    # Forzamos la recarga de las relaciones
    updated_product.refresh_from_db()
    
    # Devolvemos los datos con el serializer de lectura
    read_serializer = ProductReadSerializer(updated_product)
    return Response(read_serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.role == "admin":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)


#
# Reviews
#


@api_view(['POST'])
def ReviewCreateView(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    existing_review = Reviews.objects.filter(product=product, user=request.user).first()
    if existing_review:
        return Response({"detail": "Ya opinaste sobre el producto."}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data.copy() if isinstance(request.data, QueryDict) else request.data
    data['product'] = product.id
    data['user'] = request.user.id  # Se asegura de que el usuario actual sea el que hace la reseña

    serializer = ReviewCreateSerializer(data=data)      

    if serializer.is_valid():
        serializer.save()  # Aquí se guarda la reseña y se actualiza el rating del producto
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def ReviewShowAllFromProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Ordenar las reseñas de forma aleatoria
    reviews = Reviews.objects.filter(product=product).order_by('?')
    
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#
# Reviews ends
#
#
# user's product
#

@api_view(['GET'])
def get_products_by_user(request, user_id):
    products = Product.objects.filter(user_id=user_id)
    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_products_sells_by_user(request, user_id):
    products = Product.objects.filter(user_id=user_id, count_in_sells__gt=0)
    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)


#
#  user's product ends
#
#
# sells
#

@api_view(['POST'])
def reduce_product_stock(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        quantity = int(request.data.get('quantity', 0))
        
        if quantity <= 0:
            return Response({"error": "La cantidad debe ser mayor a 0."}, status=status.HTTP_400_BAD_REQUEST)
        
        if product.count_in_stock < quantity:
            return Response({"error": "Stock insuficiente."}, status=status.HTTP_400_BAD_REQUEST)
        
        product.count_in_stock -= quantity
        product.save()

        return Response({"message": "Stock actualizado correctamente.", "count_in_stock": product.count_in_stock}, status=status.HTTP_200_OK)
    
    except Product.DoesNotExist:
        return Response({"error": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)


#
# ProductCategory CRUD Views
#

@api_view(['GET'])
def get_all_categories(request):
    """Obtener todas las categorías activas (público) o todas si es admin/seller"""
    if request.user.is_authenticated and request.user.role in ['admin', 'seller']:
        categories = ProductCategory.objects.all().order_by('name')
    else:
        categories = ProductCategory.objects.filter(is_active=True).order_by('name')
    
    serializer = ProductCategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_category(request, pk):
    """Obtener una categoría por ID"""
    try:
        category = ProductCategory.objects.get(pk=pk)
        if not category.is_active and request.user.role not in ['admin', 'seller']:
            return Response({'detail': 'Categoría no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductCategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ProductCategory.DoesNotExist:
        return Response({'detail': 'Categoría no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_category(request):
    """Crear una nueva categoría (solo Admin y Seller)"""
    if request.user.role not in ['admin', 'seller']:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProductCategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_category(request, pk):
    """Actualizar una categoría (solo Admin y Seller)"""
    if request.user.role not in ['admin', 'seller']:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        category = ProductCategory.objects.get(pk=pk)
    except ProductCategory.DoesNotExist:
        return Response({'detail': 'Categoría no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductCategorySerializer(category, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_category(request, pk):
    """Eliminar una categoría (solo Admin y Seller)"""
    if request.user.role not in ['admin', 'seller']:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        category = ProductCategory.objects.get(pk=pk)
        # Verificar si hay productos usando esta categoría
        products_count = Product.objects.filter(product_category=category).count()
        if products_count > 0:
            # En lugar de eliminar, desactivamos
            category.is_active = False
            category.save()
            return Response({
                'detail': f'La categoría fue desactivada porque tiene {products_count} producto(s) asociado(s).',
                'category': ProductCategorySerializer(category).data
            }, status=status.HTTP_200_OK)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ProductCategory.DoesNotExist:
        return Response({'detail': 'Categoría no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


#
# UnitOfMeasurement CRUD Views
#

@api_view(['GET'])
def get_all_units(request):
    """Obtener todas las unidades de medición activas (público) o todas si es admin/seller"""
    if request.user.is_authenticated and request.user.role in ['admin', 'seller']:
        units = UnitOfMeasurement.objects.all().order_by('name')
    else:
        units = UnitOfMeasurement.objects.filter(is_active=True).order_by('name')
    
    serializer = UnitOfMeasurementSerializer(units, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_unit(request, pk):
    """Obtener una unidad de medición por ID"""
    try:
        unit = UnitOfMeasurement.objects.get(pk=pk)
        if not unit.is_active and request.user.role not in ['admin', 'seller']:
            return Response({'detail': 'Unidad de medición no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UnitOfMeasurementSerializer(unit)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UnitOfMeasurement.DoesNotExist:
        return Response({'detail': 'Unidad de medición no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_unit(request):
    """Crear una nueva unidad de medición (solo Admin y Seller)"""
    if request.user.role not in ['admin', 'seller']:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = UnitOfMeasurementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_unit(request, pk):
    """Actualizar una unidad de medición (solo Admin y Seller)"""
    if request.user.role not in ['admin', 'seller']:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        unit = UnitOfMeasurement.objects.get(pk=pk)
    except UnitOfMeasurement.DoesNotExist:
        return Response({'detail': 'Unidad de medición no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UnitOfMeasurementSerializer(unit, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_unit(request, pk):
    """Eliminar una unidad de medición (solo Admin y Seller)"""
    if request.user.role not in ['admin', 'seller']:
        return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        unit = UnitOfMeasurement.objects.get(pk=pk)
        # Verificar si hay productos usando esta unidad
        products_count = Product.objects.filter(unit_of_measurement=unit).count()
        if products_count > 0:
            # En lugar de eliminar, desactivamos
            unit.is_active = False
            unit.save()
            return Response({
                'detail': f'La unidad fue desactivada porque tiene {products_count} producto(s) asociado(s).',
                'unit': UnitOfMeasurementSerializer(unit).data
            }, status=status.HTTP_200_OK)
        unit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except UnitOfMeasurement.DoesNotExist:
        return Response({'detail': 'Unidad de medición no encontrada.'}, status=status.HTTP_404_NOT_FOUND)