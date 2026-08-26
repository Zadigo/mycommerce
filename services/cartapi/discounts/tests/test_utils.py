import pytest

from cart.tests.utils import create_items
from discounts.utils import (
    calculate_discount,
    calculate_partial_discount,
    get_calculated_discount_response,
)


def test_calculate_discount():
    value = calculate_discount(100, 25)
    assert value == 133.33

    # With float
    value = calculate_discount(100, 0.25)
    assert value == 133.33

    # With discount 0
    value = calculate_discount(100, 0)
    assert value == 100.0

    # With price 0
    value = calculate_discount(0, 25)
    assert value == 0.0


def test_get_calculated_discount_response():
    result = get_calculated_discount_response()
    assert isinstance(result, dict)


def test_get_calculated_discount_response_with_discounted_total():
    value = calculate_discount(100, 25)
    data = get_calculated_discount_response(discounted_total=value)

    assert isinstance(data, dict)

    assert data['total']['discounted'] == 133.33
    assert isinstance(data['products']['valid'], list)
    assert isinstance(data['products']['invalid'], list)
    assert data['total']['all'] == 133.33
    assert data['total']['undiscounted'] == 0


@pytest.mark.django_db
def test_calculate_partial_discount():
    items = list(create_items(2))
    invalid, valid, discounted_total, undiscounted_total = calculate_partial_discount(
        items,
        percentage=25,
        ids=[1]
    )

    assert isinstance(invalid, list)
    assert isinstance(valid, list)
    assert isinstance(discounted_total, (float, int))
    assert isinstance(undiscounted_total, (float, int))

    # print(items, invalid, valid, discounted_total, undiscounted_total)
