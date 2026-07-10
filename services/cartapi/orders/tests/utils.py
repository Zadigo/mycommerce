import factory
from accounts.tests.utils import FakeUser
from faker import Faker
from orders.models import CustomerOrder, Product
from cart.tests.utils import SERIALIZED_CARTITEM

faker = Faker()


class ProductFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    reference = faker.random_int()
    serialized_data = factory.LazyFunction(lambda: SERIALIZED_CARTITEM['items'])
    unit_price = faker.pyfloat(positive=True, max_value=100.0)

    # reference = factory.Faker('random_int')
    # serialized_data = factory.LazyFunction(lambda: {'name': Faker().word()})
    # unit_price = factory.Faker('pyfloat', positive=True, max_value=100.0)


class CustomerOrderFaker(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomerOrder

    reference = faker.random_int()
    stripe_charge = faker.random_int()
    user = factory.SubFactory(FakeUser)
    address = faker.street_address()
    city = faker.city()
    zip_code = faker.postcode()
    country = faker.country_code()
    total = faker.pyfloat(positive=True, max_value=100.0)
    completed = faker.boolean(chance_of_getting_true=50)
    refund_requested = faker.boolean(chance_of_getting_true=10)

    # reference = factory.Faker('ean13')
    # stripe_charge = factory.Faker('ean8')
    # user = factory.SubFactory(FakeUser)
    # address = factory.Faker('street_address')
    # city = factory.Faker('city')
    # zip_code = factory.Faker('postcode')
    # country = factory.Faker('country_code')
    # total = factory.Faker('pyfloat', positive=True, max_value=100.0)
    # completed = factory.Faker('boolean', truth_probability=0.5)
    # refund_requested = factory.Faker('boolean', truth_probability=0.1)
