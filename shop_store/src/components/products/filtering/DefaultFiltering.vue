<template>
  <div class="card shadow-none mb-3">
    <div class="card-body px-0 text-center">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-left gap-1">
          <div class="d-flex justify-content-between align-items-center me-3 gap-1">
            <v-btn :to="{ name: 'shop_products_collection', params: { id: 'all' } }" variant="tonal">
              {{ $t('Afficher tout') }}
            </v-btn>

            <v-btn v-for="category in productCategories" :key="category" :to="{ name: 'shop_products_collection', params: { id: category.toLowerCase() } }" variant="tonal">
              {{ category }}
            </v-btn>
          </div>

          <v-btn variant="tonal" flat>
            {{ $t('Taille') }}
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />

            <v-menu activator="parent">
              <v-list style="width: 250px;">
                <v-list-item>
                  <p class="text-tertiary">{{ $t('Tailles standard') }}</p>
                  <div class="d-flex justify-content-start gap-1 flex-wrap">
                    <v-btn v-for="size in sizes.clothes" :key="size" variant="outlined" rounded>
                      {{ size }}
                    </v-btn>
                  </div>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>

          <!-- <button type="button" class="btn btn-sm btn-light shadow-none">
            Trier
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button> -->
          <!-- <button type="button" class="btn btn-sm btn-light shadow-none">
            Taille
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button> -->
          <!-- <button type="button" class="btn btn-sm btn-light shadow-none">
            Couleurs
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Matières
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Prix
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Formes
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Armatures
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button>
          <button type="button" class="btn btn-sm btn-light shadow-none">
            Coques
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />
          </button> -->
        </div>

        <div class="d-flex justify-content-right gap-1 align-items-center">
          <v-skeleton-loader v-if="productsLoading" type="text"></v-skeleton-loader>
          <span v-else id="product-count" class="fw-bold me-2">{{ totalProductCount }} produits trouvés</span>

          <button type="button" :class="{ active: gridSize === 3 }" class="btn btn-sm btn-light shadow-none" @click="handleGridSize(3)">
            <font-awesome-icon :icon="['fas', 'table-cells-large']" />
          </button>
          
          <button type="button" :class="{ active: gridSize === 4 }" class="btn btn-sm btn-light shadow-none" @click="handleGridSize(4)">
            <font-awesome-icon :icon="['fas', 'table-cells']" />
          </button>

          <v-btn variant="tonal" flat>
            {{ $t('Trier') }}
            <font-awesome-icon :icon="['fas', 'caret-down']" class="ms-2" />

            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, i) in sortingOptions" :key="i" :value="item" @click="$emit('update:sorting', item)">
                  <v-list-item-title>{{ $t(item) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import { ref, inject } from 'vue'

import sizes from 'src/data/sizes.json'

const sortingOptions = [
  'Prix croissant',
  'Prix décroissant'
]

export default {
  name: 'DefaultFiltering',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    totalProductCount: {
      type: Number,
      default: 0
    }
  },
  emits: {
    'update-grid-size' () {
      return true
    },
    'update:sorting' (value) {
      console.log('update:sorting', value)
      return true
    }
  },
  setup () {
    const gridSize = ref(4)
    const productsLoading = inject('productsLoading')

    return {
      sizes,
      gridSize,
      productsLoading,
      sortingOptions
    }
  },
  computed: {
    productCategories () {
      return _.uniq(_.map(this.products, (product) => {
        return product.category
      }))
    }
  },
  beforeMount() {
    if (this.$session.keyExists('grid-size')) {
      this.gridSize = this.$session.retrieve('grid-size')
      this.$emit('update-grid-size')
    } else {
      this.$session.create('grid-size', 3)
    }
  },
  methods: {
    /**
     * Changes the size of the grid to
     * reduce or increase the amount of
     * products displayed on the screen
     * 
     * @param {String | Number} size 
     */
    handleGridSize (size) { 
      this.gridSize = size
      this.$emit('update-grid-size', size)
    }
  }
}
</script>

<style scoped>
  #product-count {
    font-size: .9rem;
  }
</style>
