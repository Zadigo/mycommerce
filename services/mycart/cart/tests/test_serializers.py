from django.test import TestCase
from cart.api.serializers import CartItemSerializer


class TestCartItemSerializer(TestCase):
    def test_cart_item_serializer(self):
        items = [
            {
                'size': {
                    'name': 'M',
                    'active': True,
                    'metric': 'cm',
                    'availability': True,
                    'variantPrice': 50.0
                },
                'total': 100.0,
                'product': {
                    'id': 1,
                    'name': 'Test Product',
                    'price': 50.0,
                    'salePrice': 45.0,
                    'unitPrice': 50.0,
                    'mainImage': {
                        'name': 'image.jpg',
                        'variant': 'default',
                        'original': 'http://example.com/image.jpg',
                        'createdOn': '2024-01-01T00:00:00Z',
                        'thumbnail': 'http://example.com/image_thumbnail.jpg',
                        'isMainImage': True
                    }
                },
                'quantity': 2
            }
        ]
        serializer = CartItemSerializer(data=items, many=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
