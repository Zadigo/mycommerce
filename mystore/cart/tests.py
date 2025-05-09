import json
import time

from cart.api.serializers import cart_statistics
from cart.models import Cart
from cart.sessions import CartJWTGenerator
from django.contrib.auth import get_user_model
from django.test import (LiveServerTestCase, RequestFactory, TestCase,
                         TransactionTestCase, override_settings)
from django.urls import reverse
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import status
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait
from shop.models import Product

from mystore.custom_utilities.tokens import (JWTGenerator, decode_jwt_token,
                                             is_token_expired)
from mystore.mixins import AuthenticatedTestCase


class TestCartManager(TransactionTestCase):
    fixtures = ['carts']

    @classmethod
    def setUpClass(cls):
        instance = CartJWTGenerator()

        factory = RequestFactory()
        request = factory.get(reverse('cart_api:carts'))

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

    @classmethod
    def tearDownClass(cls):
        cls.user.delete()

    def test_with_correct_size(self):
        self.params['product'] = Product.objects.first()
        result = Cart.objects.rest_api_add_to_cart(**self.params)
        self.assertIsInstance(result, tuple)

        token, items = result
        self.assertIsInstance(token, str)
        self.assertTrue(items.count() == 1)

    def test_with_incorrect_size(self):
        # If a product has sizes, we should not be able to
        # add a product in the cart with 'unique'
        self.params['product'] = Product.objects.get(id=2)

        with self.assertRaises(ValidationError):
            Cart.objects.rest_api_add_to_cart(**self.params)


@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestCartApi(AuthenticatedTestCase):
    fixtures = [
        'fixtures/users', 'fixtures/products',
        'fixtures/variants', 'carts'
    ]

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
        product = Product.objects.first()

        path = reverse('cart_api:session_id')
        response = self.client.post(path)

        token = response.json().get('token')
        self.assertIsNotNone(token)

        size = product.size_set.first()
        data = json.dumps({
            # Basic product item
            # for the serializer
            'product': {
                'id': product.id,
                'size': size.name,
                'color': product.color
            },
            'size': size.name,
            'session_id': token
        })
        response = self.client.post(
            reverse('cart_api:add'),
            content_type='application/json',
            data=data
        )

        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
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
        qs = Product.objects.all()

        path = reverse('cart_api:session_id')
        response = self.client.post(path)

        token = response.json().get('token')
        self.assertIsNotNone(token)

        final_data = None

        items_to_add = []
        for i, product in enumerate(qs):
            if i > 2:
                break

            with self.subTest(product=product):
                size = 'Unique'
                sizes = product.size_set.all()
                if sizes.exists():
                    size = sizes.first().name

                data = json.dumps({
                    'product': {
                        'id': product.id,
                        'size': size,
                        'color': product.color
                    },
                    'size': size,
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

    def test_two_same_products(self):
        """Tests the result of the cart when two same
        products are added"""
        token, _ = self._create_session_id()

        qs = Product.objects.filter(size__isnull=False)
        product = qs.first()

        sizes = product.size_set.all()
        size = sizes.first().name

        data = json.dumps({
            'product': {
                'id': product.id,
                'size': size,
                'color': product.color
            },
            'size': size,
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
        self.assertTrue(last_response_data['statistics'][0]['total'], int(
            product.get_price) * 2)

    def test_delete_item_in_cart_authenticated(self):
        token, cart_id = self._create_session_id()

        product = Product.objects.filter(size__isnull=False).first()
        instance = Cart.objects.create(**{
            'session_id': token,
            'product': product,
            'user': self.user,
            'size': product.size_set.first().name,
            'price': product.get_price
        })

        self.assertIsNotNone(instance, 'Product was not created')

        path = reverse('cart_api:delete', args=[cart_id])
        response = self.client.post(path, data={
            'session_id': token,
            'product_id': product.id,
            'size': product.size_set.first().name
        })
        self.assertIsNone(response.json()['total'])


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
    fixtures = ['carts']

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

    def setUp(self):
        self.queryset = Cart.objects.all()

    def test_structure(self):
        result = cart_statistics(self.queryset)

        data = list(result)
        self.assertIsInstance(data, list)

        item = data[0]
        self.assertIn('product__id', item)
        # The first item should have quantity 1
        self.assertEqual(data[0]['quantity'], 2)
        # The first item should have quantity 2
        # since we have two products of size "S"
        self.assertEqual(data[1]['quantity'], 1)


@override_settings(PY_UTILITIES_JWT_SECRET='some_secret')
class TestJWTGenerator(TestCase):
    def test_create_token(self):
        instance = JWTGenerator(
            'ecommerce',
            'users',
            'some subject'
        )
        value = instance.create()

        self.assertIsNotNone(value)
        self.assertIsInstance(value, str)

        decoded = decode_jwt_token(
            value,
            raise_exception=True,
            audience='users'
        )
        self.assertIsInstance(decoded, dict)
        self.assertIn('aud', decoded)

    def test_same_tokens(self):
        """Ensure that we pass a unique token and that
        both JWT would therefore not be the same"""
        t1 = JWTGenerator(
            'ecommerce',
            'users',
            'some subject',
            cart_id='1234'
        ).create()

        t2 = JWTGenerator(
            'ecommerce',
            'users',
            'some subject',
            cart_id='2345'
        ).create()

        self.assertNotEqual(t1, t2)
