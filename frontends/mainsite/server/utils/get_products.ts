import type { H3Event } from 'h3'
import { Product } from '~/types/graphql/products'
import { createErrorTemplate } from '~/utils'

type ProductQueryParams = {
  name: string
  offset: number
}

export const getProductsCached = defineCachedFunction(async (event: H3Event) => {
  try {
    const query = getQuery<Partial<ProductQueryParams>>(event)
    const data = await $fetch<Product>('/graphql/', {
      method: 'POST',
      body: {
        query: `
          query($name: String!, $offset: Int!) {
            searchProducts(name: $name, first: $offset) {
              edges {
                node {
                  id
                  name
                  slug
                  price
                  salePrice
                  unitPrice
                  displayNew
                  mainImage {
                    id
                    name
                    original
                    thumbnail
                    isMainImage
                    variant
                    createdOn
                  }
                  productImages {
                    id
                    name
                    original
                    thumbnail
                  }
                }
              }
            }
          }`,
        variables: {
          name: query.name,
          offset: query.offset || 20
        }
      }
    })
    return data
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
}, {
  name: 'products',
  maxAge: 60 * 60 * 24, // Cache for 1 day
  staleMaxAge: 60 * 60, // Stale for 1 hour
  getKey(event) {
    const query = getQuery<Partial<ProductQueryParams>>(event)
    return `searchProducts:${query.name || ''}:${query.offset || 20}`
  },
})
