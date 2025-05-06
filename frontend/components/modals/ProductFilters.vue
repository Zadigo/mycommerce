<template>
  <TailSheet v-model:open="show" id="modal-product-filters">
    <TailSheetContent>
      <TailSheetHeader>
        <div class="flex justify-between items-center">
          <h4 class="m-0">
            {{ $t("Filtrer") }}
          </h4>
        </div>
      </TailSheetHeader>

      <div class="flex flex-column justify-around px-5">    
        <div>
          {{ query }}

          <TailAccordion type="single" collapsible>
            <!-- Order by -->
            <TailAccordionItem value="sort by">
              <TailAccordionTrigger>
                {{ $t('Trier par') }}
              </TailAccordionTrigger>

              <TailAccordionContent class="flex gap-2">
                <TailButton v-for="sortingFilter in sortingFilterActions" id="action-sorting-direction" :key="sortingFilter[0]" :active="query.sorted_by===sortingFilter[0]" variant="outline" size="sm" @click="handleFilterSelection('sorted by', sortingFilter[0])">
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
                <TailButton v-for="size in defaultSizes.clothes" id="action-filter-size" :key="size" :active="query.sizes.includes(size)" size="sm" variant="outline" class="ms-2" @click="handleFilterSelection('sizes', size)">
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
                <TailButton v-for="priceFilter in defaultPriceFilters" id="action-filter-price"  :key="priceFilter.value" :active="priceFilter.value===query.price" variant="outline" size="sm" @click="handleFilterSelection('price', priceFilter.value)">
                  {{ priceFilter.text }}
                </TailButton>
              </TailAccordionContent>
            </TailAccordionItem>
          </TailAccordion>
          <!-- Typologie, Couleur -->
        </div>

        <div class="border-top flex justify-around mt-10 gap-2">
          <TailButton id="action-delete-filters" variant="default" @click="handleFiltersReset">
            {{ $t("Supprimer") }}
          </TailButton>
          
          <TailButton id="action-filters-result" variant="default" @click="handleShowResults">
            {{ $t('Voir résulats', { n: count }) }}
          </TailButton>
        </div>
      </div>
    </TailSheetContent>
  </TailSheet>
</template>

<script setup lang="ts">
import { defaultPriceFilters, defaultSizes, sortingFilterActions, type Actions, type DefaultClotheSize, type DefaultPriceFilters } from '~/data'
import type { ProductsQuery, ProductsApiResponse, ExtendedRouteParamsRawGeneric, ExtendedLocationQuery } from '~/types'

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits({
  'update-products' (_data: ProductsApiResponse) {
    return true
  },
  'update:modelValue'(_value) {
    return true
  }
})

const { id } = useRoute().params as ExtendedRouteParamsRawGeneric
const queryParams = useUrlSearchParams<ProductsQuery>('history', {
  removeNullishValues: true
})

const query = ref<ProductsQuery>({
  sorted_by: 'New',
  typology: [],
  colors: [],
  sizes: [],
  price: null,
  offset: 0
})

const show = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const { data: products, execute } = await useFetch<ProductsApiResponse>(`/api/collections/${id}`, {
  method: 'GET',
  immediate: false,
  query: query.value
})

/**
 * 
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
 *
 * @param action The filter action
 * @param value The value of the filter
 */
function handleFilterSelection (action: Actions, value: DefaultClotheSize | DefaultPriceFilters) {
  switch (action) {
    case 'sorted by':
      query.value.sorted_by = value
      queryParams.sorted_by = value
      break

    // case 'typology':
    //   updateList<string[]>(query.value.typology, value)
    //   break

    // case 'colors':
    //   updateList<string[]>(query.value.colors, value)
    //   break

    case 'sizes':
      updateList<DefaultClotheSize[]>(query.value.sizes, value)
      queryParams.size = query.value.sizes.join(',')
      break

    case 'price':
      // If the user double-clicks, then write
      // the price as null
      if (query.value.price === value) {
        query.value.price = null
        queryParams.price = null
      } else {
        query.value.price = value
        queryParams.price = value
      }
      break
  
    default:
      break
  }
}

/**
 * Gets the results based on the provided filters
 * from the backend
 */
function handleShowResults() {
  execute()

  if (products.value) {
    emit('update-products', products.value)
  }
}

/**
 *  
 */
function handleFiltersReset() {
  query.value = {
    sorted_by: 'New',
    typology: [],
    colors: [],
    sizes: [],
    price: null
  }

  queryParams.price = null
  queryParams.size = null
  queryParams.sorted_by = null
}

onMounted(() => {
  // TODO: Check the filters from the url and if they
  // not null, request the products based on the provided
  // values - call refresh()
})
</script>
