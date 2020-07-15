from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('home/', views.render_home_page, name="home"),
    path('create/', views.tweet_create_view, name="create-tweet"),
    path('list/', views.tweet_list_view),
    path('list/<int:pk>/', views.tweet_detail_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
