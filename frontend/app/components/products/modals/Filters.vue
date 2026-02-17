<template>
  <volt-drawer v-model:visible="showModal" id="modal-product-filters" :header="$t('Filtrer')" position="right" style="width: 400px;">
    <div class="flex-col justify-around px-5">    
      <div>
        {{ query }}

        <volt-accordion type="single" collapsible>
          <!-- Order by -->
          <volt-accordion-panel value="sort by">
            <volt-accordion-header>
              {{ $t('Trier par') }}
            </volt-accordion-header>

            <volt-accordion-content class="flex">
              <div class="space-x-2 space-y-2">
                <volt-button v-for="sortingFilter in filterBySorting" :id="`action-sorting-direction__${sortingFilter[0]?.replace(' ', '-')}`" :key="sortingFilter[0]" :active="query.sorted_by===sortingFilter[0]" variant="outline" size="sm" @click="handleFilterSelection('sorted by', sortingFilter[0])">
                  {{ $t(sortingFilter[0] || '') }}
                </volt-button>
              </div>
            </volt-accordion-content>
          </volt-accordion-panel>
          
          <!-- Size -->
          <volt-accordion-panel value="size">
            <volt-accordion-header>
              <div class="flex gap-2 items-center">
                {{ $t('Taille') }}

                <volt-badge>
                  {{ query.sizes.length }}
                </volt-badge>
              </div>
            </volt-accordion-header>

            <volt-accordion-content class="flex">
              <div class="space-x-2 space-y-2">
                <volt-button v-for="size in filterByClotheSize" :id="`action-filter-size__${size?.replace(' ', '-')}`" :key="size" :active="query.sizes.includes(size)" size="sm" variant="outline" class="ms-2" @click="handleFilterSelection('sizes', size)">
                  {{ size }}
                </volt-button>
              </div>
            </volt-accordion-content>
          </volt-accordion-panel>

          <!-- Price -->
          <volt-accordion-panel value="price">
            <volt-accordion-header>
              {{ $t("Prix") }}
            </volt-accordion-header>

            <volt-accordion-content class="flex justify-start flex-wrap">
              <div class="space-x-2 space-y-2">
                <volt-button v-for="priceFilter in filterByPrice" :id="`action-filter-price__${priceFilter.value?.toString().replace(' ', '-')}`" :key="priceFilter.value" :active="priceFilter.value===query.price" variant="outline" size="sm" @click="handleFilterSelection('price', priceFilter.value)">
                  {{ priceFilter.text }}
                </volt-button>
              </div>
            </volt-accordion-content>
          </volt-accordion-panel>
        </volt-accordion>
        
        <!-- Typologie, Couleur -->
      </div>

      <div class="border-top flex justify-around mt-10 gap-2">
        <volt-button id="action-delete-filters" variant="default" @click="resetFilters">
          {{ $t("Supprimer") }}
        </volt-button>
        
        <volt-button id="action-filters-result" variant="default" @click="() => { showModal = false, execute() }">
          {{ $t('Voir résulats', { n: count }) }}
        </volt-button>
      </div>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import { filterByClotheSize, filterBySorting, filterByPrice, type FilterActions, type PriceFilter, type SortingFilter } from '~~/layers/base/data/constants'
import type { ClotheSizes, SearchedProducts, Undefineable } from '~/types'

const { count = 0 } = defineProps<{
  count: number
}>()

const emit = defineEmits<{
  'update-products': [products: SearchedProducts],
  'update:modelValue': [value: boolean]
}>()

/**
 * Route parameters
 */

const { id } = useRoute().params as { id: string }

/**
 * Products
 */

const { showModal, query, resetFilters } = await useProductsStore()

const { data: filteredProducts, execute } = await useFetch<SearchedProducts>(`/api/collections/${id}`, {
  method: 'GET',
  immediate: false,
})

/**
 * Analytics
 */

// const { viewProductsEvent } = useGoogleAnalyticsCallbacks(undefined, filteredProducts.value?.data.searchProducts)

// watchDebounced(query, async () => {
//   await viewProductsEvent('Filtered Produts')
// }, {
//   debounce: 500,
//   deep: true
// })

/**
 * Function that pushes or removes the value from the filter lists
 * @param items The items with which the list should be update
 * @param value The value that should be added or removed from the list
 */
function updateList<T extends (ClotheSizes | PriceFilter | number)[]>(items: T, value: T[number]) {  
  if (items.includes(value)) {
    const index = items.findIndex(x => {
      if (typeof x === 'number' || typeof x === 'string') {
        return x === value
      } else {
        return -1
      }
    })
    items.splice(index, 1)
  } else {
    items.push(value)
  }
}

/**
 * Receives a filter and then sorts the products
 * @param action The filter action
 * @param value The value of the filter
 */
function handleFilterSelection (action: FilterActions, value: Undefineable<ClotheSizes | PriceFilter | SortingFilter>) {
  switch (action) {
    case 'sorted by':
      query.value.sorted_by = value || 'New'
      break

    // case 'typology':
    //   updateList<string[]>(query.value.typology, value)
    //   break

    // case 'colors':
    //   updateList<string[]>(query.value.colors, value)
    //   break

    case 'sizes':
      updateList(query.value.sizes, value)
      break

    case 'price':
      // If the user double-clicks, then write
      // the price as null
      if (query.value.price === value) {
        query.value.price = null
      } else {
        query.value.price = value
      }
      break
  
    default:
      break
  }
}
</script>
