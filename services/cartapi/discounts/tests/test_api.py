from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from cart.tests.utils import create_items
from discounts.models import Discount


class TestApplyDiscountApi(TestCase):
    # fixtures = ['carts']

    def setUp(self):
        self.instance = Discount.objects.create(
            name='ETE2025',
            percentage=25
        )

        items = list(create_items(1))
        self.cart = items[0]

    def test_apply_discount_code_does_not_exist(self):
        response = self.client.post(
            reverse('discounts:apply'), 
            content_type='application/json',
            data={
                'cart_id': self.cart.session_id,
                'discount_code': 'NONEXISTENT'
            }
        )
        self.assertEqual(response.status_code, 404, response.content)

    # TODO: Use static product data
    def test_apply_discount_code_exists(self):
        valid_ids = list(map(lambda item: item['product']['id'], self.cart.items))

        current_date = timezone.now()

        self.instance.start_date = current_date - timezone.timedelta(days=1)
        self.instance.end_date = current_date + timezone.timedelta(days=1)
        self.instance.products = valid_ids
        self.instance.save()

        response = self.client.post(
            reverse('discounts:apply'), 
            content_type='application/json',
            data={
                'cart_id': self.cart.session_id,
                'discount_code': 'ETE2025'
            }
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertIn('products', response.json())
        
        print(response.json())

        valid = response.json()['products']['valid']
        self.assertEqual(len(valid), len(valid_ids), "Should return all valid products in the response")
        
        invalid = response.json()['products']['invalid']
        self.assertEqual(len(invalid), 0, "Should return no invalid products in the response")
