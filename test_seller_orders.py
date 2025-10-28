import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order
from users.models import User
from orders.serializers import OrderSerializer

# Obtener el admin
admin = User.objects.get(email='admin@admin.com')

print(f"🔍 Probando vistas para: {admin.email}")
print(f"   Role: {admin.role}")
print(f"   ID: {admin.id}")
print()

# Simular la vista seller_pending_orders
print("=" * 50)
print("📦 ÓRDENES PENDIENTES (my/pending/)")
print("=" * 50)
pending_orders = Order.objects.filter(
    seller=admin,
    status__in=['pending', 'preparing', 'shipped']
).order_by('-created_at')

print(f"Total encontradas: {pending_orders.count()}")
for order in pending_orders:
    print(f"  ✅ Orden #{order.id}")
    print(f"     - Status: {order.status}")
    print(f"     - Cliente: {order.user.email}")
    print(f"     - Precio: ${order.total_price}")
    print()

# Serializar
serializer = OrderSerializer(pending_orders, many=True)
print(f"Datos serializados: {len(serializer.data)} órdenes")
print()

# Simular la vista seller_delivered_orders
print("=" * 50)
print("📦 ÓRDENES ENTREGADAS (my/seller/delivered/)")
print("=" * 50)
delivered_orders = Order.objects.filter(
    seller=admin,
    status__in=['delivered', 'completed']
).order_by('-created_at')

print(f"Total encontradas: {delivered_orders.count()}")
for order in delivered_orders:
    print(f"  ✅ Orden #{order.id}")
    print(f"     - Status: {order.status}")
    print(f"     - Cliente: {order.user.email}")
    print(f"     - Precio: ${order.total_price}")
    print()

# Serializar
serializer = OrderSerializer(delivered_orders, many=True)
print(f"Datos serializados: {len(serializer.data)} órdenes")
