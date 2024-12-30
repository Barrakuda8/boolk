from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from authentication.serializers import UserModelSerializer
from .models import ResidentialComplex, Building, Apartment, ApartmentImage, Amenity, Reservation, ReservationGroup


class ResidentialComplexModelSerializer(ModelSerializer):

    class Meta:
        model = ResidentialComplex
        fields = ['id', 'name']


class BuildingModelSerializer(ModelSerializer):

    residential_complex = ResidentialComplexModelSerializer()

    class Meta:
        model = Building
        fields = ['id', 'address', 'residential_complex']


class ApartmentImageModelSerializer(ModelSerializer):

    class Meta:
        model = ApartmentImage
        fields = ['image', 'main']


class AmenityModelSerializer(ModelSerializer):

    class Meta:
        model = Amenity
        fields = ['name', 'icon']


class ApartmentReservationModelSerializer(ModelSerializer):

    class Meta:
        model = Reservation
        fields = ['date']


class ApartmentModelSerializer(ModelSerializer):

    building = BuildingModelSerializer()
    images = ApartmentImageModelSerializer(many=True, read_only=True)
    amenities = AmenityModelSerializer(source='get_amenities', many=True, read_only=True)
    reservations = ApartmentReservationModelSerializer(source='get_reservations', many=True, read_only=True)

    class Meta:
        model = Apartment
        fields = ['id', 'number', 'building', 'rooms', 'area', 'price', 'images', 'amenities', 'reservations']


class ReservationGroupApartmentModelSerializer(ModelSerializer):
    building = BuildingModelSerializer()

    class Meta:
        model = Apartment
        fields = ['id', 'number', 'building', 'rooms']


class ReservationGroupModelSerializer(ModelSerializer):

    apartment = ReservationGroupApartmentModelSerializer()
    start_date = serializers.CharField(source='get_start_date')
    end_date = serializers.CharField(source='get_end_date')

    class Meta:
        model = ReservationGroup
        fields = ['id', 'apartment', 'start_date', 'end_date']

