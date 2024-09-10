import datetime
from rest_framework.response import Response
from django.http import QueryDict
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.text import slugify
from rest_framework import status
from . models import Category, Product, Reviews
from . serializers import ProductCreateSerializer, ProductReadSerializer, ProductImagesSerializer, ReviewCreateSerializer, ReviewSerializer
from backend.pagination import CustomPagination

from datetime import timedelta, datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify
@api_view(['POST'])
def create_product(request):
    print("llega hasta aqui")
    if request.user.role == 'seller' or request.user.role == 'admin':
        product_serializer = ProductCreateSerializer(data=request.data)
        
        if product_serializer.is_valid():
            name = product_serializer.validated_data['name']
            category = product_serializer.validated_data['category']
            tiempoL_value = product_serializer.validated_data.get('tiempoL', None)

            if tiempoL_value is None:
                weeks_to_add = 1
            elif tiempoL_value == 1:
                weeks_to_add = 2
            else:
                weeks_to_add = 0

            fecha_limite = datetime.now() + timedelta(weeks=weeks_to_add)

            s = name + category
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
    products = Product.objects.all()
    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductReadSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def FilterProductsView(request):
    products = Product.objects.all()

    locate = request.GET.get('locate')
    if locate:
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
            pass

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

@api_view(['PUT'])
def edit_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.role == "admin":
        serializer = ProductReadSerializer(product, data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            category = serializer.validated_data['category']
            s = name + category
            slug = slugify(s)
            serializer.save(user=request.user, slug=slug)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['DELETE'])
def delete_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.role == "admin":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)



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