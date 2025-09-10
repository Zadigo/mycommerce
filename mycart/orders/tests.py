import json
import os
import time

from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase, override_settings
from django.urls import reverse
from orders.payment import PaymentInterface

from mycart.mixins import AuthenticationMixin


class TestOrdersApi(AuthenticationMixin):
    fixtures = ['orders']

    # @classmethod
    # def setUpTestData(cls):
    #     os.environ.setdefault('STRIPE_TEST_CARD', 'tok_visa')

    #     # settings.DEBUG = True

    #     # model = get_user_model()

    #     cls.user = get_user_model().objects.first()
    #     cls.user.set_password('touparet')
    #     cls.user.save()

    #     # cls.user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
    #     # cls.user.userprofile.save()

    def setUp(self):
        self.client = self.client_class()
        self.token = self._authenticate()

    def test_create_shipping(self):
        """
        See: https://docs.stripe.com/testing?testing-method=tokens
        """
        shipping = json.dumps({
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
        })

        response = self.client.post(
            reverse('orders_api:create'),
            content_type='application/json',
            data=shipping
        )
        self.assertEqual(response.status_code, 200,
                         f'Failed to create shipping: {response.json()}')


class TestPaymentInterface(TestCase):
    fixtures = ['fixtures/user']

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.first()
        cls.user.userprofile.stripe_id = os.getenv('STRIPE_TEST_CUSTOMER_ID')
        cls.user.userprofile.save()

    def test_create_new_source(self):
        with override_settings(DEBUG=True):
            instance = PaymentInterface()

            response = instance.create_new_source(
                customer=self.user.userprofile.stripe_id,
                source=os.getenv('STRIPE_TEST_CARD')
            )

            self.assertTrue(
                response,
                f'Failed to create new source: {instance.errors}'
            )

    def test_create_modify_capture_payment_intent(self):
        with override_settings(DEBUG=True):
            instance = PaymentInterface()

            request = RequestFactory()
            request = request.get(reverse('orders_api:intent'))
            setattr(request, 'user', self.user)

            intent_response = instance.payment_intent(request, 16.45)
            self.assertTrue(intent_response)

            address = self.user.userprofile.address_set.create(
                firstname='Juliette',
                lastname='Mahut',
                address_line='1 rue de Paris',
                zip_code=59000,
                city='Lille',
                country='France',
                telephone='0601010101'
            )

            response = instance.update_intent(
                instance.payment_details.payment_intent_id,
                address
            )
            self.assertIsNotNone(response, f'Response is None: {response}, {instance.errors}')

            time.sleep(3)

            source_response = instance.create_new_source(
                request.user.userprofile.stripe_id,
                'tok_visa'
            )

            time.sleep(3)

            result = instance.capture_intent(
                request,
                instance.payment_details.payment_intent_id,
                source_response['id']
            )
            self.assertTrue(result, f'Failed to create payment intent: {result}, {instance.errors}')

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
