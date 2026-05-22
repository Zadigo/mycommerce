/**
 * @packageDocumentation A collecton of composables to manage the cart state
 * with the Django backend.
 */

/**
 * Function that regroups all the cart-related operations
 * for the Django backend
 */
export function useDjangoCartComposable() {
  const { cartSession, cart, docRef } = useCartComposable()  

  async function update(){
    if (isDefined(cartSession) && isDefined(docRef)) {
      await $fetch('/cart/v1/create', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.cartProdDomain,
        body: {
          session_id: docRef.id,
          items: cart.value
        }
      })
    }
  }

  return {
    update
  }
}
