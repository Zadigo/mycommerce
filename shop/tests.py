from django.test import TestCase
from django.test.client import Client, RequestFactory

from shop import views
from shop.utils import create_slug


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


class TestUtilities(TestCase):
    def test_calculate_sale(self):
        pass

    def test_transform_to_snake_case(self):
        pass

    def test_remove_special_characters(self):
        pass

    def test_process_file_name(self):
        pass

    def test_product_media_path(self):
        pass

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
