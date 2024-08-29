from django.urls import path
from .views import Verify2FAcode, RefreshView, MyselfView, Oauth2LoginView

urlpatterns = [
    path('verify/', Verify2FAcode.as_view(), name='verify-2fa'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('me/', MyselfView.as_view(), name='me'),
    path('oauth/', Oauth2LoginView.as_view(), name='oauth'),
]