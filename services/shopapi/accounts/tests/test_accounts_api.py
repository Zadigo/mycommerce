import unittest

from django.urls import reverse

from accounts.models import Address
from accounts.tests.utils import AuthenticatedTestCase


class TestUserInfo(AuthenticatedTestCase):
    fixtures = ['accounts']

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


class TestAddressLines(AuthenticatedTestCase):
    fixtures = ['accounts']

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
            'accounts_api:update_destroy_address_line',
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

    def test_update_address_line(self):
        address = Address.objects.create(**{
            'user_profile': self.user.userprofile,
            'firstname': 'Julie',
            'lastname': 'Poto',
            'address_line': '1 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 1
        })

        path = reverse(
            'accounts_api:update_destroy_address_line',
            args=[self.user.id, address.id]
        )
        response = self.client.patch(path, data={
            'firstname': 'Julie',
            'lastname': 'Potosse',
            'address_line': '15 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 1
        })
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertIn('id', data)
        self.assertEqual(data['address_line'], '15 rue de Paris')

    def test_delete_address_line(self):
        address = Address.objects.create(**{
            'user_profile': self.user.userprofile,
            'firstname': 'Julie',
            'lastname': 'Poto',
            'address_line': '1 rue de Paris',
            'zip_code': 75001,
            'country': 'France',
            'city': 'Paris',
            'telephone': '0600010101',
            'gender': 1
        })

        path = reverse(
            'accounts_api:update_destroy_address_line',
            args=[self.user.id, address.id]
        )
        response = self.client.delete(path)
        self.assertEqual(response.status_code, 204)


class TestSignup(AuthenticatedTestCase):
    fixtures = ['accounts']

    def test_create_user(self):
        path = reverse('accounts_api:signup')
        response = self.client.post(path, data={
            'username': 'randomuser',
            'email': 'random@gmail.com',
            'password': 'touparette',
            'password_confirmation': 'touparette'
        })
        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)



class TestTokenObtainPairView(AuthenticatedTestCase):
    fixtures = ['accounts']

    # def test_obtain_token(self):
    #     path = reverse('token_obtain_pair')
    #     response = self.client.post(path, data={
    #         'username': self.user.username,
    #         'password': 'touparet'
    #     })
    #     data = response.json()
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn('access', data)

    # @unittest.skip('Login with email not yet implemented')
    # def test_authenticate_with_email(self):
    #     response = self.client.post(
    #         reverse('token_obtain_pair'),
    #         data={
    #             'email': self.user.email,
    #             'password': 'touparet'
    #         }
    #     )
    #     self.assertEqual(response.status_code, 200, response.json())
