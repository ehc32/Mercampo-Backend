from rest_framework import serializers
from .models import Order, Orderitem, ShoppingAddress
from products.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = Orderitem
        fields = '__all__'

class ShoppingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingAddress
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    orderitem_set = OrderItemSerializer(many=True, read_only=True)
    shoppingaddress = ShoppingAddressSerializer(read_only=True)
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
    
    def get_user(self, obj):
        user_data = {
            'id': obj.user.id,
            'email': obj.user.email,
        }
        first_name = getattr(obj.user, 'first_name', '')
        last_name = getattr(obj.user, 'last_name', '')
        if first_name or last_name:
            user_data['name'] = f"{first_name} {last_name}".strip()
        else:
            user_data['name'] = getattr(obj.user, 'username', obj.user.email)
        return user_data
