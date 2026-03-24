import type { Nullable } from '~/types'

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
  alternateName: string
  description: string
  logo: string
  sameAs: string[]
  image: string[]
  rcs: string
  address: string
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

export const businessDetails: BusinessDetails = {
  name: "La Boutique de Valorie",
  legalName: "La Boutique de Valorie",
  alternateName: "Boutique Valorie",
  siren: '111 800 574',
  siret: '111 800 574 00001',
  numberoTVA: 'FR29790849574',
  creationDate: '2013-01-28',
  description: 'La Boutique de Valorie est une entreprise spécialisée dans la vente de produits capillaires pour cheveux crépus et bouclés, offrant une large gamme de soins et de coiffures adaptés à tous les types de cheveux.',
  logo: '',
  sameAs: [
    'https://fr.pinterest.com/boutiquevalorie',
    'https://facebook.com/boutiquevalorie',
    'https://www.instagram.com/boutiquevalorie'
  ],
  image: [

  ],
  rcs: '',
  address: '15 test address, Lille, France',
  priceRange: '$$',
  foundingDate: '2013-01-28',
  foundingLocation: 'Lille, France',
  founderImage: null,
  shareCapital: null,
  founder: 'John Pendenque',
  founderDescription: "John Pendenque est un entrepreneur passionné avec une expertise approfondie dans le domaine des produits capillaires pour cheveux crépus et bouclés.",
  founderKnowsAbout: [
    'Cheveux crépus',
    'Cheveux bouclés',
    'Coiffure multiculturelle',
    'Soins capillaires'
  ],
  webContentManager: 'Pendenque John',
  publishingDirector: 'Pendenque John',
  editorInChief: 'Pendenque John',
  websiteProvider: {
    legalName: 'Gency313',
    url: 'https://gency313.fr'
  },
  cloudProvider: {
    legalName: 'SAS OVH',
    url: 'http://www.ovhcloud.com/fr/',
    description: "OVH SAS est une filiale de la société OVH Groupe SA, société immatriculée au RCS de Lille",
    address: '2 rue Kellermann - 59100 Roubaix - France',
    rcs: '424 761 419 00045'
  },
  contact: {
    telephone: '+33-3-20-00-00-00',
    email: 'laboutiquedevalorie@gmail.com',
    address: '15 test address, Lille, France'
  },
  socials: {
    instagram: {
      url: 'https://www.instagram.com/laboutiquedevalorie',
      handle: '@laboutiquedevalorie'
    },
    facebook: {
      url: 'https://www.facebook.com/laboutiquedevalorie',
      handle: 'laboutiquedevalorie'
    },
    pinterest: {
      url: 'https://fr.pinterest.com/laboutiquedevalorie',
      handle: 'laboutiquedevalorie'
    }
  }
}

type BusinessDetailsKeys = keyof BusinessDetails

type BusinessDetailsKeyValue = {
  [K in BusinessDetailsKeys]: BusinessDetails[K]
}

/**
 * A composable to access business details throughout the application. It provides a `get` function 
 * to retrieve specific details by key, ensuring type safety and consistency across the app.
 */
export async function useBusinessDetails() {
  function get<K extends BusinessDetailsKeys>(key: K): BusinessDetailsKeyValue[K] {
    return businessDetails[key]
  }

  const reactiveGet = reactify(get)
  const activeSocials = computed(() => Object.keys(get('socials')) as SocialPlatform[])

  function getSocial(platform: SocialPlatform): Social | null {
    const socials = get('socials')
    return socials[platform] || null
  }

  function getSocialIcon(platform: SocialPlatform): string {
    const icons: Record<SocialPlatform, string> = {
      instagram: 'fa-brands:instagram',
      facebook: 'fa-brands:facebook',
      pinterest: 'fa-brands:pinterest',
      twitter: 'fa-brands:twitter',
      linkedin: 'fa-brands:linkedin',
      tiktok: 'fa-brands:tiktok',
      youtube: 'fa-brands:youtube'
    }
    return icons[platform]
  }

  const sameAs = computed(() => Object.values(get('socials')).map(social => social.url))

  return {
    businessDetails,
    activeSocials,
    sameAs,
    get,
    reactiveGet,
    getSocial,
    getSocialIcon
  }
}
