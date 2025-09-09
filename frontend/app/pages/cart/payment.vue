<template>
  <TailCard class="card shadow-sm border-none">
    <TailCardContent>
      <p class="font-light mb-5">
        {{ $t('Choississez votre mode de paiement') }}
      </p>

      <TailList>
        <TailListItem v-for="paymentMethod in paymentMethods" :key="paymentMethod.name" :active="selectedPaymentMethod === paymentMethod.name" @click.prevent="handlePaymentType(paymentMethod.name)">
          <Icon :name="`fa-brands:${paymentMethod.icon}`" class="me-3" />
          {{ paymentMethod.name }}
        </TailListItem>
      </TailList>

      <hr v-if="hasSelectedPaymentMethod" class="my-5">

      <CartPaymentStripeBlock v-if="stripeSelected" @payment-complete="callbackPaymentComplete" />
      <CartPaymentKlarnaBlock v-else-if="klarnaSelected" />
    </TailCardContent>

    <TailCardContent class="flex gap-1 items-center justify-center">
      <NuxtImg src="/cards/mastercard.svg" height="30" width="30" />
      <NuxtImg src="/cards/visa.png" height="30" width="30" />
    </TailCardContent>
  </TailCard>
</template>

<script lang="ts" setup>
import type { PaymentType } from '~/types'

definePageMeta({
  title: 'Cart: Payment',
  layout: 'cart',
  middleware: ['cart']
})

const paymentMethods = [
  {
    name: 'Visa / Mastercard',
    icon: 'cc-mastercard'
  },
  {
    name: 'Klarna',
    icon: 'klarna'
  }
]

/**
 * Payment
 */

const router = useRouter()
const selectedPaymentMethod = ref<string | null>(null)

const hasSelectedPaymentMethod = computed(() => selectedPaymentMethod.value !== null)
const stripeSelected = computed(() => hasSelectedPaymentMethod.value && selectedPaymentMethod.value !== 'Klarna')
const klarnaSelected = computed(() => hasSelectedPaymentMethod.value && selectedPaymentMethod.value === 'Klarna')

/**
 * Executes card tokenization and initiates the
 * payment on the backend side
 */
function handlePaymentType(cardType: string) {
  selectedPaymentMethod.value = cardType
}

/**
 * Callback when the payment was completed
 * successfully
 * @param blockName The payment block that was used (e.g. Stripe, Klarna, etc.)
 */
function callbackPaymentComplete(blockName: PaymentType) {
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
