from django.test import TestCase
from django.urls import reverse
from rest_framework import status


class TestCollectionApi(TestCase):
    fixtures = ['products.json', 'collections.json']

    def test_get_all_collection(self):
        path = reverse('collection_api:collections')
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        for item in data:
            with self.subTest(item=item):
                self.assertIn('id', item)
                self.assertIn('category', item)

    def test_list_collection_products(self):
        path = reverse('collection_api:collection_products', args=['shorts'])
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        print(data)
        self.assertIn('count', data)
        self.assertIn('results', data)
        self.assertTrue(data['results'] >= 1)

        for item in data['results']:
            with self.subTest(item=item):
                self.assertIn('id', item)
                self.assertIn('category', item)
