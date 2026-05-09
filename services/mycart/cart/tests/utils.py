from faker import Faker
from factory.django import DjangoModelFactory
from services.mycart.cart.models import Cart
import pydantic

faker = Faker(locale='en_US')


SERIALIZED_CARTITEM = {
    "session_id": "postmanTest1234",
    "items": [
        {
            "size": {
                "name": "M",
                "metric": "cm",
                "active": True,
                "variantPrice": 5,
                "availability": False
            },
            "product": {
                "salePrice": 0,
                "name": "Product Fixture 2",
                "id": "2",
                "price": 10,
                "mainImage": {
                    "createdOn": "2025-01-01",
                    "isMainImage": True,
                    "thumbnail": "/images/group5/img1.jpeg",
                    "variant": "default",
                    "name": "Main Image",
                    "original": "/images/group5/img1.jpeg"
                },
                "unitPrice": 10
            },
            "total": 10,
            "quantity": 1
        },
        {
            "size": {
                "variantPrice": 0,
                "availability": True,
                "active": True,
                "metric": "cm",
                "name": "S"
            },
            "quantity": 1,
            "product": {
                "mainImage": {
                    "original": "/images/group1/img1.jpg",
                    "createdOn": "2025-01-01",
                    "thumbnail": "/images/group1/img1.jpg",
                    "name": "Main Image",
                    "isMainImage": True,
                    "variant": "default"
                },
                "salePrice": 0,
                "id": "1",
                "price": 20,
                "unitPrice": 20,
                "name": "Product Fixture 1"
            },
            "total": 20
        }
    ]
}



class FakeProduct(pydantic.BaseModel):
    id: int
    name: str
    price: float
    salePrice: float
    unitPrice: float
    mainImage: dict


class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Cart

    session_id = faker.uuid4()


def create_items(quantity: int):
    instances = ProductFactory.create_batch(quantity)
    for instance in instances:
        for _ in range(faker.pyint(min_value=1, max_value=10)):
            main_image = {
                'name': faker.word(),
                'variant': faker.word(),
                'original': faker.word(),
                'createdOn': faker.date(),
                'thumbnail': faker.word(),
                'isMainImage': faker.pybool()
            }

            validated_item = FakeProduct(
                id=faker.random_number(),
                name=faker.word(),
                price=faker.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=20.0),
                mainImage=main_image,
                salePrice=faker.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=20.0),
                unitPrice=faker.pyfloat(positive=True, right_digits=2, min_value=1.0, max_value=20.0)
            )

            template = [
                {
                    'size': {
                        'name': 'M',
                        'active': True,
                        'metric': 'cm',
                        'availability': False,
                        'variantPrice': 0
                    },
                    'total': 0,
                    'product': validated_item.model_dump(),
                    'quantity': faker.pyint(min_value=1, max_value=5)
                }
            ]
            
            instance.items = template
        instance.save()
    return instances
    