import { useAuthentication } from '../stores/authentication'
import { createRouter, createWebHistory, isNavigationFailure } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: "/",
      redirect: "/shop",
    },
    {
      path: "/shop",
      name: "shop_collections",
      component: async () => import("../pages/CollectionsPage.vue"),
      meta: {
        requiresAuthentication: false,
      },
    },
    {
      path: "/shop/collection/:id",
      name: "shop_products_collection",
      component: async () => import("../pages/ProductsPage.vue"),
      meta: {
        requiresAuthentication: false,
      },
    },
    {
      path: "/shop/:id",
      name: "shop_product",
      component: async () => import("../pages/ProductPage.vue"),
      meta: {
        requiresAuthentication: false,
      },
    },
    {
      path: "/wishlist",
      name: "wishlist",
      component: async () => import("../pages/WishlistPage.vue"),
      meta: {
        requiresAuthentication: false,
      },
    },
    {
      path: "/cart",
      component: async () => import("../layouts/PaymentLayout.vue"),
      children: [
        {
          path: "",
          name: "shop_payment_home",
          component: async () => import("../pages/cart/PaymentHomePage.vue"),
          meta: {
            requiresAuthentication: true,
          },
        },
        {
          path: "shipment",
          name: "shop_shipment",
          component: async () => import("../pages/cart/ShipmentPage.vue"),
          meta: {
            requiresAuthentication: true,
          },
        },
        {
          path: "payment",
          name: "shop_payment",
          component: async () => import("../pages/cart/PaymentPage.vue"),
          meta: {
            requiresAuthentication: true,
          },
        },
        {
          path: "success",
          name: "shop_payment_success",
          component: async () => import("../pages/cart/PaymentSuccess.vue"),
          meta: {
            requiresAuthentication: true,
          },
        },
      ],
    },
    {
      path: "/accounts",
      component: async () => import("../layouts/AccountsLayout.vue"),
      children: [
        {
          path: "",
          name: "accounts_home",
          component: async () => import("../pages/accounts/UserPage.vue"),
          meta: {
            requiresAuthentication: true,
          },
        },
        {
          path: "orders",
          name: "accounts_orders",
          component: async () => import("../pages/accounts/OrdersPage.vue"),
          meta: {
            requiresAuthentication: true,
          },
        },
      ],
    },
    {
      path: "/test",
      name: "test_page",
      component: () => import("../pages/TestPage.vue"),
    },
    {
      path: "/404",
      name: "not_found",
      component: () => import("../pages/ErrorNotFound.vue"),
    },
    {
      path: "/:catchAll(.*)*",
      component: () => import("../pages/ErrorNotFound.vue"),
    },
  ],
});

router.beforeEach((to, _, next) => {
  const store = useAuthentication()

  if (to.meta.requiresAuthentication) {
    if (!store.isAuthenticated) {
      next({
        name: 'shop_collections',
        query: {
          login: 0
        }
      })
    }
  } else {
    next()
  }
})

router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure)) {
    // Do something
    console.log('navigation failure', failure, to, from)
  }
})

router.onError((error, to, from) => {
  console.error(error, to, from)
})

export default router
