import requests
from celery import shared_task
from celery.utils.log import get_logger
from django.db import models
from cart.models import Cart

logger = get_logger(__name__)


@shared_task
def check_product_exists(product_id):
    """Check if a product exists in `mystore.Product` 
    service model"""
    try:
        response = requests.get(f'http://127.0.0.1:8000/shop/v1/{product_id}')

        if response.status_code == 200:
            return True
        else:
            return False
    except requests.RequestException as e:
        logger.error(f"Error checking product existence: {e}")
        return False


@shared_task
def calculate_total(cart_id: int):
    """Calculate the total price of items in the cart"""
    try:
        instance = Cart.objects.get(id=cart_id)
    except:
        logger.error(f"Cart with id {cart_id} does not exist.")
        return
    else:
        total = 0
        quantity = 0

        for json_product in instance.items:
            total += json_product['product']['price'] * json_product['quantity']
            quantity += json_product['quantity']

        instance.total = total
        instance.quantity = quantity

        instance.save()

        logger.warning(
            f"Updated item {instance.id}. Quantity: {instance.quantity} price {instance.total}")
