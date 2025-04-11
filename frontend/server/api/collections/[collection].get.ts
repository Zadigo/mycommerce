import { useServerAxiosClient } from '~/composables/client'
import { ProductsAPIResponse } from '~/types'

export default defineCachedEventHandler(async event => {
    const { collection } = event.context.params
    const name = collection || 'all'
    const query = getQuery(event)

    const access = getCookie(event, 'access')
    const refresh = getCookie(event, 'refresh')

    const { client } = useServerAxiosClient(access, refresh, (token) => {
        setCookie(event, 'access', token)
    })
    
    if (name) {
        const response = await client.get<ProductsAPIResponse>(`/api/v1/collection/${name}`, {
            params: {
                sorted_by: query.sorted_by,
                offset: query.offset,
                price: query.price,
                sizes: query.sizes
            }
        })
        return response.data
    } else {
        return []
    }
}, {
    base: 'fs',
    staleMaxAge: 1,
    maxAge: 1,
    getKey(event) {
        const collectionName = getRouterParam(event, 'collection')
        const query = getQuery(event)
        const tokens = [ collectionName || 'all' ]
        
        if (query.sorted_by) {
            if (typeof query.sorted_by === 'string') {
                tokens.push(query.sorted_by.replace(' ', '-'))
            }
        }

        return `collection-${tokens.join('-').toLowerCase()}`
    }
})
