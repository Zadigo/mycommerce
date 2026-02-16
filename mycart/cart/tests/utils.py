
from faker import Faker

fake = Faker(locale='en_US')


def create_items(quantity: int):
    item = {
        'size': {
            'name': fake.pystr(max_chars=10),
            'active': True,
            'metric': 'cm',
            'availability': True,
            'variantPrice': 0.0
        },
        'total': 0.0, # This is initially calculated with Nuxt. We recalculate it with Django
        'product': {
            'id': fake.pyint(min_value=1, max_value=quantity),
            'name': fake.pystr(max_chars=10),
            'price': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0),
            'mainImage': {
                'name': fake.pystr(max_chars=10),
                'variant': fake.pystr(max_chars=10),
                'original': fake.pystr(max_chars=10),
                'createdOn': fake.date(),
                'thumbnail': fake.pystr(max_chars=10),
                'isMainImage': fake.pybool()
            },
            'salePrice': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0),
            'unitPrice': fake.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=10.0)
        },
        'quantity': fake.pyint(min_value=1, max_value=2)
    }

    for _ in range(quantity):
        yield item
