import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
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
  
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/devtools',
    // '@artmizu/nuxt-prometheus',
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

  // vuetify: {
  //   moduleOptions: {
  //     styles: true
  //   },
  //   vuetifyOptions: {
  //     ssr: {
  //       clientWidth: 1280,
  //       clientHeight: 70
  //     },
  //     defaults: {
  //       global: {
  //         ripple: true,
  //       },
  //     },
  //     theme: {
  //       defaultTheme: 'light'
  //     }
  //   }
  // },

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
  }
})
