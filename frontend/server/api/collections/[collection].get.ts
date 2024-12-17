// import { useNuxtApp } from "nuxt/app"
import { useAxiosClient } from '../../../composables/utils'
import type { ProductsAPIResponse } from '../../../types'

// defineCachedEventHandler
export default defineEventHandler(async (event) => {
    const { createClient } = useAxiosClient()
    const client = createClient()
    const { collection } = event.context.params

    const testCollection = collection || 'all'

    try {
        if (testCollection) {
            const response = await client.get<ProductsAPIResponse>(`/collection/${testCollection}`)
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

// {
//     maxAge: 2 * 60,
//     swr: true
// }
