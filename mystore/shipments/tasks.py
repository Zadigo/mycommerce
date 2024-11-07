from celery import shared_task


@shared_task
def request_shipment(order_id):
    return NotImplemented
