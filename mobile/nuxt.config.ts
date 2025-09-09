import tailwind from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/ionic', // FIXME: Not working with Nuxt 4.1.0
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  css: [
    '~/assets/css/tailwind.css'
  ],

  vite: {
    plugins: [
      tailwind()
    ]
  }
})
