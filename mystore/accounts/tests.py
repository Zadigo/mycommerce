from accounts.models import Address
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from accounts import tasks
from orders.payment import StripeInterfaceMixin


class TestAccounts(APITestCase):
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

    def test_get_profile_data(self):
        path = reverse('accounts_api:user')
        response = self.client.get(path)

        self.assertEqual(response.status_code == 200)
        self.assertIn('id', response.json())
        self.assertEqual(response.json()['email'], 'juliette@test-mail.com')

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
        path = reverse('accounts_api:addresses', args=[1])
        response = self.client.post(path, data={
            'firstname': 'Julie',
            'lastname': 'Poto',
            'address_line': '1 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 0
        })
        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)

        update_response = self.client.patch(path, data={
            'firstname': 'Julie',
            'lastname': 'Poto',
            'address_line': '15 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 0
        })

        data = update_response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)
        self.assertEqual(data['address_line'], '15 rue de Paris')

    def test_create_user_in_stripe(self):
        tasks.signup_workflow.apply_async(
            args=[self.user.email],
            countdown=1
        )
