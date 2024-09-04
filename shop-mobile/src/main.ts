import { createApp, toRaw } from 'vue'
import { createPinia } from 'pinia';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { createVueLocalStorage, createVueSession, VueSessionInstance, VueLocalStorageInstance } from './plugins/vue-storages';

import App from './App.vue'
import router from './router';
import '@/plugins/index'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

const localstorage = createVueLocalStorage({
  afterMount ({ instance }) {
    if (!instance.keyExists('likedProducts')) {
      instance.create('likedProducts', [])
    }

    if (!instance.keyExists('visitedProducts')) {
      instance.create('visitedProducts', [])
    }
  }
})

const session = createVueSession()

const pinia = createPinia()

pinia.use(({ store }) => {
  store.$router = toRaw(router);
  store.$session = toRaw(VueSessionInstance);
  store.$localstorage = toRaw(VueLocalStorageInstance);

  store.$subscribe((mutation, state) => {
    if (mutation.storeId === 'shop') {
      VueLocalStorageInstance?.create("likedProducts", state.likedProducts);
      VueLocalStorageInstance?.create("visitedProducts", state.visitedProducts);
    }
  })
})

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(localstorage)
  .use(session)
  .use(pinia)
  .component("FontAwesomeIcon", FontAwesomeIcon);

router.isReady().then(() => {
  app.mount('#app');
});
