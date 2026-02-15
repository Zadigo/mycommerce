from unittest.mock import patch

from cart import tasks
from cart.models import Cart
from django.test import TestCase, override_settings
from faker import Faker

from mycart.settings import MICROSERVICES

MICROSERVICES = {
    'apps': {
        'cart': [
            'http://service1.example.com/check',
            'http://service2.example.com/check',
        ]
    }
}

fake = Faker(locale='en_US')


@override_settings(CELERY_ALWAYS_EAGER=True, MICROSERVICES=MICROSERVICES)
class TestTasks(TestCase):
    def setUp(self):

        item = [
            {
                'size': {
                    'name': fake.pystr(max_chars=10),
                    'active': True,
                    'metric': 'cm',
                    'availability': True,
                    'variantPrice': 0.0},
                'total': fake.pyfloat(positive=True, right_digits=2),
                'product': {
                    'id': fake.pyint(min_value=1),
                    'name': fake.pystr(max_chars=10),
                    'price': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0),
                    'mainImage': {
                        'name': fake.pystr(max_chars=10),
                        'variant': fake.pystr(max_chars=10),
                        'original': fake.pystr(max_chars=10),
                        'createdOn': fake.date(),
                        'thumbnail': fake.pystr(max_chars=10),
                        'isMainImage': fake.pybool()},
                    'salePrice': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0),
                    'unitPrice': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0)},
                'quantity': fake.pyint(min_value=1, max_value=2)
            }
        ]

        self.items = [item for _ in range(5)]

    def test_check_product_exists(self):
        with patch('cart.tasks.httpx', autospec=True) as mhttpx:
            mhttpx.AsyncClient.return_value.__aenter__.return_value.post.return_value.raise_for_status.return_value = None

            tasks.check_product_exists.apply(
                args=[self.items]
            ).get()

    def test_caculate_total(self):
        cart = Cart.objects.create(
            items=self.items[-1],
            user=None,
            order_reference=fake.pystr(max_chars=10),
            total=0.0,
            quantity=0
        )
        tasks.calculate_total.apply(args=[cart.id]).get()

        cart.refresh_from_db()

        self.assertIsNotNone(cart.total)
        self.assertIsNotNone(cart.quantity)
        self.assertGreater(cart.total, 0)
        self.assertGreater(cart.quantity, 0)
