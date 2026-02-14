
from unittest import TestCase

from orders.tests.utils import CustomerOrderFaker


class TestOrdersApi(TestCase):
    # fixtures = ['orders']

    # def setUp(self):
    #     self.client = self.client_class()
    #     self.token = self._authenticate()

    # def test_create_shipping(self):
    #     """
    #     See: https://docs.stripe.com/testing?testing-method=tokens
    #     """
    #     shipping = json.dumps({
    #         'session_id': 'some_session',
    #         'email': 'juliette@test-mail.com',
    #         'firstname': 'Juliette',
    #         'lastname': 'Lopez',
    #         'address_line': '1 rue de Paris',
    #         'zip_code': 59000,
    #         'city': 'Lille',
    #         'country': 'France',
    #         'telephone': '0601010101',
    #         'delivery_option': 'Chronopost',
    #         'card': os.getenv('STRIPE_TEST_CARD'),
    #         'token': 'tok_visa',
    #         'intent': '',
    #         'client_ip': '1.1.1.1'
    #         # 'source': os.getenv('STRIPE_TEST_CARD'),
    #         # 'card_token': 'ca_token'
    #     })

    #     response = self.client.post(
    #         reverse('orders_api:create'),
    #         content_type='application/json',
    #         data=shipping
    #     )
    #     self.assertEqual(response.status_code, 200,
    #                      f'Failed to create shipping: {response.json()}')

    def setUp(self):
        self.orders = CustomerOrderFaker.create_batch(2)

    def test_orders_list(self):
        print(self.orders)
