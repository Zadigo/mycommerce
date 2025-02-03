from celery import shared_task


@shared_task
def shipment_workflow(order_id):
    """Task that sends different API requests
    to the external modules used for shipping
    a particular given product"""
