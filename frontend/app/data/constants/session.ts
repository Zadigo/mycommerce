import type { SessionCacheData } from '~/types'

export const baseSessionCacheData: SessionCacheData = {
  language: {
    choice: 'fr',
    selected: false
  },

  /**
   * @deprecated
   */
  paymentIntent: null,
  /**
   * @deprecated
   */
  cart: null,
  /**
   * @deprecated
   */
  cartViewCount: 0,
  /**
   * @deprecated
   */
  authenticatedCart: false,

  recommendations: [],
  searchHistory: [],
  /**
   * @deprecated
   */
  profile: null,
  popularImages: [],
  likedProducts: []
}
