<template>
  <TailCard id="feed-header" ref="headerEl" class="card shadow-none border-none mb-3 px-1">
    <TailCardContent class="pt-1 text-center">
      <div class="flex justify-between align-center">
        <div class="flex justify-content-left gap-1">
          <div class="flex justify-between items-center me-3 gap-1">
            <TailButton class="has-[.router-link-exact-active]:bg-primary" variant="light" as-child>
              <NuxtLinkLocale id="link-collections-feed-header" to="/shop/collection/all">
                {{ $t('Afficher tout') }}
              </NuxtLinkLocale >
            </TailButton>

            <!-- Categories -->
            <TailButton v-for="category in productCategories" :key="category" as-child>
              <NuxtLinkLocale :id="`link-collection-${category.toLowerCase()}`" :to="`/shop/collection/${category.toLowerCase()}`">
                {{ category }}
              </NuxtLinkLocale>
            </TailButton>

            <TailButton variant="light" class="ms-3" @click="emit('product-filters')">
              <font-awesome icon="sliders" class="me-2" /> {{ $t('Filtres') }}
            </TailButton>
          </div>
        </div>
        
        <div class="flex justify-end gap-1 items-center">
          <TailSkeleton v-if="productsLoading" class="w-[100px] h-[50px]" />
          <span id="product-count" v-else class="font-semibold text-sm me-2">
            {{ $t('Produits trouvés', { n: count }) }}
          </span>

          <TailButton :variant="gridSize === 3 ? 'light' : 'ghost'" flat @click="handleGridSize(3)">
            <font-awesome icon="table-cells" />
          </TailButton>

          <TailButton :variant="gridSize === 4 ? 'light' : 'ghost'" flat @click="handleGridSize(4)">
            <font-awesome icon="table-cells-large" />
          </TailButton>
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
  'product-filters' () {
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
