import { updateDoc } from 'firebase/firestore'
import type { Nullable, PaymentIntentApiResponse, ShipingInformation } from '~/types'

/**
 * A composable used to manage the Stripe Payment Intent state globally.
 * @link https://docs.stripe.com/payments/payment-intents
 */
export const usePaymentIntentComposable = createGlobalState(() => {
  const { $client, $goPurchase } = useNuxtApp()
  const { customHandleError } = useErrorHandler()
  const { docRef, cartSessionId, cartSession } = useCartComposable()

  const apiResponse = ref<PaymentIntentApiResponse | null>(null)
  const paymentIntent = useCookie('payment_intent')

  // Requests a new payment intent and returns an
  // intent ID that will be used to confirm the payment
  // on the actual payment page
  async function create(total = 0) {
    // We want to use one single payment intent
    // per session in order to have proper tracking
    // of the customer's payment attempts
    // if (isDefined(paymentIntent)) {
    //   return 
    // }

    const data = await $goPurchase<PaymentIntentApiResponse>('/payments/intent', {
      method: 'POST',
      body: {
        sessionId: cartSessionId.value,
        total
      },
      onRequestError({ error }) {
        console.log('Error creating payment intent:', error)
      }
    })

    console.log('Payment intent created:', data)

    apiResponse.value = data
    paymentIntent.value = data.paymentIntentId


    // const data = await $client<PaymentIntentApiResponse>('orders/v1/intent', {
    //   method: 'POST',
    //   baseURL: useRuntimeConfig().public.cartProdDomain,
    //   body: {
    //     session_id: cartSessionId.value,
    //     total
    //   },
    //   onRequestError({ error }) {
    //     customHandleError(error)
    //   }
    // })

    // apiResponse.value = data
    // paymentIntent.value = data.intent
  }

  async function update(total: Nullable<number> = null, shipment: MaybeRef<Nullable<ShipingInformation>> = null) {
    if (isDefined(docRef) && isDefined(cartSession)) {
      $client('orders/v1/intent/update', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.cartProdDomain,
        body: {
          session_id: docRef.id,
          shipment: toValue(shipment),
          total,
          intent: cartSession.value.paymentIntent
        } as {
          session_id: string
          shipment: Nullable<ShipingInformation>
          total: Nullable<number>,
          intent: string
        },
        onRequestError({ error }) {
          customHandleError(error)
        }
      })
    }
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
    /**
     * The payment intent ID returned from the API, which will be used to 
     * confirm the payment on the actual payment page. This is stored in a cookie to 
     * persist across page reloads and sessions.
     */
    paymentIntent: readonly(paymentIntent),
    /**
     * This is a helper method to check if a payment intent already exists for the current session.
     */
    hasPaymentIntent,
    /**
     * We want to have two separate methods for creating and updating the payment intent
     * because we want to have more control over when the payment intent is created and when it is updated.
     */
    update,
    /**
     * We want to use one single payment intent per session in order to have proper tracking
     * of the customer's payment attempts. This is because Stripe creates a new payment intent
     * for each payment attempt, and if we create a new one every time the customer goes to the
     * checkout page, we would lose the ability to track how many times the customer has attempted
     * to pay, which can be useful for fraud prevention and analytics. By creating a single payment
     * intent and reusing it for each attempt, we can maintain a consistent record of the customer's
     * payment history and behavior.
     */
    create
  }
})
