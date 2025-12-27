import json
import os
from unittest.mock import Mock, PropertyMock, patch

from cart.models import Cart
from django.test import RequestFactory
from django.urls import reverse
from rest_framework.response import Response

from mycart.mixins import (SERIALIZED_CARTITEM, AuthenticatedTestCase,
                           AuthenticationMixin)


class TestOrdersApi(AuthenticationMixin):
    fixtures = ['orders']

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


# @patch('orders.api.views.PaymentInterface')
class TestPaymentInterface(AuthenticatedTestCase):
    fixtures = ['fixtures/user']

    def test_process(self):
        new_item = Cart.objects.create(**{
            'session_id': 'test_session_12345',
            'items': SERIALIZED_CARTITEM['items'],
            'total': 15,
            'quantity': 3
        })

        fake_request = RequestFactory()
        fake_request = fake_request.get(reverse('cart_api:list'))
        setattr(fake_request, 'user', self.user)
        setattr(fake_request, 'META', {'REMOTE_ADDR': ''})

        with patch('orders.api.views.PaymentInterface') as mocked_interface:
            intent_value = 'pi_1N4qY2L3a'
            fake_interface = mocked_interface.return_value

            fake_intent = Mock(name='PaymentIntent')
            type(fake_intent).id = PropertyMock(return_value=intent_value)
            mocked_interface.return_value.payment_intent.return_value = fake_intent

            value = {
                'error': 'Failed to create intent'
            }

            fail_response = Response(value, status=400)
            fake_interface.return_value.get_fail_response.return_value = fail_response

            value = {
                'intent': intent_value,
                'client': 'some_client_secret_value'
            }

            success_response = Response(value, status=200)
            fake_interface.get_success_response.return_value = success_response

            response = self.client.post(
                reverse('orders_api:intent'),
                data={
                    'session_id': new_item.session_id,
                    'total': new_item.total
                }
            )

            print(response.json())

    # def test_create_new_source(self):
    #         with override_settings(DEBUG=True):
    #             instance = PaymentInterface()

    #             response = instance.create_new_source(
    #                 customer=self.user.userprofile.stripe_id,
    #                 source=os.getenv('STRIPE_TEST_CARD')
    #             )

    #             self.assertTrue(
    #                 response,
    #                 f'Failed to create new source: {instance.errors}'
    #             )

    # def test_create_modify_capture_payment_intent(self):
    #     with override_settings(DEBUG=True):
    #         instance = PaymentInterface()

    #         request = RequestFactory()
    #         request = request.get(reverse('orders_api:intent'))
    #         setattr(request, 'user', self.user)

    #         intent_response = instance.payment_intent(request, 16.45)
    #         self.assertTrue(intent_response)

    #         address = self.user.userprofile.address_set.create(
    #             firstname='Juliette',
    #             lastname='Mahut',
    #             address_line='1 rue de Paris',
    #             zip_code=59000,
    #             city='Lille',
    #             country='France',
    #             telephone='0601010101'
    #         )

    #         response = instance.update_intent(
    #             instance.payment_details.payment_intent_id,
    #             address
    #         )
    #         self.assertIsNotNone(
    #             response, f'Response is None: {response}, {instance.errors}')

    #         time.sleep(3)

    #         source_response = instance.create_new_source(
    #             request.user.userprofile.stripe_id,
    #             'tok_visa'
    #         )

    #         time.sleep(3)

    #         result = instance.capture_intent(
    #             request,
    #             instance.payment_details.payment_intent_id,
    #             source_response['id']
    #         )
    #         self.assertTrue(
    #             result, f'Failed to create payment intent: {result}, {instance.errors}')

    # def test_capture_payment_intent(self):
    #     instance = PaymentInterface()

    #     factory = RequestFactory()

    #     request = factory.get(reverse('orders_api:intent'))
    #     params = {
    #         'address_line1': '1 rue Google',
    #         'zip_code': 59000,
    #         'city': 'Lille',
    #         'country': 'France',
    #         'telephone': '0689098978'
    #     }
    #     result = instance.payment_intent(request, 16.45, stripe_params=params)
    #     self.assertDictEqual(instance.errors, {})
