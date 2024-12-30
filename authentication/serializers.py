from django.contrib.auth import get_user_model
from rest_framework import serializers

UserModel = get_user_model()


class UserModelSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):

        user = UserModel.objects.create_user(
            **validated_data
        )

        return user

    class Meta:
        model = UserModel
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'phone_number', 'email')