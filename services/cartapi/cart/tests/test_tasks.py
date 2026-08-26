
from cart import django_tasks
from cart.models import Cart
from cart.tests.utils import create_items


def test_calculate_total():
    items = create_items(2)
    cart = Cart.objects.first()
    result = django_tasks.calculate_total(cart.pk)
    result.get()
