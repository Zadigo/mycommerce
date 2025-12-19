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

            <volt-accordion-content class="flex gap-2">
              <volt-button v-for="sortingFilter in filterBySorting" id="action-sorting-direction" :key="sortingFilter[0]" :active="query.sorted_by===sortingFilter[0]" variant="outline" size="sm" @click="handleFilterSelection('sorted by', sortingFilter[0])">
                {{ $t(sortingFilter[0]) }}
              </volt-button>
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

            <volt-accordion-content class="flex gap-2">
              <volt-button v-for="size in filterByClotheSize" id="action-filter-size" :key="size" :active="query.sizes.includes(size)" size="sm" variant="outline" class="ms-2" @click="handleFilterSelection('sizes', size)">
                {{ size }}
              </volt-button>
            </volt-accordion-content>
          </volt-accordion-panel>

          <!-- Price -->
          <volt-accordion-panel value="price">
            <volt-accordion-header>
              {{ $t("Prix") }}
            </volt-accordion-header>

            <volt-accordion-content class="flex justify-start flex-wrap gap-2">
              <volt-button v-for="priceFilter in filterByPrice" id="action-filter-price"  :key="priceFilter.value" :active="priceFilter.value===query.price" variant="outline" size="sm" @click="handleFilterSelection('price', priceFilter.value)">
                {{ priceFilter.text }}
              </volt-button>
            </volt-accordion-content>
          </volt-accordion-panel>
        </volt-accordion>
        
        <!-- Typologie, Couleur -->
      </div>

      <div class="border-top flex justify-around mt-10 gap-2">
        <volt-button id="action-delete-filters" variant="default" @click="resetFilters">
          {{ $t("Supprimer") }}
        </volt-button>
        
        <volt-button id="action-filters-result" variant="default">
          {{ $t('Voir résulats', { n: count }) }}
        </volt-button>
      </div>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import { filterByClotheSize, filterBySorting, filterByPrice, type FilterActions, type PriceFilter } from '~/data/constants'
import type { ClotheSizes, SearchedProducts } from '~/types'

const props = withDefaults(defineProps<{ count: number }>(), { count: 0 })
const emit = defineEmits<{ 'update-products': [products: SearchedProducts], 'update:modelValue': [value: boolean] }>()

/**
 * Products
 */

const { showModal, query, resetFilters } = await useProductsStore()

/**
 * Route parameters
 */

const { id } = useRoute().params as { id: string }


/**
 * Products
 */

const { data: filteredProducts, execute } = await useFetch<SearchedProducts>(`/api/collections/${id}`, {
  method: 'GET',
  immediate: false,
})

/**
 * Function that pushes or removes the value from the filter lists
 * @param items The items with which the list should be update
 * @param value The value
 */
function updateList<T extends (ClotheSizes | number)[]>(items: T, value: string | number) {  
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
function handleFilterSelection (action: FilterActions, value: ClotheSizes | PriceFilter) {
  switch (action) {
    case 'sorted by':
      query.value.sorted_by = value
      break

    // case 'typology':
    //   updateList<string[]>(query.value.typology, value)
    //   break

    // case 'colors':
    //   updateList<string[]>(query.value.colors, value)
    //   break

    case 'sizes':
      updateList<ClotheSizes[]>(query.value.sizes, value)
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
