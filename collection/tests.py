from django.test import TestCase
from django.test.client import Client, RequestFactory

from collection import views


class TestCollectionApi(TestCase):
    fixtures = ['products.json', 'collections.json']
    
    def setUp(self):
        self.factory = RequestFactory()
    
    def test_get_all_collection(self):
        request = self.factory.get('/api/v1/collection/all')
        response = views.collecion_view(request, 'all')
        data = response.data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
    
    def test_pants_collection(self):
        request = self.factory.get('/api/v1/collection/shorts')
        response = views.collecion_view(request, 'all')
        data = response.data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        
