

from cart.models import Cart
from django.db.models.fields import json
from django.test import override_settings
from django.urls import reverse
from rest_framework.mixins import status

from mycart.mixins import AuthenticatedTestCase

SERIALIZED_CARTITEM = {
    "session_id": "postmanTest1234",
    "items": [
        {
            "size": {
                "name": "M",
                "metric": "cm",
                "active": True,
                "variantPrice": 5,
                "availability": False
            },
            "product": {
                "salePrice": 0,
                "name": "Product Fixture 2",
                "id": "2",
                "price": 10,
                "mainImage": {
                    "createdOn": "2025-01-01",
                    "isMainImage": True,
                    "thumbnail": "/images/group5/img1.jpeg",
                    "variant": "default",
                    "name": "Main Image",
                    "original": "/images/group5/img1.jpeg"
                },
                "unitPrice": 10
            },
            "total": 10,
            "quantity": 1
        },
        {
            "size": {
                "variantPrice": 0,
                "availability": True,
                "active": True,
                "metric": "cm",
                "name": "S"
            },
            "quantity": 1,
            "product": {
                "mainImage": {
                    "original": "/images/group1/img1.jpg",
                    "createdOn": "2025-01-01",
                    "thumbnail": "/images/group1/img1.jpg",
                    "name": "Main Image",
                    "isMainImage": True,
                    "variant": "default"
                },
                "salePrice": 0,
                "id": "1",
                "price": 20,
                "unitPrice": 20,
                "name": "Product Fixture 1"
            },
            "total": 20
        }
    ]
}


@override_settings(PY_UTILITIES_JWT_ISSUER='ecommerce', PY_UTILITIES_JWT_SECRET='some_secret')
class TestCartApi(AuthenticatedTestCase):
    fixtures = ['fixtures/user', 'carts']

    def test_list_all_carts(self):
        response = self.client.get(reverse('cart_api:list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for item in response.json():
            with self.subTest(item=item):
                self.assertIn('items', item)
                self.assertIn('total', item)
                self.assertIn('quantity', item)

    def test_list_cart_items_not_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='')
        response = self.client.get(
            reverse(
                'cart_api:cart_items',
                kwargs={'unique_id': 'postmanTest1234'}
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            response.json()
        )

        data = response.json()
        self.assertIn('items', data)
        self.assertIsInstance(data['items'], list)
        self.assertEqual(len(data['items']), 1)
        self.assertIn('total', data)
        self.assertIn('quantity', data)

    def test_create_cart_authenticated(self):
        response = self.client.post(
            reverse('cart_api:create'),
            data=SERIALIZED_CARTITEM,
            content_type='application/json'
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            response.json()
        )

        data = response.json()
        self.assertIn('session_id', data)
        self.assertIsInstance(data['session_id'], str)

    def test_delete_item_in_cart(self):
        response = self.client.delete(
            reverse(
                'cart_api:delete',
                kwargs={'unique_id': 'postmanTest1234'}
            ),
            data=["2"],
            content_type='application/json'
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
            response.json()
        )

    def test_delete_from_cart(self):
        # First, create the cart
        create_response = self.client.post(
            reverse('cart_api:create'),
            data=SERIALIZED_CARTITEM,
            content_type='application/json'
        )
        self.assertEqual(
            create_response.status_code,
            status.HTTP_201_CREATED,
            create_response.json()
        )

        # Now, delete an item from the cart
        delete_response = self.client.delete(
            reverse(
                'cart_api:delete',
                kwargs={'unique_id': 'postmanTest1234'}
            ),
            data=json.dumps({
                "session_id": "postmanTest1234",
                "product_ids": [
                    ["2", "M"]
                ]
            }),
            content_type='application/json'
        )
        self.assertEqual(
            delete_response.status_code,
            status.HTTP_204_NO_CONTENT,
            delete_response.json()
        )

    def test_add_same_cart_if_others_were_paid_for(self):
        # The user should be abe to create a new cart
        # with the same session ID, if the previous
        # ones were paid for.
        Cart.objects.create(**{
            'session_id': 'duplicateSessionID',
            'items': SERIALIZED_CARTITEM['items'],
            'is_paid_for': True
        })

        Cart.objects.create(**{
            'session_id': 'duplicateSessionID',
            'items': SERIALIZED_CARTITEM['items'],
            'is_paid_for': False
        })

        qs = Cart.objects.filter(session_id='duplicateSessionID')
        self.assertEqual(qs.count(), 2)


# @unittest.skip('Live test skipped')
# class TestLiveCart(LiveServerTestCase):
#     @classmethod
#     def setUpClass(cls):
#         super().setUpClass()
#         cls.browser = webdriver.Edge()

#     @classmethod
#     def tearDownClass(cls):
#         cls.browser.quit()
#         super().tearDownClass()

#     def test_cart(self):
#         self.browser.get('http://localhost:5173/')

#         WebDriverWait(self.browser, 10).until(
#             ec.element_to_be_clickable(
#                 (
#                     By.ID,
#                     'btn-select-language'
#                 )
#             )
#         )

#         language_button = self.browser.find_element(
#             By.ID,
#             'btn-select-language'
#         )
#         language_button.click()

#         time.sleep(2)

#         section = self.browser.find_element(
#             By.CSS_SELECTOR,
#             'section#collections'
#         )
#         collections = section.find_elements(
#             By.TAG_NAME,
#             'article'
#         )
#         first_collection = collections[0]
#         first_collection.click()

#         time.sleep(10)
