from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone_number = models.CharField(max_length=32, verbose_name='Номер телефона')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
