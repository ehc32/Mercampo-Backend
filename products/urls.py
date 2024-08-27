from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search),
    path('filterdata/', views.FilterProductsView),
    path('', views.get_products),   
    path('getLocate/<str:locate>/', views.get_products_by_locate),
    path('getRandom/random_products/', views.get_products_random), # funcional - trae productos aleatorios
    path('get_all_locate/', views.get_all_locate),  # funcional - trae todas las localizaciones sin repetir
    path('getLast12/last_products/', views.get_last_12_products), # funcional - trae los ultimos 12 productos
    path('get/admin/<int:id>/', views.get_product_admin), # funcional - trae un producto productos como administrador
    path('get/<slug:slug>/', views.get_product), # funcional - trae un producto y sus datos
    path('get_product_images/<int:product_id>/', views.get_product_images), # funcional - trae un producto y sus datos
    path('post/', views.create_product), # funcional - crea un producto
    path('edit/<int:pk>/', views.edit_product),
    path('delete/<int:pk>/', views.delete_product),
    path('cate/<str:category>/', views.get_prod_by_cate), # funcional - trae productos por categoria
    path('caterandom/<str:category>/', views.get_prod_by_caterandom), # funcional - trae productos por categoria
    path('review/<int:pk>/', views.create_review),
]
