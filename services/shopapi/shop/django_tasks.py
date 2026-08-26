import huey

from shop.models import Product
from shopapi.huey_app import huey_task


@huey_task.periodic_task(huey.crontab(hour='*'))
def check_products():
    """A scheduler that can be used to operate
    daily tasks on the products of the database"""
    qs = Product.objects.filter(active=True)
    for product in qs:
        print('Verifying product:', product.id)
    return list(qs.values_list('id', flat=True))
