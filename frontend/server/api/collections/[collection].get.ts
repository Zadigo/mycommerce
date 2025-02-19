import { useAxiosClient } from "~/composables/django_client"
import { ProductsAPIResponse } from "~/types"

export default defineCachedEventHandler(async event => {
    const { collection } = event.context.params
    const name = collection || 'all'
    const { client } = useAxiosClient()

    if (name) {
        const response = await client.get<ProductsAPIResponse>(`/collection/${name}`)
        return response.data
    } else {
        return []
    }
}, {
    maxAge: 1,
    getKey(event) {
        const collectionName = getRouterParam(event, 'collection')
        const query = getQuery(event) 

        return `collection-${collectionName || 'all'}`
    }
})
