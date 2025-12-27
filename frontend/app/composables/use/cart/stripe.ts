import { updateDoc } from 'firebase/firestore'
import type { PaymentIntentApiResponse } from '~/types'

/**
 * A composable used to manage the Stripe Payment Intent state globally.
 * @link https://docs.stripe.com/payments/payment-intents
 */
export const usePaymentIntentComposable = createGlobalState(() => {
  const { $client } = useNuxtApp()
  const { customHandleError } = useErrorHandler()
  const { docRef, cartSessionId } = useCartComposable()

  const apiResponse = ref<PaymentIntentApiResponse | null>(null)
  const paymentIntent = useCookie('payment_intent')

  // Requests a new payment intent and returns an
  // intent ID that will be used to confirm the payment
  // on the actual payment page
  async function create(total = 0) {
    // We want to use one single payment intent
    // per session in order to have proper tracking
    // of the customer's payment attempts
    if (isDefined(paymentIntent)) {
      return 
    }

    const data = await $client<PaymentIntentApiResponse>('/api/v1/orders/intent', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: {
        session_id: cartSessionId.value,
        total
      },
      onRequestError({ error }) {
        customHandleError(error)
      }
    })

    apiResponse.value = data
    paymentIntent.value = data.intent
  }

  watchDebounced(paymentIntent, async (newValue) => {
    if (isDefined(newValue) && isDefined(docRef)) {
      try {
        updateDoc(docRef, { paymentIntent: newValue })
      } catch (error) {
        console.error('Error updating payment intent in Firestore:', error)
      }
    }

  }, { debounce: 500 })

  const hasPaymentIntent = computed(() => isDefined(paymentIntent.value)) 

  return {
    paymentIntent: readonly(paymentIntent),
    hasPaymentIntent,
    create
  }
})
