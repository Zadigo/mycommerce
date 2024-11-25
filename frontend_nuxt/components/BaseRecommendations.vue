<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="h4 text-center mb-5">
      {{ $t(blockTitle) }}
    </h2>

    <div ref="productsRow" class="row g-1">
      <ProductsIterator :products="recommendations" :columns="columns" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AxiosError } from 'axios';
import type { Product } from '~/types';

const props = defineProps({
  blockTitle: {
    type: String,
    default: () => {
      return "Cela peut t'intéresser"
    }
  },
  quantity: {
    type: Number,
    default: 20
  },
  scrollable: {
    type: Boolean
  },
  columns: {
    type: Number,
    default: 3
  }
})

// const { instance } = useVueSession()
const route = useRoute()
const recommendations = ref<Product[]>([])
const productsRow = ref<HTMLElement>()
const { $client } = useNuxtApp()

async function requestRecommendations () {
  try {
    const response = await $client.get('shop/products/recommendations', {
      params: {
        p: route.params.id,
        q: props.quantity
      }
    })
    recommendations.value = response.data
    // instance.expire('recommendations', response.data, 100)
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle error
    }
  }
}

onBeforeMount(async () => {
  await requestRecommendations()
})

onMounted(() => {
  if (props.scrollable) {
    if (productsRow.value) {
      productsRow.value.classList.add('products-wrapper')
    }
  }
})
</script>
