<template>
  <section id="success" class="px-10 my-10">
    <div class="w-10/12 mx-auto">
      <TailCard class="card border-none">
        <TailCardContent class="text-center">
          <h1 class="text-3xl font-bold mb-5">
            Succès
          </h1>

          <p class="font-light">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Sed ipsa, aspernatur rerum magni voluptas aut molestiae ducimus 
            voluptates, corrupti quaerat, ut quisquam doloribus. Inventore, 
            deleniti est quae nesciunt repellat non.
          </p>

          <NuxtLink id="link-shop-success" to="/" class="mt-5">
            {{ $t('Boutique') }}
          </NuxtLink>
        </TailCardContent>
      </TailCard>
    </div>

    <div class="w-10/12 mx-auto mt-5">
      <BaseRecommendations :quantity="8" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core'
import type { CartUpdateApiResponse, ProductStock } from '~/types';

definePageMeta({
  layout: 'cart',
  middleware:  ['cart']
})

useHead({
  title: 'Success',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

const cartStore = useCart()
const cart = useSessionStorage<CartUpdateApiResponse>('cart', null)

// const { gtag } = useGtag()
const { handleError } = useErrorHandler()
const {  $client } = useNuxtApp()

/**
 * 
 */
async function handleUpdateStock () {
  try {
    const response = await $client<ProductStock[]>('/api/v1/stocks/update', {
      method: 'POST',
      body: {
        customer_order: null
      }
    })
    console.log(response)
  } catch (e) {
    handleError(e)
  }
}

onMounted(async () => {
  await handleUpdateStock()

  // TODO: G-Analytics
  // gtag('event', 'purchase', {
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

  // useTrackEvent('purchase', {
  //   checkout_step: 4,
  //   currency: 'EUR',
  //   shipping: 1,
  //   value: cartStore.cartTotal
  // })

  cart.value = null
  cartStore.cache = null
})
</script>
