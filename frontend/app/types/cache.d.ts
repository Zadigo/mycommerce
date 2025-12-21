import type { Arrayable, Languages, Nullable } from '.'
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

  recommendations: Product[]
  searchHistory: string[]
  profile: Nullable<Profile>
  likedProducts: Product[]
  popularImages: PopularImages[]
}
