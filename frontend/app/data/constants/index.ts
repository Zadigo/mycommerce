import type { SessionCacheData } from '~/types'

export * from './footer'

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

export const countries = [
  "France",
  "Guadeloupe",
  "Martinique",
  "Réunion"
] as const
