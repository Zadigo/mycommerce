import { createApp, toRaw } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import {
  createVueLocalStorage,
  createVueSession,
  VueLocalStorageInstance,
  VueSessionInstance,
} from "./plugins/vue-storages";
import { createHead } from "unhead";
import installPlugins, { i18n } from "./plugins";

import App from "./App.vue";
import router from "./router";
import DayJsAdapter from "@date-io/dayjs";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import colors from "vuetify/util/colors";


import "bootstrap/dist/css/bootstrap.min.css"
import "mdb-ui-kit/css/mdb.min.css"
import "./style.css";

const app = createApp(App);

const localstorage = createVueLocalStorage({
  afterMount({ instance }) {
    if (!instance.keyExists("likedProducts")) {
      instance.create("likedProducts", []);
    }

    if (!instance.keyExists("visitedProducts")) {
      instance.create("visitedProducts ", []);
    }
  },
});

const session = createVueSession({
  afterMount({ instance }) {
    instance.bulkCreate({
      likedProducts: [],
      visitedProducts: [],
    });
  },
});

const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = toRaw(router);
  store.$session = toRaw(VueSessionInstance);
  store.$localstorage = toRaw(VueLocalStorageInstance);

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
    }
  });
});

// https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
const head = createHead({
  plugins: [],
});

head.push({ titleTemplate: "%s - Boutique" });

const vuetify = createVuetify({
  components,
  directives,
  date: {
    adapter: DayJsAdapter,
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.red.darken1,
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

app.use(localstorage);
app.use(session);
app.use(pinia);
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(installPlugins())

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
