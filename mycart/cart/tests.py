import json
import random
import time
import unittest

from cart.api.serializers import cart_statistics
from cart.models import Cart
from cart.sessions import CartJWTGenerator
from django.contrib.auth import get_user_model
from django.test import (LiveServerTestCase, RequestFactory, TestCase,
                         TransactionTestCase, override_settings)
from django.urls import reverse
from rest_framework.mixins import status
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait

from mycart.custom_utilities.tokens import decode_jwt_token, is_token_expired
from mycart.mixins import AuthenticatedTestCase

SERIALIZED_PRODUCT = {
    'id': 1,
    'name': 'Product Fixture',
    'active': True,
    'category': 'Skirts',
    'color': 'Pink',
    'color_variant_name': 'pink-something',
    'created_on': '2025-1-1',
    'display_new': True,
    'get_main_image': None,
    'get_price': '1',
    'has_sizes': True,
    'images': [],
    'is_new': True,
    'model_height': '165',
    'model_size': '45',
    'modified_on': '2025-1-1',
    'on_sale': True,
    'sale_price': '45',
    'active': True,
    'sale_value': 4,
    'sizes': [
        {
            'id': 1,
            'name': 'XS',
            'metric': 'Clothe',
            'availability': True,
            'active': True
        },
        {
            'id': 2,
            'name': 'S',
            'metric': 'Clothe',
            'availability': True,
            'active': True
        },
        {
            'id': 3,
            'name': 'M',
            'metric': 'Clothe',
            'availability': False,
            'active': False
        }
    ],
    'sku': '345',
    'slug': 'slug',
    'sub_category': 'some',
    'unit_price': '34',
    'variants': [],
    'collection_set': [
        {
            'id': 1,
            'name': 'Some Name',
            'category': 'Dress',
            'get_view_name': 'dress',
            'illustration': 'Some',
            'number_of_items': 1,
            'sub_category': 'some-sub-category',
            'tags': ['Skirt']
        }
    ]
}


class TestCartManager(TransactionTestCase):
    fixtures = ['fixtures/user', 'carts']

    @classmethod
    def setUpClass(cls):
        instance = CartJWTGenerator()

        factory = RequestFactory()
        request = factory.get(reverse('cart_api:list'))

        user_model = get_user_model()
        cls.user = user_model.objects.create_user(
            username='test_user',
            email='test@gmail.com',
            password='touparet'
        )
        request.user = cls.user
        request.session = {}

        cls.params = {
            'request': request,
            'token': instance.create(),
            'product': None,
            'size':  'Unique'
        }

    # @classmethod
    # def tearDownClass(cls):
    #     cls.user.delete()

    def test_with_correct_size(self):
        self.params['product'] = SERIALIZED_PRODUCT
        result = Cart.objects.rest_api_add_to_cart(**self.params)
        self.assertIsInstance(result, tuple)

        token, items = result
        self.assertIsInstance(token, str)
        self.assertTrue(items.count() == 1)

    @unittest.expectedFailure
    def test_with_incorrect_size(self):
        self.params['product'] = SERIALIZED_PRODUCT
        self.params['size'] = 'Unique'
        Cart.objects.rest_api_add_to_cart(**self.params)

        # with self.assertRaises(ValidationError):


