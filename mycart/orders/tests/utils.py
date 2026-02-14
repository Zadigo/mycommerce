import factory
from accounts.tests.utils import UserFaker
from faker import Faker
from orders.models import CustomerOrder, Product


class ProductFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    reference = factory.Faker('random_int')
    serialized_data = factory.LazyFunction(lambda: {'name': Faker().word()})
    unit_price = factory.Faker('pyfloat', positive=True, max_value=100.0)


class CustomerOrderFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomerOrder

    reference = factory.Faker('ean13')
    stripe_charge = factory.Faker('ean8')
    user = factory.SubFactory(UserFaker)
    address = factory.Faker('street_address')
    city = factory.Faker('city')
    zip_code = factory.Faker('postcode')
    country = factory.Faker('country_code')
    total = factory.Faker('pyfloat', positive=True, max_value=100.0)
    completed = factory.Faker('boolean')
