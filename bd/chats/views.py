from django.shortcuts import render
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import get_user_model

User = get_user_model()
class ChatView(generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetChatView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        chats = Chat.objects.filter(users=user)
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data
        serializer = ChatSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetMessageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        chat_id = request.query_params.get('chat_id')
        print("hola")
        print(chat_id)
        # Obtener todos los mensajes del chat, no solo los enviados por el usuario
        if chat_id:
            try:
                # Convertir chat_id a entero antes de usarlo
                chat_id = int(chat_id)
                messages = Message.objects.filter(chat_id=chat_id)
                print(messages)
            except ValueError:
                # Si chat_id no es un número válido, devolver error
                return Response(
                    {"error": "El parámetro chat_id debe ser un número válido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Si no se proporciona chat_id, obtener todos los mensajes relacionados con el usuario
            from django.db.models import Q
            messages = Message.objects.filter(
                Q(sender=user) | Q(chat__participants=user)
            ).distinct()
            
        serializer = MessageSerializer(messages, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        data = request.data.copy()  # Crear una copia para modificar
        data['sender'] = request.user.id
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateChatView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        chat_type = data.get("chat_type", "").upper()
        
        if chat_type not in ["DM", "GROUP"]:
            return Response(
                {"chat_type": ["Invalid choice. Must be 'DM' or 'GROUP'."]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convertir user_id a entero
        user_id = data.get("user_id")
        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return Response(
                {"user_id": ["Invalid user ID. Must be a number."]},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not user_id:
            return Response(
                {"user_id": ["This field is required."]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            other_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"user_id": ["User not found."]}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        data["users"] = [request.user.id, other_user.id]
        
        if "name" not in data:
            data["name"] = f"Chat with {other_user.username}"
        
        serializer = ChatSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateMessageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        data = request.data
        data['sender'] = request.user.id
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class GetUserByUsername(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        print("GET request:", request.query_params)  # Debugging (remove in production)
        
        username = request.query_params.get('username')
        if not username:
            return Response({"error": "Username parameter is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        user_data = User.objects.filter(username=username).values("id").first()

        if user_data:
            return Response({"id": user_data["id"]}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)