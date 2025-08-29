import stripe
from celery import shared_task
from celery.utils.log import get_logger
from django.conf import settings
from django.template.loader import render_to_string
from orders.models import CustomerOrder

logger = get_logger('orders')


@shared_task
def create_order(order_id, product_ids):
    instance = CustomerOrder.objects.get(reference=order_id)
    # 6. Send webhooks as required using N8N or
    # other automated interfaces
    # webhooks = Webhook(request, '/my-path')
    # webhooks.send()

    # 7. Interrogate APIs that will serve to
    # get a delivery ID etc

    params = {
        'from_email': settings.DEFAULT_FROM_EMAIL,
        'html_content': render_to_string('test.html')
    }
    instance.user.email_user('Order received', '', **params)
    return {'order_id': order_id}


@shared_task
def cancel_order(order_id):
    """Used when an order was paid for and user requests
    for the order to be cancelled within a 5 minutes timeframe"""
    return {}


@shared_task
def refund_request(order_id, reason=None):
    """Case where an order has been fully executed and the
    customer asks for refund"""
    instance = CustomerOrder.objects.get(reference=order_id)

    try:
        response = stripe.Refund.create(
            charge=instance.stripe_charge,
            reason=reason,
            metadata={}
        )
    except stripe.StripeError as e:
        logger.error(e.args)
    except Exception as e:
        logger.error(e.args)
    else:
        params = {
            'from_email': settings.DEFAULT_FROM_EMAIL,
            'html_content': render_to_string('test.html')
        }

        instance.user.email_user('Refund', '', **params)
        return {'order_id': order_id, 'id': response.id}
