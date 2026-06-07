export type GraphQLQuery = {
  query: string
  variables?: Record<string, unknown>
}

export const productsQuery = {
  query: `
    query GetProducts($page: Int, $perPage: Int) {
      products(page: $page, perPage: $perPage) {
        id
        name
        price
        imageUrl
      }
    }
  `,
  variables: {
    page: 1,
    perPage: 10,
  }
}

export const productQuery = {
  query: `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        name
        price
        description
        imageUrl
      }
    }
  `,
  variables: {
    id: '1',
  }
}

export const searchProductsQuery = {
  query: `
    query SearchProducts($query: String!) {
      searchProducts(query: $query) {
        id
        name
        price
        imageUrl
      }
    }
  `,
  variables: {
    query: 'shirt',
  }
}
