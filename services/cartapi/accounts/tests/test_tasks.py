from collections import namedtuple
from unittest.mock import Mock, patch

import pytest

from accounts import django_tasks

django_tasks.huey_task.immediate = True  # Set immediate to True for testing

@pytest.mark.django_db
def test_update_stripe_customer_task(new_user, new_address):
    with patch('accounts.django_tasks.stripe') as mstripe:
        mstripe.return_value.Customer = Mock(modify=Mock())
        result = django_tasks.update_stripe_customer(email=new_user.email)
        result.get()


@pytest.mark.django_db
def test_create_stripe_customer(new_user, new_address):
    with patch('accounts.django_tasks.stripe') as mstripe:
        mstripe.Customer = Mock(
            create=Mock(return_value=namedtuple('Customer', ['id'])(id='cus_test123'))
        )
        result = django_tasks.create_stripe_customer(email=new_user.email)
        result.get()

