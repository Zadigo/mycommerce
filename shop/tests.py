from django import setup
from django.test import TestCase
from django.test.client import Client, RequestFactory

from shop import views
from django.urls import reverse
from shop.models import Product
from shop.utils import create_slug

from django.contrib.auth import get_user_model
from django.test import Client, RequestFactory, TestCase
from rest_framework.mixins import status
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from shop.api.views import shop as shop_api_views
from cart.models import Cart


def create_user():
    USER_MODEL = get_user_model()
    user = USER_MODEL.objects.create_user(
        email='lucile@gmail.com',
        password='touparette',
        username='lucile'
    )
    return user


class TestShopAPI(APITestCase):
    fixtures = ['products.json']

    def setUp(self):
        self.client = APIClient()

    def test_products_view_structure(self):
        self.factory = APIRequestFactory()
        request = self.factory.get('/api/v1/shop/products')
        view = shop_api_views.ListProducts.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_search_view(self):
        self.factory = APIRequestFactory()
        request = self.factory.get('/api/v1/shop/search', data={'q': 'Tanga'})
        response = views.search_view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_products_view(self):
        client = APIClient()
        response = client.get(reverse('shop_api:api_list_products'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        count = Product.objects.count()
        self.assertEqual(count, 30)

    def test_list_products_view_as_search(self):
        response = self.client.get(
            reverse('shop_api:api_list_products'),
            data={'q': 'Blazer Strapped'}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        count = Product.objects.filter(name='Blazer Strapped').count()
        self.assertEqual(count, 1)


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
