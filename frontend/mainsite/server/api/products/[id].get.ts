import { useGenerateProducts } from '~~/layers/base/app/utils/__fixtures__/products'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const data = await $fetch('/v1/graphql/', {
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
  return result.value.data.allProducts.edges.at(0)
})
