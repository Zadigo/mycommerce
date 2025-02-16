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
  site: {
    url: 'https://example.com',
    name: 'Ecommerce website'
  },
  vite: { server: {} },
  runtimeConfig: {
    public: {
      // Firebase
      firebaseApiKey: process.env.NUXT_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
      firebaseDbUrl: process.env.NUXT_FIREBASE_DB_URL,
      firebaseStorageBucket: process.env.NUXT_FIREBASE_STORAGE_BUCKET,
      firebaseAppId: process.env.NUXT_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_FIREBASE_MEASUREMENT_ID,
      firebaseMessageSenderId: process.env.NUXT_FIREBASE_MESSAGE_SENDER_ID,
      firebaseProjectId: process.env.NUXT_FIREBASE_PROJECT_ID,

      // https://nuxt.com/modules/gtag
      gtag: {
        id: 'G-CVKFG2XPVG',
        enabled: true, // TODO: Remove. Testing
        // enabled: process.env.NODE_ENV === 'production',
        config: {
          currency: 'EUR',
          shipping: 1,
          tax: 20
        }
      },
      DJANGO_PROD_URL: process.env.NUXT_DJANGO_PROD_URL,
      STRIPE_SECRET_KEY: process.env.NUXT_STRIPE_TEST_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.NUXT_STRIPE_TEST_PUBLISHABLE_KEY,
      STRIPE_ACCOUNT: process.env.NUXT_STRIPE_TEST_PUBLISHABLE_KEY,
      STRIPE_API_VERSION: '2024-06-20',
      STRIPE_LOCALE: 'fr',
      WHATS_APP_URL: process.env.NUXT_WHATS_APP_URL
    },
  },
  // hooks: {
  //   'app:resolve': () => {
  //     const config = useRuntimeConfig()
  //     const required = ['STRIPE_SECRET_KEY', 'DJANGO_PROD_URL']

  //     required.forEach(key => {
  //       if (!config[key]) {
  //         throw new Error(`Missing required environment key: ${key}`)
  //       }
  //     })
  //   }
  // },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  ssr: true,
  routeRules: {
    '/': {
      ssr: true, 
      robots: true
    },
    '/wishlist': {
      ssr: false, 
      robots: true
    },
    '/shop/**': {
      ssr: true,
      robots: true
    },
    '/cart/**': {
      ssr: false,
      robots: false
    },
    '/account/**': {
      ssr: false,
      robots: false
    },
    '/404': {
      ssr: false,
      robots: true
    }
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@artmizu/nuxt-prometheus',
    '@vesp/nuxt-fontawesome',
    '@nuxtjs/google-fonts',
    '@nuxt/test-utils/module',
    '@unlok-co/nuxt-stripe',
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    // 'nuxt-meta-pixel', // BUG: This raises an error with minimatch
    'nuxt-clarity-analytics',
    'nuxt-openapi-docs-module',
    'vuetify-nuxt-module',
    'vue-sonner/nuxt'
  ],
  alias: {
    '@': path.resolve(__dirname, './'),
    '@types': './types'
  },
  eslint: {},
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
      "Noto Sans": {
        wght: '100..700'
      }
    }
  },
  // gtag: {
  //   enabled: process.env.NODE_ENV === 'production',
  //   id: 'G-XX'
  // },
  css: [
    '@/assets/style.scss',
    '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '~/node_modules/mdb-ui-kit/css/mdb.min.css',
    '~/node_modules/animate.css/animate.min.css',
  ],
  vuetify: {
    moduleOptions: {
      styles: true
    },
    vuetifyOptions: {
      ssr: {
        clientWidth: 1280,
        clientHeight: 70
      },
      defaults: {
        global: {
          ripple: true,
        },
      },
      theme: {
        defaultTheme: 'light'
      }
    }
  },
  fontawesome: {
    icons: {
      solid: [
        'angle-left',
        'arrow-up',
        'arrow-down',
        'chevron-left',
        'caret-right',
        'circle-check',
        'close',
        'clock-rotate-left',
        'envelope',
        'home',
        'heart',
        'phone',
        'pen',
        'ruler',
        'search',
        'sliders',
        'shop',
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
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: 'i18n_redirected',
    //   redirectOn: 'root'
    // },
    locales: [
      { 
        code: 'en',
        language: 'en-US',
        file: 'en-US.json',
        dir: 'ltr', 
        name: 'English'
      },
      { 
        code: 'fr',
        language: 'fr-FR',
        file: 'fr-FR.json',
        dir: 'ltr', 
        name: 'Français'
      }
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
