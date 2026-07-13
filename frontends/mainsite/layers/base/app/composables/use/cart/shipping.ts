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

  const shippingInfoCompleted = computed(() => objectCanBeSaved(shippingInfo))

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

  const { trigger } = watchTriggerable([_saveDetails, shippingInfo], async ([saveDetailsValue, shippingInfoValue]) => {
    if (shippingInfoCompleted.value && saveDetailsValue) {
      void $fetch('/api/account/address/create', {
        method: 'POST',
        body: shippingInfoValue
      })
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
    save: trigger
  }
})
