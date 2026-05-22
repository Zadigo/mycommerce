from decimal import Decimal
from shop.tests.utils import ProductFactory
from django.test import TestCase
from shop.models import Product
from shop.utils import (calculate_sale, create_slug, process_file_name,
                        product_media_path, remove_special_characters,
                        transform_to_snake_case)


class TestUtilities(TestCase):
    # fixtures = ['fixtures/products']s

    def setUp(self):
        self.products: list[Product] = ProductFactory.create_batch(1)
        self.product = self.products[0]

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

    def test_video_path(self):
        pass

    def test_image_path(self):
        pass

    def test_create_slug(self):
        products = [
            "Jupe Midi Popeline Taille Élastique",
            "Jupe d'appoint",
            "éladine de marseille - d'argan"
        ]
        for product in products:
            slug = create_slug(product)
            with self.subTest(product=product):
                self.assertIsInstance(slug, str)

        slug = create_slug(products[0], 1, 'blue')
        self.assertIn(
            'jupe-midi-popeline-taille-elastique-1-blue',
            slug
        )
