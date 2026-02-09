
from graphene_django.utils.testing import GraphQLTestCase
from shop.models import Product
from shop.tests.utils import ProductFactory


class TestGraphQl(GraphQLTestCase):
    def setUp(self):
        self.products = ProductFactory.build_batch(size=100)

    def test_some_query(self):
        print(Product.objects.all())
        response = self.query(
            '''
            query {
                allProducts {
                    id
                    name
                }
            }
            '''
        )

        print(response.content)

        # content = json.loads(response.content)

        # # This validates the status code and if you get errors
        # self.assertResponseNoErrors(response)

        # print(content)
