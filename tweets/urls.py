from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import rest_views

urlpatterns = [
    path('', rest_views.tweet_list_view),
    path('<int:pk>/', rest_views.tweet_detail_view),
    path('create/', rest_views.tweet_create_view, name="create-tweet"),
    path('delete/<int:pk>/', rest_views.tweet_delete_view),
    path('like/<int:pk>/', rest_views.tweet_like_view),
    path('unlike/<int:pk>/', rest_views.tweet_unlike_view),
    path('retweet/<int:pk>/', rest_views.tweet_retweet_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
