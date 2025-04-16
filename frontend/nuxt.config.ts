import tailwindcss from '@tailwindcss/vite'
// import { defineOrganization } from 'nuxt-schema-org/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  routeRules: {
    '/': {
      swr: true,
      cache: {
        base: 'redis',
        maxAge: 1,
      }
    },
    'shop/collection/**': {
      ssr: true
    },
    'wishlist': {
      ssr: false
    },
    'account/**': {
      ssr: false
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
      djangoProdUrl: process.env.NUXT_DJANGO_PROD_URL,
      quartProdUrl: process.env.NUXT_QUART_PROD_URL,
      prodDomain: process.env.NUXT_DJANGO_PROD_URL,
      
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
    // '@nuxtjs/seo',
    '@vesp/nuxt-fontawesome',
    '@nuxt/icon',
    '@nuxt/test-utils',
    'vuetify-nuxt-module',
    'shadcn-nuxt',
    'vue-sonner/nuxt',
    // '@nuxtjs/tailwindcss'
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
    ]
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  schemaOrg: {
    // identity: defineOrganization({
    //   '@type': 'onlineStore',
    //   name: 'E-commerce',
    //   alternateName: '',
    //   description: '',
    //   foundingDate: '2015-01-01',
    //   numberOfEmployees: {
    //     '@type': 'QuantitativeValue',
    //     value: 1
    //   },
    //   legalName: 'ModernHome Inc.',
    //   taxID: '47-1234567',
    //   vatID: 'EU123456789',
    //   address: {
    //     '@type': 'PostalAddress',
    //     streetAddress: '100 Commerce Way, Suite 300',
    //     addressLocality: 'Portland',
    //     addressRegion: 'OR',
    //     postalCode: '97201',
    //     addressCountry: 'US'
    //   },
    //   hasMerchantReturnPolicy: {
    //     '@type': 'MerchantReturnPolicy',
    //     name: 'Standard Return Policy',
    //     inStoreReturnsOffered: false,
    //     merchantReturnDays: '30',
    //     returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    //     returnMethod: ['ReturnByMail'],
    //     returnFees: 'https://schema.org/FreeReturn',
    //     returnPolicyCountry: {
    //       '@type': 'Country',
    //       name: ['US', 'CA', 'GB', 'AU', 'NZ']
    //     }
    //   },
    //   shippingDetails: {
    //     '@type': 'OfferShippingDetails',
    //     shippingRate: {
    //       '@type': 'MonetaryAmount',
    //       value: '0',
    //       currency: 'EUR'
    //     },
    //     shippingDestination: {
    //       '@type': 'DefinedRegion',
    //       addressCountry: ['FR', 'GP']
    //     },
    //     'deliveryTime': {
    //       '@type': 'ShippingDeliveryTime',
    //       handlingTime: {
    //         '@type': 'QuantitativeValue',
    //         minValue: 1,
    //         maxValue: 2,
    //         unitCode: 'DAY'
    //       },
    //       'transitTime': {
    //         '@type': 'QuantitativeValue',
    //         minValue: 3,
    //         maxValue: 7,
    //         unitCode: 'DAY'
    //       }
    //     }
    //   },
    //   paymentAccepted: [
    //     'Credit Card',
    //     'PayPal',
    //     'Apple Pay',
    //     'Google Pay',
    //   ],
    //   currenciesAccepted: ['EUR'],
    //   sameAs: [
    //     'https://facebook.com/modernhome',
    //     'https://instagram.com/modernhome',
    //     'https://pinterest.com/modernhome',
    //     'https://twitter.com/modernhome'
    //   ],
    //   openingHoursSpecification: [
    //     {
    //       '@type': 'OpeningHoursSpecification',
    //       dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    //       opens: '09:00:00',
    //       closes: '18:00:00'
    //     }
    //   ],
    //   contactPoint: [
    //     {
    //       '@type': 'ContactPoint',
    //       contactType: 'customer service',
    //       telephone: '+1-888-555-0123',
    //       email: 'support@modernhome.com',
    //       availableLanguage: ['English', 'French'],
    //       hoursAvailable: {
    //         '@type': 'OpeningHoursSpecification',
    //         dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    //         opens: '09:00:00',
    //         closes: '18:00:00'
    //       }
    //     },
    //     {
    //       '@type': 'ContactPoint',
    //       contactType: 'sales',
    //       telephone: '+1-888-555-0124',
    //       email: 'sales@modernhome.com'
    //     }
    //   ]
    // })
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/style.scss',
    // '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    // '~/node_modules/mdb-ui-kit/css/mdb.min.css',
  ],
  
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
    families: {
      Ubuntu: {
        wght: '100..700'
      },
      Roboto: {
        wght: '100..700'
      },
      Lato: {
        wght: '100..700'
      },
      'Noto Sans': {
        wght: '100..700'
      }
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
