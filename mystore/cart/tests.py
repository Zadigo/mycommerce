import time

from cart.api import views
from cart.managers import SessionManager
from cart.models import Cart
from django.contrib.auth import get_user_model
from django.test import Client, LiveServerTestCase, RequestFactory, TestCase
from django.urls import reverse
from rest_framework.mixins import status
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait
from shop.models import Product


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

    # def test_list_all_carts_view_not_authenticated(self):
    #     factory = APIRequestFactory()
    #     request = factory.get(reverse('carts_api:list_carts'))
    #     view = views.ListAllCarts.as_view()
    #     response = view(request)

    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # def test_list_all_carts_view_authenticated(self):
    #     client = APIClient()

    #     user = create_user()
    #     client.login(username=user.username, password='touparette')

    #     response = client.get('api/v1/cart/')

    #     count = Cart.objects.count()
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(count, len(response.data))

    # def test_cart_view(self):
    #     user = create_user()
    #     factory = RequestFactory()
    #     request = factory.post('api/v1/cart', data={'session_id': 'test_session'})
    #     response = views.cart_view(request)
    #     self.assertEqual(response.data['session_id'], 'test_session')
    #     self.assertEqual(len(response.data['results']), 1)

    # def test_add_to_cart_view(self):
    #     factory = RequestFactory()
    #     request = factory.post('api/v1/cart/add', data={'product': 1, 'default_size': 'Unique', 'session_id': 'test_session'})
    #     response = views.cart_view(request)

    # def test_add_to_cart(self):
    #     client = Client()
    #     response = client.post('api/v1/cart/add', data={'product': 2, 'default_size': 'Unique', 'session_id': 'test_session'})
    #     self.assertEqual(response.status_code, 200)


class TestSessionManager(TestCase):
    def setUp(self):
        factory = RequestFactory()
        request = factory.get(reverse('cart_api:api_list_carts'))
        self.session = SessionManager(request)

    def test_session_structure(self):
        key = self.session.create_session_key()
        self.assertIsInstance(key, str)
        parts = key.split('-')
        self.assertEqual(len(parts), 3)

    def test_result(self):
        key = self.session.create_session_key()
        self.assertTrue(self.session.test_key(key))


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