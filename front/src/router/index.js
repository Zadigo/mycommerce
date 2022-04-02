import Vue from 'vue'
import VueRouter from 'vue-router'

import i18n from '../i18n'
import store from '@/store'
// import googleAnalytics from 'google_analytics'

import BaseAccount from '@/views/auth/BaseAccount.vue'

Vue.use(VueRouter)

function loadView(component) {
  return () => import(`@/views/${component}.vue`)
}

function loadLayout(component) {
  return () => import(`@/layouts/${component}.vue`)
}

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
        component: loadView('HomeView'),
        meta: {
          fullPage: false
        }
      },
      {
        path: 'collections/:collection([a-z-]+)',
        name: 'collection_details',
        component: loadView('CollectionView'),
        meta: {
          fullPage: false
        }
      },
      // {
      //   path: 'collections/:collection([a-z-]+)/:product(\\d+)/:slug([a-z-]+)',
      //   name: 'collection_product_view',
      //   component: loadView('CollectionView'),
      //   meta: {
      //     fullPage: false
      //   }
      // },
      {
        path: 'products/:id(\\d+)/:slug([a-z-]+)',
        name: 'product_view',
        component: loadView('ProductView'),
        meta: {
          fullPage: false
        }
      },
      {
        path: 'wishlist',
        name: 'wishlist',
        component: loadView('WishlistView'),
        meta: {
          fullPage: false
        }
      },
      {
        path: 'cart',
        name: 'cart',
        component: loadView('CartView'),
        meta: {
          fullPage: false
        }
      },

      {
        path: 'size-guide',
        name: 'size_guide',
        component: loadView('SizeGuideView'),
        meta: {
          fullPage: true
        }
      },

      {
        path: 'fitting-room',
        name: 'fitting_room_view',
        component: loadView('FittingRoomView')
      },

      {
        path: 'account',
        component: BaseAccount,
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
        path: 'login',
        name: 'login_view',
        meta: {
          fullPage: true
        },
        component: loadView('auth/LoginView')
      },
      {
        path: 'signup',
        name: 'signup_view',
        meta: {
          fullPage: true
        },
        component: loadView('auth/SignupView')
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
      }

      // {
      //   path: '*',
      //   name: '404_error',
      //   component: () => import('@/views/404_View.vue')
      // }
    ]
  },


  {
    path: '/dashboard',
    component: loadLayout('DashboardSite'),
    children: [
      {
        path: '',
        name: 'dashboard_index_view',
        meta: {
          text: 'Home',
          icon: 'home',
          adminLink: true
        },
        component: loadView('dashboard/IndexView')
      },
      {
        path: 'products',
        name: 'dashboard_products',
        meta: {
          text: 'Products',
          icon: 'table',
          adminLink: true
        },
        component: loadView('dashboard/ProductsView')
      },
      {
        path: 'products/:id',
        name: 'dashboard_product',
        meta: {
          text: 'Product',
          icon: 'table'
        },
        component: loadView('dashboard/ProductView')
      },
      {
        path: 'images',
        name: 'dashboard_images',
        meta: {
          text: 'Images',
          icon: 'images',
          adminLink: true
        },
        component: loadView('dashboard/ProductsImagesView')
      },
      {
        path: 'images/:id(\\d+)',
        name: 'dashboard_image_view',
        meta: {
          text: 'Image',
          icon: 'image'
        },
        component: loadView('dashboard/ProductImageView')
      }
    ]
  },

  {
    path: '/500',
    name: 'server_error_view',
    component: loadView('404View')
  },
  {
    path: '/404',
    name: 'not_found_view',
    alias: '*',
    component: loadView('404View')
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  scrollBehavior: () => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 700);
  },
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

  // functions.pageView(to.path, 'Page Title')
  
  if (to.meta['requiresAuthentication']) {
    if (!store.getters['authenticationModule/isAuthenticated']) {
      next('login')
    } else {
      next()
    }
  }

  return next()
})

// router.afterEach((to, from) => {
//   to
//   from
// })

export default router
