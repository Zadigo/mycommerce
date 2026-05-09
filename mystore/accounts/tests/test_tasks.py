from mystore.accounts import tasks
from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITestCase


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class TestAccountsTasks(APITestCase):
    fixtures = ['accounts']

    def test_signup_workflow_task(self):
        self.user = get_user_model().objects.first()
        data = tasks.signup_workflow.apply((self.user.email,)).get()
        print(data)

    def tet_update_profile(self):
        pass

    def test_signup_workflow(self):
        pass

    def test_login_workflow(self):
        pass
