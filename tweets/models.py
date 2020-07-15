from django.db import models
from django.contrib.auth.models import User
import random


class Tweet(models.Model):
    content = models.TextField(max_length=240, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to='media/%Y/%m')
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-id']

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 150)
        }

    def __str__(self):
        return f'Tweet {self.id}'
