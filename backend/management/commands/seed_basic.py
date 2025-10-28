from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Enterprise
from products.models import Product
from orders.models import Order, Orderitem
from django.utils import timezone
import random

class Command(BaseCommand):
    help = "Seed basic users/products/orders for local testing"

    def handle(self, *args, **options):
        User = get_user_model()
        admin, _ = User.objects.get_or_create(email="admin@admin.com", defaults={"name":"Admin"})
        if not admin.password:
            admin.set_password("admin123")
            admin.save()

        # Create a buyer and seller
        buyer, _ = User.objects.get_or_create(email="buyer@example.com", defaults={"name": "Buyer"})
        if not buyer.password:
            buyer.set_password("buyer123"); buyer.save()

        seller, _ = User.objects.get_or_create(email="seller@example.com", defaults={"name": "Seller"})
        if not seller.password:
            seller.set_password("seller123"); seller.save()

        # Ensure seller has enterprise
        ent, _ = Enterprise.objects.get_or_create(owner_user=seller, defaults={
            "name": "Mercampo Seller",
            "address": "Local",
            "products_length": 0,
            "description": "Demo enterprise",
        })

        # Products
        created = 0
        for i in range(1, 11):
            p, was_created = Product.objects.get_or_create(
                name=f"Producto {i}",
                defaults={
                    "description": "Demo",
                    "category": "OTROS",
                    "price": random.randint(5,50),
                    "count_in_stock": random.randint(5,30),
                    "user": seller,
                },
            )
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Productos creados: {created}"))

        # Simple order
        prod = Product.objects.first()
        if prod:
            order, _ = Order.objects.get_or_create(
                user=buyer,
                seller=seller,
                defaults={
                    "total_price": prod.price or 10,
                    "is_paid": False,
                    "created_at": timezone.now(),
                },
            )
            Orderitem.objects.get_or_create(order=order, product=prod, defaults={"quantity":1, "price": str(prod.price or 10)})
            self.stdout.write(self.style.SUCCESS("Orden demo creada"))
        
        self.stdout.write(self.style.SUCCESS("Seed finalizado"))
