import type { NavigationGuard } from 'vue-router'
// import { useCart } from "~/stores/cart"

/**
 * TODO: Activate when design process is complete
 */
export default defineNuxtRouteMiddleware((to): ReturnType<NavigationGuard> => {
  if (import.meta.server) return

  // const { hasProducts } = storeToRefs(useCart())

  // if (!hasProducts.value && to.path.includes('/cart/')) {
  //     return abortNavigation('Cart does not have any items')
  // } else {
  //     return true
  // }
})
