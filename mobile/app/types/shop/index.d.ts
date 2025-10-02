import type { Product } from '~/types/shop/product'
import type { _DatabaseObject, BaseApiResponse } from '..'

export type * from './product'
export type * from './stock'

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
