import type { DeliveryOption } from './delivery'

export type Arrayable<T> = T[]

export type Undefineable <T> = T | undefined

export type Nullable<T> = T | null

export type Refable<T> = Ref<T>

export type MaybeEmpty<T> = Undefineable<T> | Nullable<T>

export type StringNull = string | null | undefined

export type * from './api/accounts'
export type * from './cache'
export type * from './cart'
export type * from './other'
export type * from './text'
export type * from './api'
export type * from './graphql'

/**
 * Token returned by the Django backend in order
 * to identify anonymous users on the website
 */
export interface JWTData {
  exp: number
  iat: number
  iss: string
  typ: string
  aud: string
  sub: string
  user_id?: number | null
  /**
   * A unique random string used to make the JWT
   * token unique if the user is anonymous 
   */
  cart_id: string
}

export interface LocalstorageCacheData {
  cities: Record<string, string>[]
  deliveryOptions: DeliveryOption[]
  visitedProducts: number[]
  likedProducts: number[]
  grid: 3 | 4
}

interface Text {
  id: string
  title?: string
  type: 'text' | 'points'
  content: string | (string | string[])[]
}

export interface GuideText {
  id: string
  title: string
  text: Text[]
}

export interface ExtendedLocationQuery {
  login?: string | null
}

export type Languages = 'fr' | 'en' | 'es'

export type BaseCountries = 'France' | 'Guadeloupe' | 'Martinique' | 'Réunion'

export type MaybeType<T> = MaybeRef<MaybeEmpty<T>> | MaybeEmpty<T>
