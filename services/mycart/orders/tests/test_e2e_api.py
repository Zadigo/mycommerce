from accounts.tests.mixins import AuthenticatedTestCase
from django.urls import reverse
from orders.models import CustomerOrder, Product
from orders.tests.utils import CustomerOrderFaker, ProductFaker
from cart.tests.utils import create_items
from django.conf import settings
from cart.utils import calculate_items_total
from unittest.mock import patch
from rest_framework.response import Response
from django.contrib.auth import get_user_model


class TestOrdersApi(AuthenticatedTestCase):
    # fixtures = ['orders']

    def setUp(self):
        super().setUp()
        products: list[Product] = ProductFaker.create_batch(2)
        self.orders: list[CustomerOrder] = CustomerOrderFaker.create_batch(2)

        for order in self.orders:
            order.user = self.user
            order.save()

        products[0].customer_order.add(*self.orders)

    def test_list_customer_orders(self):
        response = self.client.get(reverse('orders_api:orders'))
        self.assertEqual(
            response.status_code, 200,
            f'Failed to list customer orders: {response.json()}'
        )

        print(response.json())

    def test_cancel_order(self):
        response = self.client.post(
            reverse('orders_api:cancel_order', args=[self.order.id])
        )
        self.assertEqual(
            response.status_code, 200,
            f'Failed to cancel order: {response.json()}'
        )

        print(response.json())


class TestCreatePaymentIntentApi(AuthenticatedTestCase):
    def setUp(self):
        super().setUp()

        # FIXME: For whatever reasons, pytest does not pick
        # up the DEBUG setting from the .env file, which causes
        # stripe api to fail
        settings.DEBUG = True

        self.order: CustomerOrder = CustomerOrderFaker.create()
        self.order.user = self.user
        self.order.save()

        self.payment_intent = None

        self.path = reverse('orders_api:intent')
        self.cart = create_items(1)[0]

        # Calculate the total of the cart since normally this would be
        # done by a celery task, but since we are not running the worker,
        # we need to do it manually here
        total, total_quantity = calculate_items_total(self.cart.items)
        self.cart.total = total
        self.cart.quantity = total_quantity
        self.cart.save()

    def test_with_valid_existing_cart(self):
        # Create an isolated cart for this test
        # to ensure that we are not affected
        # by other tests
        cart = create_items(1)[0]
        cart.session_id = 'test_session_id'
        total, total_quantity = calculate_items_total(cart.items)
        cart.total = total
        cart.quantity = total_quantity
        cart.save()

        response = self.client.post(
            self.path,
            data={
                'session_id': cart.session_id,
                'total': cart.total
            }
        )

        data = response.json()

        self.assertEqual(
            response.status_code, 201,
            f'Failed to create payment intent: {data}'
        )

        self.assertIn('intent', data)
        self.assertIn('client', data)

        cart.refresh_from_db()
        self.assertIsNotNone(cart.payment_intent)

    def test_with_cart_total_is_zero(self):
        self.cart.total = 0.0
        self.cart.save()

        response = self.client.post(
            self.path,
            data={
                'session_id': self.cart.session_id,
                'total': self.cart.total
            }
        )
        data = response.json()

        self.assertEqual(response.status_code, 402, data)
        self.assertEqual(data['message'], 'Payment failed')

    def test_with_none_existing_cart(self):
        response = self.client.post(
            self.path,
            data={
                'session_id': 'non_existing_session_id',
                'total': self.cart.total
            }
        )
        data = response.json()

        self.assertEqual(response.status_code, 404, data)
        self.assertEqual(data['detail'], 'No Cart matches the given query.')

    def test_with_cart_total_mismatch(self):
        response = self.client.post(
            self.path,
            data={
                'session_id': self.cart.session_id,
                'total': self.cart.total + 1  # Introduce a mismatch
            }
        )
        data = response.json()

        self.assertEqual(response.status_code, 400, data)
        self.assertEqual(data['message'], 'Total amount mismatch')

    def test_with_cart_already_paid_for(self):
        self.cart.is_paid_for = True
        self.cart.save()

        response = self.client.post(
            self.path,
            data={
                'session_id': self.cart.session_id,
                'total': self.cart.total
            }
        )
        data = response.json()

        self.assertEqual(response.status_code, 400, data)
        self.assertEqual(data['message'], 'Invalid operation on paid cart')

    def test_with_stale_cart(self):
        self.cart.is_stale = True
        self.cart.save()

        response = self.client.post(
            self.path,
            data={
                'session_id': self.cart.session_id,
                'total': self.cart.total
            }
        )
        data = response.json()

        self.assertEqual(response.status_code, 400, data)
        self.assertEqual(data['message'], 'Invalid operation on stale cart')

    def test_with_failed_stripe_api_call(self):
        with patch('orders.api.views.PaymentInterface') as minterface:
            minterface.return_value.payment_intent.return_value = False
            minterface.return_value.get_fail_response.return_value = Response({
                'message': 'Payment failed'
            }, status=402)
            response = self.client.post(
                self.path,
                data={
                    'session_id': self.cart.session_id,
                    'total': self.cart.total
                }
            )

            data = response.json()

            self.assertEqual(response.status_code, 402, data)


class TestUpdatePaymentIntentApi(AuthenticatedTestCase):
    def setUp(self):
        super().setUp()
        # FIXME: For whatever reasons, pytest does not pick
        # up the DEBUG setting from the .env file, which causes
        # stripe api to fail
        settings.DEBUG = True
        self.cart = create_items(1)[0]
        total, total_quantity = calculate_items_total(self.cart.items)
        self.cart.total = total
        self.cart.quantity = total_quantity
        self.cart.save()

    def test_update_payment_intent_with_data(self):
        # First, create a payment intent
        create_response = self.client.post(
            reverse('orders_api:intent'),
            data={
                'session_id': self.cart.session_id,
                'total': self.cart.total
            }
        )
        create_response_data = create_response.json()
        self.assertEqual(
            create_response.status_code, 201,
            create_response_data
        )

        # Now update it
        update_response = self.client.post(
            reverse('orders_api:update'),
            data={
                'intent': create_response_data['intent'],
                'session_id': self.cart.session_id,
                'total': self.cart.total,
                'shipment': {
                    'email': 'test@example.com',
                    'firstname': 'John',
                    'lastname': 'Doe',
                    'address_line': '10 Rue Meurein',
                    'zip_code': '59800',
                    'city': 'Lille',
                    'country': 'France',
                    'telephone': '555-1234'
                }
            },
            format='json'
        )

        self.assertEqual(
            update_response.status_code, 201,
            update_response.json()
        )

    def test_update_payment_intent_with_no_data(self):
        pass

    def test_update_no_payment_intent(self):
        pass
