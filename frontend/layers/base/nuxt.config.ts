export default defineNuxtConfig({
  imports: {
    dirs: ['data']
  },
  
  vuefire: {
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      dbUrl: process.env.NUXT_PUBLIC_FIREBASE_DB_URL,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      messageSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID
    }
  },
  
  fonts: {
    families: [
      // Body
      {
        name: 'Sora',
        weight: [100, 800],
        styles: ['normal', 'italic'],
        preload: true
      },
      // Title
      {
        name: 'Manrope',
        weight: [200, 800],
        styles: ['normal', 'italic'],
        preload: true
      }
    ]
  },

  stripe: {
    server: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    },
    client: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
  },

  image: {
    // TODO: Activate when the project images backend
    // is set correctly to cloudefare/aws
    // https://image.nuxt.com/providers/cloudflare
    provider: 'none'
  },

  nuxtAuthentication: {
    domain: process.env.NUXT_PUBLIC_DJANGO_PROD_URL || 'http://127.0.0.1:8000',
    accessEndpoint: '/auth/v1/token/',
    refreshEndpoint: '/auth/v1/token/refresh/',
    verifyEndpoint: '/auth/v1/token/verify/'
  },

  ganalytics: {
    ga4: {
      id: 'G-CVKFG2XPVG',
      enableDebug: true
    },
    gtm: {
      id: 'GTM-TJZFHM5'
    }
  }
})
