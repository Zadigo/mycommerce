export * from './shop'

export type Arrayable<T> = T[]

export type Undefineable<T> = T | undefined

export type Nullable<T> = T | null

export type Refable<T> = Ref<T>

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
