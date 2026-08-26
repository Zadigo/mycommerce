from unittest.mock import patch

from django.test import TestCase
from django.test.client import RequestFactory
from django.urls import reverse
from django.contrib.auth.models import AnonymousUser
from cart.api.serializers import CartItemSerializer, ValidateCreateCart
from cart.models import Cart

ITEMS = [
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

class TestCartItemSerializer(TestCase):
    def test_cart_item_serializer(self):
        serializer = CartItemSerializer(data=ITEMS, many=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)


@patch('cart.api.serializers.django_tasks.calculate_total')
class TestValidateCreateCart(TestCase):
    def setUp(self):
        template = {
            'session_id': 'testsession123',
            'items': ITEMS
        }

        # request = self.client.post(
        #     reverse('cart_api:create_update'),
        #     data=template, 
        #     content_type='application/json'
        # )
        request = RequestFactory().post(
            reverse('cart_api:create_update'),
            data=template, 
            content_type='application/json'
        )
        request.user = AnonymousUser()  # Simulate an anonymous user

        self.template = template
        self.request = request

    def test_save_cart_item_serializer(self, mcalculate_total):
        serializer = ValidateCreateCart(data=self.template)
        serializer._context['request'] = self.request

        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        instance = serializer.save()
        self.assertEqual(len(instance.items), len(ITEMS))

    def test_update_cart_item_serializer(self, mcalculate_total):
        instance = Cart.objects.first()
        serializer = ValidateCreateCart(instance=instance, data=self.template)
        serializer._context['request'] = self.request

        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        instance = serializer.save()
        self.assertEqual(len(instance.items), len(ITEMS))
