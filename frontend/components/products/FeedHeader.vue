<template>
  <TailCard id="feed-header" ref="headerEl" class="card shadow-none mb-3 px-1">
    <TailCardContent class="pt-1 text-center">
      <div class="flex justify-between align-center">
        <div class="flex justify-content-left gap-1">
          <div class="d-flex justify-content-between align-items-center me-3 gap-1">
            <v-btn to="/shop/collection/all" variant="tonal">
              {{ $t('Afficher tout') }}
            </v-btn>

            <!-- Categories -->
            <v-btn v-for="category in productCategories" :key="category" :to="`/shop/collection/${category.toLowerCase()}`" variant="tonal">
              {{ category }}
            </v-btn>

            <v-btn variant="tonal" class="ms-3" @click="emit('show-product-filters')">
              <font-awesome icon="sliders" class="me-2" /> Filtres
            </v-btn>
          </div>
        </div>
        
        <div class="flex justify-end gap-1 align-center">
          <v-skeleton-loader :is-loading="productsLoading" type="text">
            <span id="product-count" class="font-bold me-2">
              {{ count }} produits trouvés
            </span>
          </v-skeleton-loader>

          <v-btn :active="gridSize === 3" variant="tonal" flat @click="handleGridSize(3)">
            <font-awesome icon="table-cells" />
          </v-btn>

          <v-btn :active="gridSize === 4" variant="tonal" flat @click="handleGridSize(4)">
            <font-awesome icon="table-cells-large" />
          </v-btn>
        </div>
      </div>
    </TailCardContent>
  </TailCard>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    default: () => []
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits({
  'update:grid-size' (size: number) {
    return [3, 4].includes(size)
  },
  'update:sorting' (_value: string) {
    return true
  },
  'show-product-filters' () {
    return true
  }
})

const gridSize = ref(3)
const productsLoading = inject<boolean>('productsLoading')

/**
 * Returns a set of categories that the user can use
 * to filter the products on the page 
 */
const productCategories = computed(() => {
  const items = props.products.map(product => {
    return product.category
  }).filter(x => x !== 'Not attributed')
  return Array.from(new Set(items))
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

.to-fixed {
  position: fixed;
  top: 13%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  background-color: white;
  width: 90%;
}
</style>
