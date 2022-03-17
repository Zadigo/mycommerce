import Vue from 'vue'
import VueRouter from 'vue-router'

import i18n from '../i18n'
import Account from '../views/Account.vue'
import store from '../store'

import googleAnalyticsFunctions from '../plugins/analytics/google/functions'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'home', params: { lang: i18n.locale }}
  },

  {
    path: '/:lang',
    component: {
      render: h => h('router-view')
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
      },
      {
        path: 'collections/:collection([a-z-]+)',
        name: 'collection_details',
        component: () => import(/* webpackChunkName: "collection" */ '@/views/CollectionView.vue')
      },
      {
        path: 'products/:id(\\d+)/:slug([a-z-]+)',
        name: 'product',
        component: () => import(/* webpackChunkName: "product" */ '../views/ProductView.vue')
      },
      {
        path: 'wishlist',
        name: 'wishlist',
        component: () => import(/* webpackChunkName: "wishlist" */'@/views/WishlistView.vue')
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import(/* webpackChunkName: "cart" */'@/views/CartView.vue')
      },

      {
        path: 'account',
        component: Account,
        children: [
          {
            path: '',
            name: 'account_home',
            meta: { requiresAuthentication: true },
            component: () => import(/* webpackChunkName: "account" */ '../components/account/Home.vue')
          },
          {
            path: 'your-orders',
            name: 'your_orders',
            component: () => import(/* webpackChunkName: "account" */ '../components/account/YourOrders.vue')
          },
          {
            path: 'your-account',
            name: 'your_account',
            meta: {
              pageTitle: i18n.t('your_account')
            },
            component: () => import(/* webpackChunkName: "account" */ '../components/account/YourAccount.vue')
          },
          {
            path: 'advantages',
            name: 'advantages',
            component: () => import(/* webpackChunkName: "account" */ '../components/account/Home.vue')
          },
          {
            path: 'your_payments',
            name: 'your_payments',
            component: () => import(/* webpackChunkName: "account" */ '../components/account/Home.vue')
          },
          {
            path: 'help',
            name: 'help',
            component: () => import(/* webpackChunkName: "account" */ '../components/account/Home.vue')
          },
          {
            path: 'lists',
            name: 'likes_and_lists',
            component: () => import(/* webpackChunkName: "account" */ '../components/account/UserLists.vue')
          }
        ]
      },

      {
        path: '/login',
        name: 'login',
        meta: {
          fullPage: true
        },
        component: () => import('@/views/LoginView.vue')
      },
      
      {
        path: '/size-guide',
        name: 'size_guide',
        component: () => import('@/views/SizeGuideView.vue')
      },

      {
        path: '/how-to-order',
        name: 'how_to_order'
      },
      {
        path: '/how-to-track',
        name: 'how_to_track'
      },
      {
        path: '/delivery-and-returns',
        name: 'delivery_and_returns',
        component: () => import(/* webpackChunkName: "customer_care" */ '@/views/customer_care/DeliveryAndReturnsView.vue')
      },
      {
        path: '/contact-us',
        name: 'contact_us'
      },
      {
        path: '/payment-methods',
        name: 'payment_methods'
      },

      {
        path: '*',
        name: '404_error',
        component: () => import('@/views/404_View.vue')
      }
    ]
  },

  {
    path: '/dashboard',
    components: {
      dashboard: () => import('@/components/dashboard/BaseLayout.vue')
    },
    children: [
      {
        path: '',
        name: 'dashboard_index',
        meta: {
          text: 'Home',
          icon: 'home',
          isAdmin: true
          // requiresAdmin: true
        },
        components: {
          content: () => import('@/views/dashboard/IndexView.vue')
        }
      },
      {
        path: 'products',
        name: 'dashboard_products',
        meta: {
          text: 'Products',
          icon: 'table',
          isAdmin: true
          // requiresAdmin: true
        },
        components: {
          content: () => import('@/views/dashboard/ProductsView.vue')
        }
      },
      {
        path: 'products/:id',
        name: 'dashboard_product',
        meta: {
          text: 'Product',
          icon: 'table',
          isAdmin: true
          // requiresAdmin: true
        },
        components: {
          content: () => import('@/views/dashboard/ProductView.vue')
        }
      },
      {
        path: 'images',
        name: 'dashboard_images',
        meta: {
          text: 'Images',
          icon: 'images',
          isAdmin: true
          // requiresAdmin: true
        },
        components: {
          content: () => import('@/views/dashboard/ProductImagesView.vue')
        }
      }
    ]
  },

  {
    path: '/404',
    name: 'not_found',
    alias: '*',
    component: () => import('@/views/404_View.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  scrollBehavior: () => { window.scrollTo(0, 0) },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name.includes('dashboard')) {
    return next()
  }

  var localeLanguage = to.params.lang
  var supportedLanguages = process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',')

  if (!supportedLanguages.includes(localeLanguage)) { return next('en') }
  if (i18n.locale !== localeLanguage) { i18n.locale = localeLanguage }

  if (to.meta['requiresAuthentication']) {
    if (!store.getters['authenticationModule/isAuthenticated']) {
      next('login')
    } else {
      next()
    }
  }
  // googleAnalyticsFunctions.DEFAULT_CURRENCY i18n.n()
  googleAnalyticsFunctions.pageView(to.path, null)
  
  return next()
})

// router.afterEach((to, from) => {
//   to
//   from
// })

export default router
