import type { Product } from "~/types"

export interface CustomerOrder {
    id: number
    reference: string
    products: Product[]
    total: string
    created_on: string
}
