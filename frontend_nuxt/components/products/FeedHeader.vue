<template>
  <div class="card shadow-none mb-3">
    <div class="card-body pt-1 text-center">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-left gap-1">
          <div class="d-flex justify-content-between align-items-center me-3 gap-1">
            <v-btn :to="{ name: 'shop_products_collection', params: { id: 'all' } }" variant="tonal">
              {{ $t('Afficher tout') }}
            </v-btn>

            <v-btn v-for="category in productCategories" :key="category" :to="{ name: 'shop_products_collection', params: { id: category.toLowerCase() } }" variant="tonal">
              {{ category }}
            </v-btn>

            <v-btn variant="tonal" class="ms-3" @click="$emit('show-product-filters')">
              <font-awesome icon="sliders" class="me-2" /> Filtres
            </v-btn>
          </div>
        </div>
        
        <div class="d-flex justify-content-right gap-1 align-items-center">
          <v-skeleton-loader :is-loading="productsLoading" type="text">
            <span id="product-count" class="fw-bold me-2">
              {{ totalProductCount }} produits trouvés
            </span>
          </v-skeleton-loader>

          <v-btn :active="gridSize === 3" variant="tonal" flat @click="handleGridSize(3)">
            <font-awesome icon="table-cells-large" />
          </v-btn>

          <v-btn :active="gridSize === 4" variant="tonal" flat @click="handleGridSize(4)">
            <font-awesome icon="table-cells-large" />
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const sortingOptions = [
  'Prix croissant',
  'Prix décroissant'
]

const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    default: () => []
  },
  totalProductCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits({
  'update:grid-size' (size: number) {
    return [3, 4].includes(size)
  },
  'update:sorting' (_value: string) {
    // return sortingOptions.includes(value)
    return true
  },
  'show-product-filters' () {
    return true
  }
})

const gridSize = ref(4)
const productsLoading = inject<boolean>('productsLoading')

const productCategories = computed(() => {
  const items = props.products.map(product => {
    return product.category
  })
  return new Set(items)
})

/**
 * Changes the size of the grid to
 * reduce or increase the amount of
 * products displayed on the screen
 */
function handleGridSize (size: number) { 
  gridSize.value = size
  emit('update:grid-size', size)
}
</script>

<style lang="scss" scoped>
  #product-count {
    font-size: .9rem;
  }
</style>
