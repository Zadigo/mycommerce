import { useAxiosClient } from "~/composables/django_client"
import { ProductsAPIResponse } from "~/types"


export default defineCachedEventHandler(async event => {
    const { collection } = event.context.params
    const name = collection || 'all'
    const { client } = useAxiosClient()
    const query = getQuery(event)
    
    if (name) {
        const response = await client.get<ProductsAPIResponse>(`/collection/${name}`, {
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
