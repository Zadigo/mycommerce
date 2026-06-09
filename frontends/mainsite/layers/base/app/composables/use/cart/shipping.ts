import type { DeliveryOption, ShipingInformation } from '~/types/api/cart'

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
  const _saveDetails = refDebounced(saveDetails, 1000)

  const shippingInfo = ref<ShipingInformation>({
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

  const { trigger: save } = watchTriggerable([_saveDetails, shippingInfo], async ([saveDetailsValue, shippingInfoValue]) => {
    const canBeSaved = Object.entries(shippingInfoValue).map(([_, value]) => value !== '').every((val) => val === true)

    if (saveDetailsValue && canBeSaved) {
      try {
        const data = await $client('/api/v1/address-set/create', {
          method: 'POST',
          baseURL: useRuntimeConfig().public.prodDomain,
          body: shippingInfoValue
        })

        if (data) {
          addressSaved.value = true
        }
      } catch (error) {
        console.error('Error saving address set:', error)
      }
    } 
  })

  return {
    shippingInfoCompleted,
    addressSaved: readonly(addressSaved),
    shipping,
    shippingInfo,
    saveDetails,
    /**
     * Function to manually trigger saving shipping details
     */
    save
  }
})
