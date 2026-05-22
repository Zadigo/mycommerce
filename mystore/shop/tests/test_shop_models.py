import unittest

import factory
from django.test import TransactionTestCase
from shop.models import Product
from django.test import override_settings
from django.conf import settings


class ProductFactory(factory.django.DjangoModelFactory):
    # sale_value = factory.Transformer(0, transform=0)

    class Meta:
        model = Product

    name = factory.Faker(
        'word'
    )
    color = factory.Faker(
        'color_name'
    )
    sku = factory.Faker(
        'ean13'
    )
    unit_price = factory.Faker(
        'pyfloat',
        left_digits=2,
        right_digits=2,
        positive=True
    )
    # sale_value = factory.Faker(
    #     'pyfloat',
    #     left_digits=1,
    #     right_digits=2,
    #     positive=True
    # )
    # sale_price = factory.Faker(
    #     'pyfloat',
    #     left_digits=2,
    #     right_digits=2,
    #     positive=True
    # )
    # on_sale = factory.Faker(
    #     'boolean',
    #     chance_of_getting_true=50
    # )
    display_new = factory.Faker(
        'boolean',
        chance_of_getting_true=50
    )
    active = factory.Faker(
        'boolean',
        chance_of_getting_true=90
    )


class TestProductModel(TransactionTestCase):
    """Tests for specific model logic on prices etc"""

    fixtures = ['fixtures/products']

    @classmethod
    def setUpClass(cls):
        cls.on_sale = Product.objects.filter(on_sale=True)
        cls.not_on_sale = Product.objects.filter(on_sale=True)

    def test_get_price_product_on_sale(self):
        product = self.on_sale.first()

        unit_price = product.unit_price
        sale_value = product.sale_value
        result = unit_price - sale_value

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

