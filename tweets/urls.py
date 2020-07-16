from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views
from . import rest_views

urlpatterns = [
    path('home/', views.render_home_page, name="home"),
    path('create/', rest_views.tweet_create_view, name="create-tweet"),
    path('list/', rest_views.tweet_list_view),
    path('list/<int:pk>/', rest_views.tweet_detail_view),
    path('delete/<int:pk>/', rest_views.tweet_delete_view),
    path('like/<int:pk>/', rest_views.tweet_like_view),
    path('unlike/<int:pk>/', rest_views.tweet_unlike_view),
    path('retweet/<int:pk>/', rest_views.tweet_retweet_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