@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestCartApi(AuthenticatedTestCase):
    fixtures = ['fixtures/user', 'carts']

    def _create_session_id(self):
        path = reverse('cart_api:session_id')
        response = self.client.post(path)

        token = response.json().get('token')
        self.assertIsNotNone(token)

        payload = decode_jwt_token(token, audience='cart')
        return token, payload['cart_id']

    def test_list_all_carts_view_not_authenticated(self):
        response = self.client.get(reverse('cart_api:list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for item in response.json():
            with self.subTest(item=item):
                self.assertIn('product', item)

    def test_create_session_id(self):
        response = self.client.post(reverse('cart_api:session_id'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = response.json()
        self.assertIn('token', payload)

        # Test that we can decode the token efficiently and
        # test it's expiration date
        payload = decode_jwt_token(
            payload['token'], raise_exception=True, audience='cart')
        result = is_token_expired(payload)
        self.assertFalse(result)

    def test_add_to_cart(self):
        path = reverse('cart_api:session_id')
        response = self.client.post(path)

        token = response.json().get('token')
        self.assertIsNotNone(token)

        size = SERIALIZED_PRODUCT['sizes'][0]
        data = json.dumps({
            'product': SERIALIZED_PRODUCT,
            'size': size['name'],
            'session_id': token
        })
        response = self.client.post(
            reverse('cart_api:add'),
            content_type='application/json',
            data=data
        )

        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED,
                         f'Failed to created item: {data}')
        self.assertIsNotNone(data['session_id'])

        results = data['results']
        self.assertIsInstance(results, list)

        for item in results:
            with self.subTest(item=item):
                self.assertIn('id', item)
                self.assertIn('product', item)
                self.assertIn('size', item)
                self.assertIn('price', item)

        statistics = data['statistics']
        self.assertIsInstance(statistics, list)
        self.assertGreater(len(statistics), 0)

        for item in statistics:
            with self.subTest(item=item):
                self.assertIn('product__id', item)

        self.assertGreater(data['total'], 0)

    def test_add_multiple(self):
        """This function is to test the result that
        we get when we add multiple items in a cart
        with the same session ID"""
        path = reverse('cart_api:session_id')
        response = self.client.post(path)

        token = response.json().get('token')
        self.assertIsNotNone(token)

        final_data = None

        items_to_add = []
        for i, product in enumerate([SERIALIZED_PRODUCT, SERIALIZED_PRODUCT]):
            if i > 2:
                break

            with self.subTest(product=product):
                data = json.dumps({
                    'product': product,
                    'size': random.choice(product['sizes'])['name'],
                    'session_id': token
                })
                items_to_add.append(data)

                response = self.client.post(
                    reverse('cart_api:add'),
                    content_type='application/json',
                    data=data
                )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                final_data = response.json()

                time.sleep(2)

        self.assertIsNotNone(final_data)
        self.assertEqual(len(final_data['results']), len(items_to_add))

    def test_add_two_same_products(self):
        """Tests the result of the cart when two same
        products are added"""
        token, _ = self._create_session_id()

        data = json.dumps({
            'product': SERIALIZED_PRODUCT,
            'size': SERIALIZED_PRODUCT['sizes'][0]['name'],
            'session_id': token
        })

        returned_data = []

        for _ in range(2):
            response = self.client.post(
                reverse('cart_api:add'),
                content_type='application/json',
                data=data
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            returned_data.append(response.json())

        last_response_data = returned_data[-1]

        # Statistics should be one and the unique
        # element should have a quantity of 2
        self.assertTrue(len(last_response_data['statistics']), 2)
        self.assertTrue(last_response_data['statistics'][0]['quantity'], 2)

        self.assertTrue(
            last_response_data['statistics'][0]['total'],
            int(SERIALIZED_PRODUCT['get_price']) * 2
        )

    def test_delete_item_in_cart_authenticated(self):
        token, cart_id = self._create_session_id()

        instance = Cart.objects.create(**{
            'session_id': token,
            'product': SERIALIZED_PRODUCT,
            'user': self.user,
            'size': SERIALIZED_PRODUCT['sizes'][0]['name'],
            'price': SERIALIZED_PRODUCT['get_price']
        })

        self.assertIsNotNone(instance, 'Product was not created')

        path = reverse('cart_api:delete', args=[cart_id])
        response = self.client.post(path, data={
            'session_id': token,
            'product_id': SERIALIZED_PRODUCT['id'],
            'size': SERIALIZED_PRODUCT['sizes'][0]['name']
        })
        self.assertIsNone(response.json()['total'])


@unittest.skip('Live test skipped')
class TestLiveCart(LiveServerTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.browser = webdriver.Edge()

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()
        super().tearDownClass()

    def test_cart(self):
        self.browser.get('http://localhost:5173/')

        WebDriverWait(self.browser, 10).until(
            ec.element_to_be_clickable(
                (
                    By.ID,
                    'btn-select-language'
                )
            )
        )

        language_button = self.browser.find_element(
            By.ID,
            'btn-select-language'
        )
        language_button.click()

        time.sleep(2)

        section = self.browser.find_element(
            By.CSS_SELECTOR,
            'section#collections'
        )
        collections = section.find_elements(
            By.TAG_NAME,
            'article'
        )
        first_collection = collections[0]
        first_collection.click()

        time.sleep(10)


class TestCartStatistics(TestCase):
    fixtures = ['fixtures/user', 'carts']

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

    def setUp(self):
        self.queryset = Cart.objects.all()

    def test_structure(self):
        result = cart_statistics(self.queryset)
        print(result)

        data = list(result)
        self.assertIsInstance(data, list)

        item = data[0]
        self.assertIn('product__id', item)
        self.assertEqual(data[0]['quantity'], 2)
        # The first item should have quantity 2
        # since we have two products of size "S"
        self.assertEqual(data[1]['quantity'], 1)
