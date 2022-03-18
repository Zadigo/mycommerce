from django.test import TestCase
from django.test.client import Client, RequestFactory

from shop import views

class TestShopApi(TestCase):
    fixtures = ['products.json']
    
    def test_products_view_structure(self):
        factory = RequestFactory()
        request = factory.get('/api/v1/shop/products')
        response = views.products_view(request)
        self.assertEqual(response.status_code, 200)
        expected_data = {
            'count': 0,
            'infos': {
                'total_count': 0,
                'filters': {
                    'colors': []
                }
            },
            'next': None,
            'previous': None,
            'results': []
        }
        self.assertDictEqual(response.data, expected_data)
