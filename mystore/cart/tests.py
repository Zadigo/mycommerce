import time

from cart.api.serializers import cart_statistics
from cart.models import Cart
from cart.sessions import RestSessionManager
from django.contrib.auth import get_user_model
from django.test import (LiveServerTestCase, RequestFactory, TestCase,
                         TransactionTestCase)
from django.urls import reverse
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import status
from rest_framework.test import APITestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait
from shop.models import Product

DEFAULT_SESSION_ID = 'other-session-value'


class TestCartManager(TransactionTestCase):
    fixtures = ['carts']

    @classmethod
    def setUpClass(cls):
        token = RestSessionManager.create_session_key()

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
            'token': token,
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


class TestCart(APITestCase):
    fixtures = ['carts']

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

    def setUp(self):
        self.client = self.client_class()
        self.token = self._authenticate()

    def _authenticate(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': self.user.username,
                'password': 'touparet'
            }
        )

        self.assertEqual(response.status_code, 200, 'Authentication failed')

        token = response.json().get('access')
        self.assertIsNotNone(token, 'Token retrieval failed')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        return token

    def test_list_all_carts_view_not_authenticated(self):
        response = self.client.get(reverse('cart_api:list_carts'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_session_id(self):
        response = self.client.post(reverse('cart_api:create_session_id'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_to_cart(self):
        product = Product.objects.first()
        response = self.client.post(
            reverse('cart_api:create_session_id')
        )
        token = response.json().get('token')
        self.assertIsNotNone(token)

        data = {
            "product": {
                "id": product.id,
                "size": "Unique",
                "color": "Blue"
            },
            "size": "Unique",
            "session_id": token
        }
        response = self.client.post(
            reverse('cart_api:add_to_cart'),
            # content_type='application/json',
            format='json',
            data=data
        )

        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(data['session_id'])
        self.assertEqual(data['statistics']['total'], 15.2)


class TestSessionManager(TestCase):
    def setUp(self):
        # Create a mockup request so that the
        # class can actually be used
        factory = RequestFactory()
        request = factory.get(reverse('cart_api:carts'))

        self.instance = RestSessionManager(request)

    def test_gloal_structure(self):
        result = self.instance.create_session_key()
        self.assertIsNotNone(result)
        self.assertRegex(result, r'^ca_')

    def test_key_scructure(self):
        result = self.instance.create_session_key()
        state = self.instance.test_key(result)
        self.assertTrue(state)

    # def setUp(self):
    #     factory = RequestFactory()
    #     request = factory.get(reverse('cart_api:api_list_carts'))
    #     self.session = SessionManager(request)

    # def test_session_structure(self):
    #     key = self.session.create_session_key()
    #     self.assertIsInstance(key, str)
    #     parts = key.split('-')
    #     self.assertEqual(len(parts), 3)

    # def test_result(self):
    #     key = self.session.create_session_key()
    #     self.assertTrue(self.session.test_key(key))


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
