import unittest

from django.test import TransactionTestCase, override_settings

from shop.models import Product
from shop.tests.utils import ProductFactory


class TestProductModel(TransactionTestCase):
    """Tests for specific model logic on prices etc"""

    @classmethod
    def setUpClass(cls):
        ProductFactory.create_batch(10)
        cls.on_sale = Product.objects.filter(on_sale=True)
        cls.not_on_sale = Product.objects.filter(on_sale=False)

    def test_get_price_product_on_sale(self):
        product = self.on_sale.first()
        self.assertTrue(product.on_sale)

        product.unit_price = 100
        product.sale_value = 20
        product.on_sale = True
        product.save()

        unit_price = product.unit_price
        sale_value = product.sale_value
        result = unit_price * (1 - sale_value / 100)
        
        product.sale_price = result
        product.save()

        self.assertEqual(result, product.get_price)

    @unittest.skip('Percentage not calculated on clean')
    def test_sale_percentage(self):
        print(self.on_sale.first().sale_percentage)


@override_settings(VAT_PERCENTAGE=20)
class TestVATPrice(TransactionTestCase):
    def test_vat_price_calculation(self):
        product = ProductFactory(unit_price=100)
        expected_vat_price = 120  # 100 + 20% of 100
        self.assertEqual(product.vat_price, expected_vat_price)

    def test_invalid_vat_percentage_type(self):
        with override_settings(VAT_PERCENTAGE='invalid'):
            product = ProductFactory(unit_price=100)
            self.assertIsNone(product.vat_price)

    def test_invalid_vat_percentage_number(self):
        with override_settings(VAT_PERCENTAGE=-10):
            product = ProductFactory(unit_price=100)
            self.assertIsNone(product.vat_price)

        with override_settings(VAT_PERCENTAGE=150):
            product = ProductFactory(unit_price=100)
            self.assertIsNone(product.vat_price)

