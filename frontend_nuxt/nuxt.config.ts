import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
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
      DJANGO_PROD_URL: process.env.NUXT_DJANGO_PROD_URL 
    }
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  ssr: true,
  // routeRules: {
  //   '/': { ssr: true }
  // }
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vesp/nuxt-fontawesome',
    'vuetify-nuxt-module',
    '@nuxtjs/google-fonts',
    '@nuxt/test-utils/module',
    '@nuxtjs/google-fonts',
    'nuxt-gtag',
    'nuxt-clarity-analytics',
    '@unlok-co/nuxt-stripe'
  ],
  alias: {
    '@': path.resolve(__dirname, './')
  },
  eslint: {
    
  },
  googleFonts: {
    families: {
      Ubuntu: true
    }
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-XX'
  },
  css: [
    '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '~/node_modules/mdb-ui-kit/css/mdb.min.css'
  ],
  vuetify: {
    moduleOptions: {

    },
    vuetifyOptions: {

    }
  },
  fontawesome: {
    icons: {
      solid: []
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
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        port: 6379,
        host: 'driver',
        username: '',
        password: ''
      }
    }
  }
})