from unittest.mock import AsyncMock, patch

from cart import tasks
from cart.tests.utils import create_items
from django.test import TestCase, override_settings
from faker import Faker
from mycart.settings import MICROSERVICES

MICROSERVICES = {
    'apps': {
        'cart': [
            'http://service1.example.com/check'
        ]
    }
}

faker = Faker()


@override_settings(CELERY_ALWAYS_EAGER=True, MICROSERVICES=MICROSERVICES)
class TestTasks(TestCase):
    def setUp(self):
        self.items = create_items(quantity=2)

    def test_check_product_exists(self):
        with patch('cart.tasks.httpx', autospec=True) as mhttpx:
            response = AsyncMock()
            response.raise_for_status.return_value = None
            response.json.return_value = {'valid': True}
            mhttpx.AsyncClient.return_value.__aenter__.return_value.post.return_value = response
            # mhttpx.AsyncClient.return_value.__aenter__.return_value.post.return_value.raise_for_status.return_value = None

            tasks.check_product_exists.apply(
                args=[self.items]
            ).get()

    def test_caculate_total(self):
        items = create_items(1)
        instance = items[0]
        tasks.calculate_total.apply(args=[instance.id]).get()

        instance.refresh_from_db()

        self.assertIsNotNone(instance.total)
        self.assertIsNotNone(instance.quantity)
        self.assertGreater(instance.total, 0)
        self.assertGreater(instance.quantity, 0)

        item = instance.items[0]
        self.assertEqual(instance.total, item['product']['price'] * item['quantity'])

