import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from .models import Order, Orderitem, ShoppingAddress
from .serializers import OrderItemSerializer, OrderSerializer
from products.models import Product


@api_view(['GET'])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    order = Order.objects.filter(user__email__icontains=query)
    serializer = OrderSerializer(order, many=True)
    return Response({'orders': serializer.data})


@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_order(request):
    user = request.user
    data = request.data
    
    try:
        orderItems = json.loads(data['order_items'])
    except (json.JSONDecodeError, TypeError) as e:
        return Response({'error': 'Invalid format for order_items'}, status=status.HTTP_400_BAD_REQUEST)

    total_price = data['total_price']
    
    order = Order.objects.create(
        user=user,
        total_price=total_price
    )

    ShoppingAddress.objects.create(
        order=order,
        address=data['address'],
        city=data['city'],
        postal_code=data['postal_code'],
    )

    for i in orderItems:
        product = Product.objects.get(id=i['id'])
        item = Orderitem.objects.create(
            product=product,
            order=order,
            quantity=i['quantity'],
            price=i['price']
        )

        product.count_in_stock -= item.quantity
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def solo_order(request, pk):
    user = request.user
    try:
        order = Order.objects.get(pk=pk)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def delivered(request, pk):
    order = Order.objects.get(pk=pk)
    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.save()
    return Response('Order was delivered')

@api_view(['GET'])
def get_order_items(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        items = order.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)

