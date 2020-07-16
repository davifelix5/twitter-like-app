from rest_framework import serializers
from .models import Tweet


class RetweetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tweet
        fields = ['id', 'parent', 'user', 'content']


class TweetCreateSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    retweets = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'likes', 'content', 'user', 'retweets']

    def get_likes(self, obj):
        return obj.likes.count()

    def get_retweets(self, obj):
        return Tweet.objects.filter(parent__pk=obj.pk).count()

    def validate_content(self, value):

        if len(value) > 240:
            raise serializers.ValidationError('Esse tweet é muito longo!')
        elif len(value) == 0:
            raise serializers.ValidationError('Esse tweet é muito curto!')

        return value


class TweetViewSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    retweets = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'likes', 'content', 'user', 'is_retweet', 'parent', 'retweets']

    def get_likes(self, obj):
        return obj.likes.count()

    def get_retweets(self, obj):
        return Tweet.objects.filter(parent__pk=obj.pk).count()
