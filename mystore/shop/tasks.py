from celery import shared_task


@shared_task
def get_recommendations():
    return NotImplemented
