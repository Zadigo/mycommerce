// import { FetchError } from 'ofetch'
// import { refreshAccessToken } from '~/utils'
// import { productFixture } from '~/data/__fixtures__/products'


// import type { Product } from '~/types'

// export default defineCachedEventHandler(async event => {
//   const id = getRouterParam(event, 'id')
  
//   const access = getCookie(event, 'access')
//   const refresh = getCookie(event, 'refresh')
  
//   try {
//     // return productFixture
    
//     const response = await $fetch<Product[]>(`/api/v1/shop/products/${id}`, {
//       baseURL: useRuntimeConfig().public.prodDomain,
//       method: 'GET',
//       headers: [
//         ['Authorization', access ? `Token ${access}` : '']
//       ]
//     })

//     return response
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
//     const id = getRouterParam(event, 'id')
//     return `product-${id}`
//   }
// })

import { generateProducts } from '~/data/__fixtures__/products/utils'

export default defineCachedEventHandler(_event => {
  return generateProducts(1).at(0)
}, {
  base: 'redis',
  maxAge: 0, // disable cache for now
  getKey(event) {
    const id = getRouterParam(event, 'id')
    return `product-${id}`
  }
})
