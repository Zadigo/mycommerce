import type { DefaultClotheSize } from "~/data"

export * from './product'

export type ProductsApiResponse = {
  count: number
  limit: number
  next: number | null
  previous: number | null
  results: Product[]
}

export type LikedProducts = number[]

export declare interface CollectionApiResponse {
  id: number;
  name: string;
  category: string;
  sub_category: string;
  number_of_items: number;
  illustration: string | null;
  tags: string[] | null;
  get_view_name: string;
}

// TODO: Renamt ProductStockApiResponse
export interface ProductStockApiResponse {
  id: number
  variant: {
    id: number
    name: string
  }
  quantity: number
  in_stock: boolean
  almost_sold_out: boolean
  is_active: boolean
}
