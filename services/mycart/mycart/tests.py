from django.test import TestCase, override_settings

from services.mycart.mycart.custom_utilities.tokens import JWTGenerator, decode_jwt_token


@override_settings(PY_UTILITIES_JWT_SECRET='some_secret')
class TestJWTGenerator(TestCase):
    def test_create_token(self):
        instance = JWTGenerator(
            'ecommerce',
            'users',
            'some subject'
        )
        value = instance.create()

        self.assertIsNotNone(value)
        self.assertIsInstance(value, str)

        decoded = decode_jwt_token(
            value,
            raise_exception=True,
            audience='users'
        )
        self.assertIsInstance(decoded, dict)
        self.assertIn('aud', decoded)

    def test_same_tokens(self):
        """Ensure that we pass a unique token and that
        both JWT would therefore not be the same"""
        t1 = JWTGenerator(
            'ecommerce',
            'users',
            'some subject',
            cart_id='1234'
        ).create()

        t2 = JWTGenerator(
            'ecommerce',
            'users',
            'some subject',
            cart_id='2345'
        ).create()

        self.assertNotEqual(t1, t2)
