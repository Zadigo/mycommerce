// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap',
    '@unlok-co/nuxt-stripe',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/test-utils',
    '@nuxtjs/seo',
    '@vesp/nuxt-fontawesome',
    'vuetify-nuxt-module',
    'vue-sonner/nuxt'
  ],
  i18n: {
    baseUrl: './',
    langDir: './locales',
    defaultLocale: 'fr',
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en-US.json',
        dir: 'ltr',
        name: 'English'
      },
      {
        code: 'es',
        language: 'es-ES',
        file: 'es-ES.json',
        dir: 'ltr',
        name: 'Spanish'
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
  css: [
    '~/assets/style.scss',
    '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '~/node_modules/mdb-ui-kit/css/mdb.min.css',
  ],
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
  }
})
