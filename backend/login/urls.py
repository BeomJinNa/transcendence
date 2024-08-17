from django.urls import path
from .views import LoginView, LogoutView, RegisterView, Verify2FAcode

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('verify/', Verify2FAcode.as_view(), name='verify-2fa'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]