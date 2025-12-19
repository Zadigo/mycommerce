import type { Languages } from '.'
import type { Profile } from './api/accounts'
import type { Product } from './api/shop'
import type { CartUpdateApiResponse } from './cart'


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
  paymentIntent: null

  /**
   * @deprecated Stored independently in a firebase document
   */
  cart: CartUpdateApiResponse | null

  recommendations: Product[]
  searchHistory: string[]
  authenticatedCart: boolean
  cartViewCount: number
  profile: Profile | null
  sessionId: string | null
  likedProducts: Product[]
  popularImages: PopularImages[]
}
