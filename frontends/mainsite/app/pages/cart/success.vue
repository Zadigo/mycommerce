<template>
  <section id="success" class="px-10 my-10">
    <div class="w-10/12 mx-auto">
      <volt-card class="card border-none">
        <template #content>
          <div class="text-center">
            <h1 class="text-3xl font-bold mb-5">
              {{ $t('Récapitualif de la commande') }}
            </h1>
  
            <p class="font-light">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Sed ipsa, aspernatur rerum magni voluptas aut molestiae ducimus
              voluptates, corrupti quaerat, ut quisquam doloribus. Inventore,
              deleniti est quae nesciunt repellat non.
            </p>
  
            <nuxt-link-locale id="link-home" to="/" class="mt-5">
              {{ $t('Boutique') }}
            </nuxt-link-locale>
          </div>
        </template>
      </volt-card>
    </div>

    <div class="w-10/12 mx-auto mt-5">
      <base-recommendations :quantity="8" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { CartUpdateApiResponse, ProductStockApiResponse } from '~/types'

definePageMeta({
  layout: 'cart',
  middleware:  ['cart']
})

const { sendEvent } = useAnalyticsEvent()
const { customHandleError } = useErrorHandler()
const {  $client } = useNuxtApp()

try {
  const response = await $client<ProductStockApiResponse[]>('/api/v1/stocks/update', {
    method: 'POST',
    body: {
      customer_order: null
    }
  })
  console.log(response)
} catch (e) {
  customHandleError(e)
  sendEvent(defineAnalyticsEvent('exception', {
    description: 'Error while updating product stock after order completion',
    fatal: false
  }))
}

/**
 * Analytics 
 */

const { docRef, cartSession } = useCartComposable()

onMounted(() => {
  if (isDefined(docRef) && isDefined(cartSession)) {
    sendEvent(defineAnalyticsEvent('purchase', {
      transaction_id: docRef.id || '',
      currency: 'EUR',
      value: cartSession.value?.total || 0,
      items: []
    }))
  }
})

/**
 * SEO
 */

const { t } = useI18n()

useHead({
  title: t('Récapitualif de la commande'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
