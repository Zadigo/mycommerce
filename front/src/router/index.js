import Vue from 'vue'
import VueRouter from 'vue-router'

import i18n from '../i18n'
import store from '@/store'
import { loadView } from '../utils'

// Routes
import shop from './shop'
import dashboard from './dashboard'
import accounts from './accounts'

// import BaseAccount from '@/layouts/BaseAccount.vue'

Vue.use(VueRouter)

var routes = [
  {
    path: '/',
    redirect: {
      name: 'home_view',
      params: {
        lang: i18n.locale
      }
    }
  },
  {
    path: '/:lang',
    component: {
      render: h => h('router-view')
    },
    children: [
      ...shop,
      ...accounts,

      {
        path: '/cookie-settings',
        name: 'cookie_settings_view',
        component: loadView('CookiesView')
      }
    ]
  },

  ...dashboard,
]

var router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => {
    window.scrollTo(0, 0)
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.forAdmin) {
    // For now, only do translation for the
    // main website. The admin site will be
    // defaulted to french or english
    var localeLanguage = to.params.lang
    var supportedLanguages = process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',')
  
    if (!supportedLanguages.includes(localeLanguage)) { next('en') }
    if (i18n.locale !== localeLanguage) { i18n.locale = localeLanguage }
  }

  if (to.meta['requiresAuthentication']) {
    if (!store.getters['authenticationModule/isAuthenticated']) {
      next('login')
    }
  }

  if (to.meta['requiresAdmin']) {
    if (!store.getters['authenticationModule/isAdmin']) {
      next('login')
    }
  }

  return next()
})

export default router
