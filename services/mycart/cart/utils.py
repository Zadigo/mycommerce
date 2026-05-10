from typing import Union

from django.forms import DecimalField


def calculate_vat(value: Union[DecimalField, float, int], vat: int = 20):
    price = float(value)
    if vat < 0 or vat > 100:
        raise ValueError('VAT should be above 0 and below 100')
    return price * (1 + (vat / 100))


def calculate_items_total(items: list[dict]) -> tuple[float, int]:
    """Calculates the total price and quantity of the items in the cart
    by iterating over the list of items and summing up the price and 
    quantity of each item."""
    total = 0
    total_quantity = 0

    for json_product in items:
        price = json_product['product']['price']
        quantity = json_product['quantity']

        total += (price * quantity)
        total_quantity += quantity
    return total, total_quantity
