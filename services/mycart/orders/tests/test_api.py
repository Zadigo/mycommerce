from accounts.tests.mixins import AuthenticatedTestCase
from django.urls import reverse
from orders.models import CustomerOrder, Product
from orders.tests.utils import CustomerOrderFaker, ProductFaker


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


class TestPaymentIntentApi(AuthenticatedTestCase):
    def setUp(self):
        super().setUp()
        self.order: CustomerOrder = CustomerOrderFaker.create()
        self.order.user = self.user
        self.order.save()
        self.payment_intent = None

    def test_create_payment_intent(self):
        response = self.client.post(
            reverse(
                'orders_api:create', 
                args=[self.order.id]
            )
        )
        self.assertEqual(
            response.status_code, 200,
            f'Failed to create payment intent: {response.json()}'
        )

        data = response.json()

    def test_update_payment_intent(self):
        # First, create a payment intent
        create_response = self.client.post(
            reverse('orders_api:create_payment_intent', args=[self.order.id])
        )
        self.assertEqual(create_response.status_code, 200)

        # Now, update the payment intent
        update_response = self.client.post(
            reverse('orders_api:update_payment_intent', args=[self.order.id])
        )
        self.assertEqual(
            update_response.status_code, 200,
            f'Failed to update payment intent: {update_response.json()}'
        )

        print(update_response.json())

    def test_cancel_order(self):
        response = self.client.post(
            reverse('orders_api:cancel_order', args=[self.order.id])
        )
        self.assertEqual(
            response.status_code, 200,
            f'Failed to cancel order: {response.json()}'
        )

        print(response.json())
