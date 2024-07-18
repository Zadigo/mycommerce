import App from './App.vue'

import { useScript } from 'unhead'
import { createApp, toRaw } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createHead } from 'unhead'
// import { CapoPlugin } from 'unhead'
import { useVueSession } from './plugins/vue-storages'

import router from './router'
import DayJsAdapter from '@date-io/dayjs'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
// import { aliases, fa } from 'vuetify/iconsets/fa'

import './style.css'
import 'vuetify/styles'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-ui-kit/css/mdb.min.css'
import '@mdi/font/css/materialdesignicons.css'

import './plugins'

import ShopLayout from './layouts/ShopLayout.vue'
import installPlugins from './plugins'

const head = createHead({
  plugins: [
    // CapoPlugin()
  ]
})

const pinia = createPinia()
pinia.use(({ store }) => {
  const { session } = useVueSession()

  store.$router = toRaw(router)
  store.$session = toRaw(session)
  
  // Intercept actions on adding a product in 
  // the cart so that the items can be stored
  // in the user's session
  store.$onAction(({ name, store, after }) => {
    if ((name === 'updateCart' || name === 'removeFromCart') && store.$id === 'cart') {
      after(() => {
        session.create('cart', store.$state.products)
        // session.create('cart_cache', store.$state.cache)
      })
    }
  })

  store.$subscribe((mutation, state) => {
    // Intercept actions such as addToWishlist, removeFromWishlist
    // and addToHistory so that we can automatically commit the
    // registered products in the store in the user session
    if (mutation.storeId === 'shop') {
      session.create('likedProducts', state.likedProducts)
      session.create('visitedProducts', state.visitedProducts)
    }
  })
})

const plugins = installPlugins()

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
      // fa
    }
  }
})

// TODO: Google Analytics does not work
function createGoogleAnalytics (options) {
  const { gtag } = useScript(`https://www.googletagmanager.com/gtag/js?id=${options.id}`, {
    beforeInit () {
      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag (...p) {
        window.dataLayer.push(p)
      }
      window.gtag('js', new Date())
      window.gtag('config', options.id, { debug: 'true' })
    },
    use () {
      return { gtag: window.gtag }
    }
  })

  return {
    install: (app) => {
      app.config.globalProperties.$analytics = gtag
      app.mixin({
        data () {
          return {
            analyticsTag: options.id
          }
        }
      })
    }
  }
}

const app = createApp(App)
app.use(router)
app.use(createGoogleAnalytics({
  id: 'G-CVKFG2XPVGv'
}))
app.use(pinia)
app.use(vuetify)
app.use(head)
app.use(plugins)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('ShopLayout', ShopLayout)
app.mount('#app')
