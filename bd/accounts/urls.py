from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('login/', views.LoginView.as_view(), name='login-api'),
    path('login-page/', views.LoginPage.as_view(), name='login-page'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('auth/google/callback/', views.GoogleLoginCallback.as_view(), name='google-callback'),
]