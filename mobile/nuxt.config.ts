// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@pinia/nuxt',
    'nuxt-vuefire',
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@askdoppler/nuxt',
    '@nuxtjs/apollo',
    '@nuxtjs/ionic',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@ionic/cli'
  ],

  vuefire: {
    config: {

    }
  },

  ionic: {
    integrations: {
      //
    },
    css: {
      //
    },
    config: {
      //
    }
  },

  runtimeConfig: {
    
  }
})