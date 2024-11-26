<template>
  <ModalsBase :show-modal="showProductFilters">
    <div class="d-flex flex-column justify-content-around">
      <v-container class="border-bottom d-flex justify-content-between align-items-center">
        <h4 class="m-0">
          {{ $t("Filtrer") }}
        </h4>

        <v-btn variant="tonal" @click="showProductFilters=false">
          <font-awesome icon="close" round />
        </v-btn>
      </v-container>
            
      <v-container>
        <v-expansion-panels>
          <!-- Filter By -->
          <v-expansion-panel collapse-icon="mdi-minus" expand-icon="mdi-plus">
            <v-expansion-panel-title>Trier par</v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="price-filters p-2">
                <div class="d-flex justify-content-start flex-wrap gap-2">
                  <v-btn v-for="sortingFilter in sortingFilters" :key="sortingFilter[0]" :active="selectedFilters.sorted_by===sortingFilter[0]" variant="outlined" size="small" rounded @click="handleFilterSelection('sorted by', sortingFilter[0])">
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
              <v-btn v-for="size in sizes.clothes" :key="size" :active="selectedFilters.sizes.includes(size)" size="small" variant="outlined" class="ms-2" rounded @click="handleFilterSelection('sizes', size)">
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
              <v-btn v-for="priceFilter in priceFilters" :key="priceFilter.value" :active="priceFilter.value===selectedFilters.price" class="me-2 mb-2" variant="outlined" size="small" color="dark" rounded @click="handleFilterSelection('price', priceFilter.value)">
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
        
        <v-btn color="secondary" variant="tonal" rounded @click="showProductFilters=false">
          Voir résulats ({{ count }})
        </v-btn>
      </v-container>
    </div>
  </ModalsBase>
</template>

<script lang="ts" setup>
type Actions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'

interface SelectedFilters {
  sorted_by: string,
  typology: string[],
  colors: string[],
  sizes: string[],
  price: string | null
}

const props = defineProps({
  show: {
    type: Boolean
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits({
  close (_data: boolean) {
    return true
  },
  'update-products' (_data: string) {
    return true
  }
})

const { updateList } = useListManager()

const sizes = {
  "clothes": [
    "XS",
    "S",
    "M",
    "L",
    "XL"
  ]
}

const priceFilters = [
  {
    text: "Jusqu'à 15€",
    value: 'Up to 15'
  },
  {
    text: "Jusqu'à 20€",
    value: 'Up to 20'
  },
  {
    text: "Jusqu'à 25€",
    value: 'Up to 25'
  },
  {
    text: "Jusqu'à 30€",
    value: 'Up to 30'
  },
  {
    text: "Jusqu'à 35€",
    value: 'Up to 40',
  },
  {
    text: "Jusqu'à 50€",
    value: 'Up to 50'
  }
]

const sortingFilters = [
  ['New', 'Nouveautés'],
  ['Price up', 'Prix croissant'],
  ['Price down', 'Prix décroissant']
]

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

/**
 * Receives a filter and then sorts
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
      selectedFilters.value.price = value
      break;
  
    default:
      break;
  }
  emit('update-products', queryString.value)
}

/**
 *  
 */
function handleFiltersReset () {
  selectedFilters.value = {
    sorted_by: 'New',
    typology: [],
    colors: [],
    sizes: [],
    price: null
  }
}

/**
 * 
 */
const showProductFilters = computed({
  get: () => props.show,
  set: (value) => {
    emit('close', value)
  }
})


</script>
