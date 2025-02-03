from celery import shared_task


@shared_task
def check_stocks(product_id):
    return NotImplemented


@shared_task
def update_stocks(product_id):
    return NotImplemented
