from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin
from .models import User
from .serializers import UserModelSerializer


class UserModelViewSet(GenericViewSet, CreateModelMixin):

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserModelSerializer
