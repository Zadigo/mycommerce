import { useAxiosClient } from "~/composables/client"

export default defineEventHandler(async event => {
    try {
        const { client } = useAxiosClient('/api/v1/')
        const response = await client.post<{ token: string }>('/cart/session-id')
        return response.data
    } catch (e) {
        throw createError('Could not get session ID')
    }
})
