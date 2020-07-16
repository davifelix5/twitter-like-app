from .serializers import TweetSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from . import models


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_create_view(request):

    serializer = TweetSerializer(data=request.POST or None)

    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    return Response({}, status=400)


@api_view(["GET"])
def tweet_list_view(request):
    queryset = models.Tweet.objects.all()
    serialized_tweets = TweetSerializer(queryset, many=True)
    response_data = {
        "message": "Tweets found successfully",
        "response": serialized_tweets.data,
    }
    return Response(response_data, status=200)


@api_view(["GET"])
def tweet_detail_view(request, pk):
    try:
        tweet = models.Tweet.objects.get(pk=pk)
    except models.Tweet.DoesNotExist:
        return Response(
            {'message': 'There is no such tweet'},
            status=404
        )
    serialized_tweet = TweetSerializer(tweet)
    response_data = {
        "message": "Tweet found successfully",
        "response": serialized_tweet.data,
    }
    return Response(response_data, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, pk):
    try:
        tweet = models.Tweet.objects.get(pk=pk)
    except models.Tweet.DoesNotExist:
        return Response(
            {'message': 'There is no such tweet'},
            status=404
        )
    if not tweet.user == request.user:
        return Response(
            {'message': "You cannot delete this tweet"},
            status=401
        )
    tweet.delete()
    return Response(
        {'message': "Tweet deleted succefully"},
        status=200
    )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def tweet_unlike_view(request, pk):
    try:
        tweet = models.Tweet.objects.get(pk=pk)
    except models.Tweet.DoesNotExist:
        return Response(
            {'message': 'There is no such tweet'},
            status=404
        )
    if request.user not in tweet.likes.all():
        return Response(
            {'message': 'User never liked this tweet'},
            status=409
        )

    tweet.likes.remove(request.user)

    return Response(
        {'message': 'Tweet unliked successfully'},
        status=200
    )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def tweet_like_view(request, pk):
    try:
        tweet = models.Tweet.objects.get(pk=pk)
    except models.Tweet.DoesNotExist:
        return Response(
            {'message': 'There is no such tweet'},
            status=404
        )
    if request.user in tweet.likes.all():
        return Response(
            {'message': 'User already liked this tweet'},
            status=409
        )

    tweet.likes.add(request.user)

    return Response(
        {'message': 'Tweet liked successfully'},
        status=200
    )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def tweet_retweet_view(request, pk):
    pass
