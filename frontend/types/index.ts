import type { Profile } from './accounts'
import type { CartUpdateApiResponse, DeliveryOption } from './cart'
import type { Product } from './shop'

export * from './accounts'
export * from './cart'
export * from './shop'
export * from './feed'
export * from './text'
export * from './address'

export interface JWTData {
    exp: number
    iat: number
    iss: string
    typ: string
    aud: string
    sub: string
    user_id: number
    cart_id: string
}

export type StringNull = string | null | undefined

const availableLocales = ['fr', 'en', 'es'] as const;
export type Languages = (typeof availableLocales)[number];

export type LanguageOptions = {
    location: string | null
    choice: Languages
    selected: boolean
};

export interface LocalstorageCacheData {
    cities: Record<string, string>[]
    deliveryOptions: DeliveryOption[]
    visitedProducts: number[]
    likedProducts: number[]
    grid: 3 | 4
}

export interface PopularImages {
    product_id: number
    image_url: string
    count: number
}

export interface SessionCacheData {
    language: LanguageOptions
    paymentIntent: null
    cart: CartUpdateApiResponse | null
    recommendations: Product[]
    searchHistory: string[]
    authenticatedCart: boolean
    cartViewCount: number
    profile: Profile | null
    sessionId: string | null
    // TODO: Tracks the images on which the
    // user has zoomed the most
    popularImages: PopularImages[]
}

interface Text {
    id: string
    title?: string
    type: 'text' | 'points'
    content: string | (string | string[])[]
}

export interface GuideText {
    id: string
    title: string
    text: Text[]
}

export interface ExtendedLocationQuery {
    login?: string | null
}


export interface FooterSection {
    name: string
    links: {
        name: string
        to: string
    }[]
}

export interface FooterLinks {
    socials: {
        name: string
        url: string
        icon: string | null
    }[],
    sections: FooterSection[]
}
