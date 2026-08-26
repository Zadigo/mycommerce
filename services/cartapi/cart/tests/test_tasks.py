import pytest

from cart import django_tasks
from cart.models import Cart
from cart.tests.utils import create_items

django_tasks.huey_task.immediate = True

@pytest.mark.django_db
def test_calculate_total():
    items = create_items(2)
    cart = Cart.objects.first()
    result = django_tasks.calculate_total(cart.pk)
    result.get()

    # for instance in items:
    #     # instance.refresh_from_db()
    #     assert instance.total > 0
