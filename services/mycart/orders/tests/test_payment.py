import json
from unittest.mock import Mock, PropertyMock, patch

from cart.models import Cart
from django.test import RequestFactory
from django.urls import reverse
from rest_framework.response import Response

from accounts.tests.mixins import AuthenticatedTestCase
from cart.tests.utils import SERIALIZED_CARTITEM


@patch('orders.api.views.PaymentInterface')
class TestPaymentInterface(AuthenticatedTestCase):
    fixtures = ['fixtures/user']

    def _create_fake_request(self):
        fake_request = RequestFactory()
        fake_request = fake_request.get(reverse('cart_api:list'))
        setattr(fake_request, 'user', self.user)
        setattr(fake_request, 'META', {'REMOTE_ADDR': ''})
        return fake_request

    def _build_fake_interface(self, mock_value):
        intent_value = 'pi_1N4qY2L3a'

        fake_intent = Mock(name='PaymentIntent')
        type(fake_intent).id = PropertyMock(return_value=intent_value)
        type(fake_intent).response_data = PropertyMock(return_value={})
        mock_value.payment_intent.return_value = fake_intent

        value = {
            'error': 'Failed to create intent'
        }

        fail_response = Response(value, status=400)
        mock_value.return_value.get_fail_response.return_value = fail_response

        value = {
            'intent': intent_value,
            'client': 'some_client_secret_value'
        }

        success_response = Response(value, status=200)
        mock_value.get_success_response.return_value = success_response

        mock_value.update_intent.return_value = True

    def test_with_valid_cart(self, mocked_interface: Mock):
        new_item = Cart.objects.create(**{
            'session_id': 'test_session_12345',
            'items': SERIALIZED_CARTITEM['items'],
            'total': 15,
            'quantity': 3
        })

        fake_interface = mocked_interface.return_value
        self._build_fake_interface(fake_interface)

        response = self.client.post(
            reverse('orders_api:intent'),
            data={
                'session_id': new_item.session_id,
                'total': new_item.total
            }
        )

        self.assertEqual(
            response.status_code, 200,
            f'Failed to process payment intent: {response.json()}'
        )

    def test_with_invalid_cart(self, mocked_interface: Mock):
        Cart.objects.create(**{
            'session_id': 'test_session_12345',
            'items': SERIALIZED_CARTITEM['items'],
            'total': 15,
            'quantity': 3,
            'is_paid_for': True
        })

        fake_interface = mocked_interface.return_value
        self._build_fake_interface(fake_interface)

        response = self.client.post(
            reverse('orders_api:intent'),
            data={
                'session_id': 'test_session_12345',
                'total': 15
            }
        )

        print(response.json())

        self.assertEqual(
            response.status_code, 400,
            'Invalid operation on paid cart'
        )

    def test_update_payment_intent(self, mocked_interface: Mock):
        new_item = Cart.objects.create(**{
            'session_id': 'test_session_12345',
            'items': SERIALIZED_CARTITEM['items'],
            'payment_intent': 'pi_1N4qY2L3a',
            'total': 15,
            'quantity': 3
        })

        fake_interface = mocked_interface.return_value
        self._build_fake_interface(fake_interface)

        response = self.client.post(
            reverse('orders_api:update'),
            data=json.dumps({
                'intent': 'pi_1N4qY2L3a',
                'shipment': None,
                'session_id': new_item.session_id,
                'total': new_item.total
            }),
            content_type='application/json'
        )

        print(response.json())

        # self.assertEqual(
        #     response.status_code, 200,
        #     f'Failed to process payment intent: {response.json()}'
        # )
