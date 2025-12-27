from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase


class AuthenticationMixin:
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.get(pk=1)
        cls.user.set_password('touparet')
        cls.user.save()

    def setUp(self):
        self.client = self.client_class()
        self.token = self._authenticate()

    def _authenticate(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            data={
                'username': 'juliette',
                'password': 'touparet'
            }
        )

        self.assertEqual(response.status_code, 200, 'Authentication failed')

        token = response.json().get('access')
        self.assertIsNotNone(token, 'Token retrieval failed')

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        return token


class AuthenticatedTestCase(AuthenticationMixin, APITestCase):
    pass


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
