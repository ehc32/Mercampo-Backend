from gettext import translation
import json
from datetime import datetime, timezone

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
import requests

from .models import Order, Orderitem, ShoppingAddress, TemporaryOrder , Notification , OrderConfirmation

from .serializers import OrderItemSerializer, OrderSerializer
from products.models import Product
from django.core.mail import send_mail
from django.db import transaction
import logging
from users.models import MercadoPagoConfig, User, PayPalConfig
from products.models import Product
from .paypal import paypal_create_order_api, paypal_capture_order_api, paypal_get_client_id_env

logger = logging.getLogger(__name__)


@api_view(['GET'])
def search(request):
    query = request.query_params.get('query', '')
    orders = Order.objects.filter(user__email__icontains=query)
    serializer = OrderSerializer(orders, many=True)
    return Response({'orders': serializer.data})

# Listado de todas las órdenes (para admin)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    # Solo admin puede ver todas las órdenes
    if request.user.role != 'admin':
        return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    # Filtrar órdenes que necesitan acción (pendientes, en preparación, enviadas)
    # Excluir completadas y canceladas para mostrar solo las activas
    orders = Order.objects.exclude(status__in=['completed', 'cancelled']).order_by('-created_at')
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
      - payment_method (opcional): método de pago usado
      - payment_id (opcional): ID de la transacción
    """
    user = request.user
    data = request.data

    try:
        orderItems = json.loads(data['order_items'])
    except (json.JSONDecodeError, TypeError):
        return Response({'error': 'Invalid format for order_items'}, status=status.HTTP_400_BAD_REQUEST)

    total_price = data['total_price']
    payment_method = data.get('payment_method', None)
    payment_id = data.get('payment_id', None)

    # Obtener el vendedor del primer producto (asumiendo que todos son del mismo vendedor)
    seller = None
    if orderItems:
        try:
            first_product = Product.objects.get(id=orderItems[0]['id'])
            seller = first_product.user
        except Product.DoesNotExist:
            pass

    # Crear la orden definitiva
    order = Order.objects.create(
        user=user,
        seller=seller,  # Asignar el vendedor
        total_price=total_price,
        payment_method=payment_method,
        payment_id=payment_id
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

# Marcar orden como entregada (mantener por compatibilidad, pero ahora actualiza también status)
@api_view(['PUT'])
def delivered(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
    # Actualizar tanto is_delivered como status para mantener consistencia
    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.status = 'delivered'  # Actualizar también el campo status
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

    # Usar el campo seller directamente para mejor rendimiento
    # También incluir órdenes donde el seller es None pero los productos son del vendedor (para compatibilidad)
    orders = Order.objects.filter(
        seller=seller,
        status__in=['pending', 'preparing', 'shipped']  # Estados pendientes
    ).order_by('-created_at')

    # Serializamos las órdenes
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_orders_by_status(request, status_type):
    """
    Obtiene órdenes del vendedor filtradas por tipo de estado.
    status_type puede ser: 'pending', 'preparing', 'shipped', 'delivered', 'completed', 'all'
    """
    seller = request.user
    status_map = {
        'pending': ['pending'],
        'preparing': ['preparing'],
        'shipped': ['shipped'],
        'delivered': ['delivered'],
        'completed': ['completed'],
        'active': ['pending', 'preparing', 'shipped'],  # Órdenes activas (pendientes de completar)
        'finished': ['delivered', 'completed'],  # Órdenes finalizadas
        'all': ['pending', 'preparing', 'shipped', 'delivered', 'completed']
    }
    
    statuses = status_map.get(status_type, ['pending'])
    
    # Filtrar órdenes del vendedor por estado
    orders = Order.objects.filter(
        seller=seller,
        status__in=statuses
    ).order_by('-created_at')

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_delivered_orders(request):
    seller = request.user

    # Usar el campo seller directamente
    orders = Order.objects.filter(
        seller=seller,
        status__in=['delivered', 'completed']  # Estados entregados
    ).order_by('-created_at')

    # Serializamos las órdenes
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


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

    # Nuevo flujo: permitir confirmación desde estado 'shipped'
    if order.status not in ['shipped', 'delivered']:
        return Response({'detail': 'La orden debe estar en entrega para confirmarla'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar si ya está completada
    if order.status == 'completed':
        return Response({'detail': 'Order already confirmed'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Actualizar el estado a completed
    order.status = 'completed'
    if not order.is_delivered:
        order.is_delivered = True
        order.delivered_at = datetime.now(timezone.utc)
    order.save()
    
    # Creamos la confirmación de recepción
    confirmation, created = OrderConfirmation.objects.get_or_create(
        order=order,
        confirmed_by_user=request.user
    )

    # Obtener el vendedor
    seller = order.seller
    if not seller and order.orderitem_set.exists():
        seller = order.orderitem_set.first().product.user
    
    # Crear la notificación para el vendedor
    if seller:
        Notification.objects.create(
            user=seller,
            message=f"El cliente ha confirmado la recepción de la orden #{order.id}",
            link=f"/orders/{order.id}/",
        )

    serializer = OrderSerializer(order)
    return Response({
        'detail': 'Orden confirmada como recibida y notificación enviada al vendedor',
        'order': serializer.data,
        'confirmed_at': confirmation.confirmed_at
    }, status=status.HTTP_200_OK)


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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    """
    Actualiza el estado de una orden.
    
    Flujo de estados (simplificado según la solicitud):
    - pending -> shipped (vendedor/admin)  "Comenzar entrega" / "Entregando pedido"
    - shipped -> completed (cliente confirma recibido)
    
    Body: { "status": "shipped" | "completed" | "cancelled" }
    """
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'detail': 'Orden no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    
    # Validar que el status sea válido
    valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response({'detail': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verificar permisos según el rol
    user = request.user
    is_admin = user.role == 'admin'
    
    # Obtener el vendedor de la orden (usar order.seller si existe, sino buscar por productos)
    seller = order.seller
    if not seller and order.orderitem_set.exists():
        seller = order.orderitem_set.first().product.user
    
    # Validar transiciones de estado
    current_status = order.status
    
    # Solo el vendedor o admin puede cambiar a: shipped (comenzar entrega) y cancelled
    if new_status in ['shipped', 'preparing', 'delivered']:
        if not is_admin and (not seller or user != seller):
            return Response({'detail': 'Solo el vendedor o administrador puede actualizar este estado'}, status=status.HTTP_403_FORBIDDEN)
        
        # Validar transición válida (sin etapa preparing/delivered en el nuevo flujo)
        if current_status == 'pending' and new_status != 'shipped':
            return Response({'detail': f'No se puede cambiar de {current_status} a {new_status}. Use "shipped" para comenzar la entrega.'}, status=status.HTTP_400_BAD_REQUEST)
        if current_status == 'shipped' and new_status != 'cancelled':
            return Response({'detail': f'No se puede cambiar de {current_status} a {new_status}. Solo el cliente puede completar la orden.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Solo el cliente puede cambiar a: completed
    if new_status == 'completed':
        if not is_admin and user != order.user:
            return Response({'detail': 'Solo el cliente puede completar la orden'}, status=status.HTTP_403_FORBIDDEN)
        # En el nuevo flujo, el cliente completa desde estado shipped
        if order.status != 'shipped':
            return Response({'detail': 'La orden debe estar en entrega (shipped) para completarla'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Actualizar el estado
    old_status = order.status
    order.status = new_status
    
    # Actualizar campos de compatibilidad según el nuevo estado
    if new_status == 'completed':
        # Al completarse, mantener is_delivered y delivered_at
        if not order.is_delivered:
            order.is_delivered = True
            order.delivered_at = datetime.now(timezone.utc)
    
    order.save()
    
    # Crear notificación según el cambio de estado
    if new_status == 'shipped' and seller:
        Notification.objects.create(
            user=order.user,
            message=f"Tu orden #{order.id} está en entrega",
            link=f"/orders/{order.id}/",
        )
    elif new_status == 'completed' and seller:
        Notification.objects.create(
            user=seller,
            message=f"El cliente ha confirmado la recepción de la orden #{order.id}",
            link=f"/orders/{order.id}/",
        )
    
    serializer = OrderSerializer(order)
    return Response({
        'detail': f'Estado actualizado de {old_status} a {new_status}',
        'order': serializer.data
    }, status=status.HTTP_200_OK)


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_temp_preference(request):
    user = request.user
    data = request.data
    
    try:
        logger.info(f"Recibida petición de preferencia de usuario {user.id}. Datos recibidos: {list(data.keys())}")
        
        order_items = data.get('order_items', [])
        if isinstance(order_items, str):
            try:
                order_items = json.loads(order_items)
            except json.JSONDecodeError:
                return Response({"error": "Formato inválido para order_items"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not order_items or not isinstance(order_items, list) or len(order_items) == 0:
            logger.error(f"No hay productos válidos en la orden. Order_items: {order_items}")
            return Response({"error": "No hay productos válidos en la orden"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar que cada item tenga los campos requeridos
        for idx, item in enumerate(order_items):
            if not isinstance(item, dict):
                logger.error(f"Item {idx} no es un diccionario: {item}")
                return Response({"error": f"Item {idx} tiene formato inválido"}, status=status.HTTP_400_BAD_REQUEST)
            if 'id' not in item:
                logger.error(f"Item {idx} no tiene campo 'id': {item}")
                return Response({"error": f"Item {idx} no tiene campo 'id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            first_product = Product.objects.get(id=order_items[0]['id'])
            seller = first_product.user
            logger.info(f"Vendedor identificado: {seller.id}")
        except Product.DoesNotExist:
            logger.error(f"Producto {order_items[0]['id']} no existe")
            return Response({"error": f"Producto {order_items[0]['id']} no existe"}, status=status.HTTP_400_BAD_REQUEST)
        except (KeyError, IndexError) as e:
            logger.error(f"Error al acceder a order_items[0]['id']: {str(e)}")
            return Response({"error": f"Formato inválido de order_items: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        for item in order_items:
            try:
                product = Product.objects.get(id=item['id'])
                if product.user != seller:
                    logger.error(f"Producto {product.id} pertenece a otro vendedor")
                    return Response({"error": "Todos los productos deben ser del mismo vendedor"}, status=status.HTTP_400_BAD_REQUEST)
            except Product.DoesNotExist:
                logger.error(f"Producto {item['id']} no existe")
                return Response({"error": f"Producto {item['id']} no existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mp_config = MercadoPagoConfig.objects.get(user=seller)
        except MercadoPagoConfig.DoesNotExist:
            return Response({"error": "El vendedor no tiene configurado MercadoPago"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que el access_token existe y no está vacío
        if not mp_config.access_token or not mp_config.access_token.strip():
            logger.error(f"El vendedor {seller.id} tiene MercadoPago configurado pero el access_token está vacío o None")
            # Recargar desde la base de datos para estar seguro
            mp_config.refresh_from_db()
            if not mp_config.access_token or not mp_config.access_token.strip():
                return Response({
                    "error": "El access_token de Mercado Pago no está configurado correctamente. Por favor, reconfigure sus credenciales.",
                    "debug": f"Access_token presente: {bool(mp_config.access_token)}, longitud: {len(mp_config.access_token) if mp_config.access_token else 0}"
                }, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"Iniciando creación de preferencia para vendedor {seller.id}, usuario {user.id}. Access_token longitud: {len(mp_config.access_token) if mp_config.access_token else 0}")
        
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
        
        try:
            mp = mercadopago.SDK(mp_config.access_token)
            logger.info(f"SDK de MercadoPago inicializado correctamente para vendedor {seller.id}")
        except Exception as e:
            logger.error(f"Error al inicializar SDK de MercadoPago para vendedor {seller.id}: {str(e)}", exc_info=True)
            return Response({"error": f"Error al inicializar Mercado Pago: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        mp_items = []
        for item in order_items:
            try:
                product = Product.objects.get(id=item['id'])
                quantity = int(item.get('quantity', 1))
                price = float(item.get('price', 0))
                
                if quantity <= 0:
                    logger.warning(f"Cantidad inválida para producto {product.id}: {quantity}")
                    quantity = 1
                
                if price <= 0:
                    logger.warning(f"Precio inválido para producto {product.id}: {price}")
                    price = float(product.price)
                
                mp_items.append({
                    "title": product.name[:255],  # Limitar longitud del título
                    "quantity": quantity,
                    "unit_price": price,
                    "currency_id": "COP"
                })
                logger.info(f"Item agregado: {product.name} x{quantity} @ ${price}")
            except Product.DoesNotExist:
                logger.error(f"Producto {item.get('id')} no existe")
                return Response({"error": f"Producto {item.get('id')} no existe"}, status=status.HTTP_400_BAD_REQUEST)
            except (ValueError, KeyError) as e:
                logger.error(f"Error al procesar item {item}: {str(e)}")
                return Response({"error": f"Error al procesar item: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not mp_items:
            logger.error("No se pudo crear ningún item para Mercado Pago")
            return Response({"error": "No se pudo crear ningún item válido"}, status=status.HTTP_400_BAD_REQUEST)
        
        preference_data = {
            "items": mp_items,
            "payer": {
                "name": user.name,
                "email": user.email
            },
            "external_reference": str(temp_order.id),
            "notification_url": f"{settings.BACKEND_URL}/orders/payment/webhook/",
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/payment/success?external_reference={temp_order.id}",
                "failure": f"{settings.FRONTEND_URL}/payment/failure",
                "pending": f"{settings.FRONTEND_URL}/payment/pending"
            },
            "statement_descriptor": f"Compra a {seller}"
        }

        # Configurar auto_return solo si FRONTEND_URL es público (no localhost)
        try:
            frontend_url = getattr(settings, 'FRONTEND_URL', '') or ''
            if frontend_url and 'localhost' not in frontend_url and frontend_url.startswith('http'):
                preference_data["auto_return"] = "approved"
        except Exception:
            pass
        
        try:
            logger.info(f"Creando preferencia de Mercado Pago con {len(mp_items)} items para usuario {user.id}")
            logger.info(f"Datos de preferencia: {json.dumps(preference_data, indent=2)}")
            preference_response = mp.preference().create(preference_data)
            logger.info(f"Respuesta completa de Mercado Pago: {json.dumps(preference_response, indent=2)}")
            
            # Verificar si hay un error en la respuesta
            if preference_response.get('status') and preference_response.get('status') >= 400:
                error_message = "Error desconocido de Mercado Pago"
                error_details = []
                
                # Extraer mensajes de error de la respuesta
                if preference_response.get('response'):
                    response_data = preference_response.get('response')
                    if isinstance(response_data, dict):
                        if 'message' in response_data:
                            error_message = response_data['message']
                        if 'cause' in response_data:
                            if isinstance(response_data['cause'], list):
                                for cause in response_data['cause']:
                                    if isinstance(cause, dict):
                                        if 'description' in cause:
                                            error_details.append(cause['description'])
                                        elif 'message' in cause:
                                            error_details.append(cause['message'])
                            elif isinstance(response_data['cause'], dict):
                                error_details.append(str(response_data['cause']))
                        if not error_details and 'error' in response_data:
                            error_details.append(str(response_data['error']))
                    else:
                        error_message = str(response_data)
                
                full_error = error_message
                if error_details:
                    full_error += " - " + " | ".join(error_details)
                
                logger.error(f"Error en respuesta de Mercado Pago (status {preference_response.get('status')}): {full_error}")
                logger.error(f"Respuesta completa: {json.dumps(preference_response, indent=2, default=str)}")
                
                return Response({
                    "error": "Error al crear la preferencia de pago en Mercado Pago",
                    "details": full_error,
                    "mp_status": preference_response.get('status'),
                    "mp_response": preference_response.get('response')
                }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error al crear preferencia de Mercado Pago: {str(e)}", exc_info=True, extra={
                "user": user.id,
                "seller": seller.id,
                "access_token_length": len(mp_config.access_token) if mp_config.access_token else 0,
                "access_token_preview": mp_config.access_token[:20] + "..." if mp_config.access_token and len(mp_config.access_token) > 20 else "None"
            })
            return Response({
                "error": f"Error al crear la preferencia de pago: {str(e)}",
                "details": "Por favor, verifica que las credenciales de Mercado Pago sean correctas y que el access_token esté guardado correctamente."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if not preference_response.get('response'):
            logger.error("Error al crear preferencia - respuesta sin 'response'", extra={
                "response": preference_response,
                "user": user.id,
                "seller": seller.id,
                "access_token_length": len(mp_config.access_token) if mp_config.access_token else 0
            })
            return Response({
                "error": "Error al crear la preferencia de pago",
                "details": f"La respuesta de Mercado Pago no contiene 'response'. Respuesta recibida: {json.dumps(preference_response)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if 'id' not in preference_response['response'] or 'init_point' not in preference_response['response']:
            logger.error("Respuesta de Mercado Pago incompleta", extra={
                "response_keys": list(preference_response.get('response', {}).keys()),
                "response": preference_response.get('response'),
                "user": user.id,
                "seller": seller.id
            })
            return Response({
                "error": "La respuesta de Mercado Pago está incompleta",
                "details": f"Faltan campos requeridos en la respuesta. Respuesta recibida: {json.dumps(preference_response.get('response', {}))}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        temp_order.mp_preference_id = preference_response['response']['id']
        temp_order.save()
        logger.info(f"Preferencia creada exitosamente. ID: {preference_response['response']['id']}, Temp Order ID: {temp_order.id}")
        
        return Response({
            "init_point": preference_response['response']['init_point'],
            "preference_id": temp_order.id,
            "public_key": mp_config.public_key
        })
        
    except Exception as e:
        logger.error(f"Error en create_temp_preference: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request, payment_id):
    try:
        # Obtener orden temporal para encontrar al vendedor
        temp_order = TemporaryOrder.objects.get(mp_preference_id=payment_id)
        seller = temp_order.seller
        
        # Usar credenciales del vendedor
        mp_config = MercadoPagoConfig.objects.get(user=seller)
        mp = mercadopago.SDK(mp_config.access_token)
        payment_info = mp.payment().get(payment_id)
        
        return Response({"status": payment_info['response']['status']})
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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


def finalize_order(temp_order, payment_id, payment_method="mercadopago"):
    order_data = temp_order.order_data

    # Valores por defecto para los campos opcionales
    seller_id = order_data.get("seller_id")
    # Si no hay seller_id en order_data, usar el seller del temp_order directamente
    if not seller_id and temp_order.seller:
        seller_id = temp_order.seller.id
    shipping_price = order_data.get("shipping_price", 0.0)
    tax_price = order_data.get("tax_price", 0.0)

    # Crear la orden principal
    order = Order.objects.create(
        user=temp_order.user,
        total_price=order_data["total_price"],
        payment_method=payment_method,
        payment_id=payment_id,
        is_paid=True,
        paid_at=datetime.now(),
        seller_id=seller_id,  # Asegurar que siempre se asigne el seller
        shipping_price=shipping_price,
        tax_price=tax_price,
        status='pending'  # Estado inicial por defecto
    )

    # Crear la dirección de envío
    ShoppingAddress.objects.create(
        order=order,
        address=order_data["address"],
        city=order_data["city"],
        postal_code=order_data["postal_code"],
        country="Colombia"
    )

    # Optimización: Obtener todos los productos en una sola consulta
    product_ids = [item["id"] for item in order_data["order_items"]]
    products = {product.id: product for product in Product.objects.filter(id__in=product_ids)}

    # Crear los items de la orden
    order_items = []
    for item in order_data["order_items"]:
        product = products.get(item["id"])

        if not product:
            logger.warning(f"Producto no encontrado: {item['id']}")
            continue

        order_items.append(Orderitem(
            product=product,
            order=order,
            quantity=item["quantity"],
            price=item["price"]
        ))

        # Reducir stock del producto
        product.count_in_stock = max(0, product.count_in_stock - item["quantity"])

    # Guardar los items de la orden en una sola operación
    Orderitem.objects.bulk_create(order_items)

    # Guardar los productos con stock actualizado en una sola operación
    Product.objects.bulk_update(products.values(), ["count_in_stock"])

    # Eliminar la orden temporal
    temp_order.delete()

    # Enviar correo de confirmación
    try:
        send_order_confirmation_email(order)
        logger.info(f"Correo de confirmación enviado para la orden {order.id}")
    except Exception as e:
        logger.error(f"Error al enviar correo de confirmación: {str(e)}")

    return order

from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
def finalize_order_on_success(request):
    """
    Endpoint para finalizar la creación de la orden cuando se redirige al usuario
    en la página de éxito. Se espera recibir el payment_id.
    """
    data = request.data
    payment_id = data.get("payment_id")

    if not payment_id:
        return Response({"error": "payment_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Idempotencia con transacción: evitar duplicados por llamadas concurrentes
    with transaction.atomic():
        # Bloquear fila si existe
        existing = Order.objects.select_for_update().filter(payment_id=payment_id).first()
        if existing:
            return Response({
                "status": "approved",
                "message": "Pago aprobado y orden ya creada",
                "order_id": existing.id,
                "seller_id": existing.seller_id,
                "shipping_price": existing.shipping_price,
                "tax_price": existing.tax_price
            })
   
    external_reference = data.get("external_reference")
    if not external_reference:
        return Response({"error": "external_reference es requerido"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Aceptar tanto el ID numérico (nuestro TEMP_ORDER_ID) como el preference_id de MP
    try:
        temp_order_id = int(str(external_reference).strip())
        temp_order = TemporaryOrder.objects.get(id=temp_order_id)
    except (ValueError, TypeError):
        # Si no es numérico, intentar por mp_preference_id
        try:
            temp_order = TemporaryOrder.objects.get(mp_preference_id=str(external_reference).strip())
        except TemporaryOrder.DoesNotExist:
            return Response({
                "error": "external_reference inválido",
                "detail": "Se esperaba el ID numérico de la orden temporal (preference_id devuelto por nuestro backend) o el preference_id de MP",
                "got": external_reference
            }, status=status.HTTP_400_BAD_REQUEST)
    except TemporaryOrder.DoesNotExist:
        return Response({"error": "Orden temporal no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
    # Validar el pago con MercadoPago usando las credenciales del vendedor
    try:
        seller = temp_order.seller
        mp_config = MercadoPagoConfig.objects.get(user=seller)
        mp = mercadopago.SDK(mp_config.access_token)
        payment_info = mp.payment().get(payment_id)
        if 'response' not in payment_info:
            return Response({"error": "Respuesta inválida de Mercado Pago"}, status=status.HTTP_400_BAD_REQUEST)
        payment_status = payment_info['response'].get('status')
        if payment_status != 'approved':
            return Response({"error": f"Pago no aprobado (estado: {payment_status})"}, status=status.HTTP_400_BAD_REQUEST)
    except MercadoPagoConfig.DoesNotExist:
        return Response({"error": "Configuración de Mercado Pago del vendedor no encontrada"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error validando pago con MercadoPago: {str(e)}", exc_info=True)
        return Response({"error": f"Error validando pago: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Finalizar la orden con los nuevos campos tras validar el pago (dentro de transacción)
    with transaction.atomic():
        # Rechequear idempotencia justo antes de crear
        existing = Order.objects.select_for_update().filter(payment_id=payment_id).first()
        if existing:
            return Response({
                "status": "approved",
                "message": "Pago aprobado y orden ya creada",
                "order_id": existing.id,
                "seller_id": existing.seller_id,
                "shipping_price": existing.shipping_price,
                "tax_price": existing.tax_price
            })
        order = finalize_order(temp_order, payment_id)

    return Response({
        "status": "approved",
        "message": "Orden creada exitosamente",
        "order_id": order.id,
        "seller_id": order.seller_id,
        "shipping_price": float(order.shipping_price),  # Convertir a float para JSON
        "tax_price": float(order.tax_price)  # Convertir a float para JSON
    }, status=status.HTTP_201_CREATED)

# -------- PayPal Integration --------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def paypal_create_order(request):
    user = request.user
    data = request.data

    try:
        order_items = data.get('order_items', [])
        if isinstance(order_items, str):
            order_items = json.loads(order_items)

        if not order_items or not isinstance(order_items, list):
            return Response({"error": "No hay productos válidos en la orden"}, status=status.HTTP_400_BAD_REQUEST)

        # validar vendedor único
        first_product = Product.objects.get(id=order_items[0]['id'])
        seller = first_product.user
        for item in order_items:
            product = Product.objects.get(id=item['id'])
            if product.user != seller:
                return Response({"error": "Todos los productos deben ser del mismo vendedor"}, status=status.HTTP_400_BAD_REQUEST)

        # crear TemporaryOrder
        temp_order = TemporaryOrder.objects.create(
            user=user,
            seller=seller,
            order_data={
                "order_items": order_items,
                "total_price": data.get('total_price'),
                "address": data.get('address'),
                "city": data.get('city'),
                "postal_code": data.get('postal_code'),
                "shipping_price": data.get('shipping_price', 0.0),
                "tax_price": data.get('tax_price', 0.0),
                "seller_id": seller.id,
            },
            provider="paypal",
        )

        # obtener credenciales del vendedor
        try:
            pp_conf = PayPalConfig.objects.get(user=seller)
        except PayPalConfig.DoesNotExist:
            return Response({"error": "El vendedor no tiene configurado PayPal"}, status=status.HTTP_400_BAD_REQUEST)

        # llamar API PayPal con credenciales del vendedor
        raw_amount = float(data.get('total_price'))
        currency = getattr(settings, 'PAYPAL_CURRENCY', 'USD')
        # Convertir COP->USD si corresponde (para entorno de pruebas)
        amount = raw_amount / float(getattr(settings, 'PAYPAL_EXCHANGE_COP_USD', 4000)) if currency == 'USD' else raw_amount
        pp = paypal_create_order_api(
            amount=amount,
            currency=currency,
            custom_id=str(temp_order.id),
            description=f"Order #{temp_order.id}",
            client_id=pp_conf.client_id,
            secret=pp_conf.secret_key,
        )
        if not pp or 'id' not in pp:
            return Response({"error": "No se pudo crear la orden en PayPal"}, status=status.HTTP_502_BAD_GATEWAY)

        temp_order.paypal_order_id = pp['id']
        temp_order.save(update_fields=["paypal_order_id"]) 

        approve_url = None
        for link in pp.get('links', []):
            if link.get('rel') == 'approve':
                approve_url = link.get('href')
                break

        return Response({
            "orderID": pp['id'],
            "approve_url": approve_url,
        })
    except Product.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"paypal_create_order error: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def paypal_capture(request):
    try:
        order_id = request.data.get('orderID')
        if not order_id:
            return Response({"error": "orderID es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        # usar credenciales del vendedor asociadas a la orden temporal
        try:
            temp = TemporaryOrder.objects.get(paypal_order_id=order_id)
            seller = temp.seller
            pp_conf = PayPalConfig.objects.get(user=seller)
        except (TemporaryOrder.DoesNotExist, PayPalConfig.DoesNotExist):
            pp_conf = None
        capture = paypal_capture_order_api(order_id, client_id=(pp_conf.client_id if pp_conf else None), secret=(pp_conf.secret_key if pp_conf else None))
        if not capture:
            return Response({"error": "No se pudo capturar el pago"}, status=status.HTTP_502_BAD_GATEWAY)

        status_pp = capture.get('status')
        if status_pp != 'COMPLETED':
            return Response({"status": status_pp})

        # extraer datos
        purchase_units = capture.get('purchase_units', [])
        custom_id = None
        capture_id = None
        if purchase_units:
            pu = purchase_units[0]
            custom_id = pu.get('custom_id') or pu.get('reference_id')
            payments = pu.get('payments', {})
            captures = payments.get('captures', [])
            if captures:
                capture_id = captures[0].get('id')
                custom_id = captures[0].get('custom_id') or custom_id

        if not custom_id:
            # fallback usando TemporaryOrder guardado por paypal_order_id
            try:
                temp_order = TemporaryOrder.objects.get(paypal_order_id=order_id)
            except TemporaryOrder.DoesNotExist:
                return Response({"error": "No se pudo asociar la orden temporal"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            temp_order = TemporaryOrder.objects.get(id=custom_id)

        order = finalize_order(temp_order, payment_id=capture_id or order_id, payment_method="paypal")

        return Response({
            "status": "approved",
            "order_id": order.id
        })
    except TemporaryOrder.DoesNotExist:
        return Response({"error": "Orden temporal no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"paypal_capture error: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def paypal_webhook(request):
    try:
        data = json.loads(request.body or '{}')
        event_type = data.get('event_type')
        resource = data.get('resource', {})

        # Opcional: validar firma con PAYPAL_WEBHOOK_ID
        # Para simplificar, consultamos a PayPal el recurso antes de marcar pagado.

        if event_type == 'CHECKOUT.ORDER.APPROVED':
            order_id = resource.get('id')
            if order_id:
                # capturar con credenciales globales o ignora si no están
                capture = paypal_capture_order_api(order_id)
                if capture and capture.get('status') == 'COMPLETED':
                    # reutilizar lógica de captura normal
                    request._full_data = {"orderID": order_id}  # no se usa realmente
                return JsonResponse({"status": "captured"})
            return JsonResponse({"status": "ignored"})

        if event_type == 'PAYMENT.CAPTURE.COMPLETED':
            capture_id = resource.get('id')
            # obtener detalle de order/capture via Orders Get no disponible directo; usar purchase_units en resource si existe
            custom_id = None
            try:
                # PayPal envía custom_id en resource.supplementary_data.related_ids.order_id -> obtener order y leer custom_id
                # Como alternativa, buscamos TemporaryOrder por paypal_order_id si viene related_ids
                related = resource.get('supplementary_data', {}).get('related_ids', {})
                order_id = related.get('order_id')
                if order_id:
                    # buscamos temp por paypal_order_id
                    temp_order = TemporaryOrder.objects.get(paypal_order_id=order_id)
                    order = finalize_order(temp_order, payment_id=capture_id or order_id, payment_method="paypal")
                    send_order_confirmation_email(order)
                    return JsonResponse({"status": "success"})
            except TemporaryOrder.DoesNotExist:
                logger.warning("Temp order no encontrada por paypal_order_id en webhook")
            except Exception as e:
                logger.error(f"paypal_webhook error capture completed: {str(e)}")

            return JsonResponse({"status": "success"})

        return JsonResponse({"status": "ignored"})
    except Exception as e:
        logger.error(f"paypal_webhook error: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)

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



@csrf_exempt
@api_view(['GET', 'POST'])
def webhook(request):
    """
    Webhook para recibir notificaciones de MercadoPago.
    Maneja notificaciones de prueba y pagos.
    """
    try:
        # Unificar datos desde GET/POST (Mercado Pago puede enviar GET con query o POST JSON/form)
        raw_body = request.body.decode('utf-8') if request.body else ''
        logger.info(f"Webhook recibido. Method={request.method}. Body={raw_body}. Query={dict(request.GET)}")

        data = {}
        if request.method == 'GET':
            # Ejemplo: ?topic=payment&id=123 or ?type=payment&data.id=123
            data = {
                'type': request.GET.get('type') or request.GET.get('topic'),
                'action': request.GET.get('action'),
                'data': {
                    'id': request.GET.get('data.id') or request.GET.get('id')
                }
            }
        else:
            # POST: intentar JSON; si falla, intentar form-urlencoded
            try:
                data = json.loads(raw_body) if raw_body else {}
            except json.JSONDecodeError:
                # Form payload
                data = {
                    'type': request.POST.get('type') or request.POST.get('topic'),
                    'action': request.POST.get('action'),
                    'data': {
                        'id': request.POST.get('data.id') or request.POST.get('id')
                    }
                }

        logger.info(f"Datos normalizados: {data}")

        notification_type = data.get('type')
        action = data.get('action')
        
        # Manejar notificación de prueba
        if action == 'test.created' or notification_type == 'test':
            logger.info("Notificación de prueba recibida")
            return JsonResponse({"status": "success"})
        
        # Manejar notificación de pago
        if action == 'payment.created' or notification_type == 'payment':
            # Obtener ID del pago
            payment_id = data.get('data', {}).get('id')
            if not payment_id:
                logger.error("ID de pago no encontrado en los datos")
                return JsonResponse({"error": "ID de pago no encontrado"}, status=400)
            
            logger.info(f"Procesando pago: {payment_id}")
            
            # Verificar si el pago ya fue procesado
            if Order.objects.filter(payment_id=payment_id).exists():
                logger.info(f"Pago {payment_id} ya fue procesado anteriormente")
                return JsonResponse({"status": "already_processed"})
            
            try:
                # Obtener información del pago usando credenciales globales (válido para validar y obtener external_reference)
                mp_global = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
                payment_info = mp_global.payment().get(payment_id)
                
                if 'response' not in payment_info:
                    logger.error(f"Respuesta de pago inválida: {payment_info}")
                    return JsonResponse({"error": "Respuesta de pago inválida"}, status=400)
                
                # Obtener external_reference (ID de la orden temporal)
                external_reference = payment_info['response'].get('external_reference')
                if not external_reference:
                    logger.error("External reference no encontrado en la información del pago")
                    return JsonResponse({"error": "External reference no encontrado"}, status=400)
                
                logger.info(f"External reference: {external_reference}")
                
                # Obtener orden temporal
                try:
                    temp_order = TemporaryOrder.objects.get(id=external_reference)
                    seller = temp_order.seller
                    logger.info(f"Orden temporal encontrada: {temp_order.id}, Vendedor: {seller.id}")
                except TemporaryOrder.DoesNotExist:
                    logger.error(f"Orden temporal no encontrada para external_reference: {external_reference}")
                    return JsonResponse({"error": "Orden temporal no encontrada"}, status=404)
                
                # Obtener configuración de MercadoPago del vendedor
                try:
                    mp_config = MercadoPagoConfig.objects.get(user=seller)
                    logger.info(f"Configuración de MercadoPago encontrada para vendedor: {seller.id}")
                except MercadoPagoConfig.DoesNotExist:
                    logger.error(f"Configuración de MercadoPago no encontrada para vendedor: {seller.id}")
                    return JsonResponse({"error": "Configuración de MercadoPago del vendedor no encontrada"}, status=400)
                
                # Obtener información del pago usando credenciales del vendedor
                mp_seller = mercadopago.SDK(mp_config.access_token)
                payment_info = mp_seller.payment().get(payment_id)
                
                # Verificar estado del pago
                payment_status = payment_info['response'].get('status')
                logger.info(f"Estado del pago: {payment_status}")
                
                # Procesar pago si está aprobado
                if payment_status == 'approved':
                    logger.info(f"Pago {payment_id} aprobado, creando orden definitiva")
                    
                    # Crear orden definitiva
                    order = finalize_order(temp_order, payment_id)
                    logger.info(f"Orden {order.id} creada exitosamente para pago {payment_id}")
                    
                    # Enviar correo de confirmación
                    try:
                        send_order_confirmation_email(order)
                        logger.info(f"Correo de confirmación enviado para orden {order.id}")
                    except Exception as e:
                        logger.error(f"Error al enviar correo de confirmación: {str(e)}")
                
                return JsonResponse({"status": "success", "payment_status": payment_status})
            
            except Exception as e:
                logger.error(f"Error al procesar pago {payment_id}: {str(e)}", exc_info=True)
                return JsonResponse({"error": f"Error al procesar pago: {str(e)}"}, status=500)
        
        # Manejar notificación de merchant_order
        if action == 'merchant_order.created' or (data.get('type') == 'merchant_order'):
            merchant_order_id = data.get('data', {}).get('id')
            if not merchant_order_id:
                logger.error("ID de merchant_order no encontrado en los datos")
                return JsonResponse({"error": "ID de merchant_order no encontrado"}, status=400)
            
            logger.info(f"Procesando merchant order: {merchant_order_id}")
            # Aquí puedes agregar la lógica para manejar merchant_orders si es necesario
            return JsonResponse({"status": "success"})
        
        # Manejar otros tipos de notificaciones
        logger.info(f"Tipo de acción no manejada: {action}, tipo: {data.get('type')}")
        return JsonResponse({"status": "ignored"})
        
    except Exception as e:
        logger.error(f"Error en webhook: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)