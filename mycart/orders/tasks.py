import stripe
from celery import shared_task
from celery.utils.log import get_logger
from django.utils.crypto import get_random_string
from django.conf import settings
from django.template.loader import render_to_string
from orders.models import CustomerOrder
from django.contrib.auth import get_user_model
from cart.models import Product

logger = get_logger('orders')


@shared_task
def create_order(charge, user_id, cart_amount):
    user = get_user_model().objects.get(id=user_id)
    billing_address = user.userprofile.address_set.get(
        is_active=True
    )

    attrs = {
        'reference': get_random_string(12),
        'stripe_charge': charge,
        'user': user,
        'address': billing_address.address_line,
        'city': billing_address.city,
        'zip_code': billing_address.zip_code
    }
    customer_order = CustomerOrder.objects.create(**attrs)
    customer_order.total = cart_amount
    customer_order.save()

    return customer_order.id

    # # 6. Send webhooks as required using N8N or
    # # other automated interfaces
    # # webhooks = Webhook(request, '/my-path')
    # # webhooks.send()

    # instance = CustomerOrder.objects.get(reference=order_id)

    # # 7. Interrogate APIs that will serve to
    # # get a delivery ID etc

    # params = {
    #     'from_email': settings.DEFAULT_FROM_EMAIL,
    #     'html_content': render_to_string('test.html')
    # }
    # instance.user.email_user('Order received', '', **params)
    # return {'order_id': order_id}


@shared_task
def create_products(order_id, products, serialized_product):
    """Create product instances for a given order. The products
    are the items received as per serialized by the store"""
    instance = CustomerOrder.objects.get(reference=order_id)

    for product in products:
        instance.products.create(serialized_data=product)
    return {'order_id': order_id, 'product_ids': [p.id for p in products]}


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
