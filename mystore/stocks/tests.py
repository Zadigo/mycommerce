from django.conf import settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from shop.models import Product


class TestStockApi(APITestCase):
    fixtures = ['stocks']

    @classmethod
    def setUpTestData(cls):
        settings.DEBUG = True

        model = get_user_model()

        cls.user = model.objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

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

    def test_get_product_stock_status(self):
        product = Product.objects.first()

        path = reverse('stock_api:product', args=[product.id])
        response = self.client.get(path)

        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('variant', data)

    def test_update_stock_status(self):
        path = reverse('stock_api:update')
        data = {'customer_order': 'some_reference'}
        response = self.client.post(path, data=data)

        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(data, [{'id': 1, 'quantity': 19}])
