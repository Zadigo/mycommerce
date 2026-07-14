import { toValue } from 'vue'
import { Product } from '~/types/graphql'
import { useGenerateProducts } from '~~/layers/base/app/utils/__fixtures__/products'

export default defineEventHandler(async(event): Promise<Product> => {
  const id = getRouterParam(event, 'id')

  const data = await $fetch<Product>('/graphql/', {
    method: 'POST',
    baseURL: useRuntimeConfig().public.prodDomain,
    body: {
      query: `
        query($id: ID!) {
          product(id: $id) {
            id
            name
          }
        }
      `,
      variables: {
        id
      }
    }
  })

  console.log('$fetch', data)

  const result = await useGenerateProducts(1)
  return toValue(result).data.allProducts.edges.at(0)
})
