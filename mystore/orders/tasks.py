from celery import shared_task


@shared_task
def send_email_confirmation(email):
    return {}


@shared_task
def send_order_cancelled_email(email):
    return {}


@shared_task
def new_order_workflow(order_id):
    return {}


@shared_task
def order_cancelled_workflow(order_id):
    print('order cancelled')
    return {}
