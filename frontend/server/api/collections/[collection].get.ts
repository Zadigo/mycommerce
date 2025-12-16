// import { FetchError } from 'ofetch'
// import { refreshAccessToken } from '~/utils'
// import { productApiResponseFixture } from '~/data/__fixtures__'

// import type { H3EventContext } from 'h3'
// import type { ProductsApiResponse, CollectionFetchOptions } from '~/types'

// interface EventContextParams extends H3EventContext {
//   collection: string
// }

// export default defineCachedEventHandler(async event => {
//   const { collection } = event.context.params as EventContextParams

//   const name = collection || 'all'
//   const query = getQuery<CollectionFetchOptions>(event)

//   const access = getCookie(event, 'access')
//   const refresh = getCookie(event, 'refresh')
  
  
//   try {
//     // return productApiResponseFixture
//     // console.log('[collection].get.ts', query.price)
//     const data = await $fetch<ProductsApiResponse>(`/api/v1/collection/${name}`, {
//       baseURL: useRuntimeConfig().public.prodDomain,
//       method: 'GET',
//       params: {
//         sorted_by: query.sorted_by,
//         offset: query.offset,
//         price: query.price,
//         sizes: query.sizes
//       } as CollectionFetchOptions,
//       headers: [
//         ['Authorization', access ? `Token ${access}` : '']
//       ]
//     })
//     return data
//   } catch (e) {
//     if (e instanceof FetchError) {
//       if (e.status === 401 && refresh) {
//         const { access } = await refreshAccessToken(refresh)
//         setCookie(event, 'access', access)
//       } else {
//         throw createError({
//           statusCode: e.status || 500,
//           message: e.message
//         })
//       }
//     }
//   }
// }, {
//   base: 'redis',
//   maxAge: 0, // disable cache for now
//   getKey(event) {
//     const collectionName = getRouterParam(event, 'collection')
//     const query = getQuery<{ offset: string }>(event)
//     const tokens = [collectionName || 'all', query.offset]

//     return `collection-${tokens.join('-').toLowerCase()}`
//   }
// })

import { generateProducts } from '~/data/__fixtures__/products/utils'

export default defineCachedEventHandler(_event => {
  return generateProducts(10)
}, {
  base: 'redis',
  maxAge: 0, // disable cache for now,
  getKey(event) {
    const collectionName = getRouterParam(event, 'collection')
    return `collection-${collectionName || 'all'}`  
  }
})
