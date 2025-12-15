import tailwindcss from '@tailwindcss/vite'
import { defineOrganization } from 'nuxt-schema-org/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  site: {
    url: process.env.NUXT_PUBLIC_DJANGO_PROD_URL || 'http://localhost:3000'
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  routeRules: {
    '/': {
      swr: true,
      cache: {
        swr: true,
        base: 'redis',
        maxAge: 1,
      }
    },
    'shop/**': {
      swr: true,
      cache: {
        swr: true,
        base: 'redis',
        maxAge: 1
      }
    },
    'wishlist': {
      ssr: false
    },
    'account/**': {
      ssr: false
    },
    'cart/**': {
      ssr: false
    },
    'complete-size-guide': {
      isr: true
    },
    'guide': {
      isr: true
    },
    'confidentialite': {
      ssr: true,
      cache: {
        base: 'redis',
        maxAge: 3600
      }
    }
  },

  vuefire: {
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      dbUrl: process.env.NUXT_PUBLIC_FIREBASE_DB_URL,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      messageSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID
    }
  },

  runtimeConfig: {
    public: {
      // Django/Quart/Flask
      quartProdUrl: process.env.NUXT_PUBLIC_QUART_PROD_URL || 'http://127.0.0.1:5000',
      prodDomain: process.env.NUXT_PUBLIC_DJANGO_PROD_URL || 'http://127.0.0.1:8000',
      cartProdDomain: process.env.NUXT_PUBLIC_DJANGO_CART_PROD_URL || 'http://127.0.0.1:8001',
      reviewsProdDomain: process.env.NUXT_PUBLIC_DJANGO_REVIEWS_PROD_URL || 'http://127.0.0.1:8002',

      // Stripe
      stripeTestSecretKey: process.env.NUXT_PUBLIC_STRIPE_TEST_SECRET_KEY,
      stripeTestPublishableKey: process.env.NUXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY,
      stripeApiVersion: '2024-06-20',
      stripeLocale: 'fr',

      // What's App
      whatsAppUrl: process.env.NUXT_PUBLIC_WHATS_APP_URL
        }
      },

      modules: [
        '@nuxt/fonts',
        '@nuxt/hints',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/test-utils',
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
        '@pinia/nuxt',
        '@unlok-co/nuxt-stripe',
        '@vueuse/motion',
        '@vueuse/nuxt',
        'nuxt-authentication',
        'nuxt-schema-org',
        'nuxt-vuefire',
        'pinia-plugin-persistedstate',
        'shadcn-nuxt',
        'vue-sonner/nuxt'
      ],

      shadcn: {
        prefix: 'Tail',
        componentDir: '~/components/ui'
      },

      i18n: {
        baseUrl: './',
        langDir: './locales',
        defaultLocale: 'fr',
        vueI18n: './i18n.config.ts',
        locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en-US.ts',
        dir: 'ltr',
        name: 'English'
      },
      {
        code: 'es',
        language: 'es-ES',
        file: 'es-ES.ts',
        dir: 'ltr',
        name: 'Spanish'
      },
      {
        code: 'fr',
        language: 'fr-FR',
        file: 'fr-FR.ts',
        dir: 'ltr',
        name: 'Français'
      }
        ],
    // pages: {
    //   'guide': { fr: '/guide-achat', en: '/guide-achat', es: '/guide-achat' },
    //   'wishlist': { fr: '/liste-souhait', en: '/wishlist', es: '/wishlist' },
    //   'mentions-legales': { fr: '/mentions-legales', en: '/mentions-legales', es: '/mentions-legales' },
    //   'confidentialite': { fr: '/confidentialite', en: '/confidentialite', es: '/confidentialite' },
    //   'conditions-generales': { fr: '/conditions-generales', en: '/conditions-generales', es: '/conditions-generales' },

    //   'shop-id': { fr: '/boutique/[id]', en: '/shop/[id]', es: '/tienda/[id]' },
    //   'shop-collection-id': { fr: '/boutique/collection/[id]', en: '/shop/collection/[id]', es: '/tienda/collecion/[id]' },

    //   'cart': { fr: '/cart', en: '/cart', es: '/cart' },
    //   'cart-shipment': { fr: '/panier/livraison', en: '/cart/shipment', es: '/cart/shipment' },
    //   'cart-payment': { fr: '/panier/paiement', en: '/cart/payment', es: '/cart/payment' },
    //   'cart-success': { fr: '/panier/recapitulatif', en: '/cart/success', es: '/cart/success' },
      
    //   'account': { fr: '/compte', en: '/account', es: '/account' },
    //   'orders': { fr: '/compte/commandes', en: '/account/orders', es: '/account/orders' },
    // }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  schemaOrg: {
    identity: defineOrganization({
      '@type': 'onlineStore',
      name: 'E-Woman',
      alternateName: 'The E-Woman',
      description: 'A description for the e-woman e-commerce website',
      foundingDate: '2015-01-01',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: 100
      },
      legalName: 'E-Woman Inc.',
      taxID: '47-1234567',
      vatID: 'EU123456789',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '100 Commerce Way, Suite 300',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        postalCode: '97201',
        addressCountry: 'US'
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
      sameAs: [
        'https://facebook.com/modernhome',
        'https://instagram.com/modernhome',
        'https://pinterest.com/modernhome',
        'https://twitter.com/modernhome'
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00:00',
          closes: '18:00:00'
        }
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: '+1-888-555-0123',
          email: 'support@modernhome.com',
          availableLanguage: ['English', 'French'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00:00',
            closes: '18:00:00'
          }
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: '+1-888-555-0124',
          email: 'sales@modernhome.com'
        }
      ]
    })
  },

  css: [
    '~/assets/css/main.css'
  ],

  fonts: {
    families: [
      // Body
      {
        name: 'Sora',
        weight: [100, 800],
        styles: ['normal', 'italic'],
        preload: true
      },
      // Title
      {
        name: 'Manrope',
        weight: [200, 800],
        styles: ['normal', 'italic'],
        preload: true
      }
    ]
  },

  stripe: {
    server: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    },
    client: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
  },

  image: {
    // TODO: Activate when the project images backend
    // is set correctly to cloudefare/aws
    // https://image.nuxt.com/providers/cloudflare
    provider: 'none'
  },

  // nitro: {
  //   prerender: {
  //     routes: [
  //       '/mentions-legales',
  //       '/confidentialite'
  //     ]
  //   },
  //   storage: {
  //     redis: {
  //       driver: 'redis',
  //       host: process.env.NUXT_PUBLIC_REDIS_HOST,
  //       port: 6379,
  //       username: process.env.NUXT_PUBLIC_REDIS_USER,
  //       password: process.env.NUXT_PUBLIC_REDIS_PASSWORD
  //     }
  //   },
  //   devStorage: {
  //     redis: {
  //       driver: 'redis',
  //       host: '127.0.0.1',
  //       port: 6379,
  //       username: '',
  //       password: ''
  //     }
  //   }
  // }
})
