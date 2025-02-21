from django.urls import reverse
from django.conf import settings
from django.views import View
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny

from urllib.parse import urljoin
import requests
from .serializers import UserSerializer
from .models import User


class GoogleLoginCallback(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'Authorization code required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token_url = 'https://oauth2.googleapis.com/token'
            data = {
                'code': code,
                'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
                'client_secret': settings.GOOGLE_OAUTH_CLIENT_SECRET,
                'redirect_uri': settings.GOOGLE_OAUTH_CALLBACK_URL,
                'grant_type': 'authorization_code'
            }

            token_response = requests.post(token_url, data=data)
            token_data = token_response.json()

            if 'error' in token_data:
                return Response({'error': token_data['error']}, status=status.HTTP_400_BAD_REQUEST)

            access_token = token_data.get('access_token')
            user_info = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            ).json()

            # Create or get user
            email = user_info.get('email')
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': user_info.get('given_name', ''),
                    'last_name': user_info.get('family_name', '')
                }
            )

            # Create token
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,
                'user_id': user.id,
                'email': user.email
            })

        except requests.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request):
        username = request.data.get('username').lower()
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        print(user)
        if user:
            login(request, user)
            token = Token.objects.get_or_create(user=user)
            # return Response({"token": token.key, "user_id": user.id, "username": user.username}) Ahora que sabemos que funciona, voy a redirigir a otro sitio
            return Response({"token": token.key, "user_id": user.id, "username": user.username})
        return Response({"error": "Invalid credentials", "contra": password, "usuario": username}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.username = request.data["username"].lower()
            user.set_password(request.data["password"])
            user.is_active = True
            user.save()
            token = Token.objects.get_or_create(user=user)            
            return Response({
                "token": token.key,
                "user_id": user.id,
                "username": user.username
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginPage(View):
    def get(self, request):
        return render(
            request,
            "pages/login.html",
            {
                "google_callback_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
                "google_client_id": settings.GOOGLE_OAUTH_CLIENT_ID
            },
        )
