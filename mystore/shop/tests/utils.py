
import factory
import faker
import faker.generator
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

fake_product_names = faker.Faker()

fake_product_names.add_provider(dynamic_names)


class ProductFactory(factory.django.DjangoModelFactory):
    # sale_value = factory.Transformer(0, transform=0)

    class Meta:
        model = Product

    name = fake_product_names.names()
    color = factory.Faker('color_name')
    sku = factory.Faker('ean13')

    unit_price = factory.Faker(
        'pyfloat',
        left_digits=2,
        right_digits=2,
        positive=True
    )
    on_sale = factory.Faker(
        'boolean',
        chance_of_getting_true=30
    )
    display_new = factory.Faker(
        'boolean',
        chance_of_getting_true=50
    )
    active = factory.Faker(
        'boolean',
        chance_of_getting_true=90
    )
