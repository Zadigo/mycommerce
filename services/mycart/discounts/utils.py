from typing import Any

from cart.utils import calculate_items_total
from django.utils.crypto import get_random_string


def create_reference() -> str:
    return get_random_string(4)


def calculate_discount(price: int | float, discount: int | float) -> float:
    """Calculates the discounted price based on the original price and the discount percentage.

    Args:
        price (int | float): The original price before applying the discount.
        discount (int | float): The discount percentage to apply to the original price.

    Returns:
        float: The price after applying the discount.
    """
    if isinstance(discount, int):
        discount = discount / 100

    value = (price / (1 - discount))
    return round(value, 2)


def get_calculated_discount_response(valid_products: list[dict] = [], invalid_products: list[dict] = [], discounted_total: float = 0.0, undiscounted: float = 0.0) -> dict[str, Any]:
    """Returns a dictionary containing the calculated discount response, including the discounted total and the original total.

    Args:
        valid_products (list[dict]): A list of valid products.
        invalid_products (list[dict]): A list of invalid products.
        discounted_total (float): The total discounted amount.
        undiscounted (float): The total undiscounted amount.

    Returns:
        dict[str, Any]: A dictionary containing the calculated discount response.
    """
    return {
        'products': {
            'valid': valid_products,
            'invalid': invalid_products
        },
        'total': {
            'all': discounted_total + undiscounted,
            'discounted': discounted_total,
            'undiscounted': undiscounted
        }
    }


def calculate_partial_discount(items: list[dict], percentage: int, ids: list[int]) -> tuple[list[dict], list[dict], float, float]:
    """Calculates a discount in the case where the discount is only applicable 
    to some of the items in the cart.

    Args:
        items (list[dict]): A list of dictionaries representing the items in the cart.
        percentage (int): The percentage discount to apply to the applicable items.
        ids (list[int]): A list of product IDs that the discount is applicable to.

    Returns:
        tuple[list[dict], list[dict], float, float]: A tuple containing the invalid products, valid products, discounted total, and undiscounted total.
    """
    invalid_products: list[dict] = list(
        filter(
            lambda item: item['product']['id'] not in ids, 
            items
        )
    )

    valid_products: list[dict] = list(
        filter(
            lambda item: item['product']['id'] in ids,
            items
        )
    )

    discounted, _ = calculate_items_total(valid_products)
    undiscounted_total, _ = calculate_items_total(invalid_products)

    breakpoint()

    discounted_total = calculate_discount(discounted, percentage)
    return invalid_products, valid_products, discounted_total, undiscounted_total
