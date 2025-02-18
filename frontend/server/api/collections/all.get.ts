import { useAxiosClient } from "~/composables/django_client"
import { CollectionName } from "~/types"

export default defineEventHandler(async event => {
    const { client } = useAxiosClient('/api/v1/')
    const response = await client.get<CollectionName[]>('/collection')
    return response.data
})
