import type { DeliveryOption, PaymentIntentApiResponse } from "~/types/api/cart"

export interface ShippingInfo {
  address_line: string
  city: string
  zip_code: string
  country: string
  firstname: string
  lastname: string
  telephone: string
  email: string
}

/**
 * Composable for managing shipping information in the cart
 * Includes state for shipping info, delivery option, payment intent, and saving details
 * Handles saving shipping info to the backend when 'saveDetails' is toggled
 * Ensures shared state is not run on the server
 */
export const useShippingComposable = createSharedComposable(() => {
  const addressSaved = ref<boolean>(false)
  const shipping = ref<DeliveryOption>()
  // const paymentIntent = useCookie<PaymentIntentApiResponse>('paymentIntent')
  const saveDetails = ref(false)

  const shippingInfo = ref<ShippingInfo>({
    address_line: '',
    city: '',
    zip_code: '',
    country: '',
    firstname: '',
    lastname: '',
    telephone: '',
    email: ''
  })

  const shippingInfoCompleted = computed(() => {
    return Object.entries(shippingInfo.value).map(([_, value]) => value !== '').every((val) => val === true)
  })

  // Shared composables should not run on the server
  // since they lose their state between requests
  if (import.meta.server) {
    return {
      shippingInfoCompleted,
      addressSaved: readonly(addressSaved),
      shipping,
      // paymentIntent: readonly(paymentIntent),
      shippingInfo,
      saveDetails
    }
  }

  const { $client } = useNuxtApp()

  whenever(saveDetails, () => {
    try {
      if (shippingInfoCompleted.value) {
        const data = $client('/api/v1/address-set/create', {
          method: 'POST',
          baseURL: useRuntimeConfig().public.prodDomain,
          body: shippingInfo.value,
          onResponse() {
            addressSaved.value = true
          }
        })
      }
    } catch (error) {
      console.error('Error saving address set:', error)
    }
  })

  return {
    shippingInfoCompleted,
    addressSaved: readonly(addressSaved),
    shipping,
    // paymentIntent: readonly(paymentIntent),
    shippingInfo,
    saveDetails
  }
})

export function useStripComposable() {
  
}
