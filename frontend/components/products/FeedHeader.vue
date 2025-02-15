<template>
  <div id="feed-header" ref="headerEl" class="card shadow-none mb-3">
    <div class="card-body pt-1 text-center">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-left gap-1">
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
        
        <div class="d-flex justify-content-right gap-1 align-items-center">
          <v-skeleton-loader :is-loading="productsLoading" type="text">
            <span id="product-count" class="fw-bold me-2">
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
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useScroll } from '@vueuse/core'
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
    // return sortingOptions.includes(value)
    return true
  },
  'show-product-filters' () {
    return true
  }
})

const gridSize = ref(3)
const productsLoading = inject<boolean>('productsLoading')

// const headerEl = useTemplateRef<HTMLElement>('headerEl')

/**
 * When the user scrolls to a certain level,
 * this positions the header to a fixed position 
 */
// const { y } = useScroll(window, {
//   throttle: 100
// })


const productCategories = computed(() => {
  const items = props.products.map(product => {
    return product.category
  })
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

// watch(y, (newValue) => {
//   if (headerEl.value) {
//     console.info('Feed', 'Place to fixed')

//     if (newValue > 100) {
//       headerEl.value.classList.add('to-fixed')
//     } else {
//       headerEl.value.classList.remove('to-fixed')
//     }
//   }
// })
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
