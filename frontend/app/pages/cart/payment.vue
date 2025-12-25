<template>
  <volt-card>
    <template #content>
      <p class="font-light mb-5">
        {{ $t('Choississez votre mode de paiement') }}
      </p>

      <volt-list-group :items="paymentMethods" variant="flush" />

      <volt-divider v-if="hasSelectedPaymentMethod" class="my-5" />

      <!-- Blocks -->
      <CartPaymentStripeBlock v-if="stripeSelected" @payment-complete="callbackPaymentComplete" />
      <CartPaymentKlarnaBlock v-else-if="klarnaSelected" />

      <div class="flex gap-1 items-center justify-center mt-10">
        <nuxt-img src="/cards/mastercard.svg" height="30" width="30" />
        <nuxt-img src="/cards/visa.png" height="30" width="30" />
      </div>
    </template>
  </volt-card>
</template>

<script lang="ts" setup>
import type { DefaultPaymentProviders } from '~/types'

definePageMeta({
  title: 'Cart: Payment',
  layout: 'cart',
  middleware: ['cart']
})

/**
 * Payment
 */

const router = useRouter()
const selectedPaymentMethod = ref<string | null>(null)

const hasSelectedPaymentMethod = computed(() => selectedPaymentMethod.value !== null)
const stripeSelected = computed(() => hasSelectedPaymentMethod.value && selectedPaymentMethod.value !== 'Klarna')
const klarnaSelected = computed(() => hasSelectedPaymentMethod.value && selectedPaymentMethod.value === 'Klarna')

/**
 * Callback when the payment was completed
 * successfully
 * @param blockName The payment block that was used (e.g. Stripe, Klarna, etc.)
 */
function callbackPaymentComplete(blockName: DefaultPaymentProviders) {
// TODO: G-Analytics
// gtag('event', 'add_payment_info', {
  //   transaction_id: cartStore.sessionId,
  //   currency: 'EUR',
  //   tax: 20,
  //   shipping: 1,
  //   value: cartStore.cartTotal,
  //   items: cartStore.products.map((item, i) => {
  //     return {
  //       item_id: item.product.id,
  //       item_name: item.product.name,
  //       price: item.product.get_price,
  //       quantity: 1,
  //       item_brand: null,
  //       item_category: item.product.category,
  //       item_category2: item.product.sub_category,
  //       item_variant: item.product.color,
  //       index: i,
  //       size: item.size
  //     }
  //   })
  // })

  // useTrackEvent('add_payment_info', {
  //   checkout_step: 3,
  //   currency: 'EUR',
  //   shipping: 1,
  //   value: cartStore.cartTotal
  // })
  console.log('callbackPaymentComplete', blockName)

  router.push('/cart/success')
}

/**
 * Other
 */

const paymentMethods = [
  {
    label: 'Visa / Mastercard',
    icon: 'i-lucide-credit-card',
    action: (item) => {
      selectedPaymentMethod.value = item.label
    }
  },
  {
    label: 'Klarna',
    icon: 'i-lucide-credit-card',
    action: (item) => {
      selectedPaymentMethod.value = item.label
    }
  }
]

/**
 * SEO
 */

const { t } = useI18n()

useHead({
  title: t('Paiement de la commande'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
