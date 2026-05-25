<template>
  <nuxt-layout>
    <!-- Loader -->
    <nuxt-loading-indicator />
    
    <!-- Toaster -->
    <client-only>
      <toaster />
    </client-only>
    
    <!-- Main -->
    <nuxt-page />

    <!-- Modals -->
    <client-only>
      <lazy-modals-language hydrate-on-idle />
      <lazy-modals-whats-app hydrate-on-visible />
    </client-only>
  </nuxt-layout>
</template>

<script setup lang="ts">
import { provideSSRWidth } from '@vueuse/core'
import type { PaymentIntentApiResponse, Undefineable } from './types'

/**
 * Session
 */

useSetupSession()

/**
 * Payment Intent
 */

const { cartSession, cart } = useCartComposable()
const { create, update, hasPaymentIntent, paymentIntent } = usePaymentIntentComposable()

watch(cart, async () => {
  if (!hasPaymentIntent.value) {
    void create(cartSession?.value?.total)
    
  } else {
    void update(cartSession?.value?.total)
  }
})

/**
 * Authentication
 */

useNuxtAuthentication()

/**
 * SSR
 */

provideSSRWidth(1280)

/**
 * Provides global state to the app
 */

const isMobile = useMediaQuery('(min-width: 320px)').value
const { isSupported: screenOrientation } = useScreenOrientation()

provide('isMobile', isMobile)
provide('screenOrientation', screenOrientation)
provide('documentVisible', useDocumentVisibility())

/**
 * State: Modals
 */

useState('showSearchModal', () => false)
useState('showLanguageModal', () => false)
useState('showWhatsAppModal', () => false)
useState('showCartDrawer', () => false)
useState('showLoginDrawer', () => false)
useState('authenticatedCart', () => false)
useState('showAddedProductDrawer', () => false)
useState('showEditProductDrawer', () => false)

/**
 * Other global setups
 */

useState<Undefineable<PaymentIntentApiResponse>>('paymentIntent', () => undefined)

/**
 * Load Stripe.js
 */

useScript({
  async: true,
  src: 'https://js.stripe.com/v3/',
  crossorigin: 'anonymous',
  tagPriority: 'high'
})

/**
 * SEO
 */
const { locales, locale } = useI18n()

const { get, geoLocation } = useBusinessDetails()

const { workingDays, days } = useWorkingDaysComposable({
  only: 'Weekdays',
  startTime: '09:00',
  endTime: '17:00'
})

useHead({
  meta: [
    {
      name: 'geo.region',
      content: 'FR-HDF'
    },
    {
      name: 'geo.placename',
      content: get('address').city
    },
    {
      name: 'geo.position',
      content: geoLocation.value
    },
    {
      name: 'ICBM',
      content: geoLocation.value
    }
  ]
})

useHead({
  htmlAttrs: {
    lang: locale.value
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})

defineOrganization({
  '@type': 'onlineStore',
  name: get('name'),
  alternateName: get('alternateName'),
  description: get('description'),
  foundingDate: get('foundingDate'),
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: 100
  },
  legalName: 'E-Woman Inc.',
  taxID: '47-1234567',
  vatID: 'EU123456789',
  address: {
    '@type': 'PostalAddress',
    streetAddress: get('address'),
    addressLocality: 'Lille',
    addressRegion: 'Hauts-de-France',
    postalCode: '59000',
    addressCountry: 'FR'
  },
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    name: 'Standard Return Policy',
    inStoreReturnsOffered: false,
    merchantReturnDays: '30',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    returnMethod: ['ReturnByMail'],
    returnFees: 'https://schema.org/FreeReturn',
    returnPolicyCountry: {
      '@type': 'Country',
      name: ['US', 'CA', 'GB', 'AU', 'NZ']
    }
  },
  shippingDetails: {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: '0',
      currency: 'EUR'
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: ['FR', 'GP']
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 2,
        unitCode: 'DAY'
      },
      'transitTime': {
        '@type': 'QuantitativeValue',
        minValue: 3,
        maxValue: 7,
        unitCode: 'DAY'
      }
    }
  },
  paymentAccepted: [
    'Credit Card',
    'PayPal',
    'Apple Pay',
    'Google Pay',
  ],
  currenciesAccepted: ['EUR'],
  sameAs: get('sameAs'),
  'openingHoursSpecification': workingDays.value.map(item => ({
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': item.day,
    'opens': item.startTime,
    'closes': item.endTime
  })),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: get('contact').telephone,
      email: get('contact').email,
      availableLanguage: ['English', 'French'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.value,
        opens: '09:00:00',
        closes: '18:00:00'
      }
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: get('contact').telephone,
      email: get('contact').email
    }
  ]
})

/**
 * Href Lang
 */

const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

useHead({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])]
})
</script>
