from decimal import Decimal
from urllib.parse import urlencode

from django.test import TestCase, TransactionTestCase
from django.urls import reverse
from rest_framework.mixins import status
from shop.models import Product
from shop.processors import FuzzyMatcherMixin
from shop.utils import (calculate_sale, create_slug, process_file_name,
                        product_media_path, remove_special_characters,
                        transform_to_snake_case)

from mystore.mixins import AuthenticatedTestCase


class TestProductModel(TransactionTestCase):
    """Tests for specific model logic on prices etc"""

    fixtures = ['fixtures/products']

    @classmethod
    def setUpClass(cls):
        cls.on_sale = Product.objects.filter(on_sale=True)
        cls.not_on_sale = Product.objects.filter(on_sale=True)

    def test_price_product_not_on_sale(self):
        product = self.on_sale.first()

        unit_price = product.unit_price
        sale_value = product.sale_value
        result = unit_price - sale_value
        
        # get_price should return the sale_price
        self.assertEqual(result, product.get_price)


class TestShopApi(AuthenticatedTestCase):
    fixtures = ['fixtures/users', 'fixtures/products']

    def test_list_products(self):
        path = reverse('shop_api:products')
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIn('count', data)
        self.assertEqual(data['count'], 7)
        self.assertIn('results', data)

        for item in data['results']:
            with self.subTest(item=item):
                self.assertIn('id', item)

    def test_lists_products_as_search(self):
        path = reverse('shop_api:products')
        data = {'q': 'Blazer Strapped'}
        response = self.client.get(path, data=data)

        response_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data.get('count'), 1)

    def test_get_product(self):
        product = Product.objects.first()
        path = reverse('shop_api:product', args=[product.id])
        response = self.client.get(path)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('id', response.json())

    def test_recommendations(self):
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
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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


class TestFuzzyMatcher(TransactionTestCase):
    fixtures = ['fixtures/products']

    def setUp(self):
        self.instance = FuzzyMatcherMixin()

    def test_simple_ratio_match(self):
        items = [
            # (Product, Test)
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.simple_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_partial_ratio_match(self):
        items = [
            # (Product, Test)
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.partial_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_token_sort_ratio_match(self):
        items = [
            # (Product, Test)
            ('Ribbed Taille Haute Shorts', 'Haute Taille'),
            ('Ribbed Taille Haute Shorts', 'Shorts Hautes Taille')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.token_sort_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_token_set_ratio_match(self):
        items = [
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.token_set_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_weighted_ratio_match(self):
        items = [
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.weighted_ratio_match(a, b)
                self.assertIsInstance(result, float)


class TestUtilities(TestCase):
    fixtures = ['fixtures/products']

    def test_calculate_sale(self):
        product = Product.objects.first()
        result = calculate_sale(product.unit_price, 20)

        self.assertIsInstance(result, Decimal)
        self.assertEqual(result, Decimal('241.60'))

        # Test that we can save the ouput result
        # directly on the object
        product.sale_price = result
        product.save()

    def test_transform_to_snake_case(self):
        text = [
            ('Blazzer Strapped', 'blazzer_strapped')
        ]

        for text, expected in text:
            with self.subTest(text=text):
                result = transform_to_snake_case(text)
                self.assertIn('_', result)

    def test_remove_special_characters(self):
        text = [
            ('jupé de paris ça de coûpe', 'jupe de paris ca de coupe')
        ]

        for text, expected in text:
            with self.subTest(text=text):
                result = remove_special_characters(text)
                print(result)
                # self.assertIn('_', expected)

    def test_process_file_name(self):
        text = [
            ('jupé coûpe.jpg', 'jupé_coûpe.jpg')
        ]

        for text, expected in text:
            with self.subTest(text=text):
                result = process_file_name(text)
                self.assertIsInstance(result, tuple)

                name, extension = result
                self.assertEqual(name, 'jupé_coûpe')
                self.assertEqual(extension, 'jpg')

    def test_product_media_path(self):
        filenames = [
            (
                'Blazer Strapped.jpg',
                r'blazer\_strapped\_'
            ),
            (
                'Floral Mesh Balcony Soutien Gorge Et String Ensemble.jpg',
                r'floral_mesh_balcony_soutien_gorge_et_string_ensemble_'
            ),
            (
                'Blazer Jupe Boutons Dorées.jpg',
                r'blazer_jupe_boutons_dorées_'
            ),
            (
                'Blazer, plissée de Japon.jpg',
                r'blazer_plissée_de_japon_'
            ),
            (
                'Blazer - Facile.jpg',
                r'blazer\_\-\_facile\_'
            ),
            (
                'some_simple_file.jpg',
                r'some_simple_file_'
            ),
            (
                'some#invalid**filename.jpg',
                r'someinvalidfilename_'
            ),
            (
                'jupe-cargo-lani%C3%A8res.jpg',
                r'jupe_cargo_lanières_'
            )
        ]
        for name, expected in filenames:
            with self.subTest(filename=name):
                result = product_media_path(name)
                self.assertRegex(result, expected)

    def test_video_path(self):
        pass

    def test_image_path(self):
        pass

    def test_create_slug(self):
        products = [
            "Jupe Midi Popeline Taille Élastique",
            "Jupe d'appoint",
            "éladine de marseille - d'argan"
        ]
        for product in products:
            slug = create_slug(product)
            with self.subTest(product=product):
                self.assertIsInstance(slug, str)

        slug = create_slug(products[0], 1, 'blue')
        print(slug)
