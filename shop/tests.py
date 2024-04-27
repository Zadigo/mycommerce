from django.test import TestCase
from django.test.client import Client, RequestFactory

from shop import views


class TestShopApi(TestCase):
    fixtures = ['products.json']
    
    def setUp(self):
        self.factory = RequestFactory()
    
    def test_products_view_structure(self):
        request = self.factory.get('/api/v1/shop/products')
        response = views.products_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_search_view(self):
        request = self.factory.get('/api/v1/shop/search', data={'q': 'Tanga'})
        response = views.search_view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
