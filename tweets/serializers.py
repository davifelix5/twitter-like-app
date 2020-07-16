from rest_framework import serializers
from .models import Tweet


class RetweetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tweet
        fields = ['id', 'parent', 'user', 'content']


class TweetCreateSerializer(serializers.ModelSerializer):
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


class TweetViewSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    original_tweet = TweetCreateSerializer(source='parent', read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'likes', 'content', 'is_retweet', 'parent']

    def get_likes(self, obj):
        return obj.likes.count()
