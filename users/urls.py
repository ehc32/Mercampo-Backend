from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path('search/', views.search),
    path('register/', views.register),
    path('login/', views.LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('get/', views.get_users),
    path('delete/<int:pk>/', views.delete_user),
    path('edit/<int:id>/', views.edit_profile),
    path('get/solo/<int:pk>/', views.get_solo_user),
    # seller
    path('sell/bring_request/', views.get_request_seller),
    path('sell/delete_request/<int:pk>/', views.delete_request),
    path('sell/approve_request/<int:pk>/', views.approve_request),
    path('sell/send_request/<int:user_id>/', views.register_seller),


    path('sell/paypalsel/<int:pk>/', views.request_seller_paypal_config),
    path('paypalconfig/<int:pk>/', views.get_seller_paypal_config_done),

    path('mercado-pago/config/<int:pk>/', views.request_seller_mercado_pago_config, name='mercado-pago-config'),
    path('mercado-pago/config/done/<int:pk>/', views.get_seller_mercado_pago_config),
    
    path('sell/changePermision/<int:idUser>/', views.change_can_publish),
    #Enterprise
    path('create-enterprise/<int:idUser>/', views.create_enterprise),
    path('get-enterprises/', views.get_enterprises),
     path('password-reset/request/', views.password_reset_request, name='password_reset_request'),
    path('password-reset/verify/', views.password_reset_verify, name='password_reset_verify'),
]

