from celery import shared_task
from django.conf import settings
from django.template.context import Context
from django.template.loader import render_to_string
from django.utils import timezone

from mystore.stocks.models import Stock, StockAlert


@shared_task
def check_stocks():
    qs = Stock.objects.filter(quantity__lte=10)
    for item in qs:
        # Send an automation to N8N to alert
        # that certain products are no in stock
        continue


@shared_task
def remove_alerts(ids):
    qs = StockAlert.objects.filter(id__in=ids)
    for item in qs:
        if item.alert_sent:
            item.delete()
    return list(qs.values_list('id', flat=True))


@shared_task
def alert_users():
    qs = StockAlert.objects.filter(alert_sent=False)

    subject = 'Product is available'
    default_email = getattr(settings, 'DEFAULT_FROM_EMAIL')

    for item in qs:
        context = Context()
        context.push(**{
            'email': item.user.email,
            'firstname': '',
            'lastname': '',
            'current_date': timezone.now(),
            'variant': item.variant
        })
        text = ''
        html = render_to_string('product_available.html', context=context)

        if item.variant.active and item.variant.availability:
            item.user.email_user(
                subject, text, default_email, html_message=html)
    return list(qs.values_list('id', flat=True))
