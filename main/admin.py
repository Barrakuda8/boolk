from django.contrib import admin
from main.models import ResidentialComplex, Building, Apartment, Amenity, ApartmentAmenity, ApartmentImage, Reservation, \
    ReservationGroup


@admin.register(ResidentialComplex)
class ResidentialComplexAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ['id', 'address', 'residential_complex']


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'number', 'building', 'rooms', 'area', 'price']


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'icon']


@admin.register(ApartmentAmenity)
class ApartmentAmenityAdmin(admin.ModelAdmin):
    list_display = ['id', 'apartment', 'amenity']


@admin.register(ApartmentImage)
class ApartmentImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'apartment', 'image', 'main']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'apartment', 'date']


@admin.register(ReservationGroup)
class ReservationGroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'apartment', 'start_date', 'end_date', 'user']
