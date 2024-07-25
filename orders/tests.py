import os

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from orders.api import views
from orders.payment import PaymentInterface


class TestCreateOrderView(APITestCase):
    fixtures = ['orders']

    # def setUp(self):
    #     settings.DEBUG = True
    #     user_model = get_user_model()
    #     user = user_model.objects.create_user(
    #         username='lopale',
    #         email='lopale@gmail.com',
    #         password='touparet'
    #     )
    #     user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
    #     user.userprofile.save()
    #     self.user = user

    def setUp(self):
        settings.DEBUG = True
        user_model = get_user_model()
        user = user_model.objects.first()
        user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
        user.userprofile.save()
        self.user = user
        self.token = Token.objects.create(user=user)

    def test_structure(self):
        factory = RequestFactory(
            headers={'Authorization': f'Token {self.token.key}'}
        )
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
            'source': os.getenv('STRIPE_TEST_CARD'),
            'card_token': 'ca_token'
        }
        request = factory.post(reverse('orders_api:create'), data=shipping)
        request.user = self.user
        response = views.new_customer_order(request)
        self.assertEqual(response.status_code, 200)


class TestPaymentInterface(TestCase):
    def setUp(self):
        settings.DEBUG = True
        user_model = get_user_model()
        user = user_model.objects.create_user(
            username='lopale',
            email='lopale@gmail.com',
            password='touparet'
        )
        user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
        user.userprofile.save()
        self.user = user

    def test_structure(self):
        instance = PaymentInterface()

        request = RequestFactory()
        request = request.get('orders/payment/create')
        request.user = self.user
        params = {
            'address_line1': '1 rue Google',
            'zip_code': 59000,
            'city': 'Lille',
            'country': 'France',
            'telephone': '0689098978'
        }
        response = instance.payment(request, 16.45, stripe_params=params)
        self.assertDictEqual(instance.errors, {})
