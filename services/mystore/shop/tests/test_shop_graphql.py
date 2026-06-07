import json
from graphene_django.utils.testing import GraphQLTestCase
from shop.tests.utils import ProductFactory
from shop.models import Product
from graphene_django.settings import graphene_settings
from django.test import override_settings


class TestGraphQl(GraphQLTestCase):
    def setUp(self):
        self.products: list[Product] = ProductFactory.create_batch(1)
        self.product = self.products[0]
        self.product_id: str = None

    def _get_products(self):
        response = self.query(
            '''
            query {
                allProducts {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
            '''
        )

        self.assertNotIn(
            'Not Found',
            response.content.decode(),
            response.content
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)
        return content

    def test_get_all_products(self):
        content = self._get_products()

        nodes = content['data']['allProducts']['edges']
        self.assertEqual(len(nodes), 1)

        for item in nodes:
            with self.subTest(item=item):
                node = item['node']

    def test_get_product(self):
        content = self._get_products()
        node = content['data']['allProducts']['edges'][0]['node']

        response = self.query(
            '''
            query($id: ID!) {
                product(id: $id) {
                    id
                    name
                }
            }
            ''',
            variables={'id': node['id']}
        )

        content = json.loads(response.content)
        self.assertResponseNoErrors(response)

    # def test_search_products(self):
    #     content = self._get_products()
    #     node = content['data']['allProducts']['edges'][0]['node']

    #     response = self.query(
    #         '''
    #         query($minPrice: Int!) {
    #             searchProducts(minPrice: $minPrice) {
    #                 id
    #                 name
    #             }
    #         }
    #         ''',
    #         variables={'minPrice': 1}
    #     )

    #     content = json.loads(response.content)
    #     self.assertResponseNoErrors(response)
