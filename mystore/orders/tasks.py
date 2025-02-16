from celery import shared_task


@shared_task
def new_order_workflow(order_id, product_ids):
    # 6. Send webhooks as required using N8N or
    # other automated interfaces
    # webhooks = Webhook(request, '/my-path')
    # webhooks.send()

    # 7. Interrogate APIs that will serve to
    # get a delivery ID etc
    return {}


@shared_task
def order_cancelled_workflow(order_id):
    print('order cancelled')
    return {}
