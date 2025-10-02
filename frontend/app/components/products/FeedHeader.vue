<template>
  <volt-card id="feed-header" ref="headerEl" class="shadow-none border-none mb-3 px-1">
    <template #content>
      <div class="pt-1 text-center">
        <div class="flex justify-between align-center">
          <!-- Collections. Filters -->
          <div class="flex justify-content-left gap-1">
            <div class="flex justify-between items-center me-3 gap-1">
              <volt-button variant="light" as-child>
                <nuxt-link-locale id="link-collections-feed-header" to="/shop/collection/all">
                  {{ $t('Afficher tout') }}
                </nuxt-link-locale>
              </volt-button>
  
              <!-- Categories -->
              <volt-button v-for="category in productCategories" :key="category" variant="light" as-child>
                <nuxt-link-locale :id="`link-collection-${category.toLowerCase()}`" :to="`/shop/collection/${category.toLowerCase()}`">
                  {{ category }}
                </nuxt-link-locale>
              </volt-button>
  
              <volt-button variant="light" class="ms-3" @click="emit('modal:product-filters')">
                <icon name="i-fa7-solid:sliders" class="me-2" /> {{ $t('Filtres') }}
              </volt-button>
            </div>
          </div>
  
          <!-- Grid -->
          <ClientOnly>
            <div class="flex justify-end gap-1 items-center">
              <div id="product-count" class="font-semibold text-sm me-2">
                {{ $t('Produits trouvés', { n: count }) }}
              </div>
  
              <volt-button :variant="threeState" flat @click="handleGridSize(3)">
                <icon name="i-fa7-solid:table-cells" />
              </volt-button>
  
              <volt-button :variant="fourState" flat @click="handleGridSize(4)">
                <icon name="i-fa7-solid:table-cells-large" />
              </volt-button>
            </div>
          </ClientOnly>
        </div>
      </div>
    </template>
  </volt-card>
</template>

<script setup lang="ts">
import { productSymbol } from '~/data/constants/symbols'
import { useHandleGridSize } from '~/composables/use/grid'
import type { Product } from '~/types'

defineProps<{ count: number }>()
const emit = defineEmits<{ 'modal:product-filters': [] }>()

/**
 * Products
 */

const products = inject<ComputedRef<Product[]>>(productSymbol, computed(() => []))

/**
 * Produts categories
 */

const productCategoryNames = useArrayMap(isDefined(products) ? products.value : [], product => product.category)
const productCategories = useArrayUnique(useArrayFilter(productCategoryNames, category => category !== 'Not attributed'))

/**
 * Grid
 */

const { threeState, fourState, handleGridSize } = useHandleGridSize()
</script>

<style lang="css" scoped>
[id^="link-collections-"].router-link-exact-active {
  background-color: var(--color-primary);
}

[id^="link-collection-"].router-link-exact-active {
  background-color: var(--color-primary);
}
</style>
