import pytest

from cart.tests.utils import create_items
from cart.utils import calculate_total_from_instance


@pytest.mark.django_db
def test_calculate_items_total():
    items = create_items(1)
    total, _ = calculate_total_from_instance(items[0])
    
    _item = items[0].items
    totals = map(
        lambda x: x['product']['price'] * x['quantity'],
        _item
    )
    total = sum(totals)
    assert total > 0

