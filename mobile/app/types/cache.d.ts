import type { Arrayable, Languages, Nullable, ProductNode } from '.'
import type { Profile } from './api/accounts'
import type { Product } from './api/shop'
import type { CartUpdateApiResponse } from './api/cart'


export type LanguageOptions = {
  choice: Languages
  selected: boolean
}

export interface PopularImages {
  product_id: number
  image_url: string
  count: number
}

export interface SessionCacheData {
  [key: string]: unknown
  language: LanguageOptions

  /**
   * @deprecated Stored independently in a firebase document
   */
  paymentIntent: Nullable<string>
  /**
   * @deprecated Stored independently in a firebase document
   */
  cart: Arrayable<CartItem>
  /**
   * @deprecated
   */
  authenticatedCart: boolean
  /**
   * @deprecated
   */
  cartViewCount: number

  recommendations: number[]
  searchHistory: string[]
  /**
   * @deprecated
   */
  profile: Nullable<Profile>
  likedProducts: number[]
  popularImages: PopularImages[]
}
