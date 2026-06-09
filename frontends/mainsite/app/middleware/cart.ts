import type { EventNames } from 'nuxt-ganalytics'
import type { NavigationGuard } from 'vue-router'

/**
 * TODO: Activate when design process is complete
 */
export default defineNuxtRouteMiddleware((to): ReturnType<NavigationGuard> => {
  if (import.meta.server) return
  
  /**
   * Analytics Events
   */

  const { docRef, cart } = useCartComposable()
  const { buildProductFromCartItem } = useGoogleAnalyticsCallbacks()
  const { sendEvent } = useAnalyticsEvent()

  const steps = ['/cart/', '/cart/shipment', '/cart/payment', '/cart/success']
  const events: EventNames[] = ['begin_checkout', 'add_shipping_info', 'add_payment_info', 'purchase']

  const currentStep = computed(() => steps.findIndex(step => to.path.includes(step)) + 1)

  if (isDefined(docRef)) {
    sendEvent(defineAnalyticsEvent(events[currentStep.value] || 'begin_checkout', {
      transaction_id: docRef.id || '',
      checkout_step: currentStep.value,
      currency: 'EUR',
      shipping: 1,
      items: buildProductFromCartItem(cart)
    }))
  }

  // const { hasProducts } = storeToRefs(useCart())

  // if (!hasProducts.value && to.path.includes('/cart/')) {
  //     return abortNavigation('Cart does not have any items')
  // } else {
  //     return true
  // }
})
