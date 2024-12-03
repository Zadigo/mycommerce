<template>
  <div class="row">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1>Success</h1>

          <NuxtLink to="/">
            Back to home
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col-12">
      <BaseRecommendations :quantity="10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AxiosError } from 'axios';
import type { ProductStock } from '~/types';

definePageMeta({
  layout: 'payment-layout',
  middleware: ['auth']
})

useHead({
  title: 'Success'
})

const {  $client } = useNuxtApp()

async function handleUpdateStock () {
  try {
    const response = await $client.post<ProductStock[]>('stocks/update', {
      customer_order: null
    })
    console.log(response.data)
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle
    }
  }
}

onMounted(async () => {
  await handleUpdateStock()
})
</script>
