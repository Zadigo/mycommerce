import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: async () => import('pages/HomePage.vue'),
    name: 'home_view'
  },
  {
    path: 'products',
    component: async () => import('pages/ProductsPage.vue'),
    name: 'products_view'
  },
  {
    path: 'products/:id(\\d+)',
    component: async () => import('pages/ProductPage.vue'),
    name: 'product_view'
  },
  {
    path: 'carts',
    component: async () => import('pages/CartsPage.vue'),
    name: 'carts_view'
  },
  {
    path: 'reviews',
    component: async () => import('pages/ReviewsPage.vue'),
    name: 'reviews_view'
  },
  {
    path: 'shipments',
    component: async () => import('pages/ShipmentsPage.vue'),
    name: 'shipments_view'
  },
  {
    path: 'stocks',
    component: async () => import('pages/StocksPage.vue'),
    name: 'stocks_view'
  },
  {
    path: 'stocks/:id(\\d+)',
    component: async () => import('pages/StockPage.vue'),
    name: 'stock_view'
  },
  {
    path: 'subscribers',
    component: async () => import('pages/SubscribersPage.vue'),
    name: 'subscribers_view'
  },
  {
    path: 'orders',
    component: async () => import('pages/OrdersPage.vue'),
    name: 'orders_view'
  },
  {
    path: 'orders/:id(\\d+)',
    component: async () => import('pages/OrderPage.vue'),
    name: 'order_view'
  },
  {
    path: 'images',
    component: async () => import('pages/ImagesPage.vue'),
    name: 'images_view'
  },
  {
    path: 'images/:id(\\d+)',
    component: async () => import('pages/ImagePage.vue'),
    name: 'image_view'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes