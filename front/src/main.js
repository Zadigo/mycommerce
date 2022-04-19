import '@babel/polyfill'
import 'mutationobserver-shim'
import App from './App.vue'
import Vue from 'vue'

// Plugins/Mixins
import './plugins/fontawesome'
import './plugins/axios'
import './plugins/bootstrap-vue'
import client from './plugins/axios'
import currency from './plugins/currency'
import ecommerce from './plugins/ecommerce'
import hero from './plugins/hero'
import i18n from './i18n'
import mixins from './mixins/utils'
import myProject from './plugins/my-project'
import router from './router'
import store from './store'
import session from './plugins/my-session'
import vuetify from './plugins/vuetify'
import VueAxios from 'vue-axios'
import VueGeolocation from 'vue-browser-geolocation'

// Components
import BaseSubscriptionModal from './components/BaseSubscriptionModal.vue'
import BaseTopBanner from './components/BaseTopBanner.vue'
import BaseMessages from './components/BaseMessages.vue'
import BaseTag from './layouts/BaseTag.vue'
import CountryFlag from 'vue-country-flag'
import LoginModal from './components/auth/LoginModal.vue'
import ModalCart from './components/ModalCart.vue'

import '@fontsource/montserrat'
import '@fontsource/roboto'

Vue.config.productionTip = false

// Plugins
Vue.use(ecommerce)
Vue.use(hero)
Vue.use(myProject)
Vue.use(session)
Vue.use(currency)
Vue.use(VueAxios, client)
Vue.use(VueGeolocation)
// Vue.use(myAnalytics)
// Vue.use(mySharingLinks)

// Mixins
Vue.mixin(mixins)

// Components
Vue.component('modal-cart', ModalCart)
Vue.component('base-messages', BaseMessages)
Vue.component('base-top-banner', BaseTopBanner)
Vue.component('base-subscription-modal', BaseSubscriptionModal)
Vue.component('login-modal', LoginModal)
Vue.component('base-tag', BaseTag)
Vue.component('country-flag', CountryFlag)

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')
