from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase


class AuthenticationMixin:
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.get(pk=1)
        cls.user.set_password('touparet')
        cls.user.save()

    def setUp(self):
        self.client = self.client_class()
        self.token = self._authenticate()

    def _authenticate(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': 'juliette',
                'password': 'touparet'
            }
        )

        self.assertEqual(response.status_code, 200, 'Authentication failed')

        token = response.json().get('access')
        self.assertIsNotNone(token, 'Token retrieval failed')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        return token


class AuthenticatedTestCase(AuthenticationMixin, APITestCase):
    pass
