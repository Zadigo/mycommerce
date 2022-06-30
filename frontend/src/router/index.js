import i18n from '@/i18n'

import { scrollToTop, loadView } from '../utils'
import { createRouter, createWebHistory } from 'vue-router'

import accounts from './accounts'
import dashboard from './dashboard'
import shop from './shop'

const routes = [
  {
    path: '/',
    redirect: {
      name: 'shop_view',
      params: {
        lang: i18n.global.locale
      }
    }
  },
  {
    path: '/:lang',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      ...shop,
      ...accounts,
      {
        path: 'login',
        name: 'login_view',
        meta: {
          isFullPage: true
        },
        component: loadView('shop/auth/LoginView')
      },
      {
        path: 'signup',
        name: 'signup_view',
        meta: {
          isFullPage: true
        },
        component: loadView('shop/auth/SignupView')
      }
    ]
  },
  ...dashboard,
  {
    path: '/cookie-settings',
    name: 'cookie_settings_view',
    component: loadView('shop/CookiesView')
  },
  {
    path: '/how-to-order',
    name: 'how_to_order_view'
    // component: loadView('CookiesView')
  },
  {
    path: '/how-to-track',
    name: 'how_to_track_view'
    // component: loadView('CookiesView')
  },
  {
    path: '/contact-us',
    name: 'contact_us_view'
    // component: loadView('CookiesView')
  },
  {
    path: '/about-us',
    name: 'about_us_view',
    component: loadView('shop/AboutView')
  },
  {
    path: '/payment-methods',
    name: 'payment_methods_view'
    // component: loadView('CookiesView')
  }
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: scrollToTop,
  routes
})

router.beforeEach((to, from, next) => {
  const localeLanguage = to.params.lang
  // const supportedLanguages = process.env.LANGUAGES.split(',')
  const supportedLanguages = ['en', 'es', 'fr']

  if (!supportedLanguages.includes(localeLanguage)) { next('en') }
  if (i18n.global.locale !== localeLanguage) { i18n.global.locale = localeLanguage }

  next()
})

export default router
