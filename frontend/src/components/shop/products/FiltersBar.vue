<template>
  <nav ref="link" class="navbar navbar-expand-lg shadow-none navbar-light mb-1">
    <div class="collapse navbar-collapse flex-column justify-content-left align-items-start">
      <ul class="navbar-nav w-100 justify-content-center">
        <li class="nav-item font-weight-bold text-uppercase">
          <!-- <v-btn disabled text>
            <v-icon class="mr-2">mdi-tune</v-icon>
            Filtres
          </v-btn> -->
          <button type="button" class="btn shadow-none disabled">
            <span class="fw-normal">Filtres</span>
          </button>
        </li>

        <!-- Sort method -->
        <li class="nav-item mx-1">
          <!-- <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                <v-icon class="mr-2">mdi-sort</v-icon>
                {{ $t(sortMethod) }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="method in sortMethods" :key="method" @click="doSort(method)">
                <v-list-item-title>{{ $t(method) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
        </li>

        <!-- Size -->
        <li class="nav-item mx-1">
          <!-- <v-btn text @click="openFilters('sizes')">
            {{ $t('Size') }}
            <v-icon class="ms-1">mdi-chevron-down</v-icon>
          </v-btn> -->
          <button type="button" class="btn btn-light shadow-none fw-normal" @click="openFilters('sizes')">
            {{ $t('Size') }}
          </button>
        </li>

        <!-- Colors -->
        <li class="nav-item mx-1">
          <!-- <v-btn text @click="openFilters('colors')">
            {{ $t('Color') }}
            <v-icon class="ms-1">mdi-chevron-down</v-icon>
          </v-btn> -->
          <button type="button" class="btn btn-light shadow-none fw-normal" @click="openFilters('colors')">
            {{ $t('Color') }}
          </button>
        </li>
      </ul>

      <!-- Dropdown -->
      <div v-if="showFilters" id="filters" class="d-flex justify-content-center" style="flex-wrap:wrap;">
        <!-- Sizes -->
        <div v-if="selectedFilter == 'sizes'">
          <!-- <v-chip v-for="(size, i) in sizes" :key="i" class="fw-bold me-3" style="height:50px;width:50px; border-radius:50%;text-align:center;" link @click="setFilterValue('sizes', size)">
            {{ size }}
          </v-chip> -->
          <div v-for="(size, i) in sizes" :key="i" :class="{ active: selectedElements.sizes.includes(size) }" class="md-chip fw-bold me-3" @click="setFilterValue('sizes', size)">
            {{ size }}
          </div>
        </div>

        <!-- Colors -->
        <div v-else-if="selectedFilter == 'colors'" class="d-flex justify-content-center">
          <div v-for="(color, i) in colors" :key="i" @click="setFilterValue('colors', color[0])">
            <!-- <v-icon v-if="isSelected('colors', color[0])" class="text-white filter-icon" x-large>mdi-check</v-icon>
            <v-img id="color" :src="color[1]" class="mx-2" height="50px" width="50px"></v-img> -->
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import _ from 'lodash'

import { mapState } from 'pinia'
import { useShop } from '@/store/shop'
import { useRoute } from 'vue-router'
import { getCurrentInstance } from 'vue'

import useShopComposable from '../../../composables/shop'
import { useUrls, useUtilities, scrollToTop } from '@/composables/utils'

export default {
  name: 'FiltersBar',
  emits: {
    'loading-products-start': () => true,
    'loading-products-end': () => true,
    'do-sort': () => true,
    'load-products': () => true
  },
  setup () {
    const store = useShop()
    const app = getCurrentInstance()
    const route = useRoute()
    const { getAllProducts } = useShopComposable(app, route)
    const { getVerticalScrollPercentage, listManager } = useUtilities()
    const { mediaUrl } = useUrls()
    return {
      store,
      mediaUrl,
      getAllProducts,
      getVerticalScrollPercentage,
      listManager,
      scrollToTop
    }
  },
  data: () => ({
    items: [],
    sortMethod: 'Latest',
    sortMethods: [
      'Latest',
      'Alphabetically A-Z',
      'Alphabetically Z-A',
      'Price high to low',
      'Price low to high'
    ],

    showFilters: false,
    selectedFilter: 'sizes',

    selectedElements: {
      sizes: [],
      colors: []
      // brand: {},
      // material: {},
      // cut: {},
      // season: {},
      // novelties: {},
      // delivery: {}
    },

    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }),
  computed: {
    ...mapState(useShop, {
      productNames (store) {
        return _.map(store.products, (product) => {
          return product.name
        })
      }
    }),

    colors () {
      const items = ['beige', 'black', 'camel', 'red']
      return _.map(items, (item) => {
        return [item, this.mediaUrl(`/media/swatches/${item}.png`)]
      })
    },

    searchQuery () {
      const items = new URLSearchParams({ ...this.selectedElements })
      return `?${items}`
    },

    hasFilters () {
      const truthArray = _.map(Object.keys(this.selectedElements), (key) => {
        return this.selectedElements[key].length > 0
      })
      return truthArray.some((value) => {
        return value === true
      })
    }
  },

  beforeMount () {
    this.sortMethod = this.localStorage.sort
    this.doSort(this.sortMethod || 'Latest')
  },

  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },

  unmounted () {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    async getFilteredProducts () {
      try {
        this.$emit('loading-products-start')

        const response = await this.$http.get(`shop/advanced/search${this.searchQuery}`)

        this.store.$patch((state) => {
          state.products = response.data.results
          this.$emit('loading-products-end')
        })
      } catch (error) {
        this.store.addErrorMessage('Could not resolve filter request (V-AX-FB)')
      }
    },
    doSort (method) {
      this.sortMethod = method
      this.$emit('do-sort', method)
    },
    openFilters (method) {
      if (method !== this.selectedFilter && this.showFilters) {
        this.showFilters = true
      } else {
        this.showFilters = !this.showFilters
      }
      this.selectedFilter = method
    },
    handleScroll () {
      const scrollPercentage = this.getVerticalScrollPercentage(document.body)

      if (scrollPercentage >= 5) {
        this.$refs.link.classList.add('scrolled')
      }

      if (scrollPercentage >= 90 || scrollPercentage === 0) {
        this.$refs.link.classList.remove('scrolled')
      }
    },
    setFilterValue (key, colorValue) {
      const values = this.selectedElements[key]

      this.selectedElements[key] = this.listManager(values, colorValue)

      if (!this.hasFilters) {
        this.getAllProducts()
      } else {
        this.getFilteredProducts()
      }
      this.scrollToTop()
    },
    isSelected (key, value) {
      return this.selectedElements[key].includes(value)
    }
  }
}
</script>

<style scoped>
.navbar {
  transition: all .4s ease-in-out;
  border-radius: .25rem;
}

.nav-collapse {
  position: relative;
}

.navbar.scrolled {
  position: fixed;
  display: block;
  top: 20%;
  left: 25%;
  right: 25%;
  border: 0;
  width: auto;
  background-color: white;
  padding: .25rem;
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%);
  /* box-shadow: 0 4px 12px 0 rgb(0 0 0 / 7%), 0 2px 4px rgb(0 0 0 / 5%); */
}

#color {
  cursor: pointer;
  border-radius: 50%;
}

#filters {
  width: 100%;
  height: auto;
  min-height: 60px;
  padding: .25rem;
  margin-top: 1rem;
}

.selected {
  border: 2px solid white;
  opacity: .5;
}

.filter-icon {
  position: absolute;
  left: 50%;
  right: 50%;
  top: 50%;
  bottom: 50%;
  z-index: 1200;
}

.slide-transition-enter-active,
.slide-transition-enter-active {
  transition: all .4s ease;
}

.slide-transition-enter,
.slide-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(.9, .9);
}

.slide-transition-leave,
.slide-transition-enter-to {
  opacity: 1;
  transform: translateY(0px) scale(1, 1);
}

.slide-transition-move {
  transition: all .3s ease;
}

.md-chip {
  border: 1px solid #6c757d;
}
.md-chip.active {
  border: 1px solid white;
  color: white;
  background-color: rgba(18, 102, 241, 1);
}
</style>
