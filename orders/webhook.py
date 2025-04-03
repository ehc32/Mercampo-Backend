import json
import logging
from datetime import datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.conf import settings

import mercadopago

from .models import TemporaryOrder, Order, MercadoPagoConfig, Product, Orderitem, ShoppingAddress

# Configurar logger
logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
def webhook(request):
    """
    Webhook para recibir notificaciones de MercadoPago.
    Maneja notificaciones de merchant_order y pagos en diferentes formatos.
    """
    try:
        # Log de la solicitud recibida
        logger.info(f"Webhook recibido: {request.body.decode('utf-8')}")
        logger.info(f"Query params: {request.GET}")
        
        # Intentar parsear el JSON
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            logger.error(f"JSON inválido: {str(e)}")
            return JsonResponse({"error": "Formato JSON inválido"}, status=400)
        
        # Log de los datos parseados
        logger.info(f"Datos parseados: {data}")
        
        # Determinar el tipo de notificación y obtener el ID del recurso
        topic = data.get('topic')
        action = data.get('action')
        resource_type = data.get('type')
        
        # Manejar notificación de prueba
        if action == 'test.created' or topic == 'test' or resource_type == 'test':
            logger.info("Notificación de prueba recibida")
            return JsonResponse({"status": "success"})
        
        # Obtener ID del recurso (pago o merchant_order)
        resource_id = None
        
        # Caso 1: Notificación con formato {"resource":"ID","topic":"payment"}
        if topic == 'payment' and 'resource' in data:
            resource_id = data.get('resource')
            if isinstance(resource_id, str) and '/' in resource_id:
                resource_id = resource_id.split('/')[-1]
            logger.info(f"ID de pago obtenido de resource: {resource_id}")
        
        # Caso 2: Notificación con formato {"action":"payment.created","data":{"id":"ID"}}
        elif action == 'payment.created' and 'data' in data and 'id' in data['data']:
            resource_id = data['data']['id']
            logger.info(f"ID de pago obtenido de data.id: {resource_id}")
        
        # Caso 3: Notificación en query params (data.id en la URL)
        elif not resource_id and request.GET.get('data.id'):
            resource_id = request.GET.get('data.id')
            logger.info(f"ID de pago obtenido de query param data.id: {resource_id}")
        
        # Caso 4: Merchant Order
        elif topic == 'merchant_order' and 'resource' in data:
            merchant_order_url = data.get('resource')
            merchant_order_id = merchant_order_url.split('/')[-1] if isinstance(merchant_order_url, str) else None
            logger.info(f"ID de merchant_order: {merchant_order_id}")
            
            # Procesar merchant_order
            if merchant_order_id:
                return process_merchant_order(merchant_order_id)
        
        # Verificar si tenemos un ID de pago para procesar
        if not resource_id:
            logger.error("No se pudo determinar el ID del recurso")
            return JsonResponse({"error": "ID de recurso no encontrado"}, status=400)
        
        # Procesar el pago
        return process_payment(resource_id)
        
    except Exception as e:
        logger.error(f"Error en webhook: {str(e)}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)



def process_payment(payment_id):
    """
    Procesa un pago de MercadoPago.
    """
    logger.info(f"Procesando pago: {payment_id}")
    
    # Verificar si el pago ya fue procesado
    if Order.objects.filter(payment_id=payment_id).exists():
        logger.info(f"Pago {payment_id} ya fue procesado anteriormente")
        return JsonResponse({"status": "already_processed"})
    
    try:
        # Obtener información del pago usando credenciales globales
        mp_global = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
        payment_info = mp_global.payment().get(payment_id)
        
        if 'response' not in payment_info:
            logger.error(f"Respuesta de pago inválida: {payment_info}")
            return JsonResponse({"error": "Respuesta de pago inválida"}, status=400)
        
        logger.info(f"Información del pago: {payment_info['response']}")
        
        # Intentar obtener external_reference de diferentes lugares
        external_reference = None
        
        # 1. Intentar obtener de external_reference directamente
        if 'external_reference' in payment_info['response']:
            external_reference = payment_info['response']['external_reference']
            logger.info(f"External reference encontrado en el pago: {external_reference}")
        
        # 2. Intentar obtener de metadata
        elif 'metadata' in payment_info['response'] and 'external_reference' in payment_info['response']['metadata']:
            external_reference = payment_info['response']['metadata']['external_reference']
            logger.info(f"External reference encontrado en metadata: {external_reference}")
        
        # 3. Intentar obtener del merchant_order
        elif 'order' in payment_info['response'] and 'id' in payment_info['response']['order']:
            merchant_order_id = payment_info['response']['order']['id']
            logger.info(f"Obteniendo external_reference del merchant_order: {merchant_order_id}")
            
            merchant_order = mp_global.merchant_order().get(merchant_order_id)
            if 'response' in merchant_order and 'external_reference' in merchant_order['response']:
                external_reference = merchant_order['response']['external_reference']
                logger.info(f"External reference encontrado en merchant_order: {external_reference}")
        
        # Si no se encuentra external_reference, buscar por preference_id
        if not external_reference and 'preference_id' in payment_info['response']:
            preference_id = payment_info['response']['preference_id']
            logger.info(f"Buscando orden temporal por preference_id: {preference_id}")
            
            try:
                temp_order = TemporaryOrder.objects.get(mp_preference_id=preference_id)
                external_reference = str(temp_order.id)
                logger.info(f"Orden temporal encontrada por preference_id: {external_reference}")
            except TemporaryOrder.DoesNotExist:
                logger.error(f"Orden temporal no encontrada para preference_id: {preference_id}")
        
        if not external_reference:
            logger.error("No se pudo encontrar external_reference en ninguna parte")
            return JsonResponse({"error": "External reference no encontrado"}, status=400)
        
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

def process_merchant_order(merchant_order_id):
    """
    Procesa una notificación de merchant_order de MercadoPago.
    """
    logger.info(f"Procesando merchant_order: {merchant_order_id}")
    
    try:
        # Obtener información del merchant_order
        mp_global = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
        merchant_order = mp_global.merchant_order().get(merchant_order_id)
        
        if 'response' not in merchant_order:
            logger.error(f"Respuesta de merchant_order inválida: {merchant_order}")
            return JsonResponse({"error": "Respuesta de merchant_order inválida"}, status=400)
        
        # Verificar si hay pagos asociados
        payments = merchant_order['response'].get('payments', [])
        if not payments:
            logger.info(f"Merchant order {merchant_order_id} no tiene pagos asociados")
            return JsonResponse({"status": "no_payments"})
        
        # Procesar cada pago asociado
        for payment in payments:
            payment_id = payment.get('id')
            if payment_id:
                logger.info(f"Procesando pago {payment_id} de merchant_order {merchant_order_id}")
                process_payment(str(payment_id))
        
        return JsonResponse({"status": "success"})
        
    except Exception as e:
        logger.error(f"Error al procesar merchant_order {merchant_order_id}: {str(e)}", exc_info=True)
        return JsonResponse({"error": f"Error al procesar merchant_order: {str(e)}"}, status=500)