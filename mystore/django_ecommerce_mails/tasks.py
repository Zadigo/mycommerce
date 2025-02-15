from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@shared_task
def send_email(subject, email, template, context={}):
    user = get_user_model().objects.get(email=email)

    html_message = render_to_string(template, {
        'user': user,
        **context
    })

    # Strip the HTML tags for the plain text version
    plain_message = strip_tags(html_message)
    instance = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        to=[user.email]
    )

    instance.attach_alternative(html_message, 'text/html')
    instance.send()

    return {'email': user.email}


@shared_task
def send_email_confirmation(email):
    # result = send_email.apply_async(
    #     (
    #         'Welcome to Our Service',
    #         email,
    #         'shipment_tracking_number.html',
    #         {
    #             'tracking_number': 123
    #         }
    #     ),
    #     countdown=10
    # )
    # return result.get()

    user = get_user_model().objects.get(email=email)

    subject = 'Welcome to Our Service'
    html_message = render_to_string('shipment_tracking_number.html', {
        'user': user
    })

    # Strip the HTML tags for the plain text version
    plain_message = strip_tags(html_message)
    instance = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        to=[user.email]
    )

    instance.attach_alternative(html_message, 'text/html')
    instance.send()

    return {'email': user.email}


@shared_task
def send_order_cancelled_email(email):
    return {}


@shared_task
def send_tracking_number_email(email):
    return {}
