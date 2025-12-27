import asyncio

import httpx
from cart.models import Cart
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
                return response.json()
        except httpx.HTTPError as exc:
            logger.error(f"Error while checking product exists: {exc}")
        else:
            logger.info(f"Successfully checked products at {url}")

    async def main():
        tasks = [
            asyncio.create_task(runner(service))
            for service in services
        ]
        return await asyncio.gather(*tasks)

    asyncio.run(main())


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
            total += json_product['product']['price'] * \
                json_product['quantity']
            quantity += json_product['quantity']

        instance.total = total
        instance.quantity = quantity

        instance.save()

        logger.warning(
            f"Updated item {instance.id}. Quantity: {instance.quantity} price {instance.total}")
