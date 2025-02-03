// import { useNuxtApp } from "nuxt/app"
import { useAxiosClient } from '../../../composables/utils'
import type { Product } from "../../../types"

export default defineEventHandler(async (event) => {
    const { id } = event.context.params as { id: string }
    // const { $client } = useNuxtApp()
    const { createClient } = useAxiosClient()
    const client = createClient()

    try {
        const response = await client.get<Product>(`/shop/products/${id}`)
        return response.data
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: "Product not found"
        })
    }
})
