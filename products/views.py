from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.text import slugify
from rest_framework import status
from . models import Product, ProductImage
from . serializers import ProductSerializer, ReviewSerializer
from backend.pagination import CustomPagination

from django.views.decorators.csrf import csrf_exempt

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
        product_serializer = ProductSerializer(data=request.data)
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
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    product = Product.objects.filter(name__icontains=query)
    serializer = ProductSerializer(product, many=True)
    return Response({'products': serializer.data})

@api_view(['GET'])
def get_products_by_locate(request):
    locate = request.query_params.get('locate')
    if locate is None:
        return Response({'error': 'La ubicación es requerida'}, status=400)
    products = Product.objects.filter(location__icontains=locate)
    if not products:
        return Response({'error': 'No se encontraron productos con esa ubicación'}, status=404)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_locate(request):
    locations = Product.objects.values_list('locate', flat=True).distinct()
    return Response(list(locations))

@api_view(['GET'])
def get_products_random(request):
    products = Product.objects.order_by('?')[:12]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_last_12_products(request):
    order_by = request.query_params.get('order_by')
    if order_by is None:
        order_by = '-created'
    products = Product.objects.all().order_by(order_by)[:8]
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    paginator = CustomPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_product_admin(request, id):
    products = Product.objects.get(id=id)
    serializer = ProductSerializer(products, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, slug):
    products = Product.objects.get(slug=slug)
    serializer = ProductSerializer(products, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
def edit_product(request, pk):
    product = Product.objects.get(pk=pk)
    if request.user.is_staff:
        serializer = ProductSerializer(product, data=request.data)
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
    if request.user.is_staff:
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
