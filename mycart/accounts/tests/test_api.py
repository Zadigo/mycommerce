
import factory
import pytest
from accounts.models import Address
from django.contrib.auth import get_user_model


class UserFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Faker('email')
    username = factory.Faker('user_name')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True


class UserProfileFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    user = factory.SubFactory(UserFaker)
    stripe_id = factory.Faker('ean13')
    source_id = factory.Faker('ean8')
    telephone = factory.Faker('phone_number')


class AddressFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = Address

    user_profile = factory.SubFactory(UserProfileFaker)
    firstname = factory.Faker('firstname')
    lastname = factory.Faker('lastname')
    address_line = factory.Faker('street_address')
    address_line_two = factory.Faker('secondary_address')
    zip_code = factory.Faker('postcode')
    country = factory.Faker('country_code')
    city = factory.Faker('city')
    telephone = factory.Faker('phone')
    gender = factory.Faker('random_int', min=0, max=1)
    is_active = True


@pytest.mark.django_db
def test_address_creation():
    address = AddressFaker()
    assert address.id is not None


# class TestApiEndpoints(APITestCase):
#     fixtures = ['accounts']

#     @classmethod
#     def setUpTestData(cls):
#         cls.user = get_user_model().objects.first()
#         cls.user.set_password('touparet')
#         cls.user.save()

#     def setUp(self):
#         self.client = self.client_class()
#         self.token = self._authenticate()

#     def _authenticate(self):
#         response = self.client.post(
#             reverse('token_obtain_pair'),
#             data={
#                 'username': self.user.username,
#                 'password': 'touparet'
#             }
#         )

#         self.assertEqual(response.status_code, 200, 'Authentication failed')

#         token = response.json().get('access')
#         self.assertIsNotNone(token, 'Token retrieval failed')

#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
#         return token

#     @unittest.skipIf(False, 'Login with email not yet implemented')
#     def test_authenticate_with_email(self):
#         response = self.client.post(
#             reverse('token_obtain_pair'),
#             data={
#                 'email': self.user.email,
#                 'password': 'touparet'
#             }
#         )
#         self.assertEqual(response.status_code, 200, 'Cannot login with email')

#     def test_get_user_details(self):
#         path = reverse('accounts_api:user', args=[self.user.id])
#         response = self.client.get(path)

#         self.assertEqual(response.status_code, 200)
#         self.assertIn('id', response.json())
#         self.assertEqual(response.json()['email'], 'juliette@test-mail.com')

#     def test_update_user_details(self):
#         path = reverse('accounts_api:user', args=[self.user.id])
#         response = self.client.patch(path, data={
#             'last_name': 'Courrir'
#         })

#         self.assertEqual(response.status_code, 200)
#         self.assertIn('last_name', response.json())
#         self.assertEqual(response.json()['last_name'], 'Courrir')

#     def test_list_address_line(self):
#         Address.objects.create(**{
#             'user_profile': self.user.userprofile,
#             'firstname': 'Julie',
#             'lastname': 'Poto',
#             'address_line': '1 rue de Paris',
#             'zip_code': 75001,
#             'country': 'France',
#             'city': 'Paris',
#             'gender': 0
#         })

#         path = reverse('accounts_api:addresses', args=[1])
#         response = self.client.get(path)
#         self.assertTrue(response.status_code == 200)

#         for data in response.json():
#             with self.subTest(data=data):
#                 self.assertIn('id', data)

#     def test_create_new_address_line(self):
#         path = reverse('accounts_api:addresses', args=[self.user.id])
#         response = self.client.post(path, data={
#             'firstname': 'Julie',
#             'lastname': 'Poto',
#             'address_line': '1 rue de Paris',
#             'zip_code': 75001,
#             'country': 'France',
#             'city': 'Paris',
#             'telephone': '0600010101',
#             'gender': 1
#         })
#         data = response.json()
#         self.assertEqual(response.status_code, 201)
#         self.assertIn('id', data)

#         path = reverse(
#             'accounts_api:update_address_line',
#             args=[self.user.id, data['id']]
#         )

#         update_response = self.client.patch(path, data={
#             'firstname': 'Julie',
#             'lastname': 'Potosse',
#             'address_line': '15 rue de Paris',
#             'zip_code': 75001,
#             'country': 'France',
#             'city': 'Paris',
#             'telephone': '0600010101',
#             'gender': 1
#         })

#         data = update_response.json()
#         self.assertEqual(response.status_code, 201)
#         self.assertIn('id', data)
#         self.assertEqual(data['address_line'], '15 rue de Paris')

#     def test_create_user(self):
#         path = reverse('accounts_api:signup')
#         response = self.client.post(path, data={
#             'email': 'random@gmail.com',
#             'password1': 'touparette',
#             'password2': 'touparette'
#         })

#         data = response.json()
#         self.assertEqual(response.status_code, 201)
#         self.assertIn('id', data)

#     def test_list_delivery_options(self):
#         pass


# class TestApiAccounts(APITestCase):
#     fixtures = ['accounts']

#     @classmethod
#     def setUpTestData(cls):
#         cls.user = get_user_model().objects.first()
#         cls.user.set_password('touparet')
#         cls.user.save()

#     def _authenticate(self):
#         credentials = {'email': self.user.email, 'password': 'touparet'}
#         path = reverse('accounts_api:login')
#         response = self.client.post(
#             path,
#             data=credentials,
#             content_type='application/json'
#         )
#         self.assertEqual(response.status_code, 201, response.content)
#         return response.json()

#     def test_login(self):
#         data = self._authenticate()
#         self.assertIn('access', data)

#     def test_logout(self):
#         access = self._authenticate().get('access')
#         self.client.credentials(HTTP_AUTHORIZATION=f'Token {access}')

#         path = reverse('accounts_api:logout')
#         response = self.client.post(path)
#         self.assertEqual(response.status_code, 200, response.content)
