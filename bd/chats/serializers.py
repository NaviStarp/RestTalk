from rest_framework import serializers
from .models import Chat,Message

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ('id','chat_type', 'users', 'name', 'created_at', 'updated_at')
        extra_kwargs = {
            'users': {'required': False},
            'name': {'required': False},
        }
    def create(self, validated_data):
        users = validated_data.pop('users', [])  # Extraer usuarios antes de crear el chat
        chat = Chat.objects.create(**validated_data)  # Crear el chat sin los usuarios
        
        if users:
            chat.users.set(users)  # Asignar usuarios correctamente usando set()
        
        return chat

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = (  'id', 'chat', 'sender', 'text', 'created_at', 'updated_at', 'attachment', 'attachment_type', 'read_by')
        extra_kwargs = {
            'text': {'required': False},
            'attachment': {'required': False},
            'attachment_type': {'required': False},
            'read_by': {'required': False},
        }

    def create(self, validated_data):
        chat = validated_data.pop('chat', None)
        sender = validated_data.pop('sender', None)
        read_by = validated_data.pop('read_by', [])
        message = Message.objects.create(chat=chat, sender=sender, **validated_data)
        if read_by:
            message.read_by.set(read_by)
        return message