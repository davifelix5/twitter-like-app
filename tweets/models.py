from django.db import models
import random


class Tweet(models.Model):
    content = models.TextField(max_length=240, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to='media/%Y/%m')

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 150)
        }
