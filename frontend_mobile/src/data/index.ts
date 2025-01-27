import type { SessionCacheData } from "@/types"

export const baseGrids = [
    {
        display: 1,
        icon: ['far', 'square'],
    },
    {
        display: 2,
        icon: ['fas', 'table-cells-large'],
    },
    {
        display: 3,
        icon: ['fas', 'table-cells'],
    }
]

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

// TODO: Move to Quart API backend?
// Icons are available at: https://iconduck.com/sets/laundry-and-wash-icons

export const laundryIcons = [
    {
        name: 'No bleaching',
        icon: 'laundry/bleaching-not-allowed.svg',
        label: 'Eau de javel interdite'
    },
    {
        name: 'Washing 30',
        icon: 'laundry/washing-30deg.svg',
        label: 'Lavable en machine max. 30° - Fragile'
    },
    {
        name: 'Washing 40',
        icon: 'laundry/washing-40deg.svg',
        label: 'Lavable en machine max. 40° - Fragile'
    }
]

export function findLaundryIcon(name: string, key: 'name' | 'icon' | 'label' = 'icon') {
    const result = laundryIcons.find(x => x.name === name)
    if (result) {
        return result[key]
    } else {
        return ''
    }
}
