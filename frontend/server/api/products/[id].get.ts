import { useServerAxiosClient } from "~/composables/client"
import { Product } from "~/types"

export default defineCachedEventHandler(async event => {
    const id = getRouterParam(event, 'id')

    const access = getCookie(event, 'access')
    const refresh = getCookie(event, 'refresh')

    const { client } = useServerAxiosClient(access, refresh, (token) => {
        setCookie(event, 'access', token)
    })

    const response = await client.get<Product[]>(`/api/v1/shop/products/${id}`)

    return response.data
}, {
    maxAge: 1,
    base: 'fs',
    getKey(event) {
        const id = getRouterParam(event, 'id')
        return `product-${id}`
    }
})
