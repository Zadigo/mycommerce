import type { SessionCacheData } from "~/types"

export * from './guide'
export * from './constants'

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

export const defaultSortingFilters = [
    ['New', 'Nouveautés'],
    ['Price up', 'Prix croissant'],
    ['Price down', 'Prix décroissant']
]
