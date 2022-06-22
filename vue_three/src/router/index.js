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
      params: i18n.global.locale
    }
  },
  {
    path: '/:lang',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      ...shop,
      ...accounts
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

export default router
