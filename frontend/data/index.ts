import type { SessionCacheData } from "~/types"

export * from './guide'

export const countries: string[] = [
    "France",
    "Guadeloupe",
    "Martinique",
    "Réunion"
]

export const baseSessionCacheData: SessionCacheData = {
    language: {
        choice: 'fr',
        location: 'France',
        selected: false
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


export const defaultSizes = {
    clothes: [
        'XS',
        'S',
        'M',
        'L',
        'XL'
    ]
}

export const defaultPriceFilters = [
    {
        text: "Jusqu'à 15€",
        value: 'Up to 15'
    },
    {
        text: "Jusqu'à 20€",
        value: 'Up to 20'
    },
    {
        text: "Jusqu'à 25€",
        value: 'Up to 25'
    },
    {
        text: "Jusqu'à 30€",
        value: 'Up to 30'
    },
    {
        text: "Jusqu'à 35€",
        value: 'Up to 40',
    },
    {
        text: "Jusqu'à 50€",
        value: 'Up to 50'
    }
]

export const defaultSortingFilters = [
    ['New', 'Nouveautés'],
    ['Price up', 'Prix croissant'],
    ['Price down', 'Prix décroissant']
]
