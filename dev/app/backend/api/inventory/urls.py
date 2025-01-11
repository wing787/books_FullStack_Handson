from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductView.as_view()), #name='products'),
    path('products/<int:id>/', views.ProductView.as_view()), #name='products'),
    path('purchases/', views.PurchaseView.as_view()), #name='purchases'),
    path('sales/', views.SalesView.as_view()), #name='sales'),
    path('products/model/', views.ProductModelViewSet.as_view({'get': 'list', 'post': 'create'})), #name='products_model'),
    path('inventories/<int:id>/', views.InventoryView.as_view()), #name='inventories'),
]