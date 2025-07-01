export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@intlify/nuxt3'],
  intlify: {
    localeDir: 'locales',
    vueI18n: './i18n.config.ts'
  }
})
