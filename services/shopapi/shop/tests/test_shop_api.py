from urllib.parse import urlencode

from django.urls import reverse
from rest_framework.mixins import status
from shop.models import Product
from shop.tests.utils import ProductFactory

from shopapi.tests.utils import AuthenticatedTestCase


class TestShopApi(AuthenticatedTestCase):
    # fixtures = ['fixtures/users', 'fixtures/products']

    def test_list_products(self):
        products = ProductFactory.create_batch(size=10)

        path = reverse('shop_api:products')
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIn('count', data)
        self.assertIn('results', data)

        for item in data['results']:
            with self.subTest(item=item):
                self.assertIn('id', item)

                if item['on_sale']:
                    try:
                        self.assertEqual(
                            item['get_price'],
                            item['sale_price'],
                            'Prices do not match'
                        )
                    except AssertionError as e:
                        print(
                            f'{item["id"]}: clean not called '
                            f'on fixtures? {e}'
                        )

    def test_lists_products_as_search(self):
        path = reverse('shop_api:products')
        data = {'q': 'Blazer Strapped'}
        response = self.client.get(path, data=data)

        response_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data.get('count'), 1)

    def test_get_product(self):
        products = ProductFactory.create_batch(size=10)

        product = Product.objects.first()
        path = reverse('shop_api:product', args=[product.id])
        response = self.client.get(path)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('id', response.json())

    def test_recommendations(self):
        products = ProductFactory.create_batch(size=50)

        path = reverse('shop_api:recommendations')
        query = urlencode({
            'quantity': 1,
            'for_mobile': 0,
            'with_images': 0
        })
        response = self.client.get(path + f'?{query}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should return products even though the url
        # query does not specify a product
        data = response.json()
        self.assertTrue(len(data) > 0)

    def test_recommendations_with_product_id(self):
        path = reverse('shop_api:recommendations')
        query = urlencode({
            'p': 4,
            'quantity': 30,
            'for_mobile': 0,
            'with_images': 0
        })
        response = self.client.get(path + f'?{query}')
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK, response.content)

        data = response.json()
        self.assertTrue(len(data) > 0)
        # The closest result to "Short "Short En Jean"
        self.assertEqual(data[0]['name'], 'Shorty En Dentelle')

    def test_products_new(self):
        path = reverse('shop_api:new')
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_products_on_sale(self):
        path = reverse('shop_api:sales')
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIn('results', data)

        for item in data['results']:
            with self.subTest(product=item):
                self.assertTrue(item['on_sale'])
