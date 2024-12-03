import stripe
from celery import shared_task


@shared_task
def login_workflow():
    # 1. Email user for login made or failed
    return NotImplemented


@shared_task
def signup_workflow():
    # 1. Create stripe customer
    return NotImplemented
