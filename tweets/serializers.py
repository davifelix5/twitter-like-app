from rest_framework import serializers
from .models import Tweet


class TweetSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'likes', 'content', 'user']

    def get_likes(self, obj):
        return obj.likes.count()

    def validate_content(self, value):

        if len(value) > 240:
            raise serializers.ValidationError('Esse tweet é muito longo!')
        elif len(value) == 0:
            raise serializers.ValidationError('Esse tweet é muito curto!')

        return value
