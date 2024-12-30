from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from main.filters import ApartmentFilter
from main.models import Apartment, ReservationGroup, Reservation, ResidentialComplex
from main.serializers import ApartmentModelSerializer, ReservationGroupModelSerializer, \
    ResidentialComplexModelSerializer


class GetOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method == 'GET'


class ReservationPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user.pk == request.user


class ResidentialComplexModelViewSet(ListModelMixin, GenericViewSet):

    queryset = ResidentialComplex.objects.all()
    permission_classes = [GetOnly]
    serializer_class = ResidentialComplexModelSerializer


class ApartmentModelViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):

    queryset = Apartment.objects.all()
    permission_classes = [GetOnly]
    serializer_class = ApartmentModelSerializer
    filterset_class = ApartmentFilter


class ReservationGroupModelViewSet(ModelViewSet):

    queryset = ReservationGroup.objects.all()
    permission_classes = [ReservationPermissions]
    serializer_class = ReservationGroupModelSerializer

    def get_queryset(self):
        if self.request.user:
            return (ReservationGroup.objects.filter(user__pk=self.request.user.pk, end_date__gte=datetime.now())
                    .order_by('start_date'))
        else:
            return []

    def create(self, request, *args, **kwargs):
        apartment = Apartment.objects.get(pk=request.data['apartment'])
        dates = request.data['dates']
        start = datetime.strptime(dates[0][:16], '%Y-%m-%dT%H:%M') + timedelta(hours=request.data['offset'] / -60)
        end = datetime.strptime(dates[1][:16], '%Y-%m-%dT%H:%M') + timedelta(hours=request.data['offset'] / -60)
        group = ReservationGroup.objects.create(apartment=apartment, start_date=start, end_date=end, user=request.user)
        for x in range((end - start).days + 1):
            Reservation.objects.create(apartment=apartment, date=(start + timedelta(days=x)).date(), group=group)
        return Response(status=status.HTTP_200_OK)


