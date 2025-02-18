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
    'vuetify-nuxt-module',
    '@nuxt/test-utils'
  ]
})