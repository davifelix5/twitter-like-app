from rest_framework.authentication import BasicAuthentication
from django.contrib.auth.models import User


class DevAuthentication(BasicAuthentication):

    def authenticate(self, request):
      user = User.objects.all().order_by('?').first()
      return (user, None)