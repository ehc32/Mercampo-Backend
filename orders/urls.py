from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_orders),
    path('search/', views.search),
    path('create/', views.create_order),
    path('my/orders/', views.my_orders),
    path('my/pending/', views.seller_pending_orders),
    path('my/seller/delivered/', views.seller_delivered_orders),
    path('confirm/<int:order_id>/', views.confirm_order_received, name='confirm_order_received'),
    path('notifications/<int:notification_id>/mark-as-read/', views.mark_notification_as_read, name='mark_notification_as_read'),
    path('notifications/', views.get_notifications),
    path('confirmation-status/<int:order_id>/', views.check_order_confirmation),
    path('deliver/<int:pk>/', views.delivered),
    path('solo/<int:pk>/', views.solo_order),
    path('<int:pk>/items/', views.get_order_items),
    path('<int:order_id>/status/', views.update_order_status, name='update_order_status'),  # Nueva ruta
    path('payment/temp_preference/', views.create_temp_preference), 
    path('payment/webhook/', views.webhook), 
    path('payment/status/<str:payment_id>/', views.check_payment_status, name='check_payment_status'),
    path('payment/finalize/', views.finalize_order_on_success, name='finalize_order_on_success'),
    path('payment/mp-config/', views.mercadopago_config),
]
