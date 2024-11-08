from celery import shared_task


@shared_task
def login_workflow():
    return NotImplemented


@shared_task
def signup_workflow():
    return NotImplemented
