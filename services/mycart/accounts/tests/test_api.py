from django.urls import reverse
from django.test import override_settings
from accounts.tests.mixins import AuthenticatedTestCase
from accounts.models import Address


@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
class TestUserApiEndpoints(AuthenticatedTestCase):
    def test_get_user_details(self):
        path = reverse('accounts_api:user', args=[self.user.id])
        response = self.client.get(path)

        self.assertEqual(response.status_code, 200, response.content)
        self.assertIn('id', response.json())
        self.assertEqual(response.json()['email'], self.user.email)

    def test_update_user_details(self):
        path = reverse('accounts_api:user', args=[self.user.id])
        response = self.client.patch(path, data={
            'last_name': 'Courrir'
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('last_name', response.json())
        self.assertEqual(response.json()['last_name'], 'Courrir')

    def test_create_user(self):
        path = reverse('accounts_api:signup')
        response = self.client.post(path, data={
            'username': 'test_user',
            'email': 'random@gmail.com',
            'password1': 'touparette',
            'password2': 'touparette'
        })

        data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn('username', data, data)

    def test_login_successful(self):
        path = reverse('accounts_api:login')
        response = self.client.post(path, data={
            'email': self.user.email,
            'password': 'touparet'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())

    def test_login_failed(self):
        path = reverse('accounts_api:login')

        testcases = [
            ('wrong_username', 'touparet', True),
            (self.user.email, 'wrong_password', True),
            (self.user.email, 'touparet', False)
        ]

        for testcase in testcases:
            email, password, is_active = testcase

            if not is_active:
                self.user.is_active = False
                self.user.save()

            with self.subTest(testcase=testcase):
                response = self.client.post(path, data={
                    'email': email,
                    'password': password
                })
                self.assertEqual(response.status_code, 400)

    def test_get_authentication_token(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': self.user.username,
                'password': 'touparet'
            }
        )
        self.assertEqual(response.status_code, 200, response.content)


@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
class TestAddressApiEndpoints(AuthenticatedTestCase):
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
