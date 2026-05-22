import type { Nullable } from '..'

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

export type * from './cart'
export type * from './shop'
export type * from './accounts'
