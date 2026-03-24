import tailwindcss from '@tailwindcss/vite'

const isTest = process.env.NODE_ENV === 'test'

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
    '/': { ssr: true },
    '/shop': { ssr: true },
    '/shop/collection/**': { ssr: true },
    '/shop/**': { ssr: true },
    '/wishlist': { ssr: false },
    '/account/**': { ssr: false },
    '/cart/**': { ssr: false },
    '/guide': { prerender: true },
    '/confidentialite': { prerender: true },
    '/conditions-generales': { prerender: true },
    '/complete-size-guide': { prerender: true }
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
    // Stripe
    stripeTestSecretKey: process.env.NUXT_STRIPE_TEST_SECRET_KEY,

    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      // Django/Quart/Flask
      prodDomain: process.env.NUXT_PUBLIC_DJANGO_PROD_URL || 'http://127.0.0.1:8000',
      quartProdUrl: process.env.NUXT_PUBLIC_QUART_PROD_URL || 'http://127.0.0.1:5000',
      cartProdDomain: process.env.NUXT_PUBLIC_DJANGO_CART_PROD_URL || 'http://127.0.0.1:8001',
      reviewsProdDomain: process.env.NUXT_PUBLIC_DJANGO_REVIEWS_PROD_URL || 'http://127.0.0.1:8002',

      // Stripe
      stripeTestPublishableKey: process.env.NUXT_STRIPE_TEST_PUBLISHABLE_KEY,
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
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@unlok-co/nuxt-stripe',
    '@vueuse/motion',
    '@vueuse/nuxt',
    'nuxt-authentication',
    'nuxt-ganalytics',
    'nuxt-schema-org',
    'nuxt-vuefire',
    'pinia-plugin-persistedstate',
    'vue-sonner/nuxt',
    '@nuxtjs/seo',
    '@nuxt/eslint'
  ],

  typescript: {
    tsConfig: {
      include: [
        '../test/unit/**/*.ts'
      ],
      compilerOptions: {
        paths: {
          '@shared-types': ['./types'],
          '@shared-types/*': ['./types/*']
        }
      }
    }
  },

  alias: {
    '@shared-types': './types'
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

  vite: {
    plugins: isTest ? [] : [tailwindcss()]
  },

  nuxtAuthentication: {
    domain: process.env.NUXT_PUBLIC_DJANGO_PROD_URL || 'http://127.0.0.1:8000',
    accessEndpoint: '/auth/v1/token/',
    refreshEndpoint: '/auth/v1/token/refresh/',
    verifyEndpoint: '/auth/v1/token/verify/'
  },

  ganalytics: {
    ga4: {
      id: 'G-CVKFG2XPVG',
      enableDebug: true
    },
    gtm: {
      id: 'GTM-TJZFHM5'
    }
  },

  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        host: process.env.NUXT_PUBLIC_REDIS_HOST,
        port: 6379,
        username: process.env.NUXT_PUBLIC_REDIS_USER,
        password: process.env.NUXT_PUBLIC_REDIS_PASSWORD
      }
    }
  }
})
