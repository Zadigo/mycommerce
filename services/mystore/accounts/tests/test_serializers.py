from django.test import override_settings

from accounts.api import serializers
from accounts.tests.utils import AuthenticatedTestCase


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class TestUserRegistrationSerializer(AuthenticatedTestCase):
    fixtures = ['accounts']

    def test_valid_data(self):        
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123',
            'password_confirmation': 'password123'
        }
        
        serializer = serializers.UserRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save()
