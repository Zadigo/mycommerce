import { createApp, toRaw } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createVueLocalStorage, createVueSession, VueLocalStorageInstance, VueSessionInstance } from './plugins/vue-storages'
import { createHead } from "unhead";

import App from './App.vue'

import './style.css'
import { createPinia } from 'pinia'

const localstorage = createVueLocalStorage({
    afterMount ({ instance }) {
        if (!instance.keyExists('likedProducts')) {
            instance.create('likedProducts', [])
        }

        if (!instance.keyExists('visitedProducts')) {
            instance.create('visitedProducts ', [])
        }
    }
})

const session = createVueSession({
    afterMount ({ instance }) {
        instance.bulkCreate({
            likedProducts: [],
            visitedProducts: []
        })
    }
})

const pinia = createPinia()

pinia.use(({ store }) => {
  // store.$router = toRaw(router);
  store.$session = toRaw(session);
  store.$localstorage = toRaw(localstorage);

  // Intercept actions on adding a product in
  // the cart so that the items can be stored
  // in the user's session
  store.$onAction(({ name, store, after }) => {
    if (
      (name === "updateCart" || name === "removeFromCart") &&
      store.$id === "cart"
    ) {
      after(() => {
        VueSessionInstance.create("cart", store.$state.products);
        // session.create('cart_cache', store.$state.cache)
      });
    }
  });

  store.$subscribe((mutation, state) => {
    // Intercept actions such as addToWishlist, removeFromWishlist
    // and addToHistory so that we can automatically commit the
    // registered products in the store in the user session
    if (mutation.storeId === "shop") {
      VueLocalStorageInstance.create("likedProducts", state.likedProducts);
      VueLocalStorageInstance.create("visitedProducts", state.visitedProducts);
      // VueSessionInstance.create('likedProducts', state.likedProducts)
      // VueSessionInstance.create('visitedProducts', state.visitedProducts)
    }
  });
})

// https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
const head = createHead({
    plugins: []
})

head.push({ titleTemplate: "%s - Boutique" });

const app = createApp(App)
app.use(localstorage)
app.use(session)
app.use(pinia)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
