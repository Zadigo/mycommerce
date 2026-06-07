from decimal import Decimal
from shop.tests.utils import ProductFactory
from django.test import TestCase
from shop.utils import create_slug, generate_sku
from shop.models import Product
from shop.utils import (calculate_sale, create_slug, process_file_name,
                        product_media_path, remove_special_characters,
                        transform_to_snake_case)


class TestUtilities(TestCase):
    # fixtures = ['fixtures/products']s

    def setUp(self):
        self.products: list[Product] = ProductFactory.create_batch(1)
        self.product = self.products[0]

    def test_remove_accents(self):
        from shop.utils import remove_accents

        test_cases = [
            ('é', 'e'),
            ('à', 'a'),
            ('ç', 'c'),
            ('ü', 'u'),
            ('ñ', 'n'),
            ('Jupé de Paris', 'Jupe de Paris')
        ]

        for input_str, expected in test_cases:
            with self.subTest(input_str=input_str):
                result = remove_accents(input_str)
                self.assertEqual(result, expected)

    def test_clean_text(self):
        from shop.utils import clean_text

        test_cases = [
            ('Blazzer Strapped', 'Blazzer strapped'),
            ('Floral Mesh Balcony Soutien Gorge Et String Ensemble',
             'floral mesh balcony soutien gorge et string ensemble'),
            ('Blazer Jupe Boutons Dorées', 'blazer jupe boutons dorées'),
            ('Blazer, plissée de Japon', 'blazer plissée de japon'),
            ('Blazer - Facile', 'blazer facile'),
            ('some_simple_file', 'some_simple_file'),
            ('some#invalid**filename', 'someinvalidfilename'),
            ('jupe-cargo-lani%C3%A8res', 'jupe cargo lanières')
        ]

        for input_str, expected in test_cases:
            with self.subTest(input_str=input_str):
                result = clean_text(input_str)
                self.assertEqual(result, expected)

        result = clean_text(None)
        self.assertIsNone(result)

    def test_create_image_slug(self):
        from shop.utils import create_image_slug

        test_cases = [
            ('Blazzer Strapped', 'blazzer_strapped.jpg'),
            ('Blazer Jupe Boutons Dorées', 'blazer_jupe_boutons_dorées.jpg'),
            ('Blazer, plissée de Japon', 'blazer_plissée_de_japon.jpg'),
            ('Blazer - Facile', 'blazer_facile.jpg'),
            ('some_simple_file', 'some_simple_file.jpg'),
            ('some#invalid**filename', 'someinvalidfilename.jpg'),
            ('jupe-cargo-lani%C3%A8res', 'jupe_cargo_lanières.jpg')
        ]

        for input_str, expected in test_cases:
            with self.subTest(input_str=input_str):
                result = create_image_slug(input_str)
                self.assertEqual(result, expected)

        result = create_image_slug('blazer_strapped.jpg', reverse=True)
        self.assertEqual(result, 'Blazer Strapped')

    def test_create_slug(self):
        test_cases = [
            ('Blazzer Strapped', 'blazzer-strapped'),
            ('Blazer Jupe Boutons Dorées', 'blazer-jupe-boutons-dorées'),
            ('Blazer, plissée de Japon', 'blazer-plissée-de-japon'),
            ('Blazer - Facile', 'blazer-facile'),
            ('some_simple_file', 'some_simple_file'),
            ('some#invalid**filename', 'someinvalidfilename'),
            ('jupe-cargo-lani%C3%A8res', 'jupe-cargo-lanières')
        ]

        for input_str, expected in test_cases:
            with self.subTest(input_str=input_str):
                result = create_slug(input_str)
                self.assertIn(expected, result)

        result = create_slug("jupe l'apostrophe", 1234, None)
        self.assertTrue(result.startswith('jupe-apostrophe'))

    def test_calculate_sale(self):
        product = Product.objects.create(
            name='Test Product',
            unit_price=100.00,
        )

        result = calculate_sale(product.unit_price, 2)
        self.assertIsInstance(result, Decimal)

        # Test that we can save the ouput result
        # directly on the object
        product.sale_price = result
        product.save()

    def test_transform_to_snake_case(self):
        text = [
            ('Blazzer Strapped', 'blazzer_strapped')
        ]

        for text, expected in text:
            with self.subTest(text=text):
                result = transform_to_snake_case(text)
                self.assertIn('_', result)
                self.assertEqual(result, expected)

    def test_remove_special_characters(self):
        text = [
            ('jupé de paris#$', 'jupé de paris')
        ]

        for text, expected in text:
            with self.subTest(text=text):
                result = remove_special_characters(text)
                self.assertIn(result, expected)

    def test_process_file_name(self):
        testcases = [
            ('jupé coûpe.jpg', 'jupé_coûpe.jpg')
        ]

        for text, expected in testcases:
            with self.subTest(text=text):
                result = process_file_name(text)
                self.assertIsInstance(result, tuple)

                name, extension = result
                self.assertEqual(name, 'jupé_coûpe')
                self.assertEqual(extension, 'jpg')

    def test_product_media_path(self):
        filenames = [
            (
                'Blazer Strapped.jpg',
                r'blazer\_strapped\_'
            ),
            (
                'Floral Mesh Balcony Soutien Gorge Et String Ensemble.jpg',
                r'floral_mesh_balcony_soutien_gorge_et_string_ensemble_'
            ),
            (
                'Blazer Jupe Boutons Dorées.jpg',
                r'blazer_jupe_boutons_dorées_'
            ),
            (
                'Blazer, plissée de Japon.jpg',
                r'blazer_plissée_de_japon_'
            ),
            (
                'Blazer - Facile.jpg',
                r'blazer\_\_\_facile\_'
            ),
            (
                'some_simple_file.jpg',
                r'some_simple_file_'
            ),
            (
                'some#invalid**filename.jpg',
                r'someinvalidfilename_'
            ),
            (
                'jupe-cargo-lani%C3%A8res.jpg',
                r'jupe_cargo_lanières_'
            )
        ]
        for name, expected in filenames:
            with self.subTest(filename=name):
                result = product_media_path(name)
                self.assertRegex(result, expected)

    def test_generate_sku(self):
        value = generate_sku('red')
        self.assertTrue(value.startswith('RED'))
