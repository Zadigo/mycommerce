import { updateDoc } from 'firebase/firestore'
import type { Nullable, Arrayable, PaymentIntentApiResponse, ShipingInformation, CartItem } from '~/types'

/**
 * A composable used to manage the Stripe Payment Intent state globally.
 * @link https://docs.stripe.com/payments/payment-intents
 */
export const usePaymentIntentComposable = createGlobalState(() => {
  const { docRef, cartSessionId, cartSession } = useCartComposable()

  const apiResponse = ref<PaymentIntentApiResponse | null>(null)
  // TODO: Get from firebase
  const paymentIntent = useCookie('payment_intent')
  const stripeId = useState<string>('stripeId')

  async function create<T extends CartItem>(total = 0, items?: Arrayable<T>) {
    const data = await $fetch<PaymentIntentApiResponse>('/api/proxy/golang/intent', { 
      method: 'POST', 
      body: { 
        sessionId: cartSessionId.value,  
        customerId: stripeId.value,
        total, 
        items
      }
    })

    console.log('Payment intent created:', data)
    apiResponse.value = data
  }

  async function update<T extends CartItem>(total: Nullable<number> = null, shipment: MaybeRef<Nullable<ShipingInformation>> = null, items?: Arrayable<T>) {
    if (isDefined(docRef) && isDefined(cartSession)) {
      void $fetch<PaymentIntentApiResponse>('/api/proxy/golang/intent', {
        method: 'PATCH',
        body: {
          paymentIntentId: paymentIntent.value,
          session_id: cartSessionId.value,
          shipment: toValue(shipment),
          items: toValue(items),
          customer_id: stripeId.value,
          total
        } as {
          session_id: string
          shipment: Nullable<ShipingInformation>
          total: Nullable<number>,
          items: Arrayable<T>
          customer_id: string
        },
        onRequestError({ error }) {
          console.log('Error updating payment intent:', error)
        }
      })
    }
  }

  async function reset() {
    paymentIntent.value = null
  }

  // TODO: Get/synchronize with firebase
  watchDebounced(paymentIntent, async (newValue) => {
    if (isDefined(newValue) && isDefined(docRef)) {
      try {
        void updateDoc(docRef, { paymentIntent: newValue })
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
     * @default null
     */
    paymentIntent: readonly(paymentIntent),
    /**
     * This is a helper method to check if a payment intent already exists for the current session.
     * @default false
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
    create,
    /**
     * This method is used to reset the payment intent state, 
     * which can be useful in scenarios where the user decides to 
     * abandon the checkout process or when the session expires.
     */
    reset
  }
})
