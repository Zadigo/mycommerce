import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myemailing.settings')


def get_broker():
    from django.conf import settings
    return getattr(settings, 'CELERY_BROKER_URL')


def get_backend():
    from django.conf import settings
    return getattr(settings, 'CELERY_RESULT_BACKEND')


app = Celery(
    'emailing',
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

# app.conf.beat_schedule = {
#     'query-sequences': {
#         'task': 'query_sequences',
#         'schedule': crontab(minute=1)
#     }
# }


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
