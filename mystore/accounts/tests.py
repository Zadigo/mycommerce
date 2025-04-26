import unittest
from accounts import tasks
from accounts.models import Address
from django.contrib.auth import get_user_model
from django.urls import reverse
from orders.payment import StripeInterfaceMixin
from rest_framework.test import APITestCase


class TestApiEndpoints(APITestCase):
    fixtures = ['accounts']

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

    def setUp(self):
        self.client = self.client_class()
        self.token = self._authenticate()

    def _authenticate(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': self.user.username,
                'password': 'touparet'
            }
        )

        self.assertEqual(response.status_code, 200, 'Authentication failed')

        token = response.json().get('access')
        self.assertIsNotNone(token, 'Token retrieval failed')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        return token

    @unittest.skipIf(False, 'Login with email not yet implemented')
    def test_authenticate_with_email(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'email': self.user.email,
                'password': 'touparet'
            }
        )
        self.assertEqual(response.status_code, 200, 'Cannot login with email')

    def test_get_user_details(self):
        path = reverse('accounts_api:user', args=[self.user.id])
        response = self.client.get(path)

        self.assertEqual(response.status_code, 200)
        self.assertIn('id', response.json())
        self.assertEqual(response.json()['email'], 'juliette@test-mail.com')

    def test_update_user_details(self):
        path = reverse('accounts_api:user', args=[self.user.id])
        response = self.client.patch(path, data={
            'last_name': 'Courrir'
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('last_name', response.json())
        self.assertEqual(response.json()['last_name'], 'Courrir')

    def test_list_address_line(self):
        Address.objects.create(**{
            'user_profile': self.user.userprofile,
            'firstname': 'Julie',
            'lastname': 'Poto',
            'address_line': '1 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'gender': 0
        })

        path = reverse('accounts_api:addresses', args=[1])
        response = self.client.get(path)
        self.assertTrue(response.status_code == 200)

        for data in response.json():
            with self.subTest(data=data):
                self.assertIn('id', data)

    def test_create_new_address_line(self):
        path = reverse('accounts_api:addresses', args=[self.user.id])
        response = self.client.post(path, data={
            'firstname': 'Julie',
            'lastname': 'Poto',
            'address_line': '1 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 1
        })
        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)

        path = reverse(
            'accounts_api:update_address_line',
            args=[self.user.id, data['id']]
        )

        update_response = self.client.patch(path, data={
            'firstname': 'Julie',
            'lastname': 'Potosse',
            'address_line': '15 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 1
        })

        data = update_response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)
        self.assertEqual(data['address_line'], '15 rue de Paris')

    def test_create_user(self):
        path = reverse('accounts_api:signup')
        response = self.client.post(path, data={
            'email': 'random@gmail.com',
            'password1': 'touparette',
            'password2': 'touparette'
        })
        data = response.json()
        print(data)
        # self.assertEqual(response.status_code, 201)
        # self.assertIn('id', data)

        # tasks.signup_workflow.apply_async(
        #     args=[self.user.email],
        #     countdown=1
        # )
