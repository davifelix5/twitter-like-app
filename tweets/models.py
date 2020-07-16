from django.db import models
from django.contrib.auth.models import User
import random


class TweetLike(models.Model):
    """
    Using a custom through model rather than django default,
    whilch allows me to add the timestamp field
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.TimeField(auto_now_add=True)


class Tweet(models.Model):
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    content = models.TextField(max_length=240, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to='media/%Y/%m')
    likes = models.ManyToManyField(User, related_name='tweet_user', blank=True, through=TweetLike)
    timestamp = models.TimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    @property
    def is_retweet(self):
        return self.parent is not None

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 150)
        }

    def __str__(self):
        return f'Tweet {self.id}'

