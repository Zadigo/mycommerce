import type { Nullable } from '~/types'

export * from './base'
export * from './working_hours'

export interface WebsiteProvider {
  legalName: string
  url: string
}

export interface CloudProvider extends WebsiteProvider {
  description: string
  address: string
  rcs: string
}

export interface ContactPoints {
  telephone: string
  email: string
  address: string
}

export type SocialPlatform = 'instagram' | 'facebook' | 'pinterest' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'

export type Social = {
  url: string
  handle?: string
}

export interface BusinessDetails {
  name: string
  legalName: string
  siren: string
  siret: string
  numberoTVA: Nullable<string>
  creationDate: string
  alternateName: string | string[]
  description: string
  logo: string
  sameAs: string[]
  image: string[]
  rcs: string
  address: {
    street: string
    postalCode: string
    city: string
    lat: number | null
    lng: number | null
  }
  priceRange: '$' | '$$' | '$$$'
  foundingDate: string
  foundingLocation: string
  founderImage: Nullable<string>
  shareCapital: Nullable<string>
  founder: string
  founderDescription: string
  founderKnowsAbout: string[]
  webContentManager: string
  publishingDirector: string
  editorInChief: string
  websiteProvider: WebsiteProvider
  cloudProvider: CloudProvider
  contact: ContactPoints
  socials: Partial<Record<SocialPlatform, Social>>
}

export type BusinessDetailsKeys = keyof BusinessDetails

export type BusinessDetailsKeyValue = {
  [ K in BusinessDetailsKeys ]: BusinessDetails[K]
}
