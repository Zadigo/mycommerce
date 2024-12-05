import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    pageTransition: { 
      name: 'page', 
      mode: 'out-in' 
    },
    head: {
      charset: 'utf-8'
    }
  },
  vite: {
    server: {
      
    }
  },
  runtimeConfig: {
    public: {
      DJANGO_PROD_URL: process.env.NUXT_DJANGO_PROD_URL,
      STRIPE_SECRET_KEY: process.env.NUXT_STRIPE_TEST_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.NUXT_STRIPE_TEST_PUBLISHABLE_KEY,
      STRIPE_ACCOUNT: process.env.NUXT_STRIPE_TEST_PUBLISHABLE_KEY,
      STRIPE_API_VERSION: '2024-06-20',
      STRIPE_LOCALE: 'fr'
    }
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  ssr: true,
  routeRules: {
    '/': { ssr: true, robots: true },
    '/wishlist': { ssr: false, robots: true },
    '/shop/**': { ssr: true, robots: true },
    '/cart/**': { ssr: false, robots: true },
    '/account/**': { ssr: false, robots: false },
    '/404': { ssr: false, robots: true }
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vesp/nuxt-fontawesome',
    '@nuxtjs/google-fonts',
    '@nuxt/test-utils/module',
    '@nuxtjs/google-fonts',
    '@unlok-co/nuxt-stripe',
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    'nuxt-clarity-analytics',
    'nuxt-openapi-docs-module',
    'vuetify-nuxt-module',
    'vue-sonner/nuxt'
  ],
  alias: {
    '@': path.resolve(__dirname, './'),
    '@types': './types'
  },
  eslint: {
    
  },
  googleFonts: {
    families: {
      Ubuntu: true,
      Roboto: true,
      Lato: true,
      "Noto Sans": true
    }
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-XX'
  },
  css: [
    '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '~/node_modules/mdb-ui-kit/css/mdb.min.css',
    '~/node_modules/animate.css/animate.min.css',
    '@/assets/style.scss'
  ],
  vuetify: {
    moduleOptions: {

    },
    vuetifyOptions: {

    }
  },
  fontawesome: {
    icons: {
      solid: [
        'angle-left',
        'arrow-up',
        'arrow-down',
        'caret-right',
        'user',
        'clock-rotate-left',
        'heart',
        'home',
        'phone',
        'envelope',
        'sliders',
        'ruler',
        'shop',
        'truck',
        'pen',
        'trash',
        'right-to-bracket',
        'right-from-bracket',
        'circle-check',
        'shopping-bag',
        'table-cells',
        'table-cells-large',
        'close'
      ],
      regular: [
        'heart'
      ],
      brands: [
        'whatsapp',
        'cc-mastercard',
        'google',
        'instagram',
        'facebook-f',
        'twitter'
      ]
    }
  },
  stripe: {
    server: {
      key: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
      options: {

      }
    },
    client: {
      key: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
      options: {

      }
    }
  },
  test: true,
  testUtils: {
    vitestConfig: {
      alias: {
        '@': path.resolve(__dirname, './')
      },
      css: true,
      deps: {
        optimizer: {
          ssr: {
            include: ['@nuxt/test-utils']
          }
        }
      }
    }
  },
  i18n: {
    baseUrl: './',
    langDir: './locales',
    defaultLocale: 'fr',
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', language: 'en-US', file: 'en-US.json', dir: 'ltr' },
      { code: 'fr', language: 'fr-FR', file: 'fr-FR.json', dir: 'ltr' }
    ]
  },
  nitro: {
    storage: {
      // redis: {
      //   driver: 'redis',
      //   port: 6379,
      //   host: 'driver',
      //   username: '',
      //   password: ''
      // }
    }
  }
})
