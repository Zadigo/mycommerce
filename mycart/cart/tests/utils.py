from faker import Faker
from factory.django import DjangoModelFactory
from cart.models import Cart
import pydantic

faker = Faker(locale='en_US')


class FakeProduct(pydantic.BaseModel):
    id: str = faker.uuid4()
    name: str = faker.word()
    price: float = faker.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=20.0)
    mainImage: dict = {
        'name': faker.word(),
        'variant': faker.word(),
        'original': faker.word(),
        'createdOn': faker.date(),
        'thumbnail': faker.word(),
        'isMainImage': faker.pybool()
    }
    salePrice: float = faker.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=20.0)
    unitPrice: float = faker.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=20.0)
    quantity: int = faker.pyint(min_value=1, max_value=5)

class FakeProductItems(DjangoModelFactory):
    class Meta:
        model = Cart

    session_id = faker.uuid4()


def create_items(quantity: int):
    instances = FakeProductItems.batch_create(quantity)
    for instance in instances:
        for _ in range(faker.pyint(min=1, max=10)):
            instance.items = FakeProduct.dump_json()
        instance.save()
    return instances
    

# def create_items(quantity: int):
#     item = {
#         'size': {
#             'name': fake.pystr(max_chars=10),
#             'active': True,
#             'metric': 'cm',
#             'availability': True,
#             'variantPrice': 0.0
#         },
#         'total': 0.0, # This is initially calculated with Nuxt. We recalculate it with Django
#         'product': {
#             'id': fake.pyint(min_value=1, max_value=quantity),
#             'name': fake.pystr(max_chars=10),
#             'price': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0),
#             'mainImage': {
#                 'name': fake.pystr(max_chars=10),
#                 'variant': fake.pystr(max_chars=10),
#                 'original': fake.pystr(max_chars=10),
#                 'createdOn': fake.date(),
#                 'thumbnail': fake.pystr(max_chars=10),
#                 'isMainImage': fake.pybool()
#             },
#             'salePrice': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0),
#             'unitPrice': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0)
#         },
#         'quantity': fake.pyint(min_value=1, max_value=2)
#     }

#     for _ in range(quantity):
#         yield item
