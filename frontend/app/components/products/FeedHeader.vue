<template>
  <TailCard id="feed-header" ref="headerEl" class="shadow-none border-none mb-3 px-1">
    <TailCardContent class="pt-1 text-center">
      <div class="flex justify-between align-center">
        <!-- Collections. Filters -->
        <div class="flex justify-content-left gap-1">
          <div class="flex justify-between items-center me-3 gap-1">
            <TailButton variant="light" as-child>
              <NuxtLinkLocale id="link-collections-feed-header" to="/shop/collection/all">
                {{ $t('Afficher tout') }}
              </NuxtLinkLocale>
            </TailButton>

            <!-- Categories -->
            <TailButton v-for="category in productCategories" :key="category" variant="light" as-child>
              <NuxtLinkLocale :id="`link-collection-${category.toLowerCase()}`" :to="`/shop/collection/${category.toLowerCase()}`">
                {{ category }}
              </NuxtLinkLocale>
            </TailButton>

            <TailButton variant="light" class="ms-3" @click="emit('modal:product-filters')">
              <Icon name="i-fa7-solid:sliders" class="me-2" /> {{ $t('Filtres') }}
            </TailButton>
          </div>
        </div>

        <!-- Grid -->
        <div class="flex justify-end gap-1 items-center">
          <TailSkeleton v-if="productsLoading" class="w-[100px] h-[50px]" />
          <span id="product-count" v-else class="font-semibold text-sm me-2">
            {{ $t('Produits trouvés', { n: count }) }}
          </span>

          <TailButton :variant="threeState" flat @click="handleGridSize(3)">
            <Icon name="i-fa7-solid:table-cells" />
          </TailButton>

          <TailButton :variant="fourState" flat @click="handleGridSize(4)">
            <Icon name="i-fa7-solid:table-cells-large" />
          </TailButton>
        </div>
      </div>
    </TailCardContent>
  </TailCard>
</template>

<script setup lang="ts">
import { productSymbol } from '~/data/constants/symbols'
import { useHandleGridSize } from '~/composables/use/grid'
import type { Product } from '~/types'

defineProps<{ count: number }>()
const emit = defineEmits<{ 'modal:product-filters': [] }>()

const productsLoading = inject<boolean>('productsLoading')

/**
 * Products
*/

const products = inject<ComputedRef<Product[]>>(productSymbol, computed(() => []))

/**
 * Returns a set of categories that the user can use
 * to filter the products on the page 
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
