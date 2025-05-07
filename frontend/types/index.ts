import type { DeliveryOption } from './cart'

export * from './accounts'
export * from './cache'
export * from './cart'
export * from './feed'
export * from './other'
export * from './shop'
export * from './text'

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

export type StringNull = string | null | undefined

const availableLocales = ['fr', 'en', 'es'] as const;
export type Languages = (typeof availableLocales)[number];

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
