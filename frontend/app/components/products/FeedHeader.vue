<template>
  <volt-card id="feed-header" ref="headerEl" class="shadow-none border-none mb-3 px-1">
    <template #content>
      <div class="flex justify-between align-center text-center">
        <!-- Collections. Filters -->
        <div class="flex justify-content-left gap-1">
          <div class="flex justify-between items-center me-3 gap-1">
            <volt-secondary-button>
              <nuxt-link-locale id="link-collections-feed-header" to="/shop/collection/all">
                {{ $t('Afficher tout') }}
              </nuxt-link-locale>
            </volt-secondary-button>

            <!-- Categories -->
            <volt-secondary-button v-for="category in productCategories" :key="category">
              <nuxt-link-locale :id="`link-collection-${category.toLowerCase()}`" :to="`/shop/collection/${category.toLowerCase()}`">
                {{ category }}
              </nuxt-link-locale>
            </volt-secondary-button>

            <volt-secondary-button class="ms-3" @click="emit('modal:product-filters')">
              <icon name="i-fa7-solid:sliders" class="me-2" /> {{ $t('Filtres') }}
            </volt-secondary-button>
          </div>
        </div>

        <!-- Grid -->
        <div class="flex justify-end gap-1 items-center">
          <client-only>
            <div id="product-count" class="hidden md:block font-semibold text-sm me-2">
              {{ $t('Produits trouvés', { n: count }) }}
            </div>
          </client-only>

          <volt-secondary-button :variant="threeState" flat @click="handleGridSize(3)">
            <icon name="i-fa7-solid:table-cells" />
          </volt-secondary-button>

          <volt-secondary-button :variant="fourState" flat @click="handleGridSize(4)">
            <icon name="i-fa7-solid:table-cells-large" />
          </volt-secondary-button>
        </div>
      </div>
    </template>
  </volt-card>
</template>

<script setup lang="ts">
import { productSymbol } from '~~/layers/base/data/constants/symbols'
import { useHandleGridSize } from '~/composables/use/grid'
import type { ProductNode } from '~/types'

defineProps<{ count: number }>()
const emit = defineEmits<{ 'modal:product-filters': [] }>()

/**
 * Products
 */

const products = inject<ComputedRef<ProductNode[]>>(productSymbol, computed(() => []))

/**
 * Produts categories
 */

const productCategoryNames = useArrayMap(isDefined(products) ? products.value : [], product => product.node.category)
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
