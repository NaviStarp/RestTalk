from django.db import models
from django.conf import settings

class Chat(models.Model):
    CHAT_TYPE_CHOICES = [
        ('DM', 'Mensaje Directo'),
        ('GROUP', 'Grupo'),
    ]
    chat_type = models.CharField(
        max_length=10, 
        choices=CHAT_TYPE_CHOICES, 
        default='DM',
        help_text="Define si el chat es entre 2 usuarios o un grupo"
    )
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chats')
    name = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Nombre del grupo (requerido solo para chats grupales)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.chat_type == 'GROUP' and self.name:
            return self.name
        # Para mensajes directos, mostramos los nombres de los usuarios participantes
        return "Chat entre " + " y ".join(user.username for user in self.users.all())


class Message(models.Model):
    ATTACHMENT_TYPE_CHOICES = [
        ('image', 'Imagen'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('file', 'Archivo'),
    ]
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Campo opcional para adjuntar archivos (imagen, video, audio o documento)
    attachment = models.FileField(upload_to='chat_attachments/', blank=True, null=True)
    attachment_type = models.CharField(
        max_length=10, 
        choices=ATTACHMENT_TYPE_CHOICES, 
        blank=True, 
        null=True,
        help_text="Tipo de adjunto si es que lo hay"
    )
    # Registro de usuarios que han leído el mensaje (para implementar read receipts)
    read_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='read_messages', blank=True)
    
    def __str__(self):
        if self.text:
            return f"{self.sender.username}: {self.text[:20]}"
        return f"{self.sender.username}: (Adjunto)"
