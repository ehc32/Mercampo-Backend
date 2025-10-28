"""
Script para actualizar órdenes existentes y asignarles el vendedor correcto
Ejecutar con: python fix_existing_orders.py
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order

def fix_orders():
    orders = Order.objects.filter(seller__isnull=True)
    updated_count = 0
    
    for order in orders:
        # Obtener el primer item de la orden
        first_item = order.orderitem_set.first()
        if first_item and first_item.product:
            order.seller = first_item.product.user
            order.save()
            updated_count += 1
            print(f"✅ Orden #{order.id} actualizada - Vendedor: {order.seller.email}")
    
    print(f"\n🎉 Total de órdenes actualizadas: {updated_count}")

if __name__ == "__main__":
    print("🔄 Actualizando órdenes existentes...")
    fix_orders()
    print("✅ Proceso completado!")
