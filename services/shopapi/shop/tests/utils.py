import random

import factory
import faker
import faker.providers
from factory import LazyAttribute, LazyFunction

from shop.models import Product

dynamic_names = faker.providers.DynamicProvider('names', elements=[
    'Mini-jupe à paillettes',
    'Jupe midi rustique',
    'Minijupe à volants',
    'Jupe midi à entre-deux',
    'Minijupe taille croisée',
    'Minijupe en dentelle volants'
])

NAMES =  [
    'Mini-jupe à paillettes',
    'Jupe midi rustique',
    'Minijupe à volants',
    'Jupe midi à entre-deux',
    'Minijupe taille croisée',
    'Minijupe en dentelle volants'
]

faker = faker.Faker()


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product
        django_get_or_create = ('sku', 'name', 'color')

    name = LazyAttribute(lambda _: random.choice(NAMES))
    color = LazyAttribute(lambda _: faker.color_name())
    sku = factory.Sequence(lambda n: 1000000000 + n)
    unit_price = LazyFunction(lambda: round(random.uniform(10.0, 100.0), 2))
    on_sale = LazyAttribute(lambda _: faker.boolean(chance_of_getting_true=30))
    display_new = LazyAttribute(lambda _: faker.boolean(chance_of_getting_true=50))
    active = LazyAttribute(lambda _: faker.boolean(chance_of_getting_true=90))
