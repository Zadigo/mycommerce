from accounts import tasks
from django.contrib.auth import get_user_model
from django.test import override_settings
from accounts.tests.mixins import AuthenticatedTestCase
from faker import Faker


faker_instance = Faker()

@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class TestAccountsTasks(AuthenticatedTestCase):
    # fixtures = ['accounts']

    def test_signup_workflow(self):
        self.user = get_user_model().objects.first()
        data = tasks.signup_workflow.apply((self.user.email,)).get()
        
        self.assertIn('email', data)
        self.assertIn('token', data)

    def test_update_profile(self):
        user = get_user_model().objects.create_user(
            faker_instance.user_name(), 
            'johndoe@gmail.com', 
            password=faker_instance.password(length=10, lower_case=True)
        )
        
        user.first_name = faker_instance.first_name()
        user.last_name = faker_instance.last_name()
        user.save()

        data = tasks.signup_workflow.apply((self.user.email,)).get()
        user.userprofile.stripe_id = data['token']
        user.userprofile.save()
        
        user.userprofile.address_set.create(
            firstname=user.first_name,
            lastname=user.last_name,
            address_line='10 Rue Meurein',
            zip_code=59800,
            city='Lille',
            country='France',
            telephone='+33339490050',
            is_active=True
        )
        data = tasks.update_profile_workflow.apply((user.email,)).get()
        self.assertIn('email', data)

    def test_login_workflow(self):
        pass
