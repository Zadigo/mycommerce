from celery import shared_task
from celery.utils.log import get_task_logger
from shop.models import Product


@shared_task
def check_products():
    """A scheduler that can be used to operate
    daily tasks on the products of the database"""
    qs = Product.objects.filter(active=True)
    for product in qs:
        print('Verifying product:', product.id)
    return list(qs.values_list('id', flat=True))
