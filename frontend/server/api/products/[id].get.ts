// import { useNuxtApp } from "nuxt/app"
import { useAxiosClient } from '../../../composables/utils'
import type { Product } from "../../../types"

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params as { id: string }
        const { createClient } = useAxiosClient()
        const client = createClient()
        const response = await client.get<Product>(`/shop/products/${id}`)
        return response.data
    } catch (e) {
        throw createError({
            statusCode: 400,
            statusMessage: "Product not found"
        })
    }
})
