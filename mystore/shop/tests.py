from decimal import Decimal

from cart.models import Cart
from django import setup
from django.contrib.auth import get_user_model
from django.db.models import Value
from django.test import Client, RequestFactory, TestCase
from django.test.client import Client, RequestFactory
from django.urls import reverse
from rest_framework.mixins import status
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from shop import views
from mystore.shop.api import views as shop_api_views
from shop.models import Product
from shop.utils import calculate_sale, create_slug, product_media_path

#     def test_products_view_structure(self):
#         self.factory = APIRequestFactory()
#         request = self.factory.get('/api/v1/shop/products')
#         view = shop_api_views.ListProducts.as_view()
#         response = view(request)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['count'], 1)

#     def test_search_view(self):
#         self.factory = APIRequestFactory()
#         request = self.factory.get('/api/v1/shop/search', data={'q': 'Tanga'})
#         response = views.search_view(request)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 2)


class TestShop(APITestCase):
    fixtures = ['products']

    @classmethod
    def setUpTestData(cls):
        user = get_user_model().objects.first()
        cls.user = user
        cls.user.set_password('touparet')
        cls.user.save()

    def test_products_view(self):
        response = self.client.get(reverse('shop_api:list_products'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_products_view_as_search(self):
        response = self.client.get(
            reverse('shop_api:list_products'),
            data={
                'q': 'Blazer Strapped'
            }
        )
        self.assertEqual(response.json().get('count'), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product_view(self):
        response = self.client.get(reverse('shop_api:product', args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestUtilities(TestCase):
    fixtures = ['products']

    def test_calculate_sale(self):
        product = Product.objects.first()
        result = calculate_sale(product.unit_price, 20)

        self.assertIsInstance(result, Decimal)
        self.assertEqual(result, Decimal('184.80'))

        # Test that we can save the ouput result
        # directly on the object
        product.sale_price = result
        product.save()

    def test_transform_to_snake_case(self):
        pass

    def test_remove_special_characters(self):
        pass

    def test_process_file_name(self):
        pass

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
