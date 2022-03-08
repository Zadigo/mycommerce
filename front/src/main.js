import '@babel/polyfill'
import 'mutationobserver-shim'
import App from './App.vue'
import Vue from 'vue'

// Plugins
import './plugins/fontawesome'
import './plugins/axios'
import './plugins/bootstrap-vue'
import './plugins/session'
// TODO: Unify in vue-project
import ecommerce from './plugins/ecommerce'
import myProject from './plugins/my-project'
import i18n from './i18n'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import hero from './plugins/hero'
// import mySharingLinks from './plugins/my-sharing-links'
import myAnalytics from './plugins/my-analytics'

// TODO: Unify
// import globalMixin from './mixins'

// Components
import BaseSubscriptionModal from './components/BaseSubscriptionModal.vue'
import BaseTopBanner from './components/BaseTopBanner.vue'
import BaseModalCart from './components/BaseModalCart.vue'
import BaseMessages from './components/BaseMessages.vue'
import BaseTag from './components/BaseTag.vue'
import LoginModal from './components/auth/LoginModal.vue'
import CountryFlag from 'vue-country-flag'

import '@fontsource/montserrat'
import '@fontsource/roboto'

Vue.config.productionTip = false

// Plugins
Vue.use(ecommerce)
Vue.use(hero)
// Vue.use(mySharingLinks)
Vue.use(myAnalytics)
Vue.use(myProject)


// Mixins
// Vue.mixin(globalMixin)

// Components
Vue.component('base-modal-cart', BaseModalCart)
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
  trackSiteAnalytics: true,
  render: h => h(App),
}).$mount('#app')
