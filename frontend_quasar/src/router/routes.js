
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/HomePage.vue'),
        name: 'home_view'
      },
      {
        path: 'products',
        component: () => import('pages/ProductsPage.vue'),
        name: 'products_view'
      },
      {
        path: 'products/:id(\\d+)',
        component: () => import('pages/ProductPage.vue'),
        name: 'product_view'
      },
      {
        path: 'carts',
        component: () => import('pages/CartsPage.vue'),
        name: 'carts_view'
      },
      {
        path: 'reviews',
        component: () => import('pages/ReviewsPage.vue'),
        name: 'reviews_view'
      },
      {
        path: 'shipments',
        component: () => import('pages/ShipmentsPage.vue'),
        name: 'shipments_view'
      },
      {
        path: 'stocks',
        component: () => import('pages/StocksPage.vue'),
        name: 'stocks_view'
      },
      {
        path: 'stocks/:id(\\d+)',
        component: () => import('pages/StockPage.vue'),
        name: 'stock_view'
      },
      {
        path: 'subscribers',
        component: () => import('pages/SubscribersPage.vue'),
        name: 'subscribers_view'
      },
      {
        path: 'orders',
        component: () => import('pages/OrdersPage.vue'),
        name: 'orders_view'
      },
      {
        path: 'orders/:id(\\d+)',
        component: () => import('pages/OrderPage.vue'),
        name: 'order_view'
      },
      {
        path: 'images',
        component: () => import('pages/ImagesPage.vue'),
        name: 'images_view'
      },
      {
        path: 'images/:id(\\d+)',
        component: () => import('pages/ImagePage.vue'),
        name: 'image_view'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
