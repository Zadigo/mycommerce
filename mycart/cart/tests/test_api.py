from django.test import override_settings
from cart.tests.utils import create_items
from accounts.tests.mixins import AuthenticatedTestCase
from django.urls import reverse
from rest_framework import status

@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestCartApi(AuthenticatedTestCase):
    # fixtures = ['fixtures/user', 'carts']

    def setUp(self):
        super().setUp()
        items = create_items(2)
        print(items)

    def test_list_all_carts(self):
        response = self.client.get(reverse('cart_api:list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for item in response.json():
            with self.subTest(item=item):
                self.assertIn('items', item)
                self.assertIn('total', item)
                self.assertIn('quantity', item)

    # def test_list_cart_items_not_authenticated(self):
    #     self.client.credentials(HTTP_AUTHORIZATION='')
    #     response = self.client.get(
    #         reverse(
    #             'cart_api:cart_items',
    #             kwargs={'unique_id': 'postmanTest1234'}
    #         )
    #     )

    #     self.assertEqual(
    #         response.status_code,
    #         status.HTTP_200_OK,
    #         response.json()
    #     )

    #     data = response.json()
    #     self.assertIn('items', data)
    #     self.assertIsInstance(data['items'], list)
    #     self.assertEqual(len(data['items']), 1)
    #     self.assertIn('total', data)
    #     self.assertIn('quantity', data)

    # def test_create_cart_authenticated(self):
    #     data = list(create_items(quantity=2))
    #     response = self.client.post(
    #         reverse('cart_api:create'),
    #         data={
    #             'session_id': 'postmanTest1234',
    #             'items': data
    #         },
    #         content_type='application/json'
    #     )
    #     self.assertEqual(
    #         response.status_code,
    #         status.HTTP_201_CREATED,
    #         response.json()
    #     )

    #     data = response.json()

    #     self.assertIn('session_id', data)
    #     self.assertIsInstance(data['session_id'], str)

    # def test_delete_item_in_cart(self):
    #     response = self.client.delete(
    #         reverse(
    #             'cart_api:delete',
    #             kwargs={'unique_id': 'postmanTest1234'}
    #         ),
    #         data=["2"],
    #         content_type='application/json'
    #     )
    #     self.assertEqual(
    #         response.status_code,
    #         status.HTTP_204_NO_CONTENT,
    #         response.json()
    #     )

    # def test_delete_from_cart(self):
    #     # First, create the cart
    #     create_response = self.client.post(
    #         reverse('cart_api:create'),
    #         data=list(create_items(quantity=2)),
    #         content_type='application/json'
    #     )
    #     self.assertEqual(
    #         create_response.status_code,
    #         status.HTTP_201_CREATED,
    #         create_response.json()
    #     )

    #     # Now, delete an item from the cart
    #     delete_response = self.client.delete(
    #         reverse(
    #             'cart_api:delete',
    #             kwargs={'unique_id': 'postmanTest1234'}
    #         ),
    #         data=json.dumps({
    #             "session_id": "postmanTest1234",
    #             "product_ids": [
    #                 ["2", "M"]
    #             ]
    #         }),
    #         content_type='application/json'
    #     )
    #     self.assertEqual(
    #         delete_response.status_code,
    #         status.HTTP_204_NO_CONTENT,
    #         delete_response.json()
    #     )

    # def test_add_same_cart_if_others_were_paid_for(self):
    #     # The user should be able to create a new cart
    #     # with the same session ID, if the previous
    #     # ones were paid for.
    #     Cart.objects.create(**{
    #         'session_id': 'duplicateSessionID',
    #         'items': list(create_items(quantity=2)),
    #         'is_paid_for': True
    #     })

    #     Cart.objects.create(**{
    #         'session_id': 'duplicateSessionID',
    #         'items': list(create_items(quantity=2)),
    #         'is_paid_for': False
    #     })

    #     qs = Cart.objects.filter(session_id='duplicateSessionID')
    #     self.assertEqual(qs.count(), 2)
