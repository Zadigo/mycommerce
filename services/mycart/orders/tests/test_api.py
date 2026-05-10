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
