<template>
  <div class="py-5">
    <ion-row>
      <!-- Grid -->
      <ion-col size="10">
        <products-feed-grid-buttons />
      </ion-col>

      <!-- Filter -->
      <ion-col size="2"> 
        <ion-button fill="outline" size="small" @click="showFilter = true">
          <icon name="i-lucide-filter" />
        </ion-button>
      </ion-col>
    </ion-row>

    <!-- Products Feed -->
    <products-feed-one v-if="grid === 1" />
    <products-feed-two v-else-if="grid === 2" />
    <products-feed-three v-else-if="grid === 3" />

    <!-- Infinite Scroll -->
    <ion-infinite-scroll @ion-infinite="getProducts">
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>

    <!-- Filter -->
    <products-feed-filter-modal v-model="showFilter" />
  </div>
</template>

<script lang="ts" setup>
// import type { Product } from '~/types'
import { useGenerateProducts } from '../../../../../frontend/layers/base/app/data/__fixtures__'

const grid = useState('grid')

/**
 * Products Feed Composable
 */

const { products, getProducts } = await useProductsComposable()

const productsFixtures = useGenerateProducts(100)
provide('products', productsFixtures)

/**
 * Modals
 */

const showFilter = ref(false)
</script>
