
import factory
from accounts.models import Address
from django.contrib.auth import get_user_model


class UserFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Faker('email')
    username = factory.Faker('user_name')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True


class UserProfileFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    user = factory.SubFactory(UserFaker)
    stripe_id = factory.Faker('ean13')
    source_id = factory.Faker('ean8')
    telephone = factory.Faker('phone_number')


class AddressFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = Address

    user_profile = factory.SubFactory(UserProfileFaker)
    firstname = factory.Faker('firstname')
    lastname = factory.Faker('lastname')
    address_line = factory.Faker('street_address')
    address_line_two = factory.Faker('secondary_address')
    zip_code = factory.Faker('postcode')
    country = factory.Faker('country_code')
    city = factory.Faker('city')
    telephone = factory.Faker('phone')
    gender = factory.Faker('random_int', min=0, max=1)
    is_active = True
