<template>
  <TailSheet v-model:open="showModal" id="modal-product-filters">
    <TailSheetContent>
      <TailSheetHeader>
        <div class="flex justify-between items-center">
          <h4 class="m-0">
            {{ $t("Filtrer") }}
          </h4>
        </div>
      </TailSheetHeader>

      <div class="flex-col justify-around px-5">    
        <div>
          {{ query }}

          <TailAccordion type="single" collapsible>
            <!-- Order by -->
            <TailAccordionItem value="sort by">
              <TailAccordionTrigger>
                {{ $t('Trier par') }}
              </TailAccordionTrigger>

              <TailAccordionContent class="flex gap-2">
                <TailButton v-for="sortingFilter in Array.from(sortingFilterActions)" id="action-sorting-direction" :key="sortingFilter[0]" :active="query.sorted_by===sortingFilter[0]" variant="outline" size="sm" @click="handleFilterSelection('sorted by', sortingFilter[0])">
                  {{ $t(sortingFilter[0]) }}
                </TailButton>
              </TailAccordionContent>
            </TailAccordionItem>
            
            <!-- Size -->
            <TailAccordionItem value="size">
              <TailAccordionTrigger>
                <div class="flex gap-2 items-center">
                  {{ $t('Taille') }}

                  <TailBadge>
                    {{ query.sizes.length }}
                  </TailBadge>
                </div>
              </TailAccordionTrigger>

              <TailAccordionContent class="flex gap-2">
                <TailButton v-for="size in Array.from(defaultClotheSize)" id="action-filter-size" :key="size" :active="query.sizes.includes(size)" size="sm" variant="outline" class="ms-2" @click="handleFilterSelection('sizes', size)">
                  {{ size }}
                </TailButton>
              </TailAccordionContent>
            </TailAccordionItem>

            <!-- Price -->
            <TailAccordionItem value="size">
              <TailAccordionTrigger>
                {{ $t("Prix") }}
              </TailAccordionTrigger>

              <TailAccordionContent class="flex justify-start flex-wrap gap-2">
                <TailButton v-for="priceFilter in Array.from(defaultPriceFilters)" id="action-filter-price"  :key="priceFilter.value" :active="priceFilter.value===query.price" variant="outline" size="sm" @click="handleFilterSelection('price', priceFilter.value)">
                  {{ priceFilter.text }}
                </TailButton>
              </TailAccordionContent>
            </TailAccordionItem>
          </TailAccordion>
          
          <!-- Typologie, Couleur -->
        </div>

        <div class="border-top flex justify-around mt-10 gap-2">
          <TailButton id="action-delete-filters" variant="default" @click="resetFilters">
            {{ $t("Supprimer") }}
          </TailButton>
          
          <TailButton id="action-filters-result" variant="default">
            {{ $t('Voir résulats', { n: count }) }}
          </TailButton>
        </div>
      </div>
    </TailSheetContent>
  </TailSheet>
</template>

<script setup lang="ts">
import { useProvideFilteringModalStore } from '~/composables/use/shop'
import type { Actions, DefaultClotheSize, defaultPriceFilters, DefaultPriceFilters, defaultClotheSize, ExtendedRouteParamsRawGeneric, ProductsApiResponse, sortingFilterActions } from '~/types'

const props = withDefaults(defineProps<{ modelValue: boolean, count: number }>(), { count: 0 })
const emit = defineEmits<{ 'update-products': [products: ProductsApiResponse], 'update:modelValue': [value: boolean] }>()


/**
 * Global injection state: Products filtering
 */

const { showModal, query, resetFilters } = useProvideFilteringModalStore()!


/**
 * Route parameters
 */

const { id } = useRoute().params as ExtendedRouteParamsRawGeneric


/**
 * Products
 */

const { data: filteredProducts, execute } = await useFetch<ProductsApiResponse>(`/api/collections/${id}`, {
  method: 'GET',
  immediate: false,
  query: query.value
})

/**
 * Function that pushes or removes the value from the filter lists
 * @param items The items with which the list should be update
 * @param value The value
 */
function updateList<T extends (DefaultClotheSize | number)[]>(items: T, value: string | number) {  
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
function handleFilterSelection (action: Actions, value: DefaultClotheSize | DefaultPriceFilters) {
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
      updateList<DefaultClotheSize[]>(query.value.sizes, value)
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
