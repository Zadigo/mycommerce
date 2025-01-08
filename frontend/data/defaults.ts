import type { SessionCacheData } from "~/types"

export const countries: string[] = [
    "France",
    "Guadeloupe",
    "Martinique",
    "Réunion"
]

export const baseSessionCacheData: SessionCacheData = {
    language: {
        choice: 'fr',
        location: 'France'
    },
    paymentIntent: null,
    cart: null,
    recommendations: [],
    searchHistory: [],
    authenticatedCart: false,
    cartViewCount: 0,
    profile: null,
    popularImages: []
}
