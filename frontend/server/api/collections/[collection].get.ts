import { FetchError } from 'ofetch'
import { refreshAccessToken } from '~/utils'

import type { H3EventContext } from 'h3'
import type { ProductsAPIResponse } from '~/types'

interface EventContextParams extends H3EventContext {
  collection: string
}

export default defineCachedEventHandler(async event => {
  const { collection } = event.context.params as EventContextParams

  const name = collection || 'all'
  const query = getQuery(event)

  const access = getCookie(event, 'access')
  const refresh = getCookie(event, 'refresh')

  
  try {
    console.log('[collection].get.ts', query.price)
    const data = await $fetch<ProductsAPIResponse>(`/api/v1/collection/${name}`, {
      baseURL: useRuntimeConfig().public.prodDomain,
      method: 'GET',
      params: {
        sorted_by: query.sorted_by,
        offset: query.offset,
        price: query.price,
        sizes: query.sizes
      },
      headers: [
        ['Authorization', access ? `Token ${access}` : '']
      ]
    })
    return data
  } catch (e) {
    if (e instanceof FetchError) {
      if (e.status === 401 && refresh) {
        const { access } = await refreshAccessToken(refresh)
        setCookie(event, 'access', access)
      } else {
        throw createError({
          statusCode: e.status || 500,
          message: e.message
        })
      }
    }
  }
}, {
  base: 'redis',
  maxAge: 15*60,
  getKey(event) {
    const collectionName = getRouterParam(event, 'collection')
    const query = getQuery(event)
    const tokens = [collectionName || 'all', query.offset]

    return `collection-${tokens.join('-').toLowerCase()}`
  }
})
