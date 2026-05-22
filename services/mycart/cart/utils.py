from typing import Union

from django.forms import DecimalField
from cart.models import Cart

def calculate_vat(value: Union[DecimalField, float, int], vat: int = 20):
    """Calculates the price including VAT by taking the original price and adding the VAT percentage to it.

    Args:
        value (Union[DecimalField, float, int]): The original price.
        vat (int, optional): The VAT percentage to apply. Defaults to 20.

    Returns:
        float: The price including VAT.

    Raises:
        ValueError: If the VAT percentage is less than 0 or greater than 100.
    """
    price = float(value)
    if vat < 0 or vat > 100:
        raise ValueError('VAT should be above 0 and below 100')
    return price * (1 + (vat / 100))

def calculate_total_from_instance(instance: Cart) -> float:
    """Calculates the total price of the items in the cart by calling the 
    calculate_items_total function with the items from the cart instance."""
    return calculate_items_total(instance.items)


def calculate_items_total(items: list[dict]) -> tuple[float, int]:
    """Calculates the total price and quantity of the items in the cart
    by iterating over the list of items and summing up the price and 
    quantity of each item.
    
    Args:
        items (list[dict]): A list of dictionaries representing the items in the cart.
    
    Returns:
        tuple: A tuple containing the total price (float) and total quantity (int) of the items in the cart.
    """
    total = 0
    total_quantity = 0

    for json_product in items:
        price = json_product['product']['price']
        quantity = json_product['quantity']

        total += (price * quantity)
        total_quantity += quantity
    return total, total_quantity
