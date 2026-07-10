from cart.tests.utils import create_items
from discounts.utils import (calculate_discount, calculate_partial_discount,
                             get_calculated_discount_response)
from django.test import TestCase


class TestUtils(TestCase):
    def test_calculate_discount(self):
        value = calculate_discount(100, 25)
        self.assertEqual(value, 133.33)

    def test_get_calculated_discount_response(self):
        value = calculate_discount(100, 25)

        data = get_calculated_discount_response(discounted_total=value)
        self.assertIsInstance(data, dict)

        self.assertEqual(data['total']['discounted'], 133.33)
        self.assertIsInstance(data['products']['valid'], list)
        self.assertIsInstance(data['products']['invalid'], list)
        self.assertEqual(data['total']['all'], 133.33)
        self.assertEqual(data['total']['undiscounted'], 0)

    def test_calculate_partial_discount(self):
        items = list(create_items(2))
        invalid, valid, discounted_total, undiscounted_total = calculate_partial_discount(
            items,
            percentage=25,
            ids=[1]
        )

        self.assertIsInstance(invalid, list)
        self.assertIsInstance(valid, list)
        self.assertIsInstance(discounted_total, (float, int))
        self.assertIsInstance(undiscounted_total, (float, int))

        print(items, invalid, valid, discounted_total, undiscounted_total)
