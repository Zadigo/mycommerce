from django.contrib.auth import get_user_model
from django.test import Client, RequestFactory, TestCase
from rest_framework.mixins import status
from rest_framework.test import APIClient, APIRequestFactory, APITestCase

from cart.api import views
from cart.models import Cart


def create_user():
    USER_MODEL = get_user_model()
    user = USER_MODEL.objects.create_user(
        email='lucile@gmail.com',
        password='touparette',
        username='lucile'
    )
    return user


class TestCartViews(APITestCase):
    fixtures = ['carts.json']

    def test_list_all_carts_view_not_autheticated(self):
        factory = APIRequestFactory()
        request = factory.get('api/v1/cart/')
        view = views.ListAllCarts.as_view()
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_all_carts_view_authenticated(self):
        client = APIClient()

        user = create_user()
        client.login(username=user.username, password='touparette')

        response = client.get('api/v1/cart/')

        count = Cart.objects.count()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(count, len(response.data))

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
