import type { Nullable } from '..'
import type { ProductApi } from './shop'

export interface BaseApiResponse<T> {
  count: number
  next: Nullable<number>
  previous: Nullable<number>
  results: T[]
}

export interface _DateTimes {
  modified_on: string
  created_on: string
}

export interface _DatabaseObject {
  id: number
}

/**
 * @todo Remove `Product`
*/
export type MaybeProduct = ProductApi | MaybeRef<ProductApi | undefined> | undefined

export type * from './feed'
export type * from './accounts'
