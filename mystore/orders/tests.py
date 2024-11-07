import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase
from django.urls import reverse
from orders.payment import PaymentInterface
from rest_framework.test import APITestCase


class TestOrders(APITestCase):
    fixtures = ['orders']

    @classmethod
    def setUpTestData(cls):
        settings.DEBUG = True

        model = get_user_model()

        cls.user = model.objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

        cls.user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
        cls.user.userprofile.save()

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

    def test_create_shipping(self):
        shipping = {
            'session_id': 'some_session',
            'email': 'juliette@test-mail.com',
            'firstname': 'Juliette',
            'lastname': 'Lopez',
            'address_line': '1 rue de Paris',
            'zip_code': 59000,
            'city': 'Lille',
            'country': 'France',
            'telephone': '0601010101',
            'delivery_option': 'Chronopost',
            'card': os.getenv('STRIPE_TEST_CARD'),
            'token': 'tok_visa',
            'intent': '',
            'client_ip': '1.1.1.1'
            # 'source': os.getenv('STRIPE_TEST_CARD'),
            # 'card_token': 'ca_token'
        }
        response = self.client.post(
            reverse('orders_api:create'),
            data=shipping
        )
        print(response.json())
        self.assertEqual(response.status_code, 200)


class TestPaymentInterface(TestCase):
    @classmethod
    def setUpClass(cls):
        settings.DEBUG = True

        model = get_user_model()

        cls.user = model.objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

        cls.user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
        cls.user.userprofile.save()

    def test_capture_payment_intent(self):
        instance = PaymentInterface()

        factory = RequestFactory()

        request = factory.get(reverse('orders_api:intent'))
        params = {
            'address_line1': '1 rue Google',
            'zip_code': 59000,
            'city': 'Lille',
            'country': 'France',
            'telephone': '0689098978'
        }
        result = instance.payment_intent(request, 16.45, stripe_params=params)
        self.assertDictEqual(instance.errors, {})
