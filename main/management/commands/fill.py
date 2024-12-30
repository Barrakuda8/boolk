import json
from django.conf import settings
from django.core.management.base import BaseCommand

import main.models
from main.models import Amenity, ApartmentAmenity, Apartment, ApartmentImage, ResidentialComplex, Building


def load_from_json(file_name):
    with open(f'{settings.BASE_DIR}/json/{file_name}.json', 'r', encoding='utf-8') as json_file:
        return json.load(json_file)


class Command(BaseCommand):

    def handle(self, *args, **options):
        residential_complex = load_from_json('residential_complex')
        buildings = load_from_json('building')
        apartments = load_from_json('apartment')
        amenities = load_from_json('amenity')
        apartment_amenities = load_from_json('apartment_amenity')
        apartment_images = load_from_json('apartment_image')

        ResidentialComplex.objects.all().delete()
        for complex_ in residential_complex:
            ResidentialComplex.objects.create(**complex_)

        Building.objects.all().delete()
        for building in buildings:
            complex_ = ResidentialComplex.objects.get(name=building['residential_complex'])
            building['residential_complex'] = complex_
            Building.objects.create(**building)

        Apartment.objects.all().delete()
        for apartment in apartments:
            building = Building.objects.get(address=apartment['building'])
            apartment['building'] = building
            Apartment.objects.create(**apartment)

        Amenity.objects.all().delete()
        for amenity in amenities:
            Amenity.objects.create(**amenity)

        ApartmentAmenity.objects.all().delete()
        for apartment_amenity in apartment_amenities:
            apartment = Apartment.objects.get(number=apartment_amenity['apartment'],
                                              building__address=apartment_amenity['building'])
            del apartment_amenity['building']
            apartment_amenity['apartment'] = apartment
            amenity = Amenity.objects.get(name=apartment_amenity['amenity'])
            apartment_amenity['amenity'] = amenity
            ApartmentAmenity.objects.create(**apartment_amenity)

        ApartmentImage.objects.all().delete()
        for apartment_image in apartment_images:
            try:
                apartment = Apartment.objects.get(number=apartment_image['apartment'],
                                                  building__address=apartment_image['building'])
                del apartment_image['building']
                apartment_image['apartment'] = apartment
                ApartmentImage.objects.create(**apartment_image)
            except main.models.Apartment.DoesNotExist:
                pass


