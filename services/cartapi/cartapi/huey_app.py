import logging

import huey
from django.db.models import BooleanField, ExpressionWrapper, F
from django.utils import timezone

logger = logging.getLogger(__name__)

# huey_consumer cartapi.huey_app.huey_task -w 4

huey_task = huey.RedisHuey('cartapi')

@huey_task.signal
def simple_signal(*args, **kwargs):
    logger.info(f'Some signal was sent! Args: {args}, Kwargs: {kwargs}')


@huey_task.periodic_task(huey.crontab(day_of_week=1, hour='8', minute='0'))
def check_staleness():
    """A periodic task that checks for stale carts 
    and updates their is_stale field accordingly."""
    from cart import models

    qs = models.Cart.objects.filter(is_active=True, is_stale=False)
    for cart in qs:
        cart.is_stale = ExpressionWrapper(
            F('updated_at') < timezone.now() - timezone.timedelta(days=30),
            output_field=BooleanField()
        )
        cart.save()
    logger.info(f"Checked staleness for {qs.count()} carts at {timezone.now()}")
