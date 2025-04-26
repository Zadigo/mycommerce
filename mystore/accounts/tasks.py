import stripe
from celery import shared_task
from celery.utils.log import get_task_logger
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

logger = get_task_logger(__name__)


@shared_task
def login_workflow():
    # 1. Email user for login made or failed
    return {}


@shared_task
def update_profile(email):
    try:
        user = get_user_model().objects.get(email=email)
    except ObjectDoesNotExist:
        logger.error('Signup workflow: User matching query does not exist')
        return {}
    else:
        params = {
            'id': user.userprofile.stripe_id,
            'email': user.email,
            'name': f'{user.first_name} {user.last_name}',
            'phone': f'{user.userprofile.telephone}'
        }

        # instance = user.address_set.filter(is_active=True)
        # if instance.exits():
        #     address = instance.get()
        #     params['address'] = {
        #         'line1': address.address_line,
        #         'zip_code': address.post_code,
        #         'city': address.city
        #     }

        result = stripe.Customer.modify(**params)
        # print(vars(result))
        return {'email': user.email}


@shared_task
def signup_workflow(email):
    try:
        user = get_user_model().objects.get(email=email)
    except ObjectDoesNotExist:
        logger.error('Signup workflow: User matching query does not exist')
        return {}
    else:
        result = stripe.Customer.create(
            email=user.email,
            name=f'{user.first_name} {user.last_name}'
        )

        user.userprofile.stripe_id = result.id
        user.userprofile.save()
        return {'email': email, 'token': user.userprofile.stripe_id}
