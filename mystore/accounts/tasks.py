import stripe
import requests
from celery import shared_task
from celery.utils.log import get_task_logger
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

logger = get_task_logger(__name__)


@shared_task
def login_workflow():
    # 1. Email user for login made or failed
    return {}


@shared_task
def update_profile(email):
    """Function used to sync the modifications of the
    user profile locally into Stripe when the user
    updates his user proflie"""
    user = get_user_model().objects.get(email=email)

    params = {
        'id': user.userprofile.stripe_id,
        'email': user.email,
        'name': f'{user.first_name} {user.last_name}',
        'phone': f'{user.userprofile.telephone}'
    }

    instance = user.address_set.filter(is_active=True)
    if instance.exits():
        address = instance.get()
        params['address'] = {
            'line1': address.address_line,
            'zip_code': address.post_code,
            'city': address.city
        }
    result = stripe.Customer.modify(**params)
    return {'email': user.email}


@shared_task
def signup_workflow(email: str):
    try:
        user = get_user_model().objects.get(email=email)
    except ObjectDoesNotExist:
        logger.error(
            f"User with email {email} does "
            "not exist for signup workflow"
        )
        return {'error': 'User does not exist'}

    try:
        result = stripe.Customer.create(
            email=user.email,
            name=f'{user.first_name} {user.last_name}'
        )
    except stripe.error.StripeError as e:
        logger.error(
            f"Stripe error during customer creation for {email}: {str(e)}")
        return {'error': str(e)}

    user.userprofile.stripe_id = result.id
    user.userprofile.save()

    return {'email': email, 'token': user.userprofile.stripe_id}


# @shared_task
# def signup_cart_api(email: str, password: str):
#     try:
#         credentials = {'email': email, 'password': password}
#         headers = {'content-type': 'application/json'}
#         response = requests.post(
#             settings.CART_API_URL, data=credentials, headers=headers)
#     except:
#         pass
#     else:
#         if response.ok:
#             return response.json()
#         return False


@shared_task
def signup_reviews_api(credentials_response: dict | bool, email: str, password: str):
    try:
        credentials = {'email': email, 'password': password}
        headers = {'content-type': 'application/json'}
        response = requests.post(
            settings.REVIEWS_API_URL, data=credentials, headers=headers)
    except:
        pass
    else:
        if response.ok:
            data = response.json()
            return {'cart': credentials_response, 'reviews': data}
        return False


@shared_task
def schedule_delete_accounts():
    """Task that iterates over accounts that are scheduled
    to be deleted every day on the given day"""
    qs = get_user_model().objects.filter(active=False)
    if qs.exists():
        params = {
            'from_email': '',
            'html_content': None
        }

        ids = list(qs.values_list('id', flat=True))
        for user in qs:
            # 1. Email the user that his account
            # has been deleted
            user.email_user('Account deleted', '', **params)
            user.delete()
        return ids
