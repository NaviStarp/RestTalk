from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    id = models.AutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD = 'username'
    
    def __str__(self):
        return self.username
