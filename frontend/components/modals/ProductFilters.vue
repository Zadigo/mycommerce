<template>
  <!-- FIXME: Component does not mount -->
  <v-navigation-drawer v-model="show" width="400" location="right" sticky temporary @close="emit('update:modelValue', false)">
    <div class="d-flex flex-column justify-content-around">
      <v-container class="border-bottom d-flex justify-content-between align-items-center">
        <h4 class="m-0">
          {{ $t("Filtrer") }}
        </h4>

        <v-btn variant="tonal" @click="emit('update:modelValue', false)">
          <font-awesome icon="close" round />
        </v-btn>
      </v-container>
            
      <v-container>
        {{ selectedFilters }}

        <v-expansion-panels>
          <!-- Filter By -->
          <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
            <v-expansion-panel-title>Trier par</v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="price-filters p-2">
                <div class="d-flex justify-content-start flex-wrap gap-2">
                  <v-btn v-for="sortingFilter in defaultSortingFilters" :key="sortingFilter[0]" :active="selectedFilters.sorted_by===sortingFilter[0]" variant="outlined" size="small" rounded @click="handleFilterSelection('sorted by', sortingFilter[0])">
                    {{ $t(sortingFilter[1]) }}
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
            <v-expansion-panel-title>
              {{ $t("Typologie") }}
            </v-expansion-panel-title>
          </v-expansion-panel>
          
          <!-- Color -->
          <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
            <v-expansion-panel-title>
              {{ $t("Couleur") }}
            </v-expansion-panel-title>
          </v-expansion-panel>

          <!-- Size -->
          <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
            <v-expansion-panel-title>
              {{ $t("Taille") }}

              <div v-if="selectedFilters.sizes.length > 0" class="badge badge-success ms-3">
                {{ selectedFilters.sizes.length }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-btn v-for="size in defaultSizes.clothes" :key="size" :active="selectedFilters.sizes.includes(size)" size="small" variant="outlined" class="ms-2" rounded @click="handleFilterSelection('sizes', size)">
                {{ size }}
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Price -->
          <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
            <v-expansion-panel-title>
              {{ $t("Prix") }}
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
              <v-btn v-for="priceFilter in defaultPriceFilters" :key="priceFilter.value" :active="priceFilter.value===selectedFilters.price" class="me-2 mb-2" variant="outlined" size="small" color="dark" rounded @click="handleFilterSelection('price', priceFilter.value)">
                {{ priceFilter.text }}
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>

      <v-container class="border-top d-flex justify-content-around gap-2">
        <v-btn color="secondary" variant="outlined" rounded @click="handleFiltersReset">
          {{ $t("Supprimer") }}
        </v-btn>
        
        <v-btn color="secondary" variant="tonal" rounded @click="handleShowResults">
          Voir résulats ({{ count }})
        </v-btn>
      </v-container>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { defaultPriceFilters, defaultSizes, defaultSortingFilters } from '~/data'
import type { SelectedFilters } from '~/types'

type Actions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'

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
  'update-query' (_data: SelectedFilters) {
    return true
  },
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const selectedFilters = ref<SelectedFilters>({
  sorted_by: 'New',
  typology: [],
  colors: [],
  sizes: [],
  price: null
})

const queryString = computed(() => {
  const typology = selectedFilters.value.typology.join(',')
  const colors = selectedFilters.value.colors.join(',')
  const sizes = selectedFilters.value.sizes.join(',')
  const params = [
    `sorted_by=${selectedFilters.value.sorted_by}`,
    `colors=${colors}`,
    `sizes=${sizes}`,
    `typology=${typology}`
  ]

  if (selectedFilters.value.price) {
    params.push(`price=${selectedFilters.value.price}`)
  }

  return params.filter(x => !x.endsWith('=')).join('&')
})

const show = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

function updateList<T extends (string | number)[]>(items: T, value: string | number): T {
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
  return items
}

/**
 * Receives a filter and then sorts the products
 */
function handleFilterSelection (action: Actions, value: string) {
  switch (action) {
    case 'sorted by':
      selectedFilters.value.sorted_by = value
      break;

    case 'typology':
      updateList<string[]>(selectedFilters.value.typology, value)
      break;

    case 'colors':
      updateList<string[]>(selectedFilters.value.colors, value)
      break;

    case 'sizes':
      updateList<string[]>(selectedFilters.value.sizes, value)
      break;

    case 'price':
      // If the user double-clicks, then write
      // the price as null
      if (selectedFilters.value.price === value) {
        selectedFilters.value.price = null
      } else {
        selectedFilters.value.price = value
      }
      break;
  
    default:
      break;
  }
}

function handleShowResults() {
  show.value = false
  emit('update-query', selectedFilters.value)
}

/**
 *  
 */
function handleFiltersReset() {
  selectedFilters.value = {
    sorted_by: 'New',
    typology: [],
    colors: [],
    sizes: [],
    price: null
  }
}
</script>
