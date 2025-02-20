import { useAxiosClient } from "~/composables/django_client"
import { Product } from "~/types"

export default defineCachedEventHandler(async event => {
    const id = getRouterParam(event, 'id')
    const { client } = useAxiosClient()
    const response = await client.get<Product[]>(`/shop/products/${id}`)
    return response.data
}, {
    maxAge: 1,
    base: 'redis',
    getKey(event) {
        const id = getRouterParam(event, 'id')
        return `product-${id}`
    }
})
