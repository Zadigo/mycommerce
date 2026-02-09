
from django.test import TransactionTestCase
from shop.processors import FuzzyMatcherMixin


class TestFuzzyMatcher(TransactionTestCase):
    fixtures = ['fixtures/products']

    def setUp(self):
        self.instance = FuzzyMatcherMixin()

    def test_simple_ratio_match(self):
        items = [
            # (Product, Test)
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.simple_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_partial_ratio_match(self):
        items = [
            # (Product, Test)
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.partial_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_token_sort_ratio_match(self):
        items = [
            # (Product, Test)
            ('Ribbed Taille Haute Shorts', 'Haute Taille'),
            ('Ribbed Taille Haute Shorts', 'Shorts Hautes Taille')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.token_sort_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_token_set_ratio_match(self):
        items = [
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.token_set_ratio_match(a, b)
                self.assertIsInstance(result, float)

    def test_weighted_ratio_match(self):
        items = [
            ('Ribbed Taille Haute Shorts', 'Taille Shorts'),
            ('Ribbed Taille Haute Shorts', 'Shorty En Dentelle'),
            ('Ribbed Taille Haute Shorts', 'Short Biker')
        ]

        for item in items:
            with self.subTest(item=item):
                a, b = item
                result = self.instance.weighted_ratio_match(a, b)
                self.assertIsInstance(result, float)
