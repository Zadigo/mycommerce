import type { Product } from '~/types/shop/product'
import type { DefaultClotheSize } from '~/types/constants'
import type { _DatabaseObject, BaseApiResponse } from '..'

export * from './product'

export type ProductsApiResponse = BaseApiResponse<Product>

export type LikedProducts = number[]

export declare interface CollectionApiResponse extends _DatabaseObject {
  name: string
  category: string
  sub_category: string
  number_of_items: number
  illustration: string | null
  tags: string[] | null
  get_view_name: string
}

export interface ProductStockApiResponse  extends _DatabaseObject {
  variant: {
    id: number
    name: string
  }
  quantity: number
  in_stock: boolean
  almost_sold_out: boolean
  is_active: boolean
}
