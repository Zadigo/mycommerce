from django.test import TestCase, override_settings
from django.urls import reverse

from accounts.tests.mixins import AuthenticatedTestCase
from cart.tests.utils import create_items


@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestListCartView(AuthenticatedTestCase):
    def setUp(self):
        super().setUp()
        self.items = create_items(2)

    def test_should_list_cart_items(self):
        path = reverse('cart_api:list')
        response = self.client.get(path)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json()), 1)



@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestListCartItemsView(TestCase):
    def setUp(self):
        super().setUp()
        self.items = create_items(2)

    def test_should_list_cart_items(self):
        path = reverse('cart_api:cart_items', kwargs={'unique_id': self.items[0].session_id})
        response = self.client.get(path)
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(len(response.json()['items']), 1)



@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestCreateCartView(AuthenticatedTestCase):
    def setUp(self):
        super().setUp()
        self.items = create_items(2)

    def test_should_create_cart(self):
        path = reverse('cart_api:create_update')
        data = {
            'session_id': self.items[0].session_id,
            'items': self.items[0].items
        }
        response = self.client.post(path, data, content_type='application/json')
        self.assertEqual(response.status_code, 201, response.content)
