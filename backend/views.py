from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import mercadopago
import os

# Initialize Mercado Pago SDK
sdk = mercadopago.SDK(os.getenv("MERCADO_PAGO_ACCESS_TOKEN"))

@csrf_exempt
def process_payment(request):
    if request.method == "POST":
        payment_data = {
            "transaction_amount": float(request.POST.get("amount")),
            "token": request.POST.get("token"),
            "description": request.POST.get("description"),
            "installments": int(request.POST.get("installments", 1)),
            "payment_method_id": request.POST.get("payment_method_id"),
            "payer": {
                "email": request.POST.get("email")
            }
        }

        payment_response = sdk.payment().create(payment_data)
        return JsonResponse(payment_response, safe=False)
    return JsonResponse({"error": "Invalid request method."}, status=400)
