from django.contrib import admin
from . import models


class TweetAdmin(admin.ModelAdmin):
    list_display = ['id', '__str__', 'content', 'user']
    list_filter = ['user']
    search_fields = ['content', 'user__username']

    class Meta:
        model = models.Tweet


admin.site.register(models.Tweet, TweetAdmin)
