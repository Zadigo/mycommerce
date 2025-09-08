import type { SessionCacheData } from '~/types'

export * from './product_filtering'
export * from '../../types/constants/language'
export * from './footer'
export * from './measurements'

export const baseSessionCacheData: SessionCacheData = {
  language: {
    choice: 'fr',
    location: 'France',
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
  popularImages: []
}
