from gettext import translation
import json
from datetime import datetime

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.html import strip_tags
from django.template.loader import render_to_string
import mercadopago
from django.conf import settings

from .models import Order, Orderitem, ShoppingAddress, TemporaryOrder , Notification , OrderConfirmation

from .serializers import OrderItemSerializer, OrderSerializer
from products.models import Product
from django.core.mail import send_mail
import logging
from users.models import MercadoPagoConfig, User
from products.models import Product

logger = logging.getLogger(__name__)


@api_view(['GET'])
def search(request):
    query = request.query_params.get('query', '')
    orders = Order.objects.filter(user__email__icontains=query)
    serializer = OrderSerializer(orders, many=True)
    return Response({'orders': serializer.data})

# Listado de todas las órdenes
@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# Creación de orden definitiva (flujo anterior, sin Payment)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """
    Crea una orden definitiva a partir de los datos enviados por el front.
    Se espera recibir:
      - order_items: string JSON de una lista de items (cada uno con id, quantity, price)
      - total_price: total de la orden
      - address, city, postal_code: datos de envío
    """
    user = request.user
    data = request.data

    try:
        orderItems = json.loads(data['order_items'])
    except (json.JSONDecodeError, TypeError):
        return Response({'error': 'Invalid format for order_items'}, status=status.HTTP_400_BAD_REQUEST)

    total_price = data['total_price']

    # Crear la orden definitiva
    order = Order.objects.create(
        user=user,
        total_price=total_price
    )

    # Crear la dirección de envío
    ShoppingAddress.objects.create(
        order=order,
        address=data['address'],
        city=data['city'],
        postal_code=data['postal_code'],
    )

    # Crear cada ítem de la orden y actualizar stock
    for i in orderItems:
        try:
            product = Product.objects.get(id=i['id'])
        except Product.DoesNotExist:
            continue
        Orderitem.objects.create(
            product=product,
            order=order,
            quantity=i['quantity'],
            price=i['price']
        )
        product.count_in_stock -= i['quantity']
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Obtener orden específica
@api_view(['GET'])
def solo_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

#NMis Ordenes 
@api_view(['GET'])
def my_orders(request):
    user = request.user
    orders = user.buyer_orders.all()  # 👈 Cambiar order_set a buyer_orders
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# Marcar orden como entregada
@api_view(['PUT'])
def delivered(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.save()
    return Response('Order was delivered')

# Obtener ítems de una orden
@api_view(['GET'])
def get_order_items(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        items = order.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_pending_orders(request):
    seller = request.user  

    orders = Order.objects.filter(
        orderitem__product__user=seller,  
        is_delivered=False  
    ).distinct()  

    # Serializamos las órdenes
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_delivered_orders(request):
    seller = request.user

    orders = Order.objects.filter(
        orderitem__product__user=seller, 
        is_delivered=True 
    ).distinct() 

    # Serializamos las órdenes
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_temp_preference(request):
    user = request.user
    data = request.data
    
    try:
        # Manejo seguro de order_items
        order_items = data.get('order_items', [])
        if isinstance(order_items, str):
            try:
                order_items = json.loads(order_items)
            except json.JSONDecodeError:
                return Response({"error": "Formato inválido para order_items"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not order_items or not isinstance(order_items, list):
            return Response({"error": "No hay productos válidos en la orden"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener vendedor del primer producto
        try:
            first_product = Product.objects.get(id=order_items[0]['id'])
            seller = first_product.user
        except Product.DoesNotExist:
            return Response({"error": f"Producto {order_items[0]['id']} no existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que todos los productos sean del mismo vendedor
        for item in order_items:
            try:
                product = Product.objects.get(id=item['id'])
                if product.user != seller:
                    return Response({"error": "Todos los productos deben ser del mismo vendedor"}, status=status.HTTP_400_BAD_REQUEST)
            except Product.DoesNotExist:
                return Response({"error": f"Producto {item['id']} no existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar credenciales del vendedor
        try:
            mp_config = MercadoPagoConfig.objects.get(user=seller)
        except MercadoPagoConfig.DoesNotExist:
            return Response({"error": "El vendedor no tiene configurado MercadoPago"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear orden temporal
        temp_order = TemporaryOrder.objects.create(
            user=user,
            seller=seller,
            order_data={
                "order_items": order_items,
                "total_price": data.get('total_price'),
                "address": data.get('address'),
                "city": data.get('city'),
                "postal_code": data.get('postal_code'),
            }
        )
        
        # Configurar SDK con credenciales del vendedor
        mp = mercadopago.SDK(mp_config.access_token)
        
        # Preparar items para MercadoPago
        mp_items = []
        for item in order_items:
            product = Product.objects.get(id=item['id'])
            mp_items.append({
                "title": product.name,
                "quantity": item['quantity'],
                "unit_price": float(item['price']),
                "currency_id": "COP"
            })
        
        # Crear preferencia de pago
        preference_data = {
            "items": mp_items,
            "payer": {
                "name": user.name,
                "email": user.email
            },
            "external_reference": str(temp_order.id),
            "notification_url": f"{settings.BACKEND_URL}/orders/payment/webhook/",
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/payment/success?preference_id={temp_order.id}",
                "failure": f"{settings.FRONTEND_URL}/payment/failure",
                "pending": f"{settings.FRONTEND_URL}/payment/pending"
            },
            "auto_return": "approved",
            "statement_descriptor": f"Compra a {seller}"
        }
        
        preference_response = mp.preference().create(preference_data)
        
        if not preference_response.get('response'):
            logger.error("Error al crear preferencia", extra={
                "response": preference_response,
                "user": user.id,
                "seller": seller.id
            })
            return Response({"error": "Error al crear la preferencia de pago"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        temp_order.mp_preference_id = preference_response['response']['id']
        temp_order.save()
        
        return Response({
            "init_point": preference_response['response']['init_point'],
            "preference_id": temp_order.id,
            "public_key": mp_config.public_key
        })
        
    except Exception as e:
        logger.error(f"Error en create_temp_preference: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_order_received(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificamos si el usuario que realiza la acción es el cliente que compró la orden
    if order.user != request.user:
        return Response({'detail': 'You are not authorized to confirm this order'}, status=status.HTTP_403_FORBIDDEN)

    # Verificamos si la orden ha sido entregada
    if not order.is_delivered:
        return Response({'detail': 'Order must be delivered before confirmation'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Creamos la confirmación de recepción
    confirmation, created = OrderConfirmation.objects.get_or_create(
        order=order,
        confirmed_by_user=request.user
    )

    # Crear la notificación para el vendedor
    # Suponiendo que el vendedor es el propietario del producto relacionado con la orden
    seller = order.orderitem_set.first().product.user  # Obtener el vendedor asociado con la orden (producto)
    
    notification = Notification.objects.create(
        user=seller,  # Notificación dirigida al vendedor
        message=f"The customer has confirmed that order {order.id} has been received.",
        link=f"/orders/{order.id}/",  # Enlace a la vista de detalles de la orden (ajusta según sea necesario)
    )

    # Aquí puedes agregar lógica para enviar un correo electrónico, SMS, o usar un servicio de notificaciones push

    return Response({'detail': 'Order confirmed as received and notification sent to seller'}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
    except Notification.DoesNotExist:
        return Response({'detail': 'Notification does not exist or you are not authorized'}, status=status.HTTP_400_BAD_REQUEST)

    notification.is_read = True
    notification.save()

    return Response({'detail': 'Notification marked as read'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_notifications(request):
    try:
        # Filtramos las notificaciones para el usuario autenticado
        notifications = Notification.objects.filter(user=request.user)

        # Convertir las notificaciones a un formato adecuado para el frontend
        notifications_data = [
            {
                'id': notification.id,
                'message': notification.message,
                'is_read': notification.is_read,
                'created_at': notification.created_at,
                'link': notification.link,
            }
            for notification in notifications
        ]

        return Response(notifications_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_order_confirmation(request, order_id):
    try:
        # Obtener la orden
        order = Order.objects.get(id=order_id)

        # Verificar si la orden ha sido confirmada
        confirmation_exists = OrderConfirmation.objects.filter(order=order).exists()

        # Retornar el estado de confirmación
        return Response({'confirmed': confirmation_exists}, status=status.HTTP_200_OK)
    
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)












































@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request, payment_id):
    try:
        # Obtener orden temporal para encontrar al vendedor
        temp_order = TemporaryOrder.objects.get(mp_preference_id=preference_id)
        seller = temp_order.seller
        
        # Usar credenciales del vendedor
        mp_config = MercadoPagoConfig.objects.get(user=seller)
        mp = mercadopago.SDK(mp_config.access_token)
        payment_info = mp.payment().get(payment_id)
        
        return Response({"status": payment_info['response']['status']})
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def webhook(request):
    try:
        data = json.loads(request.body)
        payment_id = data.get('data', {}).get('id')
        
        # Obtener preferencia usando credenciales globales (solo para obtener external_reference)
        mp_global = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
        payment_info = mp_global.payment().get(payment_id)
        external_reference = payment_info['response'].get('external_reference')
        
        # Obtener orden temporal y vendedor
        temp_order = TemporaryOrder.objects.get(id=external_reference)
        seller = temp_order.seller
        
        # Validar credenciales del vendedor
        try:
            mp_config = MercadoPagoConfig.objects.get(user=seller)
            mp_seller = mercadopago.SDK(mp_config.access_token)
            payment_info = mp_seller.payment().get(payment_id)
        except MercadoPagoConfig.DoesNotExist:
            return JsonResponse({"error": "Vendedor no tiene configurado MercadoPago"}, status=400)
        
        # Procesar pago
        if payment_info['response']['status'] == 'approved':
            # Crear orden definitiva
            order = Order.objects.create(
                user=temp_order.user,
                seller=seller,
                total_price=temp_order.order_data['total_price'],
                payment_id=payment_id,
                is_paid=True,
                paid_at=datetime.now()
            )
            # ... resto de la lógica ...
            
        return JsonResponse({"status": "success"})
    
    except Exception as e:
        logger.error(f"Error en webhook: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)










































@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def mercadopago_config(request):
    """
    GET: Obtiene la configuración de Mercado Pago del usuario
    POST: Guarda o actualiza la configuración de Mercado Pago del usuario
    """
    user = request.user
    
    if request.method == 'GET':
        try:
            mp_config = MercadoPagoConfig.objects.get(user=user)
            return Response({
                "public_key": mp_config.public_key,
                "has_access_token": bool(mp_config.access_token),
                "date_configured": mp_config.date_configured
            })
        except MercadoPagoConfig.DoesNotExist:
            return Response({
                "public_key": None,
                "has_access_token": False,
                "date_configured": None
            })
    
    elif request.method == 'POST':
        data = request.data
        public_key = data.get('public_key')
        access_token = data.get('access_token')
        
        if not public_key or not access_token:
            return Response({
                "error": "Se requieren public_key y access_token"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validamos que las credenciales sean correctas
        try:
            mp = mercadopago.SDK(access_token)
            user_info = mp.user().get()
            
            if "response" not in user_info:
                return Response({
                    "error": "Credenciales inválidas de Mercado Pago"
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "error": f"Error al validar credenciales: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Guardamos o actualizamos la configuración
        mp_config, created = MercadoPagoConfig.objects.update_or_create(
            user=user,
            defaults={
                'public_key': public_key,
                'access_token': access_token,
                'date_configured': timezone.now()
            }
        )
        
        return Response({
            "message": "Configuración guardada correctamente",
            "public_key": mp_config.public_key,
            "has_access_token": bool(mp_config.access_token),
            "date_configured": mp_config.date_configured
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

def finalize_order(temp_order, payment_id):
    order_data = temp_order.order_data
    
    # Asegurarnos de que los campos opcionales tengan valores por defecto
    seller_id = order_data.get("seller_id")
    shipping_price = order_data.get("shipping_price", 0.0)  # Valor por defecto 0
    tax_price = order_data.get("tax_price", 0.0)  # Valor por defecto 0
    
    order = Order.objects.create(
        user=temp_order.user,
        total_price=order_data["total_price"],
        payment_method="mercadopago",
        payment_id=payment_id,
        is_paid=True,
        paid_at=datetime.now(),
        seller_id=seller_id,  # Nuevo campo
        shipping_price=shipping_price,  # Nuevo campo
        tax_price=tax_price  # Nuevo campo
    )

    # Resto del código permanece igual...
    ShoppingAddress.objects.create(
        order=order,
        address=order_data["address"],
        city=order_data["city"],
        postal_code=order_data["postal_code"],
        country="Colombia"
    )

    for item in order_data["order_items"]:
        try:
            product = Product.objects.get(id=item["id"])
        except Product.DoesNotExist:
            logger.warning(f"Producto no encontrado: {item['id']}")
            continue
        Orderitem.objects.create(
            product=product,
            order=order,
            quantity=item["quantity"],
            price=item["price"]
        )
        product.count_in_stock = max(0, product.count_in_stock - item["quantity"])
        product.save()

    temp_order.delete()
    
    try:
        send_order_confirmation_email(order)
        logger.info(f"Correo de confirmación enviado para la orden {order.id}")
    except Exception as e:
        logger.error(f"Error al enviar correo de confirmación: {str(e)}")
    
    return order


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finalize_order_on_success(request):
    """
    Endpoint para finalizar la creación de la orden cuando se redirige al usuario
    en la página de éxito. Se espera recibir el payment_id.
    """
    user = request.user
    data = request.data
    payment_id = data.get("payment_id")

    if not payment_id:
        return Response({"error": "payment_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar si la orden ya existe
    if Order.objects.filter(payment_id=payment_id).exists():
        order = Order.objects.get(payment_id=payment_id)
        return Response({
            "status": "approved",
            "message": "Pago aprobado y orden ya creada",
            "order_id": order.id,
            "seller_id": order.seller_id,
            "shipping_price": order.shipping_price,
            "tax_price": order.tax_price
        })
   
    external_reference = data.get("external_reference")
    if not external_reference:
        return Response({"error": "external_reference es requerido"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        temp_order = TemporaryOrder.objects.get(id=external_reference)
    except TemporaryOrder.DoesNotExist:
        return Response({"error": "Orden temporal no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    # Finalizar la orden con los nuevos campos
    order = finalize_order(temp_order, payment_id)
    
    # Enviar email de confirmación
    send_order_confirmation_email(order)

    return Response({
        "status": "approved",
        "message": "Orden creada exitosamente",
        "order_id": order.id,
        "seller_id": order.seller_id,
        "shipping_price": float(order.shipping_price),  # Convertir a float para JSON
        "tax_price": float(order.tax_price)  # Convertir a float para JSON
    }, status=status.HTTP_201_CREATED)

def send_order_confirmation_email(order):
    subject = "Confirmación de Pedido"
    recipient_email = order.user.email
    context = {"user": order.user, "order": order}

    html_content = render_to_string("emails/Orde.html", context)
    plain_message = strip_tags(html_content)  

    send_mail(
        subject, 
        plain_message,
        "noreply@tudominio.com",  
        [recipient_email], 
        html_message=html_content, 
        fail_silently=False,
    )