from django.test import override_settings

from accounts.api import serializers
from accounts.tests.mixins import AuthenticatedTestCase


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class TestUserRegistrationSerializer(AuthenticatedTestCase):
    fixtures = ['accounts']

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123',
            'password_confirmation': 'password123'
        }

    def test_valid_data(self):        
        serializer = serializers.UserRegistrationSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        serializer.save()

    def test_password_mismatch(self):
        data = self.data.copy()
        data['password_confirmation'] = 'password124'

        serializer = serializers.UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

    def test_password_is_none(self):
        data = self.data.copy()
        data['password'] = None
        data['password_confirmation'] = None
        
        serializer = serializers.UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
