from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search),
    path('', views.get_products),   
    path('get/<str:locate>/', views.get_products_by_locate),
    path('getRandom/random_products/', views.get_products_random),
    path('get_all_locate/', views.get_all_locate),
    path('getLast12/last_products/', views.get_last_12_products),
    path('get/admin/<int:id>/', views.get_product_admin),
    path('get/<slug:slug>/', views.get_product),
    path('post/', views.create_product),
    path('edit/<int:pk>/', views.edit_product),
    path('delete/<int:pk>/', views.delete_product),
    path('cate/<str:category>/', views.get_prod_by_cate),
    path('review/<int:pk>/', views.create_review),
]
