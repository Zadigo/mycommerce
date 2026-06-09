import os

from celery import Celery
from celery.schedules import crontab

# Windows: celery -A shopapi.celery_app worker -E --pool=solo
# Windows - Beat: celery -A shopapi.celery_app beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
# Windows - Flower: celery -A shopapi.celery_app flower

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopapi.settings')


def get_broker():
    from django.conf import settings
    return getattr(settings, 'CELERY_BROKER_URL')


def get_backend():
    from django.conf import settings
    return getattr(settings, 'CELERY_RESULT_BACKEND')


app = Celery(
    'shopapi',
    broker=get_broker(),
    backend=get_backend(),
    logger='celery_app.log'
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/London',
    enable_utc=True,
    # task_routes={
    #     'emailing_script.tasks.testing': {
    #         'queue': 'seo'
    #     }
    # }
)

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check-orders': {
        'task': 'check_orders',
        'schedule': crontab(day_of_week='mon-fri', hour=6)
    }
}
