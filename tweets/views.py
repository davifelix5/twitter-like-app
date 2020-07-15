from django.shortcuts import get_object_or_404, render, redirect
from django.http import JsonResponse
from django.conf import settings
from . import models
from .forms import TweetForm
import random


def render_home_page(request):
    context = {'tweet_form': TweetForm()}
    return render(request, 'pages/home.html', context)


def tweet_create_view(request):
    if not request.user.is_authenticated:
        if request.is_ajax():
            return JsonResponse(
                {'message': 'You must be authenticated'},
                status=401
            )
        return redirect(settings.LOGIN_URL)
    create_tweet_form = TweetForm(request.POST or None)
    if request.method == "POST":
        if create_tweet_form.is_valid():
            new_tweet = create_tweet_form.save(commit=False)
            new_tweet.user = request.user or None
            new_tweet.save()
            if request.is_ajax():
                return JsonResponse(new_tweet.serialize(), status=201)
            return redirect('home')
        if create_tweet_form.errors and request.is_ajax():
            return JsonResponse(create_tweet_form.errors, status=400)
    context = {
        "tweet_form": create_tweet_form
    }
    return render(request, 'tweets/create.html', context)


def tweet_list_view(request):
    tweets = models.Tweet.objects.all()
    status = 200
    serialized_tweets = [tweet.serialize() for tweet in tweets]
    if not serialized_tweets:
        status = 404
        return JsonResponse(
            {"message": "There are no tweets registed"},
            status=status
        )
    response_data = {
        "response": serialized_tweets,
        "message": "Tweets found successfully"
    }
    return JsonResponse(response_data, status=status)


def tweet_detail_view(request, pk):
    tweet = get_object_or_404(models.Tweet, id=pk)
    serialized_tweet = {
        "id": tweet.id,
        "content": tweet.content,
        "likes": random.randint(1, 150)
    }
    return JsonResponse(serialized_tweet, status=200)
