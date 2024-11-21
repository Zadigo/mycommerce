import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
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
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Ubuntu: true
        }
      }
    ]
  ],
  alias: {
    '@': path.resolve(__dirname, './')
  },
  eslint: {
    
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
  testUtils: {
    vitestConfig: {
      alias: {
        '@': path.resolve(__dirname, './')
      },
      css: true,
      dir: path.resolve(__dirname, './tests'),
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
