import base64
import json
import os
from typing import Dict, Optional

import requests
from django.conf import settings


def _api_base() -> str:
    return getattr(settings, 'PAYPAL_API_BASE', 'https://api-m.sandbox.paypal.com')


def _client_credentials() -> (str, str):
    return (
        getattr(settings, 'PAYPAL_CLIENT_ID', ''),
        getattr(settings, 'PAYPAL_SECRET', ''),
    )


def _get_access_token(client_id: Optional[str] = None, secret: Optional[str] = None) -> Optional[str]:
    cid = client_id or _client_credentials()[0]
    sk = secret or _client_credentials()[1]
    if not cid or not sk:
        return None
    url = f"{_api_base()}/v1/oauth2/token"
    resp = requests.post(
        url,
        headers={"Accept": "application/json", "Accept-Language": "en_US"},
        data={"grant_type": "client_credentials"},
        auth=(cid, sk),
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()
    return data.get("access_token")


def paypal_create_order_api(*, amount: float, currency: str, custom_id: str, description: str, client_id: Optional[str] = None, secret: Optional[str] = None) -> Optional[Dict]:
    token = _get_access_token(client_id, secret)
    if not token:
        return None

    url = f"{_api_base()}/v2/checkout/orders"
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": currency,
                    "value": f"{amount:.2f}",
                },
                "custom_id": str(custom_id),
                "description": description,
            }
        ],
        "application_context": {
            "shipping_preference": "NO_SHIPPING",
            "user_action": "PAY_NOW",
            # URLs de retorno si las usas en front; con JS SDK no son obligatorias
        },
    }
    resp = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        json=payload,
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()


def paypal_capture_order_api(order_id: str, *, client_id: Optional[str] = None, secret: Optional[str] = None) -> Optional[Dict]:
    token = _get_access_token(client_id, secret)
    if not token:
        return None
    url = f"{_api_base()}/v2/checkout/orders/{order_id}/capture"
    resp = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()


def paypal_get_client_id_env() -> Dict[str, str]:
    return {
        "client_id": getattr(settings, 'PAYPAL_CLIENT_ID', ''),
        "env": getattr(settings, 'PAYPAL_ENV', 'sandbox'),
    }
