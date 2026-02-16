import asyncio

import httpx
from cart.models import Cart
from cart.utils import calculate_items_total
from celery import shared_task
from celery.utils.log import get_logger
from django.conf import settings

logger = get_logger(__name__)


@shared_task
def check_product_exists(items: list[dict]):
    """Check if a product exists in `mystore.Product` 
    service model"""
    microservices = getattr(settings, 'MICROSERVICES', {})
    services = microservices.get('apps', {}).get('cart', [])

    async def runner(url: str):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=items)
                response.raise_for_status()
        except httpx.HTTPError as e:
            logger.error(f"Error while checking product exists: {e}")
            return None
        else:
            logger.info(f"Successfully checked product at {url}")
            return response.json()

    async def main():
        tasks = [
            asyncio.create_task(runner(service))
            for service in services
        ]
        return await asyncio.gather(*tasks)

    results = asyncio.run(main())


@shared_task
def calculate_total(cart_id: int):
    """Calculate the total price of items 
    in a given cart"""
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
