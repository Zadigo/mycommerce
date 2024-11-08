<template>
  <div class="card shadow-none mb-3">
    <div class="card-body pt-1 text-center">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-left gap-1">
          <div class="d-flex justify-content-between align-items-center me-3 gap-1">
            <v-btn :to="{ name: 'shop_products_collection', params: { id: 'all' } }" variant="tonal">
              {{ $t('Afficher tout') }}
            </v-btn>

            <v-btn v-for="category in productCategories" :key="category" :to="{ name: 'shop_products_collection', params: { id: category.toLowerCase() } }" variant="tonal">
              {{ category }}
            </v-btn>

            <v-btn variant="tonal" class="ms-3" @click="$emit('show-product-filters')">
              <font-awesome-icon icon="sliders" class="me-2" /> Filtres
            </v-btn>
          </div>
        </div>
        
        <div class="d-flex justify-content-right gap-1 align-items-center">
          <v-skeleton-loader :is-loading="productsLoading" type="text">
            <span id="product-count" class="fw-bold me-2">
              {{ totalProductCount }} produits trouvés
            </span>
          </v-skeleton-loader>

          <v-btn :active="gridSize === 3" variant="tonal" flat @click="handleGridSize(3)">
            <font-awesome-icon icon="table-cells-large" />
          </v-btn>

          <v-btn :active="gridSize === 4" variant="tonal" flat @click="handleGridSize(4)">
            <font-awesome-icon icon="table-cells-large" />
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Product } from '@/types/shop';
import { defineComponent, inject, PropType, ref } from 'vue';

import sizes from '@/data/sizes.json';

const sortingOptions = [
  'Prix croissant',
  'Prix décroissant'
]

export default defineComponent({
  name: 'DefaultFiltering',
  props: {
    products: {
      type: Array as PropType<Product[]>,
      default: () => []
    },
    totalProductCount: {
      type: Number,
      default: 0
    }
  },
  emits: {
    'update:grid-size' (size: number) {
      return [3, 4].includes(size);
    },
    'update:sorting' (value: string) {
      return sortingOptions.includes(value)
    },
    'show-product-filters' () {
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
      // return _.uniq(_.map(this.products, (product) => {
      //   return product.category
      // }))
      const items = this.products.map(product => {
        return product.category
      })
      return new Set(items)
    }
  },
  beforeMount() {
    if (this.$session.keyExists('grid-size')) {
      this.gridSize = this.$session.retrieve('grid-size')
      this.$emit('update:grid-size', this.gridSize)
    } else {
      this.$session.create('grid-size', 3)
    }
  },
  methods: {
    /**
     * Changes the size of the grid to
     * reduce or increase the amount of
     * products displayed on the screen
     */
    handleGridSize (size: number) { 
      this.gridSize = size
      this.$emit('update:grid-size', size)
    }
  }
})
</script>

<style scoped>
  #product-count {
    font-size: .9rem;
  }
</style>
