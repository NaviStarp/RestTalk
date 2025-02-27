from django.urls import path
from .views import ChatView, MessageView, GetChatView, GetMessageView, CreateChatView, CreateMessageView,GetUserByUsername

urlpatterns = [
    path('chats/', ChatView.as_view(), name='chat-list-create'),
    path('messages/', MessageView.as_view(), name='message-list-create'),
    path('fhu/get/<str:name>/', GetUserByUsername.as_view(), name='get-user-by-username'),
    path('chats/get/', GetChatView.as_view(), name='get-chat'),
    path('messages/get/', GetMessageView.as_view(), name='get-message'),
    path('chats/create/', CreateChatView.as_view(), name='create-chat'),
    path('messages/send/', CreateMessageView.as_view(), name='send-message'),
]