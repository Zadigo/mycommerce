import { useServerAxiosClient } from "~/composables/client"
import { CollectionName } from "~/types"

export default defineCachedEventHandler(async event => {
    const access = getCookie(event, 'access')
    const refresh = getCookie(event, 'refresh')

    const { client } = useServerAxiosClient(access, refresh, (token) => {
        setCookie(event, 'access', token)
    })
    
    const response = await client.get<CollectionName[]>('/api/v1/collection')
    
    return response.data
}, {
    name: 'collections',
    base: 'fs',
    maxAge: 1
})
