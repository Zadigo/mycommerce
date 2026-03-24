
import factory
import faker
import faker.providers
from shop.models import Product

dynamic_names = faker.providers.DynamicProvider('names', elements=[
    'Mini-jupe à paillettes',
    'Jupe midi rustique',
    'Minijupe à volants',
    'Minijupe à volants',
    'Jupe midi à entre-deux',
    'Minijupe taille croisée',
    'Minijupe taille croisée',
    'Minijupe en dentelle volants '
])

NAMES =  [
    'Mini-jupe à paillettes',
    'Jupe midi rustique',
    'Minijupe à volants',
    'Minijupe à volants',
    'Jupe midi à entre-deux',
    'Minijupe taille croisée',
    'Minijupe taille croisée',
    'Minijupe en dentelle volants '
]

# f = factory.Faker()
# f.add_provider(dynamic_names)

faker = faker.Faker()


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = faker.random_element(NAMES)
    color = faker.color_name()
    sku = faker.random_number(digits=5, fix_len=True)

    unit_price = faker.pyfloat(
        left_digits=2,
        right_digits=2,
        positive=True
    )
    on_sale = faker.boolean(
        chance_of_getting_true=30
    )
    display_new = faker.boolean(
        chance_of_getting_true=50
    )
    active = faker.boolean(
        chance_of_getting_true=90
    )
