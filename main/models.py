from datetime import datetime

from django.db import models

from authentication.models import User


class ResidentialComplex(models.Model):
    name = models.CharField(max_length=128, verbose_name='Название')

    class Meta:
        verbose_name = 'Жилой комплекс'
        verbose_name_plural = 'Жилые комплексы'

    def __str__(self):
        return self.name


class Building(models.Model):
    residential_complex = models.ForeignKey(ResidentialComplex, on_delete=models.CASCADE, verbose_name='Жилой Комплекс')
    address = models.TextField(verbose_name='Адрес')

    class Meta:
        verbose_name = 'Здание'
        verbose_name_plural = 'Здания'

    def __str__(self):
        return f'{self.residential_complex}, {self.address}'


class Apartment(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE, verbose_name='Здание')
    number = models.PositiveSmallIntegerField(verbose_name='Номер квартиры')
    rooms = models.PositiveSmallIntegerField(verbose_name='Количество комнат')
    area = models.FloatField(verbose_name='Площадь (м)')
    price = models.FloatField(verbose_name='Цена за сутки')

    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'

    def get_amenities(self):
        return [x.amenity for x in self.amenities.select_related()]

    def get_reservations(self):
        return self.reservations.select_related().filter(date__gte=datetime.now())

    def __str__(self):
        return f'{self.building}, {self.number}'


class ApartmentImage(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='images', verbose_name='Квартира')
    image = models.ImageField(upload_to='images/', verbose_name='Изображение')
    main = models.BooleanField(default=False, verbose_name='Основное изображение')

    class Meta:
        verbose_name = 'Фото квартиры'
        verbose_name_plural = 'Фото квартир'


class Amenity(models.Model):
    name = models.CharField(max_length=64, verbose_name='Название')
    icon = models.ImageField(upload_to='icons/', verbose_name='Иконка')

    class Meta:
        verbose_name = 'Удобство'
        verbose_name_plural = 'Удобства'

    def __str__(self):
        return self.name


class ApartmentAmenity(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='amenities', verbose_name='Квартира')
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE, related_name='apartments', verbose_name='Удобство')

    class Meta:
        verbose_name = 'Удобство в квартире'
        verbose_name_plural = 'Удобства в квартирах'


class ReservationGroup(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='reservation_groups', verbose_name='Квартира')
    start_date = models.DateField(verbose_name='Начало бронирования')
    end_date = models.DateField(verbose_name='Окончание бронирования')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations', verbose_name='Пользователь')

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'

    def get_start_date(self):
        return self.start_date.strftime('%d.%m.%Y')

    def get_end_date(self):
        return self.end_date.strftime('%d.%m.%Y')


class Reservation(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='reservations', verbose_name='Квартира')
    date = models.DateField(verbose_name='Дата')
    group = models.ForeignKey(ReservationGroup, on_delete=models.CASCADE, related_name='reservations', null=True,
                              verbose_name='Бронирование')

    class Meta:
        verbose_name = 'Бронирование по дням'
        verbose_name_plural = 'Бронирования по дням'


