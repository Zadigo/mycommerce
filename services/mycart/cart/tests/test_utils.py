from cart.tests.utils import create_items
from cart.utils import calculate_items_total
from django.test import TestCase


class TestUtils(TestCase):
    def test_calculate_items_total(self):
        items = create_items(1)
        total, total_quantity = calculate_items_total(items)
        
        self.assertEqual(
            total,
            sum(
                item['product']['price'] * item['quantity']
                for item in items
            )
        )
        self.assertEqual(
            total_quantity, sum(
                item['quantity']
                for item in items
            )
        )
