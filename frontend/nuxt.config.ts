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
    // '~/assets/style.scss',
    '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '~/node_modules/mdb-ui-kit/css/mdb.min.css',
  ]
})
