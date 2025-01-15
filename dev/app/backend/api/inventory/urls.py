from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('products/', views.ProductView.as_view()), #name='products'),
    path('products/<int:id>/', views.ProductView.as_view()), #name='products'),
    path('products/model/', views.ProductModelViewSet.as_view({'get': 'list', 'post': 'create'})), #name='products_model'),
    path('inventories/<int:id>/', views.InventoryView.as_view()), #name='inventories'),
    path('purchases/', views.PurchaseView.as_view()), #name='purchases'),
    path('sales/', views.SalesView.as_view()), #name='sales'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('login/', views.LoginView.as_view()), #name='login'),
    path('retry/', views.RetryView.as_view()), #name='retry'),
    path('logout/', views.LogoutView.as_view()), #name='logout'),   
]