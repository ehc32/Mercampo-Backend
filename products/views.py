import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.text import slugify
from rest_framework import status
from . models import Category, Product
from . serializers import ProductCreateSerializer, ProductReadSerializer, ReviewSerializer, ProductImagesSerializer
from backend.pagination import CustomPagination


@api_view(['POST'])
def create_review(request, pk):
    serializer = ReviewSerializer(data=request.data)
    product = Product.objects.get(pk=pk)
    if serializer.is_valid():
        serializer.save(user=request.user, product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_product(request):
    print("llega hasta aqui")
    if request.user.role == 'client' or 'admin':
        print("Entra")
        product_serializer = ProductCreateSerializer(data=request.data)
        if product_serializer.is_valid():
            name = product_serializer.validated_data['name']
            category = product_serializer.validated_data['category']
            s = name + category
            slug = slugify(s)
            
            # Generar un slug único
            unique_slug = slug
            num = 1
            while Product.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{slug}-{num}"
                num += 1
            # Guardar el producto con el slug único
            product_serializer.save(user=request.user, slug=unique_slug)
            return Response(status=status.HTTP_201_CREATED)
        else:
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
            # No se aplica ningún filtro de fecha
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
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.role == "admin":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
