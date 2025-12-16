import type { ProductApi } from './product'
import type { _DatabaseObject, BaseApiResponse } from '../..'

export type * from './product'
export type * from './stock'

/**
 * @deprecated
 */
export type ProductsApiResponse = BaseApiResponse<Product>

/**
 * @deprecated
 */
export type LikedProducts = number[]

/**
 * @deprecated
 */
export declare interface CollectionApiResponse extends _DatabaseObject {
  name: string
  category: string
  sub_category: string
  number_of_items: number
  illustration: string | null
  tags: string[] | null
  get_view_name: string
}
