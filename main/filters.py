from django_filters import rest_framework
from main.models import Apartment


class ApartmentFilter(rest_framework.FilterSet):

    residential_complex = rest_framework.NumberFilter(method='get_residential_complex')

    @staticmethod
    def get_residential_complex(queryset, field_name, value):
        return queryset.filter(building__residential_complex__pk=value)

    class Meta:
        model = Apartment
        fields = ['residential_complex', 'rooms']
