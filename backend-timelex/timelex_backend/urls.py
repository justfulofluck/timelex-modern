from django.contrib import admin
from django.urls import path, include
from core.views import EmailAuthToken, PasswordResetView, ChangePasswordView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/login/', EmailAuthToken.as_view(), name='api_token_auth'),
    path('api/reset-password/', PasswordResetView.as_view(), name='password_reset'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change_password'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
