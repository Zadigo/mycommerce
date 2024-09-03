import App from './App.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import { createHead } from 'unhead'
import { createApp, toRaw } from 'vue'
import { createVuetify } from 'vuetify'
import { createVueLocalStorage, createVueSession, VueLocalStorageInstance, VueSessionInstance } from './plugins/vue-storages'

import DayJsAdapter from '@date-io/dayjs'
import router from './router'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import colors from 'vuetify/util/colors'

import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-ui-kit/css/mdb.min.css'
import 'vuetify/styles'
import './style.css'

import './plugins'

import ShopLayout from './layouts/ShopLayout.vue'
import installPlugins from './plugins'

const head = createHead({
  plugins: []
})

// https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
head.push({ titleTemplate: '%s - Boutique' })
// head.push({ link: { rel: 'icon', href: '/google.com' } })
// head.push({ link: { rel: 'apple-touch-icon', href: '/google.com', sizes: '180x180' } })
// head.push({ link: { rel: 'mask-icon', href: '/mask-icon.svg', color: '#FFFFFF' }})
// head.push({ meta: { name: 'theme-color', content: '#fffff'  }})

const pinia = createPinia()

const sessionPlugin = createVueSession({
  afterMount ({ instance }) {
    instance.bulkCreate({
      likedProducts: [],
      visitedProducts: []
    })
  }
})

const localStoragePlugin = createVueLocalStorage({
  afterMount ({ instance }) {
    if (!instance.keyExists('likedProducts')) {
      instance.create('likedProducts', [])
    }

    if (!instance.keyExists('visitedProducts')) {
      instance.create('visitedProducts', [])
    }
  }
})

pinia.use(({ store }) => {
  store.$router = toRaw(router)
  store.$session = toRaw(VueSessionInstance)
  store.$localstorage = toRaw(VueLocalStorageInstance)
  
  // Intercept actions on adding a product in 
  // the cart so that the items can be stored
  // in the user's session
  store.$onAction(({ name, store, after }) => {
    if ((name === 'updateCart' || name === 'removeFromCart') && store.$id === 'cart') {
      after(() => {
        VueSessionInstance.create('cart', store.$state.products)
        // session.create('cart_cache', store.$state.cache)
      })
    }
  })

  store.$subscribe((mutation, state) => {
    // Intercept actions such as addToWishlist, removeFromWishlist
    // and addToHistory so that we can automatically commit the
    // registered products in the store in the user session
    if (mutation.storeId === 'shop') {
      VueLocalStorageInstance.create('likedProducts', state.likedProducts)
      VueLocalStorageInstance.create('visitedProducts', state.visitedProducts)
    }
  })
})

const vuetify = createVuetify({
  components,
  directives,
  date: {
    adapter: DayJsAdapter
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.red.darken1
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App)
// https://vuejs.org/guide/best-practices/performance
// https://javascript.works-hub.com/learn/how-to-make-your-vue-js-application-faster-a7219
app.config.performance = true
app.use(router)
app.use(pinia)
app.use(vuetify)
app.use(installPlugins())
app.use(sessionPlugin)
app.use(localStoragePlugin)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('ShopLayout', ShopLayout)
app.mount('#app')
