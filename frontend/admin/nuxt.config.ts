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
    '@nuxt/content',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  ui: {
    prefix: 'Nuxt'
  },

  vite: {
    plugins: [
      tailwind()
    ]
  },

  runtimeConfig: {
    public: {
      prodDomain: process.env.NUXT_PUBLIC_DJANGO_SHOP_PROD_DOMAIN || 'http://127.0.0.1:8000',
      prodCartDomain: process.env.NUXT_PUBLIC_DJANGO_CART_PROD_DOMAIN || 'http://127.0.0.1:8001',
      prodReviewsDomain: process.env.NUXT_PUBLIC_DJANGO_REVIEWS_PROD_DOMAIN || 'http://127.0.0.1:8002'
    }
  }
})