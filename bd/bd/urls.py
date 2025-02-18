from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls), # temporal
    path('api/v1/', include('accounts.urls')),
]