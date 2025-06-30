import tailwindcss from '@tailwindcss/vite'
import { defineOrganization } from 'nuxt-schema-org/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  site: {
    url: process.env.NUXT_DJANGO_PROD_URL || 'http://localhost:3000'
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

  runtimeConfig: {
    public: {
      // Django/Quart/Flask
      quartProdUrl: process.env.NUXT_QUART_PROD_URL || 'http://127.0.0.1:5000',
      prodDomain: process.env.NUXT_DJANGO_PROD_URL || 'http://127.0.0.1:8000',
      
      // Firebase
      firebaseApiKey: process.env.NUXT_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
      firebaseDbUrl: process.env.NUXT_FIREBASE_DB_URL,
      firebaseStorageBucket: process.env.NUXT_FIREBASE_STORAGE_BUCKET,
      firebaseAppId: process.env.NUXT_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_FIREBASE_MEASUREMENT_ID,
      firebaseMessageSenderId: process.env.NUXT_FIREBASE_MESSAGE_SENDER_ID,
      firebaseProjectId: process.env.NUXT_FIREBASE_PROJECT_ID,

      // Stripe
      stripeTestSecretKey: process.env.NUXT_STRIPE_TEST_SECRET_KEY,
      stripeTestPublishableKey: process.env.NUXT_STRIPE_TEST_PUBLISHABLE_KEY,
      stripeApiVersion: '2024-06-20',
      stripeLocale: 'fr',

      // What's App
      whatsAppUrl: process.env.NUXT_WHATS_APP_URL
    }
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
    '@unlok-co/nuxt-stripe',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@vesp/nuxt-fontawesome',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    'shadcn-nuxt',
    'vue-sonner/nuxt',
    'pinia-plugin-persistedstate',
    'nuxt-schema-org'
  ],

  shadcn: {
    prefix: 'Tail',
    componentDir: './components/ui'
  },

  i18n: {
    baseUrl: './',
    langDir: './locales',
    defaultLocale: 'fr',
    lazy: true,
    vueI18n: './i18n.config.ts',
    bundle: {
      // TODELETE:  bundle.optimizeTranslationDirective is enabled by default, we recommend 
      // disabling this feature as it causes issues and will be deprecated in v10.
      optimizeTranslationDirective: false
    },
    // customRoutes: 'config',
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
    '~/assets/css/main.css',
    '~/assets/css/style.scss'
  ],
  
  // TODELETE
  fontawesome: {
    icons: {
      solid: [
        'angle-left',
        'arrow-right',
        'arrow-up',
        'arrow-down',
        'bell',
        'chevron-left',
        'caret-right',
        'circle-check',
        'close',
        'clock-rotate-left',
        'envelope',
        'home',
        'heart',
        'headset',
        'gift',
        'map',
        'map-location',
        'phone',
        'pen',
        'plus',
        'ruler',
        'search',
        'sliders',
        'shop',
        'tags',
        'truck',
        'trash',
        'right-to-bracket',
        'right-from-bracket',
        'shopping-bag',
        'table-cells',
        'table-cells-large',
        'user',
      ],
      regular: [
        'heart'
      ],
      brands: [
        'whatsapp',
        'cc-mastercard',
        'cc-stripe',
        'cc-visa',
        'google',
        'instagram',
        'facebook-f',
        'twitter'
      ]
    }
  },

  googleFonts: {
    display: 'swap',
    families: {
      // Body
      Inter: true,
      Sora: true,
      // TItle
      Manrope: true
    }
  },

  stripe: {
    server: {
      key: process.env.NUXT_STRIPE_PUBLISHABLE_KEY
    },
    client: {
      key: process.env.NUXT_STRIPE_PUBLISHABLE_KEY
    }
  },

  image: {
    // TODO: Activate when the project images backend
    // is set correctly to cloudefare/aws
    // https://image.nuxt.com/providers/cloudflare
    provider: 'none'
  },

  nitro: {
    prerender: {
      routes: [
        '/mentions-legales',
        '/confidentialite'
      ]
    },
    storage: {
      redis: {
        driver: 'redis',
        host: '127.0.0.1',
        port: 6379,
        username: '',
        password: 'django-local-testing'
      }
    }
  }
})
