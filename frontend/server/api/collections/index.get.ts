import { useAxiosClient } from "~/composables/django_client"
import { CollectionName } from "~/types"

export default defineCachedEventHandler(async event => {
    const { client } = useAxiosClient('/api/v1/')
    const response = await client.get<CollectionName[]>('/collection')
    return response.data
}, {
    name: 'collections',
    base: 'redis',
    maxAge: 1
})
