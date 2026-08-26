import logging

from cart.models import Cart
from cart.utils import calculate_items_total
from cartapi.huey_app import huey_task

logger = logging.getLogger(__name__)

@huey_task.task(retries=3, retry_delay=10, timeout=30)
def calculate_total(cart_id: int):
    """Calculates the total price of items 
    present in a given cart
    
    Args:
        cart_id (int): The ID of the cart to calculate the total for.
    """
    try:
        instance = Cart.objects.get(id=cart_id)
    except Cart.DoesNotExist:
        logger.error(f"Cart with id {cart_id} does not exist.")
        return
    else:
        total, total_quantity = calculate_items_total(instance.items)
        instance.total = total
        instance.quantity = total_quantity
        instance.save()

        logger.warning(
            f"Updated item {instance.id}. Quantity: "
            f"{instance.quantity} price {instance.total}"
        )
