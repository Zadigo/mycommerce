import type { SessionCacheData } from '~/types'

export const baseSessionCacheData: SessionCacheData = {
  language: {
    choice: 'fr',
    selected: false
  },
  sessionId: null,
  paymentIntent: null,
  cart: null,
  recommendations: [],
  searchHistory: [],
  authenticatedCart: false,
  cartViewCount: 0,
  profile: null,
  popularImages: [],
  likedProducts: []
}
