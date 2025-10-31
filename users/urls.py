from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Autenticación y usuarios
    path('search/', views.search),
    path('register/', views.register),
    path('login/', views.LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('get/', views.get_users),
    path('delete/<int:pk>/', views.delete_user),
    path('edit/<int:id>/', views.edit_profile),
    path('get/solo/<int:pk>/', views.get_solo_user),
    
    # Seller (Vendedores)
    path('sell/bring_request/', views.get_request_seller),
    path('sell/delete_request/<int:pk>/', views.delete_request),
    path('sell/approve_request/<int:pk>/', views.approve_request),
    path('sell/send_request/<int:user_id>/', views.register_seller),


    path('sell/paypalsel/<int:pk>/', views.request_seller_paypal_config),
    path('paypalconfig/<int:pk>/', views.get_seller_paypal_config_done),

    path('mercado-pago/config/<int:pk>/', views.request_seller_mercado_pago_config, name='mercado-pago-config'),
    path('mercado-pago/config/done/<int:pk>/', views.get_seller_mercado_pago_config),

    # Google Maps global config
    path('google-maps/config/', views.get_google_maps_config),  # GET
    path('google-maps/config/save/', views.set_google_maps_config),  # POST
    
    path('sell/changePermision/<int:idUser>/', views.change_can_publish),
    
    # Enterprise (Empresas)
    path('create-enterprise/<int:idUser>/', views.create_enterprise),
     path('enterprise/update/<int:user_id>/', views.update_enterprise, name='update_enterprise'),
    path('get-enterprises/', views.get_enterprises),
    path('get-enterprise-by-user/<int:user_id>/', views.get_enterprise_by_user),
    
    # Posts y Comentarios (Nuevas URLs)
    path('posts/create/', views.create_post),
    path('posts/<int:post_id>/comments/create/', views.create_comment),
    path('enterprises/<int:owner_user_id>/posts/', views.get_posts_with_comments, name='enterprise-posts'),
    path('posts/all/', views.get_all_posts_with_comments, name='all-posts'),
    path('posts/<int:post_id>/', views.update_or_delete_post, name='update-delete-post'),
    path('posts/<int:post_id>/', views.get_single_post),
    path('comments/<int:comment_id>/', views.update_or_delete_comment, name='update-delete-comment'),
    
    path('password-reset/request/', views.password_reset_request, name='password_reset_request'),
    path('password-reset/verify/', views.password_reset_verify, name='password_reset_verify'),
]
