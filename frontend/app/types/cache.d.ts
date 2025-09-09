import type { Profile } from './accounts'
import type { CartUpdateApiResponse } from './cart'
import type { Product } from './shop'

export type LanguageOptions = {
  location: string | null //TODELETE: This is now saved in the cookie
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
  // likedProducts: Product[]
  // TODO: Tracks the images on which the
  // user has zoomed the most
  popularImages: PopularImages[]
}
