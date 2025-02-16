import { useAxiosClient } from '../../../composables/utils'
import type { ProductsAPIResponse } from '../../../types'

export default defineEventHandler(async (event) => {
    try {
        const { collection } = event.context.params
        const name = collection || 'all'
        const { createClient } = useAxiosClient()
        const client = createClient()

        if (name) {
            const response = await client.get<ProductsAPIResponse>(`/collection/${name}`)
            return response.data
        } else {
            throw createError({
                statusCode: 404,
                message: 'Collection does not exist'
            })
        }
    } catch (e) {
        return {
            error: e
        }
    }
})
