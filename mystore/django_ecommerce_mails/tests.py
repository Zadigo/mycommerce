from django.test import TestCase, override_settings
from django_ecommerce_mails import tasks
from django.contrib.auth import get_user_model

new_settings = {
    'CELERY_TASK_ALWAYS_EAGER': True,
    'CELERY_TASK_EAGER_PROPAGATES': True
}


@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
class TestSendEmails(TestCase):
    fixtures = ['users']

    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.first()
        cls.user.set_password('touparet')
        cls.user.save()

    def test_send_email(self):
        t1 = tasks.send_email_confirmation.apply(args=[self.user.email])
        result = t1.get()
