from cart.models import Cart
from cart.tests.utils import create_items
from discounts.models import Discount
from django.test import TestCase
from django.urls import reverse


class TestApi(TestCase):
    fixtures = ['carts']

    def setUp(self):
        self.instance = Discount.objects.create(
            name='ETE2025',
            percentage=25
        )

        items = list(create_items(5))
        cart = Cart.objects.get(pk=1)
        cart.items = items
        cart.save()

    def test_apply_discount(self):
        path = reverse('discounts:apply')
        response = self.client.post(path, data={
            'cart_id': 'postmanTest1234',
            'discount_code': 'ETE2025'
        })
        self.assertEqual(response.status_code, 200, response.content)
        print(response.json())
